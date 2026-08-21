<?php
require 'db_connection.php';

$sampleAmenities = json_encode(['Bãi đỗ xe', 'Wifi', 'Quán Cafe', 'Phòng thay đồ'], JSON_UNESCAPED_UNICODE);
$sampleSubCourts = json_encode([
    ['id' => 'sc-1', 'name' => 'Court 1', 'nameCourtNumber' => 'Sân 1', 'isAvailable' => true, 'surface' => 'Thảm Taraflex BWF', 'lightingLux' => 750],
    ['id' => 'sc-2', 'name' => 'Court 2', 'nameCourtNumber' => 'Sân 2', 'isAvailable' => true, 'surface' => 'Thảm Taraflex BWF', 'lightingLux' => 750],
    ['id' => 'sc-3', 'name' => 'Court 3', 'nameCourtNumber' => 'Sân 3', 'isAvailable' => true, 'surface' => 'Thảm Taraflex BWF', 'lightingLux' => 750]
], JSON_UNESCAPED_UNICODE);
$sampleImages = json_encode(['/images/badminton-court-flooring-500x500.webp'], JSON_UNESCAPED_UNICODE);

$courts = [
    ['Sân Cầu Lông Vườn Lan', '123 Lạc Long Quân', 'Hà Nội', 'Tây Hồ', 4.5, 150, 1, 6, 2, 100000],
    ['Sân Thể Thao Bách Khoa', 'Trần Đại Nghĩa', 'Hà Nội', 'Hai Bà Trưng', 4.7, 320, 1, 10, 4, 80000],
    ['CLB Cầu Lông Long Biên', 'Nguyễn Văn Cừ', 'Hà Nội', 'Long Biên', 4.4, 90, 0, 4, 1, 90000],
    ['Nhà Thi Đấu Cầu Giấy', '35 Trần Quý Kiên', 'Hà Nội', 'Cầu Giấy', 4.9, 450, 1, 15, 5, 150000],
    ['Sân Cầu Lông Thanh Xuân', 'Khuất Duy Tiến', 'Hà Nội', 'Thanh Xuân', 4.3, 75, 0, 5, 0, 110000],
    ['Sân Cầu Lông Hoàng Mai', 'Giải Phóng', 'Hà Nội', 'Hoàng Mai', 4.6, 210, 1, 8, 2, 95000],
    ['CLB Thể Thao Đống Đa', 'Hoàng Cầu', 'Hà Nội', 'Đống Đa', 4.8, 380, 1, 12, 3, 130000]
];

$insertSql = "INSERT INTO courts (name, location, city, district, rating, review_count, phone, featured, total_courts, available_courts_count, price_per_hour, opening_time, closing_time, status, description, amenities, sub_courts, images) VALUES (?, ?, ?, ?, ?, ?, '0901234567', ?, ?, ?, ?, '05:00:00', '23:00:00', 'AVAILABLE', 'Sân chất lượng cao, thảm tiêu chuẩn.', '$sampleAmenities', '$sampleSubCourts', '$sampleImages')";

$stmt = $pdo->prepare($insertSql);

foreach ($courts as $c) {
    $stmt->execute([$c[0], $c[1], $c[2], $c[3], $c[4], $c[5], $c[6], $c[7], $c[8], $c[9]]);
}

echo "Thêm 7 sân thành công!";
?>
