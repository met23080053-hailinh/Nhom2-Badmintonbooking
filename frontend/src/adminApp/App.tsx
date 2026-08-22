import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CourtManagementView } from './components/CourtManagementView';
import { BookingManagementView } from './components/BookingManagementView';
import { PaymentManagementView } from './components/PaymentManagementView';
import { UserManagementView } from './components/UserManagementView';
import {
  NavigationTab,
  Court,
  Booking,
  PaymentTransaction,
  UserAccount,
  Promotion,
  NewsArticle,
  BookingStatus,
  PaymentStatus,
  UserStatus
} from './types';


interface Toast {
  id: string;
  title: string;
  desc?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export function AdminApp({ onLogout }: { onLogout?: () => void }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Application Data States
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  React.useEffect(() => {
    fetch(`/backend/get_courts.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const apiCourts = data.data.map((c: any) => ({
            id: 'court-' + c.id,
            name: c.name,
            image: c.images && c.images.length > 0 ? c.images[0] : '/images/preview (3).webp',
            description: c.description,
            area: c.location,
            type: c.court_type || 'Sân đôi',
            pricePerHour: c.pricePerHour,
            status: c.status === 'AVAILABLE' ? 'HOẠT ĐỘNG' : 'BẢO TRÌ'
          }));
          setCourts(apiCourts);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const [payments, setPayments] = useState<PaymentTransaction[]>([]);

  // Fetch bookings function — extracted so we can call it manually + periodically
  const fetchBookings = useCallback(() => {
    fetch(`/backend/get_bookings.php`)
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          const realBookings = data.data.map((b: any) => ({
            id: 'BB-' + b.id,
            guestName: b.user_name || 'Khách Hàng',
            guestPhone: b.user_phone || '09xx',
            courtId: 'court-' + b.court_id,
            courtName: b.court_name || 'Sân ' + b.court_id,
            date: b.start_time.split(' ')[0],
            startTime: b.start_time.split(' ')[1].substring(0,5),
            endTime: b.end_time.split(' ')[1].substring(0,5),
            amount: Number(b.total_price),
            status: b.status === 'confirmed' ? 'Paid' : b.status === 'cancelled' ? 'Cancelled' : 'Pending',
            paymentMethod: 'VietQR',
            createdAt: b.created_at
          }));
          setBookings(realBookings);

          const realPayments = data.data.map((b: any) => ({
            id: 'TXN-' + b.id,
            bookingId: 'BB-' + b.id,
            guestName: b.user_name || 'Khách Hàng',
            guestInitials: (b.user_name || 'KH').substring(0, 2).toUpperCase(),
            amount: Number(b.total_price),
            method: 'qr',
            status: b.status === 'confirmed' ? 'paid' : (b.status === 'cancelled' ? 'failed' : 'pending'),
            dateStr: b.start_time.split(' ')[0],
            timeStr: b.start_time.split(' ')[1].substring(0,5),
            fullTimestamp: b.created_at || b.start_time,
            proofImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV08JBewCJ4pTT6fjtU2JDtk5lAeh4Aq57XPDR-_snCr5U212qnf3XpgjPRu8E5C7KKtXlFy1wYdCQ6EWWd3vCU0D_YtVf5x1iCcn8VDIF0j7VpZLd2FYYmUCGN3ZhfDrVHFfDjvEoSlou2okxrq_gdixOG-VrHJrkhLFgI3V9OY1rkVOzivujZzzKu2i3f9a55xs-Q5K-458KNvhQSMN5yRToV5qNaKWuC9RVOqxUzD89jSzTMeuQ'
          }));
          setPayments(realPayments);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Initial fetch + auto-refresh every 30 seconds
  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  const [users, setUsers] = useState<UserAccount[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);

  // Fetch Promotions
  React.useEffect(() => {
    fetch(`/backend/get_promotions.php`)
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          setPromotions(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch Users
  React.useEffect(() => {
    fetch(`/backend/admin_get_users.php`)
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          setUsers(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch News
  React.useEffect(() => {
    fetch(`/backend/get_news.php`)
      .then(res => res.json())
      .then(data => {
        if(data.status === 'success') {
          const mappedNews = data.data.map((n: any) => ({
            id: n.id,
            title: n.title,
            summary: n.excerpt,
            content: n.content,
            image: n.image,
            publishDate: n.date,
            views: 0,
            author: 'Admin',
            status: 'ĐÃ ĐĂNG',
            category: n.category
          }));
          setNews(mappedNews);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Selection states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Toast Notification System
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    title: string,
    desc?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, title, desc, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Court Handlers
  const handleAddCourt = (court: Court) => {
    fetch('/backend/create_court.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: court.name,
        location: court.area || 'Khác',
        city: 'Hà Nội',
        district: 'Khác',
        court_type: court.type,
        price_per_hour: court.pricePerHour,
        status: court.status === 'HOẠT ĐỘNG' ? 'AVAILABLE' : 'MAINTENANCE',
        featured: 0
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setCourts((prev) => [{...court, id: 'court-' + data.court_id}, ...prev]);
          showToast('Thành công', 'Đã thêm sân mới', 'success');
        } else {
          showToast('Lỗi', data.message, 'error');
        }
      })
      .catch(err => console.error(err));
  };

  const handleUpdateCourt = (court: Court) => {
    fetch('/backend/update_court.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        court_id: String(court.id).replace('court-', ''),
        name: court.name,
        location: court.area || 'Khác',
        court_type: court.type,
        price_per_hour: court.pricePerHour,
        status: court.status === 'HOẠT ĐỘNG' ? 'AVAILABLE' : 'MAINTENANCE'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setCourts((prev) => prev.map((c) => (c.id === court.id ? court : c)));
          showToast('Thành công', 'Đã cập nhật sân', 'success');
        } else {
          showToast('Lỗi', data.message, 'error');
        }
      })
      .catch(err => console.error(err));
  };

  const handleDeleteCourt = (courtId: string) => {
    fetch(`/backend/delete_court.php?id=${String(courtId).replace('court-', '')}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setCourts((prev) => prev.filter((c) => c.id !== courtId));
          showToast('Thành công', 'Đã xóa sân', 'success');
        } else {
          showToast('Lỗi', data.message, 'error');
        }
      })
      .catch(err => console.error(err));
  };

  // Booking Handlers
  const handleAddBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
    // Create corresponding payment if not exists
    const newPayment: PaymentTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking.id,
      guestName: booking.guestName,
      guestInitials: booking.guestName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(-2)
        .toUpperCase(),
      amount: booking.amount,
      method: booking.paymentMethod || 'qr',
      status: booking.status === 'Paid' ? 'paid' : booking.status === 'Cancelled' ? 'failed' : 'pending',
      dateStr: 'Today',
      timeStr: booking.startTime,
      fullTimestamp: `${booking.date || 'Hôm nay'} - ${booking.startTime}`,
      proofImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV08JBewCJ4pTT6fjtU2JDtk5lAeh4Aq57XPDR-_snCr5U212qnf3XpgjPRu8E5C7KKtXlFy1wYdCQ6EWWd3vCU0D_YtVf5x1iCcn8VDIF0j7VpZLd2FYYmUCGN3ZhfDrVHFfDjvEoSlou2okxrq_gdixOG-VrHJrkhLFgI3V9OY1rkVOzivujZzzKu2i3f9a55xs-Q5K-458KNvhQSMN5yRToV5qNaKWuC9RVOqxUzD89jSzTMeuQ'
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    const bId = bookingId.replace('BB-', '');
    const apiStatus = newStatus === 'Paid' ? 'CONFIRMED' : (newStatus === 'Cancelled' ? 'CANCELLED' : 'PENDING');
    fetch('/backend/update_booking_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bId, status: apiStatus })
    }).catch(err => console.error(err));

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
    // Also sync payment status
    setPayments((prev) =>
      prev.map((p) =>
        p.bookingId === bookingId
          ? { ...p, status: newStatus === 'Paid' ? 'paid' : newStatus === 'Cancelled' ? 'failed' : 'pending' }
          : p
      )
    );
  };

  // Payment Handlers
  const handleUpdatePaymentStatus = (
    id: string,
    status: PaymentStatus,
    reason?: string
  ) => {
    const targetTxn = payments.find((p) => p.id === id);
    if (targetTxn) {
      const bId = targetTxn.bookingId.replace('BB-', '');
      const apiStatus = status === 'paid' ? 'CONFIRMED' : (status === 'failed' ? 'CANCELLED' : 'PENDING');
      fetch('/backend/update_booking_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bId, status: apiStatus })
      }).catch(err => console.error(err));

      const bStatus: BookingStatus = status === 'paid' ? 'Paid' : status === 'failed' ? 'Cancelled' : 'Pending';
      setBookings((prev) =>
        prev.map((b) => (b.id === targetTxn.bookingId ? { ...b, status: bStatus } : b))
      );
    }

    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, rejectionReason: reason } : p))
    );
  };

  // User Handlers
  const handleUpdateUserStatus = (userId: string, status: UserStatus) => {
    fetch(`/backend/admin_manage_users.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', id: userId, status })
    }).then(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
    });
  };

  const handleAddUser = (user: UserAccount) => {
    fetch(`/backend/admin_manage_users.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', name: user.name, phone: user.phone, email: user.email, role: user.role })
    }).then(() => {
      setUsers((prev) => [user, ...prev]);
    });
  };

  // Promotion Handlers
  const handleAddPromotion = (promo: Promotion) => {
    fetch('/backend/admin_manage_promotions.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        description: promo.description,
        maxLimit: promo.maxLimit
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setPromotions((prev) => [{ ...promo, id: data.id, status: 'ĐANG CHẠY' }, ...prev]);
          showToast('Thành công', 'Đã thêm khuyến mãi', 'success');
        } else {
          showToast('Lỗi', data.message, 'error');
        }
      })
      .catch(err => console.error(err));
  };

  const handleTogglePromoStatus = (promoId: string) => {
    const promo = promotions.find(p => p.id === promoId);
    if (!promo) return;
    
    const newStatus = promo.status === 'ĐANG CHẠY' ? 'TẠM DỪNG' : 'ĐANG CHẠY';
    
    fetch('/backend/admin_manage_promotions.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_status', id: promoId, status: newStatus })
    }).then(() => {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === promoId ? { ...p, status: newStatus } : p
        )
      );
      showToast('Cập nhật khuyến mãi', 'Đã thay đổi trạng thái hoạt động của voucher', 'info');
    }).catch(err => console.error(err));
  };

  // News Handlers
  const handleAddNews = (article: NewsArticle) => {
    fetch(`/backend/admin_manage_news.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        title: article.title,
        date: article.publishDate,
        image: article.image,
        excerpt: article.summary,
        category: article.category || 'Khác',
        content: article.content
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        // Optimistic UI update or re-fetch. Since ID from DB is unknown, better to reload, 
        // but for now optimistic insert with temp ID
        setNews((prev) => [article, ...prev]);
      } else {
        showToast('Lỗi', data.message, 'error');
      }
    })
    .catch(err => console.error(err));
  };

  const handleDeleteNews = (articleId: string) => {
    fetch(`/backend/admin_manage_news.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: articleId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setNews((prev) => prev.filter((n) => n.id !== articleId));
      } else {
        showToast('Lỗi', data.message, 'error');
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen text-earth-main flex flex-col antialiased bg-earth-cream">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Top Operations Header */}
      <Header
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="lg:ml-[260px] pt-20 px-4 sm:px-8 max-w-7xl w-full mx-auto flex-1">
        {activeTab === 'dashboard' && (
          <DashboardView
            bookings={bookings}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectBooking={(bk) => {
              setSelectedBooking(bk);
              setActiveTab('booking-management');
            }}
          />
        )}

        {activeTab === 'court-management' && (
          <CourtManagementView
            courts={courts}
            onAddCourt={handleAddCourt}
            onUpdateCourt={handleUpdateCourt}
            onDeleteCourt={handleDeleteCourt}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'booking-management' && (
          <BookingManagementView
            bookings={bookings}
            courts={courts}
            selectedBooking={selectedBooking}
            onSelectBooking={setSelectedBooking}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onAddBooking={handleAddBooking}
            onShowToast={showToast}
            onRefresh={fetchBookings}
          />
        )}

        {activeTab === 'payment-management' && (
          <PaymentManagementView
            payments={payments}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'user-management' && (
          <UserManagementView
            initialSubTab="users"
            users={users}
            promotions={promotions}
            news={news}
            onUpdateUserStatus={handleUpdateUserStatus}
            onAddUser={handleAddUser}
            onAddPromotion={handleAddPromotion}
            onTogglePromoStatus={handleTogglePromoStatus}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'promotions' && (
          <UserManagementView
            initialSubTab="promotions"
            users={users}
            promotions={promotions}
            news={news}
            onUpdateUserStatus={handleUpdateUserStatus}
            onAddUser={handleAddUser}
            onAddPromotion={handleAddPromotion}
            onTogglePromoStatus={handleTogglePromoStatus}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'news' && (
          <UserManagementView
            initialSubTab="news"
            users={users}
            promotions={promotions}
            news={news}
            onUpdateUserStatus={handleUpdateUserStatus}
            onAddUser={handleAddUser}
            onAddPromotion={handleAddPromotion}
            onTogglePromoStatus={handleTogglePromoStatus}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-60 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-4 shadow-xl flex items-start gap-3 border bg-earth-card animate-in slide-in-from-bottom-3 duration-300 ${
              toast.type === 'success'
                ? 'border-earth-primary'
                : toast.type === 'warning'
                ? 'border-earth-accent'
                : toast.type === 'error'
                ? 'border-earth-danger'
                : 'border-earth-primary'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              <span className={`material-symbols-outlined text-xl ${
                toast.type === 'success' ? 'text-earth-primary' :
                toast.type === 'warning' ? 'text-earth-accent' :
                toast.type === 'error' ? 'text-earth-danger' :
                'text-earth-primary'
              }`}>
                {toast.type === 'success'
                  ? 'check_circle'
                  : toast.type === 'warning'
                  ? 'warning'
                  : toast.type === 'error'
                  ? 'error'
                  : 'info'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold leading-tight">{toast.title}</p>
              {toast.desc && <p className="text-[11px] opacity-90 mt-1 leading-snug">{toast.desc}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-0.5 text-earth-muted hover:text-earth-main transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}



