import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedCourts } from './components/FeaturedCourts';
import { ThreeSteps } from './components/ThreeSteps';
import { CourtListView } from './components/CourtListView';
import { CourtDetailView } from './components/CourtDetailView';
import { FindPartnerView } from './components/FindPartnerView';
import { NewsView } from './components/NewsView';
import { BookingModal } from './components/BookingModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { AuthModal } from './components/AuthModal';
import { PolicyModal } from './components/PolicyModal';
import { Profile } from './components/Profile';
import { AdminApp } from './adminApp/App';
import { AdminLogin } from './adminApp/AdminLogin';
import { MOCK_COURTS } from './data/courts';
import { CourtFacility, BookingRecord } from './types';


export default function App() {
  const getInitialTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'search', 'courts', 'partners', 'profile', 'admin', 'admin-login', 'news'].includes(hash)) {
      return hash as 'home' | 'search' | 'courts' | 'partners' | 'profile' | 'admin' | 'admin-login' | 'news';
    }
    return 'home';
  };

  const [currentTab, setCurrentTabState] = useState<'home' | 'search' | 'courts' | 'partners' | 'profile' | 'admin' | 'admin-login' | 'news'>(getInitialTab());

  const setCurrentTab = (tab: 'home' | 'search' | 'courts' | 'partners' | 'profile' | 'admin' | 'admin-login' | 'news') => {
    window.history.pushState({ tab }, '', `#${tab}`);
    setCurrentTabState(tab);
  };


  const [selectedCourtForBooking, setSelectedCourtForBooking] = useState<CourtFacility | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingsDrawerOpen, setIsBookingsDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<'customer' | 'admin'>('customer');
  const [policyModalTitle, setPolicyModalTitle] = useState<string | null>(null);

  // User state (Persisted in localStorage)
  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('userState') || 'null');
    } catch { return null; }
  })();
  const [isLoggedIn, setIsLoggedIn] = useState(savedUser?.isLoggedIn || false);
  const [userName, setUserName] = useState(savedUser?.userName || '');
  const [userRole, setUserRole] = useState<'customer' | 'admin'>(savedUser?.userRole || 'customer');
  const [userEmail, setUserEmail] = useState(savedUser?.userEmail || '');
  const [userId, setUserId] = useState<number | null>(savedUser?.userId || null);

  const [courts, setCourts] = useState<any[]>(MOCK_COURTS);

  React.useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      
      // Logout admin if they press back to leave the admin page
      if (userRole === 'admin' && hash !== 'admin' && hash !== 'admin-login') {
        setIsLoggedIn(false);
        setUserRole('customer');
        setUserId(null);
        setUserName('');
        setUserBookings([]);
        localStorage.removeItem('userState');
      }

      if (['home', 'search', 'courts', 'partners', 'profile', 'admin', 'admin-login', 'news'].includes(hash)) {
        setCurrentTabState(hash as any);
      } else {
        setCurrentTabState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [userRole]);

  // React.useEffect(() => {
  //   fetch(`https://cau-long.rf.gd/backend/get_courts.php`)
  //     .then(res => res.json())
  //     .then(data => {
  //       if(data.status === 'success') {
  //         // Removed because DB data lacks fields (city, district, amenities, etc.)
  //         // and breaks the filtering / UI consistency.
  //       }
  //     })
  //     .catch(err => console.error("Lỗi lấy dữ liệu sân:", err));
  // }, []);

  // Tự động gọi API nhắc lịch (Cronjob mô phỏng) mỗi 1 phút (60000ms)
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(`https://cau-long.rf.gd/backend/reminder_cron.php`)
        .then(res => res.text())
        .then(text => {
          console.log("[Hệ Thống Nhắc Lịch Tự Động]:\n" + text);
        })
        .catch(err => console.error("Lỗi chạy Cronjob:", err));
    }, 60000); // 1 phút

    return () => clearInterval(intervalId); // Dọn dẹp khi component unmount
  }, []);

  // Pre-seed an initial realistic booking
  const [userBookings, setUserBookings] = useState<BookingRecord[]>([]);

  // Search filter criteria passed from Hero
  const [searchDistrict, setSearchDistrict] = useState('Tất cả khu vực');
  const [searchDate, setSearchDate] = useState('Hôm nay');
  const [searchTime, setSearchTime] = useState('Mọi khung giờ');

  // Handlers
  const handleOpenBookingForCourt = (court: CourtFacility) => {
    setSelectedCourtForBooking(court);
    setCurrentTab('court-detail' as any);
  };

  const handleHeroSearch = (criteria: { district: string; date: string; time: string }) => {
    setSearchDistrict(criteria.district);
    setSearchDate(criteria.date);
    setSearchTime(criteria.time);
    setCurrentTab('courts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroBookNow = () => {
    // Open booking modal for the featured elite arena or go to court list
    setSelectedCourtForBooking(MOCK_COURTS[0]);
    setIsBookingModalOpen(true);
  };

  const handleHeroFindPartner = () => {
    setCurrentTab('partners');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewBookingCreated = (newBooking: BookingRecord) => {
    setUserBookings([newBooking, ...userBookings]);

    // Format start and end time from timeSlots array (e.g. ['19:00 - 20:00', '20:00 - 21:00'])
    const startTimeStr = newBooking.timeSlots[0] ? newBooking.timeSlots[0].split(' - ')[0] : '00:00';
    const lastSlot = newBooking.timeSlots[newBooking.timeSlots.length - 1];
    const endTimeStr = lastSlot ? lastSlot.split(' - ')[1] : '01:00';

    // Fake a valid MySQL Date YYYY-MM-DD for demo (or use real parsed date)
    const today = new Date().toISOString().split('T')[0];
    const mysqlStartTime = `${today} ${startTimeStr}:00`;
    const mysqlEndTime = `${today} ${endTimeStr}:00`;

    // 2. Gửi dữ liệu thật về Backend PHP
    fetch(`https://cau-long.rf.gd/backend/create_booking.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId || 1, // Dùng biến userId thật thay vì số 1 (dự phòng 1 nếu null)
        court_id: parseInt(newBooking.facilityId.replace('court-', '')) || 1,
        start_time: mysqlStartTime,
        end_time: mysqlEndTime,
        total_price: newBooking.totalAmount
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Phản hồi từ Database:", data);
      if (data.status !== 'success') {
        alert("Lỗi lưu vào DB: " + data.message);
      }
    })
    .catch(err => console.error("Lỗi lưu đơn:", err));
  };

  const handleCancelBooking = (bookingId: string) => {
    setUserBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );
  };

  const handleLogin = (nameOrUser: any, emailArg?: string, idArg?: number | string) => {
    let name = '';
    let email = '';
    let id: number | null = null;
    let role = 'customer';

    if (typeof nameOrUser === 'string') {
      name = nameOrUser;
      email = emailArg || '';
      if (idArg) id = Number(idArg);
    } else if (nameOrUser) {
      name = nameOrUser.full_name || nameOrUser.name || 'Người dùng';
      email = nameOrUser.email || '';
      role = nameOrUser.role || 'customer';
      if (nameOrUser.id) id = Number(nameOrUser.id);
    }

    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);
    setUserId(id);
    
    // Admin login via "Chủ sân" button sets intent to 'admin'.
    // A secure system would rely on the backend `role` field.
    // For now we trust the intent or fallback to role if intent is missing.
    const isRoleAdmin = typeof role === 'string' && role.toLowerCase() === 'admin';
    const finalRole = (authIntent === 'admin' || isRoleAdmin) ? 'admin' : 'customer';

    if (finalRole === 'admin') {
      setUserRole('admin');
      
      // push a dummy home state so pressing back doesn't exit if they had no history
      if (window.history.length <= 1) {
        window.history.pushState({ tab: 'home' }, '', '#home');
      }
      
      setCurrentTab('admin');
    } else {
      setUserRole('customer');
    }

    localStorage.setItem('userState', JSON.stringify({
      isLoggedIn: true,
      userName: name,
      userRole: finalRole,
      userEmail: email,
      userId: id
    }));

    if (id) {
      fetch(`https://cau-long.rf.gd/backend/get_bookings.php?user_id=${id}`)
        .then(res => res.json())
        .then(data => {
          if(data.status === 'success') {
            const mappedBookings = data.data.map((b: any) => ({
              id: 'book-' + b.id,
              bookingCode: 'BB-' + b.id,
              facilityId: b.court_id,
              facilityName: 'Sân Cầu Lông ' + b.court_id,
              facilityLocation: '',
              facilityImage: '/images/preview (3).webp',
              courtNumber: 'Sân ' + b.court_id,
              date: b.start_time,
              timeSlots: [b.start_time],
              totalHours: 1,
              totalAmount: Number(b.total_price),
              formattedTotalAmount: Number(b.total_price).toLocaleString('vi-VN') + ' VND',
              status: b.status === 'confirmed' ? 'CONFIRMED' : 'PENDING',
              playerName: name,
              playerPhone: '',
              playerEmail: email,
              paymentMethod: 'Tiền mặt',
              createdAt: b.created_at,
              qrCodeSeed: 'BB-' + b.id,
            }));
            setUserBookings(mappedBookings);
          }
        })
        .catch(err => console.error("Lỗi lấy lịch sử:", err));
    }
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('Guest');
    setUserRole('customer');
    setUserEmail('');
    setUserId(null);
    setUserBookings([]); 
    setCurrentTab('home');
    localStorage.removeItem('userState');
  };

  // Middleware Guard cho tab admin
  if (currentTab === 'admin' && userRole !== 'admin') {
    setCurrentTab('home');
    alert("Không có quyền truy cập trang quản trị!");
  }



  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink selection:bg-primary/20 selection:text-primary">
      {/* Global Header matching screenshot */}
      <Header
        currentTab={currentTab as any}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userBookings={userBookings.filter((b) => b.status === 'CONFIRMED')}
        onOpenBookings={() => setIsBookingsDrawerOpen(true)}
        onOpenAuth={(intent = 'customer') => {
          if (intent === 'admin') {
            setCurrentTab('admin-login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setAuthIntent(intent);
            setIsAuthModalOpen(true);
          }
        }}
        isLoggedIn={isLoggedIn}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            {/* Hero Section matching screenshot */}
            <Hero
              onSearchSubmit={handleHeroSearch}
              onBookNowClick={handleHeroBookNow}
              onFindPartnerClick={handleHeroFindPartner}
            />

            {/* Featured Courts Grid matching screenshot */}
            <FeaturedCourts
              courts={MOCK_COURTS.filter((c) => c.featured)}
              onSelectCourt={handleOpenBookingForCourt}
              onViewAllClick={() => {
                setCurrentTab('courts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Ready to play in 3 steps matching screenshot */}
            <ThreeSteps />
          </>
        )}

        {(currentTab === 'search' || currentTab === 'courts') && (
          <CourtListView
            courts={courts}
            onSelectCourt={handleOpenBookingForCourt}
            initialDistrict={searchDistrict}
          />
        )}

        {currentTab === 'partners' && (
          <FindPartnerView
            courts={courts}
            onBookCourtRedirect={handleOpenBookingForCourt}
          />
        )}
        
        {currentTab === 'news' && (
          <NewsView />
        )}

        {currentTab === 'profile' && (
          <Profile 
            userId={userId}
            userName={userName} 
            userPhone={userEmail} 
            userRole="customer" 
            onProfileUpdate={(name, phone) => {
              setUserName(name);
              setUserEmail(phone);
            }}
          />
        )}
        
        {currentTab === 'court-detail' && selectedCourtForBooking && (
          <CourtDetailView 
            court={selectedCourtForBooking} 
            onBookNow={() => setIsBookingModalOpen(true)}
            onBack={() => {
              setCurrentTab('courts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        
        {/* --- Admin Module --- */}
        {currentTab === 'admin-login' && (
          <div className="fixed inset-0 z-[100] flex">
            <AdminLogin 
              onLoginSuccess={(userObj) => {
                handleLogin(userObj);
                setCurrentTab('admin');
              }} 
            />
          </div>
        )}

        {currentTab === 'admin' && userRole === 'admin' && (
          <div className="fixed inset-0 bg-earth-cream z-[100] overflow-y-auto w-full block">
            <AdminApp onLogout={handleLogout} />
          </div>
        )}
      </main>

      {/* Footer matching screenshot */}
      <footer className="bg-white border-t border-ink/10 pt-14 pb-10 text-ink">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-ink/10">
            {/* Brand Col */}
            <div className="md:col-span-5">
              <h3 className="font-extrabold text-xl text-ink tracking-tight">
                Badminton Booking
              </h3>
              <p className="mt-3 text-sm text-ink/80 leading-relaxed max-w-sm">
                Nền tảng hàng đầu về đặt lịch sân và kết nối cộng đồng cầu lông.
              </p>
            </div>

            {/* Liên Kết Col */}
            <div className="md:col-span-3">
              <h4 className="font-bold text-sm text-ink mb-3">Liên Kết</h4>
              <ul className="space-y-2.5 text-sm text-ink/80">
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTitle('Về Chúng Tôi')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Về Chúng Tôi
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTitle('Điều Khoản Dịch Vụ')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Điều Khoản Dịch Vụ
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyModalTitle('Chính Sách Bảo Mật')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Chính Sách Bảo Mật
                  </button>
                </li>
              </ul>
            </div>

            {/* Liên Hệ Col */}
            <div className="md:col-span-4">
              <h4 className="font-bold text-sm text-ink mb-3">Liên Hệ</h4>
              <ul className="space-y-2 text-sm text-ink/80">
                <li>
                  <a
                    href="mailto:support@badmintonbooking.com"
                    className="hover:text-primary transition-colors"
                  >
                    support@badmintonbooking.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+84763993624"
                    className="hover:text-primary transition-colors"
                  >
                    +84 763993624
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 text-center text-xs text-ink/60">
            <p>© 2024 Badminton Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <BookingModal
        court={selectedCourtForBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleNewBookingCreated}
        defaultNgày={searchDate}
        defaultTime={searchTime}
        isLoggedIn={isLoggedIn}
        userId={userId}
        userName={userName}
        userPhone={userEmail} /* Need to fix phone passing */
        onRequireLogin={() => {
          setAuthIntent('customer');
          setIsAuthModalOpen(true);
        }}
      />

      <MyBookingsModal
        isOpen={isBookingsDrawerOpen}
        onClose={() => setIsBookingsDrawerOpen(false)}
        bookings={userBookings}
        onCancelBooking={handleCancelBooking}
        onBookMore={() => {
          setCurrentTab('courts');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLogin}
        intent={authIntent}
      />

      <PolicyModal
        title={policyModalTitle}
        onClose={() => setPolicyModalTitle(null)}
      />
    </div>
  );
}

