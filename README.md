# HSB2006 - MET5 - NHÓM 2
**Hệ Thống Đặt Lịch & Quản Lý Sân Cầu Lông (Badminton Booking & Management System)**

---

## ⚠️ HƯỚNG DẪN CÀI ĐẶT NHANH DÀNH CHO GIẢNG VIÊN (QUAN TRỌNG) ⚠️
Để hệ thống hoạt động chính xác (đặc biệt là tính năng kết nối API), xin thầy vui lòng thực hiện đúng theo các bước dưới đây:

### 1. Chuẩn bị Môi trường
- **XAMPP** (hoặc môi trường PHP/MySQL tương đương).
- **Node.js** (Phiên bản v18 trở lên).

### 2. Cài đặt Cơ sở dữ liệu (MySQL)
- Mở bảng điều khiển XAMPP, **Start** cả `Apache` và `MySQL`.
- Truy cập `http://localhost/phpmyadmin`.
- Tạo một Database mới với tên CHÍNH XÁC là: `badminton_db`
- *(Tuyệt đối không cần import thủ công file SQL nào, hệ thống sẽ tự động khởi tạo dữ liệu ở bước sau).*

### 3. Cài đặt Backend (PHP)
- Thầy vui lòng **copy THƯ MỤC `backend`** từ trong thư mục dự án này, và dán trực tiếp vào thư mục `htdocs` của XAMPP.
- ⛔ **Lưu ý quan trọng:** Cấu trúc đường dẫn bắt buộc phải là: `C:\xampp\htdocs\backend\` (Việc này giúp Proxy của React gọi API mượt mà mà không bị lỗi đường dẫn).
- Mở trình duyệt và truy cập đường link sau để khởi tạo tự động toàn bộ Bảng và Dữ liệu mẫu (Gồm 10 sân cầu lông, tài khoản admin, mã giảm giá...): 
👉 **[http://localhost/backend/upgrade_db.php](http://localhost/backend/upgrade_db.php)**
- Trình duyệt báo lỗi màu xanh "Thêm mới thành công" hoặc trang trắng là đã nạp dữ liệu xong.

### 4. Cài đặt Frontend (React)
- Mở một terminal/cmd và di chuyển (cd) vào thư mục `frontend` của dự án.
- Chạy lệnh cài đặt các thư viện Node:
  ```bash
  npm install
  ```
- Khởi động giao diện người dùng:
  ```bash
  npm run dev
  ```
- Hệ thống sẽ tự động cấp một đường link (thường là `http://localhost:5173`). Bấm vào đó để trải nghiệm hệ thống!

---

## 🔑 TÀI KHOẢN KIỂM THỬ (TEST ACCOUNTS)
Hệ thống đã tự động tạo sẵn 2 tài khoản với 2 phân quyền khác nhau để thầy tiện kiểm thử các luồng chức năng:

**1. Quyền Quản trị viên (Chủ Sân / Admin)**
- Đăng nhập tại màn hình `Hệ Thống Quản Trị Chủ Sân` (bấm nút Admin Góc phải trên cùng).
- **Email:** `admin@badminton.vn`
- **Mật khẩu:** `123456`

**2. Quyền Khách hàng (Người đặt sân)**
- Dùng để kiểm thử quy trình tìm sân, thanh toán, ghép kèo.
- **Email:** `khachhang@example.com`
- **Mật khẩu:** `123456`

---

## 🌟 TÍNH NĂNG NỔI BẬT (CHẤM ĐIỂM)
1. **Thuật toán Phân trang Động (Dynamic Pagination):** Hiển thị danh sách sân với thuật toán cắt (slice) array và tự động tính tổng số trang.
2. **Quy trình Thanh toán Mô phỏng (VietQR):** Giao diện quét mã QR động.
3. **Mã hoá Mật khẩu An toàn (BCrypt):** Toàn bộ mật khẩu trong Database đều được băm bằng thuật toán `password_hash()` của PHP (tốt hơn MD5/SHA256).
4. **Hệ thống lọc thông minh:** Tìm kiếm sân theo Tên, Phân loại (Sân Đơn/Đôi/VIP) và Trạng thái (Hoạt động/Bảo trì).
5. **Giao diện Responsive:** Giao diện co giãn tự động tương thích mọi thiết bị di động với TailwindCSS và Lucide Icons.

*Trân trọng cảm ơn thầy đã dành thời gian kiểm tra và đánh giá dự án của nhóm!*
