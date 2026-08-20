import React, { useState } from 'react';
import { Bell, User, Menu, X, CheckCircle, Clock, MapPin, Calendar } from 'lucide-react';
import { BookingRecord } from '../types';

interface HeaderProps {
  currentTab: 'home' | 'search' | 'courts' | 'partners' | 'news';
  onNavigate: (tab: 'home' | 'search' | 'courts' | 'partners' | 'news') => void;
  onOpenBookings: () => void;
  onOpenAuth: (intent?: 'customer' | 'admin') => void;
  isLoggedIn: boolean;
  userName: string;
  userRole?: 'customer' | 'admin';
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  userBookings,
  onOpenBookings,
  onOpenAuth,
  isLoggedIn,
  userName,
  userRole = 'customer',
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Đã Xác Nhận Đặt Sân!',
      desc: 'Lịch đặt sân của bạn tại Elite Smash Arena (Sân 1) đã sẵn sàng.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Yêu Cầu Tham Gia Giao Lưu',
      desc: 'Nguyễn Văn Minh đã chấp nhận yêu cầu tham gia Đôi Nam của bạn.',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Thông Báo Khung Giờ Vàng',
      desc: 'Olympic Court Center vừa mở 2 khung giờ tối cho ngày mai.',
      time: '3 hours ago',
      unread: false,
    },
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-ink shadow-sm transition-transform group-hover:scale-105">
            {/* Custom Badminton Shuttlecock SVG Icon */}
            <svg
              className="w-6 h-6 text-secondary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v4" />
              <path d="m4.93 10.93 2.83-2.83" />
              <path d="m19.07 10.93-2.83-2.83" />
              <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
              <path d="m14 14 5 5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-primary group-hover:text-ink transition-colors">
            Badminton Booking
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-8 font-medium text-[15px]">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentTab === 'home'
                ? 'text-primary font-semibold'
                : 'text-ink/80 hover:text-primary'
            }`}
          >
            Trang chủ
            {currentTab === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>



          <button
            id="nav-courts-btn"
            onClick={() => onNavigate('courts')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentTab === 'courts'
                ? 'text-primary font-semibold'
                : 'text-ink/80 hover:text-primary'
            }`}
          >
            Danh sách Sân
            {currentTab === 'courts' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>

          <button
            id="nav-partners-btn"
            onClick={() => onNavigate('partners')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentTab === 'partners'
                ? 'text-primary font-semibold'
                : 'text-ink/80 hover:text-primary'
            }`}
          >
            Tìm bạn chơi
            {currentTab === 'partners' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        
          <button
            id="nav-news-btn"
            onClick={() => onNavigate('news')}
            className={`transition-colors cursor-pointer py-1 relative ${
              currentTab === 'news'
                ? 'text-primary font-semibold'
                : 'text-ink/80 hover:text-primary'
            }`}
          >
            Tin tức
            {currentTab === 'news' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            )}
          </button>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Notification Button with Dropdown */}
          <div className="relative">
            <button
              id="notifications-toggle-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-ink/80 hover:text-primary hover:bg-primary/5 transition-colors relative cursor-pointer"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface" />
            </button>

            {showNotifications && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-ink/10 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-ink/10 mb-2">
                  <h4 className="font-semibold text-sm text-ink">Thông báo</h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    2 Mới
                  </span>
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        n.unread ? 'bg-white border border-ink/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-ink mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-ink/50 font-normal">{n.time}</span>
                      </div>
                      <p className="text-ink/70 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  id="view-all-notifs-btn"
                  onClick={() => {
                    setShowNotifications(false);
                    onOpenBookings();
                  }}
                  className="w-full mt-3 pt-2 text-center text-xs font-semibold text-primary hover:underline cursor-pointer border-t border-ink/10"
                >
                  Xem Sân đã đặt & Lịch trình →
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Bookings Button */}
          <button
            id="my-bookings-btn"
            onClick={onOpenBookings}
            title="Sân đã đặt & Mã QR"
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink/80 hover:text-primary hover:bg-primary/5 transition-colors relative cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            {userBookings.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-surface text-[10px] font-bold flex items-center justify-center">
                {userBookings.length}
              </span>
            )}
          </button>

          {/* Logged in state vs Log In button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-ink/10 text-sm font-semibold text-primary hover:bg-primary/10 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-primary text-surface flex items-center justify-center text-xs font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{userName}</span>
              </button>

              {showUserDropdown && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-ink/10 p-2 z-50"
                >
                  <div className="px-3 py-2 border-b border-ink/10 mb-1">
                    <p className="text-xs text-ink/60 font-medium">Đăng nhập với tên</p>
                    <p className="text-sm font-bold text-ink truncate">{userName}</p>
                    <p className="text-xs font-bold text-secondary mt-0.5">{userRole === 'admin' ? 'Chủ Sân' : 'Khách hàng'}</p>
                    <p className="text-xs text-primary mt-0.5">Số dư ví: 250.000 VNĐ</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onNavigate('profile' as any);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-ink/80 hover:bg-zinc-50 hover:text-primary rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-primary" />
                    Hồ sơ cá nhân
                  </button>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onNavigate('admin' as any);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-primary font-semibold hover:bg-primary/5 rounded-lg transition-colors cursor-pointer flex items-center gap-2 mt-1"
                    >
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Vào Quản lý Sân (Admin)
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenBookings();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-ink/80 hover:bg-zinc-50 hover:text-primary rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Sân đã đặt ({userBookings.length})
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mt-1"
                  >Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/#admin-login"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-primary"
              >
                Chủ sân
              </a>
              <button
                id="header-login-btn"
                onClick={() => onOpenAuth('customer')}
                className="bg-gradient-to-r from-primary to-ink hover:from-primary hover:to-ink text-secondary font-semibold text-sm px-7 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >Đăng nhập</button>
            </div>
          )}

          {/* User Icon Avatar matching screenshot */}
          <button
            id="user-avatar-btn"
            onClick={() => isLoggedIn ? onNavigate('profile' as any) : onOpenAuth('customer')}
            className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer border border-ink/10"
          >
            <User className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="mobile-bookings-btn"
            onClick={onOpenBookings}
            className="p-2 text-ink/80 hover:text-primary relative"
          >
            <Calendar className="w-5 h-5" />
            {userBookings.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-ink hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden border-t border-ink/10 bg-white px-4 py-5 space-y-3 shadow-lg">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm ${
              currentTab === 'home' ? 'bg-primary/10 text-primary font-bold' : 'text-ink/80'
            }`}
          >
            Trang chủ
          </button>

          <button
            onClick={() => {
              onNavigate('courts');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm ${
              currentTab === 'courts' ? 'bg-primary/10 text-primary font-bold' : 'text-ink/80'
            }`}
          >
            Danh sách Sân
          </button>
          <button
            onClick={() => {
              onNavigate('partners');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm ${
              currentTab === 'partners' ? 'bg-primary/10 text-primary font-bold' : 'text-ink/80'
            }`}
          >
            Tìm bạn chơi
          </button>

          
          <button
            onClick={() => {
              onNavigate('news');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm ${
              currentTab === 'news' ? 'bg-primary/10 text-primary font-bold' : 'text-ink/80'
            }`}
          >
            Tin tức
          </button>

          <div className="pt-3 border-t border-ink/10 flex gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 rounded-full border border-red-200 text-red-600 font-semibold text-sm text-center cursor-pointer"
              >
                Đăng xuất ({userName})
              </button>
            ) : (
              <div className="flex w-full gap-2">
                <a
                  href="/#admin-login"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 border border-primary text-primary py-2.5 rounded-full font-semibold text-sm text-center cursor-pointer inline-block"
                >
                  Chủ Sân
                </a>
                <button
                  onClick={() => {
                    onOpenAuth('customer');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 bg-ink text-surface text-base py-2.5 rounded-full font-semibold text-sm text-center cursor-pointer"
                >
                  Đăng Nhập
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
