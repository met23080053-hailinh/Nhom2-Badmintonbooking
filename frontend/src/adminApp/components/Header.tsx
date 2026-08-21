import React, { useState } from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
  onOpenNotifications?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Đơn đặt sân mới #BK-9482',
      desc: 'Phạm Văn Dũng đặt Sân 3 lúc 11:30 hôm nay',
      time: '5 phút trước',
      unread: true,
    },
    {
      id: '2',
      title: 'Thanh toán cần duyệt TXN-8891',
      desc: 'Nguyễn Văn Toàn gửi xác nhận 320,000đ qua Bank QR',
      time: '14:30',
      unread: true,
    },
    {
      id: '3',
      title: 'Bảo trì sân 3 hoàn tất 80%',
      desc: 'Đèn LED đã thay xong, đang căng lưới thi đấu',
      time: '1 giờ trước',
      unread: false,
    },
  ];

  const dropdownStyle: React.CSSProperties = {
    backgroundColor: 'var(--admin-bg-card)',
    border: '1px solid var(--admin-border)',
    boxShadow: '0 16px 48px rgba(96,116,86,0.15)',
  };

  return (
    <header
      id="app-header"
      className="fixed top-0 right-0 left-0 lg:left-[260px] h-16 z-40 px-6 flex items-center justify-between bg-earth-primary transition-all"
      style={{
        borderBottom: '1px solid rgba(238,224,204,0.15)',
        boxShadow: '0 2px 12px rgba(96,116,86,0.1)',
      }}
    >
      {/* Left: Menu + Brand */}
      <div className="flex items-center gap-4">
        <button
          id="btn-sidebar-toggle"
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-earth-primary-hover text-earth-cream transition-colors"
          aria-label="Mở Menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <div className="w-1 h-6 rounded-full bg-earth-accent"></div>
        <span className="font-semibold text-sm hidden sm:inline-block text-earth-cream opacity-90">
          Smash Hub Operations Center
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-5 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-earth-primary-hover text-earth-cream transition-colors cursor-pointer"
            title="Thông báo"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-earth-danger rounded-full border-2 border-earth-primary"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl py-3 z-50 animate-in"
              style={dropdownStyle}>
              <div className="px-4 py-2 flex items-center justify-between border-b border-earth">
                <span className="font-bold text-earth-main text-sm">Thông báo gần đây</span>
                <span className="text-xs font-semibold cursor-pointer hover:underline text-earth-accent">
                  Đánh dấu đã đọc
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 cursor-pointer transition-colors ${item.unread ? 'bg-[rgba(186,106,76,0.08)] hover:bg-[rgba(186,106,76,0.12)]' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-earth-main">{item.title}</p>
                      <span className="text-[10px] whitespace-nowrap text-earth-muted">{item.time}</span>
                    </div>
                    <p className="text-xs mt-1 leading-snug text-earth-muted opacity-90">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 text-center border-t border-earth mt-2">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-medium hover:text-earth-main text-earth-muted transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-7 w-px" style={{ background: 'rgba(238,224,204,0.2)' }}></div>

        {/* Admin Profile */}
        <div className="relative">
          <div
            id="admin-profile-pill"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-earth-primary-hover text-earth-cream transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold leading-none">Admin Name</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider mt-1 text-earth-cream opacity-80">
                SUPER ADMIN
              </p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-lg bg-earth-accent">
              <span className="material-symbols-outlined text-[20px] text-ink">person</span>
            </div>
            <span className="material-symbols-outlined text-[20px] opacity-70">
              logout
            </span>
          </div>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl py-2 z-50 animate-in" style={dropdownStyle}>
              <div className="px-4 py-2 border-b border-earth">
                <p className="text-sm font-bold text-earth-main">Admin Name</p>
                <p className="text-xs text-earth-muted">superadmin@smashhub.vn</p>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-slate-50 text-earth-main transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-earth-muted">settings</span>
                Cài đặt hệ thống
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 hover:bg-slate-50 text-earth-main transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-earth-muted">lock_reset</span>
                Đổi mật khẩu
              </button>
              <div className="my-1 border-t border-earth"></div>
              <button
                onClick={() => { setShowProfileMenu(false); onLogout?.(); }}
                className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 font-semibold cursor-pointer hover:bg-red-50 text-earth-danger transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Đăng xuất / Về trang chủ
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};



