import React from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen
}) => {
  const navItems: {
    id: NavigationTab;
    label: string;
    icon: string;
  }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'grid_view' },
    { id: 'court-management', label: 'Quản lý sân', icon: 'sports_kabaddi' },
    { id: 'booking-management', label: 'Quản lý đặt sân', icon: 'calendar_month' },
    { id: 'payment-management', label: 'Quản lý thanh toán', icon: 'payments' },
    { id: 'user-management', label: 'Quản lý người dùng', icon: 'group' },
    { id: 'promotions', label: 'Khuyến mãi', icon: 'sell' },
    { id: 'news', label: 'Tin tức', icon: 'article' },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 h-full w-[260px] z-50 flex flex-col transition-transform duration-300 ease-in-out bg-earth-primary ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 mb-2 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-earth-accent">
              <span className="material-symbols-outlined text-earth-cream font-bold text-xl">
                sports_tennis
              </span>
            </div>
            <div>
              <span className="text-earth-cream font-bold text-xl tracking-tight block">SMASH HUB</span>
              <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'rgba(238,224,204,0.7)' }}>Admin Panel</span>
            </div>
          </div>

          <button
            className="lg:hidden p-1 rounded-lg hover:bg-earth-primary-hover transition-colors"
            style={{ color: 'rgba(238,224,204,0.8)' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-4" style={{ height: '1px', background: 'rgba(238,224,204,0.15)' }} />

        {/* Navigation Items */}
        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center w-full px-3.5 py-3 text-left rounded-xl font-medium text-sm transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'text-earth-cream shadow-md bg-earth-primary-hover'
                    : 'text-earth-cream hover:bg-earth-primary-hover'
                }`}
                style={isActive ? { borderLeft: '4px solid var(--admin-accent)' } : { borderLeft: '4px solid transparent' }}
              >
                <span
                  className={`material-symbols-outlined mr-3 text-xl transition-colors ${isActive ? 'text-earth-accent' : ''}`}
                  style={{ color: isActive ? 'var(--admin-accent)' : 'rgba(238,224,204,0.6)' }}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {item.id === 'payment-management' && (
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={isActive
                      ? { background: 'var(--admin-accent)', color: 'var(--admin-bg-main)' }
                      : { background: 'rgba(238,224,204,0.2)', color: 'var(--admin-text-light)' }}>
                    18
                  </span>
                )}
                {item.id === 'booking-management' && (
                  <span className="ml-auto w-2 h-2 rounded-full"
                    style={{ background: isActive ? 'var(--admin-bg-main)' : 'var(--admin-accent)' }}>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-3" style={{ height: '1px', background: 'rgba(238,224,204,0.15)' }} />

        {/* Bottom Court Status Summary */}
        <div className="p-4 m-4 mt-0 rounded-xl" style={{ background: 'rgba(238,224,204,0.05)', border: '1px solid rgba(238,224,204,0.15)' }}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span style={{ color: 'rgba(238,224,204,0.7)' }} className="font-medium">Trạng thái cụm sân</span>
            <span className="font-bold text-earth-accent">5/6 Sẵn sàng</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(238,224,204,0.15)' }}>
            <div className="h-full rounded-full bg-earth-accent" style={{ width: '83%' }}></div>
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'rgba(238,224,204,0.6)' }}>
            Đang phục vụ: <span className="font-semibold text-earth-accent">14 người chơi</span>
          </p>
        </div>
      </aside>
    </>
  );
};


