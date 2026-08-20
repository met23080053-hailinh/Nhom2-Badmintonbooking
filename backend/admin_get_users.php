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
        $sql = "
            SELECT 
                u.id, 
                u.full_name, 
                u.email, 
                u.phone, 
                u.role, 
                u.created_at,
                (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) as totalBookings
            FROM users u
            ORDER BY u.created_at DESC
        ";
        $stmt = $pdo->query($sql);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Map to format suitable for frontend
        $formattedUsers = array_map(function($user) {
            $rank = 'Mới';
            $tb = (int)$user['totalBookings'];
            if ($tb >= 30) $rank = 'Thành viên Vàng';
            elseif ($tb >= 10) $rank = 'Thành viên Bạc';
            elseif ($tb > 0) $rank = 'Thành viên Đồng';
            
            $status = 'HOẠT ĐỘNG';

            $nameParts = explode(' ', trim($user['full_name']));
            $initials = '';
            if (count($nameParts) > 1) {
                $initials = mb_substr(end($nameParts), 0, 1) . mb_substr($nameParts[0], 0, 1);
            } else if (count($nameParts) == 1) {
                $initials = mb_substr($nameParts[0], 0, 1);
            }
            $initials = mb_strtoupper($initials);

            return [
                'id' => 'usr-' . $user['id'],
                'name' => $user['full_name'],
                'initials' => $initials,
                'phone' => $user['phone'] ?: 'Không có SĐT',
                'email' => $user['email'],
                'role' => $user['role'] === 'ADMIN' ? 'Quản trị viên' : $rank,
                'totalBookings' => $tb,
                'joinedDate' => date('d/m/Y', strtotime($user['created_at'])),
                'status' => $status,
                'isOnline' => true,
                'avatar' => ''
            ];
        }, $users);

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $formattedUsers]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Lỗi hệ thống: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Phương thức không hỗ trợ."]);
}
?>
