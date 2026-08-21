import React, { useState } from 'react';
import { Booking, NavigationTab } from '../types';

interface DashboardViewProps {
  bookings: Booking[];
  onNavigate: (tab: NavigationTab) => void;
  onSelectBooking?: (booking: Booking) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  onNavigate,
  onSelectBooking,
}) => {
  const [chartRange, setChartRange] = useState<'7days' | '30days'>('7days');
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; value: string; x: number; y: number } | null>(null);

  const [stats, setStats] = useState<any>(null);

  React.useEffect(() => {
    fetch(`/backend/admin_dashboard_stats.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStats(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Dynamic Calculations
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date && b.date.startsWith(today) || (b.date === 'Hôm nay'));
  
  const bookingsToday = stats ? stats.overview.total_bookings : todayBookings.length;
  const confirmedToday = todayBookings.filter(b => b.status === 'Paid' || b.status === 'CONFIRMED').length;
  const pendingToday = todayBookings.filter(b => b.status === 'Pending').length;

  const revenueTodayNum = stats && stats.overview.today_revenue !== undefined ? stats.overview.today_revenue : todayBookings.filter(b => b.status === 'Paid' || b.status === 'CONFIRMED').reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const revenueTodayStr = revenueTodayNum.toLocaleString('vi-VN');

  const revenueMonthNum = stats ? stats.overview.total_revenue : bookings.filter(b => b.status === 'Paid' || b.status === 'CONFIRMED').reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const revenueMonthStr = revenueMonthNum >= 1000000 
    ? (revenueMonthNum / 1000000).toFixed(2).replace(/\.00$/, '') + 'M' 
    : (revenueMonthNum / 1000).toFixed(0) + 'K';

  const courtOccupancyData = [
    { name: 'Sân 1 (VIP)', percentage: 92 },
    { name: 'Sân 2', percentage: 75 },
    { name: 'Sân 3', percentage: 88 },
    { name: 'Sân 4', percentage: 45 },
    { name: 'Sân 5', percentage: 60 },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-12 animate-in fade-in duration-300">
      {/* 4 Metric Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Doanh Thu Hôm Nay */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm p-5 shadow-md flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex flex-col gap-1.5 relative z-10">
            <p className="text-[#94a3b8]/80 uppercase tracking-wider font-semibold text-xs">
              Doanh Thu Hôm Nay
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-ink tracking-tight">
              {revenueTodayStr}<span className="text-sm font-semibold ml-1.5 text-slate-700">VNĐ</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">24 đơn xác nhận</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center relative z-10 shrink-0 bg-[rgba(186,106,76,0.15)]">
            <span className="material-symbols-outlined text-2xl text-earth-accent">payments</span>
          </div>
        </div>

        {/* Card 2: Doanh Thu Tháng Này */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 shadow-sm p-5 shadow-md flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex flex-col gap-1.5 relative z-10">
            <p className="text-[#94a3b8]/80 uppercase tracking-wider font-semibold text-xs">
              Doanh Thu Tháng Này
            </p>
            <div className="flex items-baseline gap-2.5">
              <p className="text-2xl lg:text-3xl font-bold text-ink tracking-tight">{revenueMonthStr}</p>
              <div className="flex items-center bg-earth-primary-light text-earth-primary px-2 py-0.5 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-[13px] mr-0.5 font-bold">trending_up</span>
                12.5%
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Theo tháng hiện tại</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center relative z-10 shrink-0 bg-[rgba(186,106,76,0.15)]">
            <span className="material-symbols-outlined text-2xl text-earth-accent">account_balance_wallet</span>
          </div>
        </div>

        {/* Card 3: Số Đơn Hôm Nay */}
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-100 shadow-sm p-5 shadow-md flex items-center justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex flex-col gap-1.5 relative z-10">
            <p className="text-[#94a3b8]/80 uppercase tracking-wider font-semibold text-xs">
              Số Đơn Hôm Nay
            </p>
            <p className="text-2xl lg:text-3xl font-bold text-ink tracking-tight">{bookingsToday}</p>
            <p className="text-xs mt-0.5 text-earth-muted">
              <span className="font-semibold text-earth-primary">{confirmedToday} Đã xác nhận</span> • {pendingToday} Chờ duyệt
            </p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center relative z-10 shrink-0 bg-[rgba(186,106,76,0.15)]">
            <span className="material-symbols-outlined text-2xl text-earth-accent">event_available</span>
          </div>
        </div>

        {/* Card 4: Tỉ Lệ Lấp Đầy */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 shadow-sm p-5 shadow-md flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-center relative z-10 mb-2">
            <p className="text-[#94a3b8]/80 uppercase tracking-wider font-semibold text-xs">
              Tỉ Lệ Lấp Đầy
            </p>
            <span className="material-symbols-outlined text-earth-primary text-xl opacity-80">analytics</span>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative w-14 h-14 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                />
                <path
                  className="text-earth-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="78, 100"
                  strokeLinecap="round"
                  strokeWidth="3.8"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-earth-primary text-xs">
                {stats ? stats.overview.occupancy_rate + '%' : '78%'}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-earth-muted">
                Giờ cao điểm: <br />
                <span className="font-bold text-sm text-earth-primary">17:00 - 20:00</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Occupancy Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tổng Quan Doanh Thu Chart */}
        <div className="lg:col-span-2 rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[380px] relative bg-earth-card border-earth border">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-earth-main">Tổng Quan Doanh Thu</h2>
              <p className="text-xs text-earth-muted">Phân tích doanh thu</p>
            </div>
            <div className="flex rounded-lg p-1 bg-slate-100">
              <button
                onClick={() => setChartRange('7days')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                  chartRange === '7days'
                    ? 'bg-earth-primary text-white shadow-sm'
                    : 'text-earth-muted hover:text-earth-main'
                }`}
              >
                7 Ngày
              </button>
              <button
                onClick={() => setChartRange('30days')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                  chartRange === '30days'
                    ? 'bg-earth-primary text-white shadow-sm'
                    : 'text-earth-muted hover:text-earth-main'
                }`}
              >
                30 Ngày
              </button>
            </div>
          </div>

          {/* Interactive Chart Graphic */}
          <div className="flex-1 relative w-full h-[240px] pt-4">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 800 250"
            >
              {/* Grid Lines */}
              <line stroke="rgba(15,23,42,0.07)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
              <line stroke="rgba(15,23,42,0.07)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100" />
              <line stroke="rgba(15,23,42,0.07)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />
              <line stroke="rgba(15,23,42,0.07)" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200" />
              <line stroke="rgba(15,23,42,0.12)" strokeWidth="1" x1="0" x2="800" y1="250" y2="250" />

              {/* Y-Axis Labels */}
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="start" x="10" y="45">
                {chartRange === '7days' ? '8M' : '150M'}
              </text>
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="start" x="10" y="95">
                {chartRange === '7days' ? '6M' : '100M'}
              </text>
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="start" x="10" y="145">
                {chartRange === '7days' ? '4M' : '75M'}
              </text>
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="start" x="10" y="195">
                {chartRange === '7days' ? '2M' : '30M'}
              </text>
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="start" x="10" y="245">0</text>

              {/* Gradients */}
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--admin-primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--admin-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Data Path Area */}
              {revenueMonthNum === 0 ? (
                <>
                  <path
                    d="M 0 248 L 800 248 L 800 250 L 0 250 Z"
                    fill="url(#areaGradient)"
                  />
                  <path
                    d="M 0 248 L 800 248"
                    fill="none"
                    stroke="var(--admin-primary)"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </>
              ) : chartRange === '7days' ? (
                <>
                  <path
                    d="M 0 200 C 100 200, 150 120, 266 140 C 400 160, 450 80, 533 110 C 650 140, 700 40, 800 60 L 800 250 L 0 250 Z"
                    fill="url(#areaGradient)"
                  />
                  <path
                    d="M 0 200 C 100 200, 150 120, 266 140 C 400 160, 450 80, 533 110 C 650 140, 700 40, 800 60"
                    fill="none"
                    stroke="var(--admin-primary)"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  {/* Interactive Nodes */}
                  <circle
                    cx="266"
                    cy="140"
                    fill="var(--admin-bg-card)"
                    r="6"
                    stroke="var(--admin-primary)"
                    strokeWidth="3.5"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() => setHoveredPoint({ day: 'Wed (Thứ 4)', value: '4.250.000 VNĐ', x: 266, y: 140 })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx="533"
                    cy="110"
                    fill="var(--admin-bg-card)"
                    r="6"
                    stroke="var(--admin-primary)"
                    strokeWidth="3.5"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() => setHoveredPoint({ day: 'Fri (Thứ 6)', value: '5.800.000 VNĐ', x: 533, y: 110 })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx="800"
                    cy="60"
                    fill="var(--admin-bg-card)"
                    r="6"
                    stroke="var(--admin-primary)"
                    strokeWidth="3.5"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() => setHoveredPoint({ day: 'Sun (Chủ Nhật)', value: '7.850.000 VNĐ', x: 800, y: 60 })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </>
              ) : (
                <>
                  <path
                    d="M 0 180 C 150 190, 250 100, 380 120 C 500 140, 600 60, 800 40 L 800 250 L 0 250 Z"
                    fill="url(#areaGradient)"
                  />
                  <path
                    d="M 0 180 C 150 190, 250 100, 380 120 C 500 140, 600 60, 800 40"
                    fill="none"
                    stroke="var(--admin-primary)"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  <circle cx="380" cy="120" fill="var(--admin-bg-card)" r="6" stroke="var(--admin-primary)" strokeWidth="3.5" />
                  <circle cx="800" cy="40" fill="var(--admin-bg-card)" r="6" stroke="var(--admin-primary)" strokeWidth="3.5" />
                </>
              )}

              {/* X-Axis Labels */}
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="middle" x="30" y="270">
                {chartRange === '7days' ? 'Mon' : 'Tuần 1'}
              </text>
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="middle" x="266" y="270">
                {chartRange === '7days' ? 'Wed' : 'Tuần 2'}
              </text>
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="middle" x="533" y="270">
                {chartRange === '7days' ? 'Fri' : 'Tuần 3'}
              </text>
              <text fill="rgba(15,23,42,0.45)" fontSize="11" textAnchor="middle" x="770" y="270">
                {chartRange === '7days' ? 'Sun' : 'Tuần 4'}
              </text>
            </svg>

            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute bg-earth-card text-earth-main px-2.5 py-1.5 rounded-md shadow-xl text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full border border-earth"
                style={{
                  left: `${(hoveredPoint.x / 800) * 100}%`,
                  top: `${(hoveredPoint.y / 250) * 100 - 10}%`,
                }}
              >
                <div className="font-bold text-earth-primary">{hoveredPoint.day}</div>
                <div>{hoveredPoint.value}</div>
              </div>
            )}
          </div>
        </div>

        {/* Tình Trạng Sân Card */}
        <div className="rounded-xl shadow-md p-6 flex flex-col justify-between min-h-[380px] bg-earth-card border border-earth">
          <div>
            <h2 className="text-xl font-bold text-earth-main tracking-tight mb-1">Tình Trạng Sân</h2>
            <p className="text-xs text-earth-muted mb-5">Tỷ lệ lấp đầy theo từng sân</p>
          </div>

          <div className="flex-1 flex flex-col justify-around gap-3.5">
            {courtOccupancyData.map((court, idx) => (
              <div key={idx} className="w-full">
                <div className="flex justify-between text-xs text-earth-main font-medium mb-1.5">
                  <span>{court.name}</span>
                  <span className="font-bold text-earth-primary">{court.percentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden bg-earth-primary-light">
                  <div
                    className="h-full bg-earth-primary rounded-full transition-all duration-700"
                    style={{ width: `${court.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="rounded-2xl p-6 bg-earth-card border border-earth shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-earth-main tracking-tight">Đơn Đặt Sân Gần Đây</h2>
            <p className="text-xs text-earth-muted">Danh sách lượt đặt sân mới nhất hôm nay</p>
          </div>
          <button
            onClick={() => onNavigate('booking-management')}
            className="text-earth-primary hover:text-earth-main transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1 group py-1 px-2 rounded hover:bg-earth-primary-light"
          >
            XEM TẤT CẢ
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-ink/80 text-xs uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4 rounded-tl-lg">Mã Đơn</th>
                <th className="py-3.5 px-4">Khách Hàng</th>
                <th className="py-3.5 px-4">Sân</th>
                <th className="py-3.5 px-4">Ngày & Giờ</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 rounded-tr-lg text-right">Tổng Tiền</th>
              </tr>
            </thead>
            <tbody className="text-ink text-sm divide-y divide-white/10">
              {bookings.slice(0, 5).map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => onSelectBooking && onSelectBooking(booking)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-4 font-mono font-medium text-slate-700">
                    {booking.id}
                  </td>
                  <td className="py-4 px-4 font-semibold text-ink">
                    {booking.guestName}
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-slate-100 border border-ink/10 px-2.5 py-1 rounded text-xs font-medium">
                      {booking.courtName}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 text-xs">
                    {booking.date ? `${booking.date.split(',')[0]}, ${booking.startTime} - ${booking.endTime}` : `${booking.startTime} - ${booking.endTime}`}
                  </td>
                  <td className="py-4 px-4">
                    {booking.status === 'Paid' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-earth-primary-light text-earth-primary">
                        Đã thanh toán
                      </span>
                    )}
                    {booking.status === 'Pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-earth-accent-light text-earth-accent">
                        Chờ duyệt
                      </span>
                    )}
                    {booking.status === 'Cancelled' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-earth-danger-light text-earth-danger">
                        Đã hủy
                      </span>
                    )}
                  </td>
                  <td className={`py-4 px-4 text-right font-mono font-semibold ${
                    booking.status === 'Cancelled' ? 'text-earth-muted line-through' : 'text-earth-main'
                  }`}>
                    {booking.amount.toLocaleString('vi-VN')} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden flex flex-col gap-3">
          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking.id}
              onClick={() => onSelectBooking && onSelectBooking(booking)}
              className="bg-slate-50 rounded-lg p-4 flex flex-col gap-2.5 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-ink text-base">{booking.guestName}</p>
                  <p className="text-xs text-slate-500 font-mono">{booking.id}</p>
                </div>
                {booking.status === 'Paid' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-earth-primary-light text-earth-primary">
                    Đã thanh toán
                  </span>
                )}
                {booking.status === 'Pending' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-earth-accent-light text-earth-accent">
                    Chờ duyệt
                  </span>
                )}
                {booking.status === 'Cancelled' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-earth-danger-light text-earth-danger">
                    Đã hủy
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-earth-muted">sports_tennis</span>
                  {booking.courtName}
                </div>
                <div className={`text-right font-mono font-bold ${
                  booking.status === 'Cancelled' ? 'text-earth-muted line-through' : 'text-earth-primary'
                }`}>
                  {booking.amount.toLocaleString('vi-VN')} đ
                </div>
                <div className="col-span-2 flex items-center gap-1 text-slate-500">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  {booking.date ? `${booking.date.split(',')[0]}, ` : ''}{booking.startTime} - {booking.endTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



