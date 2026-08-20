import { Court, Booking, PaymentTransaction, UserAccount, Promotion, NewsArticle } from '../types';

export const initialCourts: Court[] = [
  {
    id: 'court-1',
    name: 'Sân VIP 1',
    type: 'Sân đôi',
    area: 'Khu A',
    pricePerHour: 120000,
    status: 'HOẠT ĐỘNG',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80',
    description: 'Sân đôi thảm Yonex cao cấp đạt chuẩn quốc tế, đèn chống lóa, điều hòa nhiệt độ.'
  },
  {
    id: 'court-2',
    name: 'Sân Tiêu Chuẩn 2',
    type: 'Sân đơn',
    area: 'Khu B',
    pricePerHour: 90000,
    status: 'HOẠT ĐỘNG',
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=400&auto=format&fit=crop&q=80',
    description: 'Sân đơn sàn gỗ phủ thảm PVC chất lượng cao, thoáng mát, thích hợp luyện tập cá nhân.'
  },
  {
    id: 'court-3',
    name: 'Sân VIP 3',
    type: 'Sân đôi',
    area: 'Khu A',
    pricePerHour: 100000,
    status: 'BẢO TRÌ',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80',
    description: 'Đang bảo dưỡng hệ thống lưới và thay đèn LED chiếu sáng chuẩn thi đấu.'
  },
  {
    id: 'court-4',
    name: 'Sân Tiêu Chuẩn 4',
    type: 'Sân đơn',
    area: 'Khu B',
    pricePerHour: 90000,
    status: 'HOẠT ĐỘNG',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=400&auto=format&fit=crop&q=80',
    description: 'Sân chuẩn cho thi đấu đơn và lớp năng khiếu câu lạc bộ.'
  },
  {
    id: 'court-5',
    name: 'Sân VIP 5',
    type: 'Sân đôi',
    area: 'Khu A',
    pricePerHour: 110000,
    status: 'HOẠT ĐỘNG',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&auto=format&fit=crop&q=80',
    description: 'Sân đôi khu vực trung tâm, khán đài mini dành cho cổ động viên.'
  },
  {
    id: 'court-6',
    name: 'Sân VIP 6 (Pro)',
    type: 'Sân VIP',
    area: 'Khu C',
    pricePerHour: 150000,
    status: 'HOẠT ĐỘNG',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop&q=80',
    description: 'Sân thi đấu đỉnh cao với camera quay chậm VAR, phục vụ nước uống và khăn lạnh miễn phí.'
  }
];

export const initialBookings: Booking[] = [
  {
    id: '#BK-8492',
    guestName: 'Nguyen Van A',
    guestPhone: '0912 345 678',
    courtId: 'court-1',
    courtName: 'Court 1 (VIP)',
    date: 'Thứ 2, 12 Tháng 8, 2024',
    dayOfWeek: 1,
    dayLabel: 'T2',
    dayNumber: 12,
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2,
    status: 'Paid',
    amount: 240000,
    paymentMethod: 'qr'
  },
  {
    id: '#BK-8491',
    guestName: 'Tran Thi B',
    guestPhone: '0987 654 321',
    courtId: 'court-3',
    courtName: 'Court 3',
    date: 'Thứ 3, 13 Tháng 8, 2024',
    dayOfWeek: 2,
    dayLabel: 'T3',
    dayNumber: 13,
    startTime: '19:00',
    endTime: '21:00',
    durationHours: 2,
    status: 'Pending',
    amount: 200000,
    paymentMethod: 'momo'
  },
  {
    id: '#BK-8490',
    guestName: 'Le Van C',
    guestPhone: '0901 234 567',
    courtId: 'court-2',
    courtName: 'Court 2',
    date: 'Thứ 4, 14 Tháng 8, 2024',
    dayOfWeek: 3,
    dayLabel: 'T4',
    dayNumber: 14,
    startTime: '16:00',
    endTime: '18:00',
    durationHours: 2,
    status: 'Paid',
    amount: 200000,
    paymentMethod: 'cash'
  },
  {
    id: '#BK-8489',
    guestName: 'Pham Dinh D',
    guestPhone: '0933 888 999',
    courtId: 'court-5',
    courtName: 'Court 5',
    date: 'Thứ 5, 15 Tháng 8, 2024',
    dayOfWeek: 4,
    dayLabel: 'T5',
    dayNumber: 15,
    startTime: '17:00',
    endTime: '19:00',
    durationHours: 2,
    status: 'Cancelled',
    amount: 200000,
    paymentMethod: 'qr'
  },
  {
    id: '#BK-8488',
    guestName: 'Hoang Anh E',
    guestPhone: '0977 123 456',
    courtId: 'court-4',
    courtName: 'Court 4',
    date: 'Thứ 6, 16 Tháng 8, 2024',
    dayOfWeek: 5,
    dayLabel: 'T6',
    dayNumber: 16,
    startTime: '15:00',
    endTime: '17:00',
    durationHours: 2,
    status: 'Paid',
    amount: 200000,
    paymentMethod: 'qr'
  },
  {
    id: '#BK-9482',
    guestName: 'Phạm Văn Dũng',
    guestPhone: '0987 654 321',
    courtId: 'court-3',
    courtName: 'Sân 3 - Tiêu chuẩn',
    date: 'Thứ 3, 13 Tháng 8, 2024',
    dayOfWeek: 2,
    dayLabel: 'T3',
    dayNumber: 13,
    startTime: '11:30',
    endTime: '13:00',
    durationHours: 1.5,
    status: 'Pending',
    amount: 150000,
    paymentMethod: 'qr'
  },
  {
    id: '#BK-8495',
    guestName: 'Nguyễn Văn A',
    guestPhone: '0912 345 678',
    courtId: 'court-1',
    courtName: 'Sân 1 • 07:00 - 08:30',
    date: 'Thứ 2, 12 Tháng 8, 2024',
    dayOfWeek: 1,
    dayLabel: 'T2',
    dayNumber: 12,
    startTime: '07:00',
    endTime: '08:30',
    durationHours: 1.5,
    status: 'Pending',
    amount: 180000,
    paymentMethod: 'qr'
  },
  {
    id: '#BK-8496',
    guestName: 'Trần Thị B',
    guestPhone: '0987 654 321',
    courtId: 'court-2',
    courtName: 'Sân 2 • 08:00 - 09:00',
    date: 'Thứ 3, 13 Tháng 8, 2024',
    dayOfWeek: 2,
    dayLabel: 'T3',
    dayNumber: 13,
    startTime: '08:00',
    endTime: '09:00',
    durationHours: 1,
    status: 'Paid',
    amount: 90000,
    paymentMethod: 'cash'
  },
  {
    id: '#BK-8497',
    guestName: 'Lê Hoàng C',
    guestPhone: '0944 555 666',
    courtId: 'court-1',
    courtName: 'Sân 1 • 11:00 - 13:00',
    date: 'Thứ 3, 13 Tháng 8, 2024',
    dayOfWeek: 2,
    dayLabel: 'T3',
    dayNumber: 13,
    startTime: '11:00',
    endTime: '13:00',
    durationHours: 2,
    status: 'Paid',
    amount: 240000,
    paymentMethod: 'qr'
  },
  {
    id: '#BK-8498',
    guestName: 'Vũ Đức Thịnh',
    guestPhone: '0908 112 233',
    courtId: 'court-5',
    courtName: 'Sân 5 • 14:00 - 15:00',
    date: 'Thứ 5, 15 Tháng 8, 2024',
    dayOfWeek: 4,
    dayLabel: 'T5',
    dayNumber: 15,
    startTime: '14:00',
    endTime: '15:00',
    durationHours: 1,
    status: 'Cancelled',
    amount: 110000,
    paymentMethod: 'momo'
  }
];

export const initialPayments: PaymentTransaction[] = [
  {
    id: 'TXN-8891',
    bookingId: '#BKG-4421',
    guestName: 'Nguyen Van Toan',
    guestInitials: 'NT',
    amount: 320000,
    method: 'qr',
    timeStr: '14:30',
    dateStr: 'Today',
    fullTimestamp: 'Oct 24, 2023 - 14:30',
    status: 'pending',
    proofImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV08JBewCJ4pTT6fjtU2JDtk5lAeh4Aq57XPDR-_snCr5U212qnf3XpgjPRu8E5C7KKtXlFy1wYdCQ6EWWd3vCU0D_YtVf5x1iCcn8VDIF0j7VpZLd2FYYmUCGN3ZhfDrVHFfDjvEoSlou2okxrq_gdixOG-VrHJrkhLFgI3V9OY1rkVOzivujZzzKu2i3f9a55xs-Q5K-458KNvhQSMN5yRToV5qNaKWuC9RVOqxUzD89jSzTMeuQ'
  },
  {
    id: 'TXN-8890',
    bookingId: '#BKG-4420',
    guestName: 'Le Thi Mai',
    guestInitials: 'LM',
    amount: 180000,
    method: 'momo',
    timeStr: '12:15',
    dateStr: 'Today',
    fullTimestamp: 'Oct 24, 2023 - 12:15',
    status: 'paid'
  },
  {
    id: 'TXN-8889',
    bookingId: '#BKG-4418',
    guestName: 'Tran Hoang',
    guestInitials: 'TH',
    amount: 500000,
    method: 'cash',
    timeStr: '09:00',
    dateStr: 'Today',
    fullTimestamp: 'Oct 24, 2023 - 09:00',
    status: 'paid'
  },
  {
    id: 'TXN-8888',
    bookingId: '#BKG-4415',
    guestName: 'Pham Van A',
    guestInitials: 'P',
    amount: 150000,
    method: 'qr',
    timeStr: '18:45',
    dateStr: 'Yesterday',
    fullTimestamp: 'Oct 23, 2023 - 18:45',
    status: 'failed',
    rejectionReason: 'Số tiền chuyển khoản không khớp với mã đơn đặt sân.'
  },
  {
    id: 'TXN-8887',
    bookingId: '#BKG-4412',
    guestName: 'Đặng Quốc Bảo',
    guestInitials: 'QB',
    amount: 240000,
    method: 'qr',
    timeStr: '16:20',
    dateStr: 'Yesterday',
    fullTimestamp: 'Oct 23, 2023 - 16:20',
    status: 'paid'
  }
];

export const initialUsers: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Nguyễn Văn An',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxbcr9tZaJ0MdSu6XBZxDDxF4z0si8q_wT-G6XV1HgZ8sciWDXRBV7Pe6iu0R-YDeereYIVPPbgNia3XeAeM-7Lc9vhkAgVGBLEgHHbh5nlXUD5LVgRKBsLue-OIunyflJ6XuS1cg65PA5cv1JhEZ1MEUdHMVCCY5ku8s5SWtB7ntv65ir9c3qrLc5tDmO1uFrhTFxDdcdZ1PMqRzQGcRNSXiScw_egxU-E7-ZEEvWf_CIj5TlNUuH',
    role: 'Thành viên Vàng',
    phone: '0912 345 678',
    email: 'an.nguyen@email.com',
    joinedDate: '12/05/2023',
    totalBookings: 42,
    status: 'HOẠT ĐỘNG',
    isOnline: true
  },
  {
    id: 'usr-2',
    name: 'Trần Thị Lan',
    initials: 'TL',
    role: 'Thành viên Bạc',
    phone: '0987 654 321',
    email: 'lan.tran89@email.com',
    joinedDate: '05/08/2023',
    totalBookings: 18,
    status: 'HOẠT ĐỘNG',
    isOnline: true
  },
  {
    id: 'usr-3',
    name: 'Lê Minh Tuấn',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT8r7PKyTOYt7cK0DWZuOvdukLtuTBOBnANvNelc27SpFmZVi6jZd94ikteKYSOaY5ihS1twQgZw-q5ZhJdLSsnjfFnr0Hnb1mDYv_l57LGRX1beq2XDpLId0weHReq-DwdYnH9mzwpTXy_lfEFOznQEZkQCsFZrdncqhT-LB4czBXydEUdewEKB8ImBjtcvclkFAogsINJEMPIn2-ZBC2jfbeuTmOzkQs8ZszkggXCc3D0vPYIqc2',
    role: 'Mới',
    phone: '0901 234 567',
    email: 'tuan.le@email.com',
    joinedDate: '20/10/2023',
    totalBookings: 2,
    status: 'BỊ KHÓA',
    isOnline: false
  },
  {
    id: 'usr-4',
    name: 'Phạm Hồng Nhung',
    initials: 'HN',
    role: 'Thành viên Vàng',
    phone: '0945 678 901',
    email: 'nhung.pham@gmail.com',
    joinedDate: '15/01/2023',
    totalBookings: 35,
    status: 'HOẠT ĐỘNG',
    isOnline: false
  },
  {
    id: 'usr-5',
    name: 'Admin Name (Trần Quốc Việt)',
    initials: 'AD',
    role: 'Quản trị viên',
    phone: '0933 000 999',
    email: 'superadmin@smashhub.vn',
    joinedDate: '01/01/2023',
    totalBookings: 120,
    status: 'HOẠT ĐỘNG',
    isOnline: true
  }
];

export const initialPromotions: Promotion[] = [
  {
    id: 'prm-1',
    code: 'SUMMER24',
    discountType: 'percentage',
    discountValue: 20,
    description: 'Áp dụng cho khung giờ vàng từ 9h-15h các ngày trong tuần. Tối đa 50k.',
    validPeriod: '01/06 - 31/08/2024',
    usedCount: 450,
    maxLimit: 1000,
    status: 'ĐANG CHẠY',
    updatedAt: 'Cập nhật 2 ngày trước'
  },
  {
    id: 'prm-2',
    code: 'NEWBIE50K',
    discountType: 'fixed',
    discountValue: 50000,
    description: 'Dành cho tài khoản đăng ký mới. Áp dụng cho lần đặt sân đầu tiên.',
    validPeriod: 'Không giới hạn',
    usedCount: 120,
    maxLimit: 'Vô hạn',
    status: 'TẠM DỪNG',
    updatedAt: 'Cập nhật 1 tuần trước'
  },
  {
    id: 'prm-3',
    code: 'VIPCLUB15',
    discountType: 'percentage',
    discountValue: 15,
    description: 'Ưu đãi dành riêng cho hội viên Vàng khi đặt sân vào khung giờ tối 18:00 - 22:00.',
    validPeriod: '01/07 - 31/12/2024',
    usedCount: 310,
    maxLimit: 500,
    status: 'ĐANG CHẠY',
    updatedAt: 'Cập nhật hôm qua'
  }
];

export const initialNews: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Giải vô địch CLB thường niên chính thức khởi tranh',
    summary: 'Đăng ký tham gia ngay hôm nay để nhận ưu đãi. Giải đấu chia làm 3 hạng mục phong trào và bán chuyên với tổng giải thưởng lên đến 50 triệu đồng.',
    content: 'Smash Hub trân trọng thông báo giải cầu lông mở rộng mùa thu 2024 dành cho tất cả thành viên và người yêu cầu lông trên toàn thành phố...',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8uKpW5Oj2ths8Hm_MSstRu6fIpAlLn-9wGFN-vqSFq_1nfaZ_xsWeMPB184XcpmzpOYTCGwaHIwSlVKFvNAALEmDmLcAp-fbE5fJiSjgLcrQxpmkJjkIkPAhU5vE0o0Xzi4GFNZgQX0IVUKhid1hDV9thygqMjDDFd7nwjD6qqe3DglUWRdTiIQan6cMFOaJyjbSgJOVghSpNPtvfqwouoYmiEUBA_pScVXoyRv3GbLcBoBPOucAS',
    publishDate: '15/06/2024',
    author: 'Admin',
    views: 1200,
    status: 'ĐÃ ĐĂNG'
  },
  {
    id: 'news-2',
    title: 'Thông báo bảo trì và nâng cấp hệ thống chiếu sáng',
    summary: 'Nội dung đang cập nhật... Nhằm nâng cao chất lượng trải nghiệm thi đấu buổi tối, Smash Hub sẽ tiến hành bảo dưỡng sân 3 và hệ thống đèn LED.',
    content: 'Hệ thống đèn mới sẽ giảm độ lóa 40%, đạt tiêu chuẩn thi đấu quốc tế BWF...',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9V4FCfl_SZIJoWiJZXqpiVRtn8c_3d5NOX0THsiSoCIq4JQQ9iavlNYuT2IpP4g4xdTpLmUw5CTAqKEArqBSCDn31v__6oJgEYmsij4W6sHkQyfSu5BLYWu0Kj3MBzDYsxU6sYmBNqcm0m-qAII_TndmTOgoh9cnMJBDuFmmk2Ley1tWG2fmFsmtV4fxOIPyJJMjCdCBl7LKi1GrfLifx0yhju5mh8wh8m-a8ol8f2u5nvd9-ZqI_',
    publishDate: '--/--/----',
    author: 'Ban Quản Lý',
    views: 0,
    status: 'BẢN NHÁP'
  },
  {
    id: 'news-3',
    title: 'Mẹo khởi động & chống chấn thương cổ chân khi đánh cầu lông',
    summary: 'Chuyên gia huấn luyện viên thể lực chia sẻ 5 bài tập kéo giãn cơ và làm nóng khớp trước khi vào sân tập luyện cường độ cao.',
    content: 'Cổ chân và khớp gối là hai vùng dễ chấn thương nhất khi di chuyển bước chéo hoặc bật nhảy đập cầu (smash)...',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop&q=80',
    publishDate: '10/06/2024',
    author: 'HLV Minh Hải',
    views: 890,
    status: 'ĐÃ ĐĂNG'
  }
];
