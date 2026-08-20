<?php
require 'db_connection.php';
$email = 'superadmin@smashhub.vn';
$password = 'admin123';
$hash = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (full_name, email, phone, password_hash, role) VALUES ('Chủ Sân (Admin)', ?, '0999999999', ?, 'ADMIN') ON DUPLICATE KEY UPDATE password_hash = ?, role = 'ADMIN'";
$stmt = $pdo->prepare($sql);
$stmt->execute([$email, $hash, $hash]);

echo "Admin created successfully.\n";
