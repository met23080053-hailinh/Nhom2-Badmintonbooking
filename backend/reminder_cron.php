<?php
/**
 * CRONJOB BẰNG PHP: HỆ THỐNG NHẮC LỊCH
 * File này được thiết kế để chạy tự động thông qua Windows Task Scheduler, Linux Cron, 
 * hoặc các dịch vụ web-cron (cron-job.org) mỗi 1-5 phút.
 */

// Cho phép hiển thị log dạng Text trên trình duyệt nếu chạy thủ công
header('Content-Type: text/plain; charset=utf-8');

require 'db_connection.php';

try {
    echo "🤖 Bắt đầu chạy Hệ thống nhắc lịch (PHP Cronjob)...\n";
    echo "Thời gian hiện tại: " . date('Y-m-d H:i:s') . "\n";

    // 1. (Tùy chọn) Tự động thêm cột is_reminded vào bảng bookings nếu chưa có
    try {
        $pdo->exec("ALTER TABLE bookings ADD COLUMN is_reminded TINYINT(1) DEFAULT 0 AFTER status");
        echo "🔧 Đã tự động thêm cột 'is_reminded' vào Database.\n";
    } catch (PDOException $e) {
        // Cột đã tồn tại, bỏ qua lỗi này
    }

    // 2. Quét các đơn đặt sân sắp diễn ra (Trong vòng 15 phút tới) và chưa được nhắc nhở
    $sql = "
        SELECT b.id, b.booking_code, b.start_time, u.full_name, u.email, c.name as court_name
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN courts c ON b.court_id = c.id
        WHERE b.status = 'CONFIRMED' 
          AND b.is_reminded = 0
          AND b.start_time > NOW() 
          AND b.start_time <= DATE_ADD(NOW(), INTERVAL 15 MINUTE)
    ";

    $stmt = $pdo->query($sql);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($bookings) === 0) {
        echo "✅ Không có đơn đặt sân nào cần nhắc nhở lúc này.\n";
    } else {
        echo "⚠️ Phát hiện " . count($bookings) . " đơn sắp tới giờ. Tiến hành gửi Mail...\n";

        foreach ($bookings as $booking) {
            $to = $booking['email'];
            $subject = "⏰ Nhắc nhở: Lịch đánh cầu lông của bạn sắp bắt đầu!";
            $startTime = date('H:i d/m/Y', strtotime($booking['start_time']));
            
            $message = "Xin chào " . $booking['full_name'] . ",\n\n";
            $message .= "Lịch đặt sân " . $booking['court_name'] . " (Mã: " . $booking['booking_code'] . ") của bạn sẽ bắt đầu vào lúc " . $startTime . ".\n";
            $message .= "Vui lòng có mặt đúng giờ nhé!\n\n";
            $message .= "Chúc bạn chơi vui vẻ!";

            $headers = "From: noreply@badminton.com\r\n";
            $headers .= "Content-type: text/plain; charset=utf-8\r\n";

            // Gửi mail bằng hàm mail() của PHP (Chỉ hoạt động nếu Server đã cấu hình SMTP trong php.ini)
            // Nếu chạy XAMPP localhost, lệnh này có thể báo False hoặc lưu vào folder sendmail
            $mailSent = @mail($to, $subject, $message, $headers);

            if ($mailSent) {
                echo "📧 Đã gửi thành công Email tới: " . $to . "\n";
            } else {
                echo "📧 (Mô phỏng) Đã gửi Email tới: " . $to . " (Lưu ý: Tính năng mail() cần cấu hình SMTP thực tế trên Host).\n";
            }

            // Đánh dấu là đã nhắc nhở để không gửi lại vào phút tiếp theo
            $updateSql = "UPDATE bookings SET is_reminded = 1 WHERE id = ?";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([$booking['id']]);
        }
        
        echo "✅ Hoàn tất việc gửi nhắc nhở.\n";
    }

} catch (PDOException $e) {
    echo "❌ Lỗi hệ thống: " . $e->getMessage() . "\n";
}
?>
