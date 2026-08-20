<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // 1. Tổng doanh thu (Chỉ tính những đơn đã XÁC NHẬN hoặc HOÀN THÀNH)
        $revenueSql = "SELECT SUM(total_price) as total_revenue FROM bookings WHERE status IN ('CONFIRMED', 'COMPLETED')";
        $revenueStmt = $pdo->query($revenueSql);
        $revenueResult = $revenueStmt->fetch();
        $totalRevenue = $revenueResult['total_revenue'] ?? 0;

        // 2. Tổng số lượt đặt sân
        $bookingsSql = "SELECT COUNT(*) as total_bookings FROM bookings";
        $bookingsStmt = $pdo->query($bookingsSql);
        $bookingsResult = $bookingsStmt->fetch();
        $totalBookings = $bookingsResult['total_bookings'] ?? 0;

        // 3. Phân bổ trạng thái đơn đặt sân (Để vẽ biểu đồ tròn)
        $statusSql = "SELECT status, COUNT(*) as count FROM bookings GROUP BY status";
        $statusStmt = $pdo->query($statusSql);
        $statusDistribution = $statusStmt->fetchAll(PDO::FETCH_ASSOC);

        // 4. Doanh thu theo 7 ngày gần nhất (Để vẽ biểu đồ cột/đường)
        $recentRevenueSql = "
            SELECT DATE(start_time) as date, SUM(total_price) as daily_revenue 
            FROM bookings 
            WHERE status IN ('CONFIRMED', 'COMPLETED') 
            AND start_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(start_time)
            ORDER BY date ASC
        ";
        $recentRevenueStmt = $pdo->query($recentRevenueSql);
        $recentRevenue = $recentRevenueStmt->fetchAll(PDO::FETCH_ASSOC);

        // 5. Tỷ lệ lấp đầy sân (Đơn giản hóa: Số đơn chia cho tổng số sân)
        // Trong thực tế cần tính theo khung giờ, nhưng đây là số liệu cơ bản
        $courtsSql = "SELECT COUNT(*) as total_courts FROM courts";
        $courtsStmt = $pdo->query($courtsSql);
        $courtsResult = $courtsStmt->fetch();
        $totalCourts = $courtsResult['total_courts'] ?? 1; // Tránh chia cho 0

        $occupancyRate = ($totalBookings / ($totalCourts * 30)) * 100; // Giả sử 1 tháng có 30 lượt chuẩn cho mỗi sân

        // 6. Thống kê người dùng
        $usersSql = "SELECT COUNT(*) as total_users FROM users";
        $usersStmt = $pdo->query($usersSql);
        $totalUsers = $usersStmt->fetch()['total_users'] ?? 0;

        // Giả sử tài khoản hoạt động là tài khoản có đặt sân hoặc mặc định là tất cả
        $activeUsers = $totalUsers; 
        $blockedUsers = 0; // Mock blocked users for now if there is no blocked column

        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "data" => [
                "overview" => [
                    "total_revenue" => (float)$totalRevenue,
                    "total_bookings" => (int)$totalBookings,
                    "occupancy_rate" => round($occupancyRate, 2),
                    "total_users" => (int)$totalUsers,
                    "active_users" => (int)$activeUsers,
                    "blocked_users" => (int)$blockedUsers
                ],
                "status_distribution" => $statusDistribution,
                "recent_revenue" => $recentRevenue
            ]
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không được hỗ trợ."]);
}
?>
