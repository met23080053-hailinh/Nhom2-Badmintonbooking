import React, { useState } from 'react';
import { UserAccount, Promotion, NewsArticle, UserMemberRank, UserStatus, PromoStatus } from '../types';

interface UserManagementViewProps {
  initialSubTab?: 'users' | 'promotions' | 'news';
  users: UserAccount[];
  promotions: Promotion[];
  news: NewsArticle[];
  onUpdateUserStatus: (userId: string, status: UserStatus) => void;
  onAddUser: (user: UserAccount) => void;
  onAddPromotion: (promo: Promotion) => void;
  onTogglePromoStatus: (promoId: string) => void;
  onAddNews: (article: NewsArticle) => void;
  onDeleteNews: (articleId: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  initialSubTab = 'users',
  users,
  promotions,
  news,
  onUpdateUserStatus,
  onAddUser,
  onAddPromotion,
  onTogglePromoStatus,
  onAddNews,
  onDeleteNews,
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'users' | 'promotions' | 'news'>(initialSubTab);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [isAddNewsOpen, setIsAddNewsOpen] = useState(false);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<UserAccount | null>(null);

  // Form states - User
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPhone, setUPhone] = useState('');
  const [uRole, setURole] = useState<UserMemberRank>('Thành viên Vàng');

  // Form states - Promo
  const [pCode, setPCode] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pDiscountVal, setPDiscountVal] = useState('20');
  const [pDiscountType, setPDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [pValidPeriod, setPValidPeriod] = useState('01/08 - 31/08/2024');
  const [pMaxLimit, setPMaxLimit] = useState(500);

  // Form states - News
  const [nTitle, setNTitle] = useState('');
  const [nSummary, setNSummary] = useState('');
  const [nContent, setNContent] = useState('');
  const [nImage, setNImage] = useState('/images/preview.webp');

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uName || !uPhone) {
      onShowToast('Thiếu thông tin', 'Vui lòng điền họ tên và số điện thoại', 'warning');
      return;
    }
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: uName,
      initials: uName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(-2)
        .toUpperCase(),
      email: uEmail || `${uPhone}@smashhub.vn`,
      phone: uPhone,
      role: uRole,
      totalBookings: 0,
      joinedDate: '13/08/2024',
      status: 'HOẠT ĐỘNG',
      isOnline: true,
    };
    onAddUser(newUser);
    onShowToast('Đã thêm thành viên', `Đã cấp tài khoản thành công cho ${uName}`, 'success');
    setIsAddUserOpen(false);
    setUName('');
    setUEmail('');
    setUPhone('');
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pCode || !pDesc) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập mã và mô tả voucher', 'warning');
      return;
    }
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      code: pCode.toUpperCase(),
      discountType: pDiscountType,
      discountValue: parseInt(pDiscountVal, 10) || 20,
      description: pDesc,
      validPeriod: pValidPeriod,
      usedCount: 0,
      maxLimit: pMaxLimit,
      status: 'ĐANG CHẠY' as PromoStatus,
      updatedAt: 'Vừa tạo hôm nay',
    };
    onAddPromotion(newPromo);
    onShowToast('Tạo khuyến mãi thành công', `Mã ${pCode.toUpperCase()} đã kích hoạt`, 'success');
    setIsAddPromoOpen(false);
    setPCode('');
    setPDesc('');
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle || !nSummary) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập tiêu đề và tóm tắt bài viết', 'warning');
      return;
    }
    const newArt: NewsArticle = {
      id: `news-${Date.now()}`,
      title: nTitle,
      summary: nSummary,
      content: nContent || nSummary,
      image: nImage,
      publishDate: '13/08/2024',
      views: 1,
      author: 'Admin',
      status: 'ĐÃ ĐĂNG',
    };
    onAddNews(newArt);
    onShowToast('Đã đăng bài viết', `Bài viết "${nTitle}" đã được xuất bản`, 'success');
    setIsAddNewsOpen(false);
    setNTitle('');
    setNSummary('');
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Sub-Navigation Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-earth-main tracking-tight">
            {subTab === 'users' && 'Quản lý người dùng & Hội viên'}
            {subTab === 'promotions' && 'Chương trình khuyến mãi & Voucher'}
            {subTab === 'news' && 'Tin tức & Hoạt động giải đấu'}
          </h1>
          <p className="text-sm text-earth-muted mt-1">
            Hệ thống quản lý dữ liệu người chơi, voucher giảm giá và bản tin thông báo Smash Hub
          </p>
        </div>

        {/* Action Button depending on subTab */}
        <div>
          {subTab === 'users' && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="bg-earth-primary hover:bg-earth-primary-hover text-ink font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              + Thêm người dùng
            </button>
          )}
          {subTab === 'promotions' && (
            <button
              onClick={() => setIsAddPromoOpen(true)}
              className="bg-earth-primary hover:bg-earth-primary-hover text-ink font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
              + Tạo khuyến mãi
            </button>
          )}
          {subTab === 'news' && (
            <button
              onClick={() => setIsAddNewsOpen(true)}
              className="bg-earth-primary hover:bg-earth-primary-hover text-ink font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-lg">post_add</span>
              + Viết bài mới
            </button>
          )}
        </div>
      </div>

      {/* SubTab Toggle Bar */}
      <div className="flex bg-slate-50 p-1.5 rounded-xl border border-earth self-start">
        <button
          onClick={() => setSubTab('users')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'users'
              ? 'bg-white text-earth-main shadow-sm'
              : 'text-earth-muted hover:text-earth-main'
          }`}
        >
          <span className="material-symbols-outlined text-base">group</span>
          NGƯỜI DÙNG ({users.length})
        </button>
        <button
          onClick={() => setSubTab('promotions')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'promotions'
              ? 'bg-white text-earth-main shadow-sm'
              : 'text-earth-muted hover:text-earth-main'
          }`}
        >
          <span className="material-symbols-outlined text-base">sell</span>
          KHUYẾN MÃI ({promotions.length})
        </button>
        <button
          onClick={() => setSubTab('news')}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            subTab === 'news'
              ? 'bg-white text-earth-main shadow-sm'
              : 'text-earth-muted hover:text-earth-main'
          }`}
        >
          <span className="material-symbols-outlined text-base">article</span>
          TIN TỨC ({news.length})
        </button>
      </div>

      {/* TAB 1: USERS */}
      {subTab === 'users' && (
        <div className="flex flex-col gap-6">
          {/* User Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-earth-card rounded-xl border border-earth shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold text-earth-muted">Tổng người dùng</p>
                <p className="text-3xl font-bold text-earth-main mt-1">{users.length}</p>
                <p className="text-xs text-earth-muted mt-1">Từ hệ thống Smash Hub</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-earth">
                <span className="material-symbols-outlined text-earth-primary text-2xl">person</span>
              </div>
            </div>

            <div className="bg-earth-card rounded-xl border border-earth shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold text-earth-muted">Đang hoạt động</p>
                <p className="text-3xl font-bold text-earth-main mt-1">{users.filter(u => u.status === 'Hoạt động' || u.status === 'HOẠT ĐỘNG').length}</p>
                <p className="text-xs text-earth-muted mt-1">Hoạt động bình thường</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-earth">
                <span className="material-symbols-outlined text-[#475569] text-2xl">verified_user</span>
              </div>
            </div>

            <div className="bg-earth-card rounded-xl border border-earth shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold text-earth-muted">Tài khoản khóa</p>
                <p className="text-3xl font-bold text-earth-main mt-1">{users.filter(u => u.status === 'Bị khóa' || u.status === 'BỊ KHÓA').length}</p>
                <p className="text-xs text-earth-muted mt-1">Vi phạm nội quy</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-earth">
                <span className="material-symbols-outlined text-[#7f1d1d] text-2xl">gpp_bad</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-50 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-3 border border-earth">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-muted text-xl">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên khách hàng, SĐT, email..."
                className="w-full bg-white text-earth-main text-xs py-2.5 pl-10 pr-4 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
              />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white text-earth-main text-xs py-2.5 pl-3 pr-8 rounded-lg border border-earth focus:outline-none focus:border-earth-primary appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="HOẠT ĐỘNG">HOẠT ĐỘNG</option>
                <option value="BỊ KHÓA">BỊ KHÓA</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-earth-muted text-base pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-earth-card rounded-xl border border-earth shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-earth-main text-xs font-bold uppercase tracking-wider border-b border-earth">
                    <th className="py-4 px-5">KHÁCH HÀNG</th>
                    <th className="py-4 px-5">LIÊN HỆ</th>
                    <th className="py-4 px-5">VAI TRÒ / HẠNG</th>
                    <th className="py-4 px-5 text-center">SỐ LẦN ĐẶT</th>
                    <th className="py-4 px-5">NGÀY THAM GIA</th>
                    <th className="py-4 px-5 text-center">TRẠNG THÁI</th>
                    <th className="py-4 px-5 text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="text-earth-main text-xs divide-y divide-earth">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-earth"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-earth-muted flex items-center justify-center font-bold text-sm border border-earth">
                              {user.initials || user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-earth-main text-sm">{user.name}</p>
                            <p className="text-[11px] text-earth-muted font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-5">
                        <p className="font-medium text-earth-main">{user.phone}</p>
                        <p className="text-earth-muted text-[11px]">{user.email}</p>
                      </td>

                      {/* Role & Tier */}
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          user.role === 'Thành viên Vàng' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          user.role === 'Thành viên Bạc' ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                          user.role === 'Quản trị viên' ? 'bg-earth-primary-light text-earth-primary border border-earth-primary' :
                          'bg-slate-100 text-slate-600 border border-earth'
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Total Bookings */}
                      <td className="py-3.5 px-5 text-center font-mono font-bold text-sm text-earth-primary">
                        {user.totalBookings} lượt
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-5 text-earth-muted">
                        {user.joinedDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 text-center">
                        {user.status === 'HOẠT ĐỘNG' ? (
                          <span className="bg-earth-primary-light text-earth-primary border border-earth-primary px-3 py-1 rounded-full font-bold text-[10px]">
                            HOẠT ĐỘNG
                          </span>
                        ) : (
                          <span className="bg-earth-danger-light text-earth-danger border border-earth-danger px-3 py-1 rounded-full font-bold text-[10px]">
                            BỊ KHÓA
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUserForHistory(user)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-earth-muted transition-colors cursor-pointer border border-transparent hover:border-earth"
                            title="Xem lịch sử đặt sân"
                          >
                            <span className="material-symbols-outlined text-base">history</span>
                          </button>
                          <button
                            onClick={() => {
                              const newStatus: UserStatus = user.status === 'HOẠT ĐỘNG' ? 'BỊ KHÓA' : 'HOẠT ĐỘNG';
                              onUpdateUserStatus(user.id, newStatus);
                              onShowToast('Cập nhật người dùng', `Đã đổi trạng thái của ${user.name} sang ${newStatus}`, 'info');
                            }}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer border border-transparent hover:border-earth ${
                              user.status === 'HOẠT ĐỘNG'
                                ? 'text-earth-danger hover:bg-earth-danger-light'
                                : 'text-earth-primary hover:bg-earth-primary-light'
                            }`}
                            title={user.status === 'HOẠT ĐỘNG' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            <span className="material-symbols-outlined text-base">
                              {user.status === 'HOẠT ĐỘNG' ? 'lock' : 'lock_open'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROMOTIONS */}
      {subTab === 'promotions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => {
            const maxVal = typeof promo.maxLimit === 'number' ? promo.maxLimit : 1000;
            const progress = Math.min(100, Math.round((promo.usedCount / maxVal) * 100));

            return (
              <div
                key={promo.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-earth flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Top Accent Stripe */}
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-earth-primary-light text-earth-primary border border-earth-primary font-black font-mono px-3 py-1 rounded-lg text-sm tracking-wider shadow-sm">
                    {promo.code}
                  </div>
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      promo.status === 'ĐANG CHẠY'
                        ? 'bg-earth-primary-light text-earth-primary border-earth-primary'
                        : 'bg-earth-danger-light text-earth-danger border-earth-danger'
                    }`}
                  >
                    {promo.status}
                  </span>
                </div>

                <div>
                  <p className="text-2xl font-black text-earth-primary font-mono">
                    {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `${promo.discountValue.toLocaleString('vi-VN')}đ OFF`}
                  </p>
                  <p className="text-xs text-earth-muted mt-1.5 leading-relaxed">{promo.description}</p>
                  <p className="text-xs text-earth-muted mt-2 font-mono">Hạn dùng: {promo.validPeriod}</p>
                </div>

                {/* Usage Progress */}
                <div className="mt-4 pt-4 border-t border-earth">
                  <div className="flex justify-between text-xs text-earth-muted mb-1">
                    <span>Lượt đã dùng</span>
                    <span className="font-bold">
                      {promo.usedCount} / {promo.maxLimit}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-earth">
                    <div
                      className="h-full bg-earth-primary rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onTogglePromoStatus(promo.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                      promo.status === 'ĐANG CHẠY'
                        ? 'bg-white border-earth text-earth-main hover:bg-slate-50'
                        : 'bg-earth-primary border-earth-primary hover:bg-earth-primary-hover text-ink'
                    }`}
                  >
                    {promo.status === 'ĐANG CHẠY' ? 'Tạm dừng' : 'Kích hoạt lại'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: NEWS & ARTICLES */}
      {subTab === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-earth flex flex-col justify-between group"
            >
              {/* Thumbnail */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 border border-earth text-earth-main text-[11px] font-bold px-2.5 py-1 rounded">
                  {article.status}
                </span>
              </div>

              {/* Text Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-earth-muted mb-2">
                    <span>{article.publishDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">visibility</span>
                      {article.views} lượt xem
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-earth-main leading-snug line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-earth-muted line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-earth flex justify-between items-center">
                  <span className="text-xs text-earth-muted font-medium">Bởi {article.author}</span>
                  <button
                    onClick={() => {
                      onDeleteNews(article.id);
                      onShowToast('Đã xóa bài viết', `Đã gỡ bài "${article.title}"`, 'info');
                    }}
                    className="text-earth-muted hover:text-earth-danger p-1 transition-colors cursor-pointer"
                    title="Xóa bài"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add User */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-earth rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-earth-main mb-4">Thêm người dùng mới</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Họ tên *</label>
                <input
                  type="text"
                  value={uName}
                  onChange={(e) => setUName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Minh Trí"
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  value={uPhone}
                  onChange={(e) => setUPhone(e.target.value)}
                  placeholder="0901 234 567"
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Email (Tùy chọn)</label>
                <input
                  type="email"
                  value={uEmail}
                  onChange={(e) => setUEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Hạng hội viên</label>
                <select
                  value={uRole}
                  onChange={(e) => setURole(e.target.value as UserMemberRank)}
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                >
                  <option value="Thành viên Vàng">Thành viên Vàng (Giảm 10% giờ cao điểm)</option>
                  <option value="Thành viên Bạc">Thành viên Bạc</option>
                  <option value="Thành viên Đồng">Thành viên Đồng</option>
                  <option value="Mới">Mới</option>
                  <option value="Quản trị viên">Quản trị viên</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-50 text-earth-main border border-earth text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-earth-primary text-ink text-xs font-bold hover:bg-earth-primary-hover cursor-pointer"
                >
                  Lưu người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Promotion */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-earth rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-earth-main mb-4">Tạo mã khuyến mãi mới</h2>
            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Mã Voucher (Code) *</label>
                <input
                  type="text"
                  value={pCode}
                  onChange={(e) => setPCode(e.target.value)}
                  placeholder="SMASH2024"
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary font-mono uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Mô tả chương trình *</label>
                <input
                  type="text"
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Áp dụng cho khung giờ vàng từ 9h-15h..."
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Kiểu giảm</label>
                  <select
                    value={pDiscountType}
                    onChange={(e) => setPDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Giá trị giảm</label>
                  <input
                    type="number"
                    value={pDiscountVal}
                    onChange={(e) => setPDiscountVal(e.target.value)}
                    placeholder="20 hoặc 50000"
                    className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddPromoOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-50 text-earth-main border border-earth hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-earth-primary hover:bg-earth-primary-hover text-ink text-xs font-bold cursor-pointer"
                >
                  Kích hoạt mã
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add News */}
      {isAddNewsOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-earth rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-earth-main mb-4">Đăng bài tin tức / sự kiện</h2>
            <form onSubmit={handleCreateNews} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  value={nTitle}
                  onChange={(e) => setNTitle(e.target.value)}
                  placeholder="Ví dụ: Lịch bốc thăm giải đấu Cầu lông Smash Open 2024..."
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">URL Ảnh bìa</label>
                <input
                  type="url"
                  value={nImage}
                  onChange={(e) => setNImage(e.target.value)}
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Nội dung tóm tắt *</label>
                <textarea
                  value={nSummary}
                  onChange={(e) => setNSummary(e.target.value)}
                  rows={2}
                  placeholder="Tóm tắt ngắn gọn nội dung tin tức gửi tới người chơi..."
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-earth-muted mb-1">Nội dung chi tiết</label>
                <textarea
                  value={nContent}
                  onChange={(e) => setNContent(e.target.value)}
                  rows={3}
                  placeholder="Chi tiết về giải đấu, quy định tham gia, cơ cấu giải thưởng..."
                  className="w-full bg-white text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddNewsOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-slate-50 text-earth-main border border-earth hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-earth-primary text-ink hover:bg-earth-primary-hover text-xs font-bold cursor-pointer"
                >
                  Xuất bản bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: User Booking History */}
      {selectedUserForHistory && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-earth rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-earth">
              <div>
                <h3 className="text-lg font-bold text-earth-main">Lịch sử đặt sân</h3>
                <p className="text-xs text-earth-muted">
                  {selectedUserForHistory.name} - {selectedUserForHistory.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedUserForHistory(null)}
                className="text-earth-muted hover:text-earth-main cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-64 overflow-y-auto">
              <div className="p-3 bg-slate-50 border border-earth rounded-lg flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-earth-main">#BK-9482 • Sân 3</p>
                  <p className="text-earth-muted">Thứ 3, 13/08 (11:30 - 13:00)</p>
                </div>
                <span className="bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded font-bold text-[10px]">
                  CHỜ XỬ LÝ
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-earth rounded-lg flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-earth-main">#BK-8310 • Sân 1 (VIP)</p>
                  <p className="text-earth-muted">Chủ Nhật, 04/08 (18:00 - 20:00)</p>
                </div>
                <span className="bg-earth-primary-light text-earth-primary border border-earth-primary px-2 py-0.5 rounded font-bold text-[10px]">
                  HOÀN TẤT
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-earth">
              <button
                onClick={() => setSelectedUserForHistory(null)}
                className="w-full py-2.5 rounded-lg bg-slate-50 border border-earth text-earth-main text-xs font-bold hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



