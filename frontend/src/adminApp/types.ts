export type NavigationTab = 
  | 'dashboard'
  | 'court-management'
  | 'booking-management'
  | 'payment-management'
  | 'user-management'
  | 'promotions'
  | 'news';

export type CourtType = 'Sân đơn' | 'Sân đôi' | 'Sân VIP';
export type CourtStatus = 'HOẠT ĐỘNG' | 'BẢO TRÌ';

export interface Court {
  id: string;
  name: string;
  type: CourtType;
  area: string; // e.g. Khu A, Khu B
  pricePerHour: number;
  status: CourtStatus;
  image: string;
  description?: string;
}

export type BookingStatus = 'Pending' | 'Pending_Payment' | 'Paid' | 'Cancelled';

export interface Booking {
  id: string; // e.g. #BK-8492
  guestName: string;
  guestPhone: string;
  courtId: string;
  courtName: string;
  date: string; // YYYY-MM-DD or readable "Thứ 3, 13 Tháng 8, 2024"
  dayOfWeek?: number; // 0=CN, 1=T2, 2=T3, 3=T4, 4=T5, 5=T6, 6=T7
  dayLabel?: string; // T2, T3, etc.
  dayNumber?: number; // 12, 13, 14
  startTime: string; // "18:00"
  endTime: string; // "20:00"
  durationHours: number;
  status: BookingStatus;
  amount: number;
  paymentMethod?: 'qr' | 'momo' | 'cash';
  createdAt?: string;
  notes?: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type PaymentMethod = 'qr' | 'momo' | 'cash';

export interface PaymentTransaction {
  id: string; // e.g. TXN-8891
  bookingId: string; // e.g. #BKG-4421
  guestName: string;
  guestInitials: string;
  amount: number;
  method: PaymentMethod;
  timeStr: string; // "14:30"
  dateStr: string; // "Today", "Yesterday", "12/08/2024"
  fullTimestamp: string;
  status: PaymentStatus;
  proofImage?: string;
  rejectionReason?: string;
}

export type UserMemberRank = 'Thành viên Vàng' | 'Thành viên Bạc' | 'Thành viên Đồng' | 'Mới' | 'Quản trị viên';
export type UserStatus = 'HOẠT ĐỘNG' | 'BỊ KHÓA';

export interface UserAccount {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  role: UserMemberRank;
  phone: string;
  email: string;
  joinedDate: string;
  totalBookings: number;
  status: UserStatus;
  isOnline?: boolean;
}

export type PromoStatus = 'ĐANG CHẠY' | 'TẠM DỪNG' | 'HẾT HẠN';

export interface Promotion {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // 20 (for 20%) or 50000 (50k)
  description: string;
  validPeriod: string; // "01/06 - 31/08/2024"
  usedCount: number;
  maxLimit: number | 'Vô hạn';
  status: PromoStatus;
  updatedAt: string;
}

export type NewsStatus = 'ĐÃ ĐĂNG' | 'BẢN NHÁP';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  publishDate: string;
  author: string;
  views: number;
  status: NewsStatus;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
