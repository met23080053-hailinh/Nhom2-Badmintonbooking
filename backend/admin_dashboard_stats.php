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
        // 1. Tổng doanh thu (Trong tháng này) — dùng created_at là ngày đặt tiền thực tế
        $revenueSql = "SELECT SUM(total_price) as total_revenue FROM bookings WHERE status IN ('confirmed', 'completed') AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())";
        $revenueStmt = $pdo->query($revenueSql);
        $revenueResult = $revenueStmt->fetch();
        $totalRevenue = $revenueResult['total_revenue'] ?? 0;

        // 1.5 Doanh thu hôm nay
        $todayRevenueSql = "SELECT SUM(total_price) as today_revenue FROM bookings WHERE status IN ('confirmed', 'completed') AND DATE(created_at) = CURDATE()";
        $todayRevenueStmt = $pdo->query($todayRevenueSql);
        $todayRevenueResult = $todayRevenueStmt->fetch();
        $todayRevenue = $todayRevenueResult['today_revenue'] ?? 0;

        // 1.6 Thống kê đơn hôm nay
        $todayBookingsSql = "SELECT COUNT(*) as count FROM bookings WHERE DATE(created_at) = CURDATE()";
        $todayBookingsCount = $pdo->query($todayBookingsSql)->fetch()['count'] ?? 0;

        $todayConfirmedSql = "SELECT COUNT(*) as count FROM bookings WHERE status IN ('confirmed', 'completed') AND DATE(created_at) = CURDATE()";
        $todayConfirmedCount = $pdo->query($todayConfirmedSql)->fetch()['count'] ?? 0;

        $todayPendingSql = "SELECT COUNT(*) as count FROM bookings WHERE status = 'pending' AND DATE(created_at) = CURDATE()";
        $todayPendingCount = $pdo->query($todayPendingSql)->fetch()['count'] ?? 0;

        // 2. Tổng số lượt đặt sân
        $bookingsSql = "SELECT COUNT(*) as total_bookings FROM bookings";
        $bookingsStmt = $pdo->query($bookingsSql);
        $bookingsResult = $bookingsStmt->fetch();
        $totalBookings = $bookingsResult['total_bookings'] ?? 0;

        // 3. Phân bổ trạng thái đơn đặt sân (Để vẽ biểu đồ tròn)
        $statusSql = "SELECT status, COUNT(*) as count FROM bookings GROUP BY status";
        $statusStmt = $pdo->query($statusSql);
        $statusDistribution = $statusStmt->fetchAll(PDO::FETCH_ASSOC);

        // 4. Doanh thu theo 7 ngày gần nhất — dùng created_at
        $recentRevenueSql = "
            SELECT DATE(created_at) as date, SUM(total_price) as daily_revenue 
            FROM bookings 
            WHERE status IN ('confirmed', 'completed') 
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ";
        $recentRevenueStmt = $pdo->query($recentRevenueSql);
        $recentRevenue = $recentRevenueStmt->fetchAll(PDO::FETCH_ASSOC);

        // 4.5. Doanh thu theo 30 ngày gần nhất — cho nút "30 Ngày"
        $monthlyRevenueSql = "
            SELECT DATE(created_at) as date, SUM(total_price) as daily_revenue 
            FROM bookings 
            WHERE status IN ('confirmed', 'completed') 
            AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        ";
        $monthlyRevenueStmt = $pdo->query($monthlyRevenueSql);
        $monthlyRevenue = $monthlyRevenueStmt->fetchAll(PDO::FETCH_ASSOC);

        // 4.6. Tổng số đơn chờ duyệt (pending)
        $pendingCountSql = "SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'";
        $totalPending = $pdo->query($pendingCountSql)->fetch()['count'] ?? 0;

        // 4.7. Tổng số tiền đã hoàn trả (Customer Refunds)
        $refundSql = "SELECT SUM(refund_amount) as total_refunds FROM bookings WHERE status = 'cancelled'";
        $totalRefunds = $pdo->query($refundSql)->fetch()['total_refunds'] ?? 0;

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
                    "today_revenue" => (float)$todayRevenue,
                    "total_refunds" => (float)$totalRefunds,
                    "total_bookings" => (int)$totalBookings,
                    "today_bookings" => (int)$todayBookingsCount,
                    "today_confirmed" => (int)$todayConfirmedCount,
                    "today_pending" => (int)$todayPendingCount,
                    "occupancy_rate" => round($occupancyRate, 2),
                    "total_users" => (int)$totalUsers,
                    "active_users" => (int)$activeUsers,
                    "blocked_users" => (int)$blockedUsers
                ],
                "status_distribution" => $statusDistribution,
                "recent_revenue" => $recentRevenue,
                "monthly_revenue" => $monthlyRevenue,
                "total_pending" => (int)$totalPending
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
