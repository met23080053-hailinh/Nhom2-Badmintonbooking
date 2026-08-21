import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, Court } from '../types';

interface BookingManagementViewProps {
  bookings: Booking[];
  courts: Court[];
  selectedBooking: Booking | null;
  onSelectBooking: (booking: Booking | null) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  onAddBooking: (booking: Booking) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const BookingManagementView: React.FC<BookingManagementViewProps> = ({
  bookings,
  courts,
  selectedBooking,
  onSelectBooking,
  onUpdateBookingStatus,
  onAddBooking,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'day'>('week');
  const [selectedCourtFilter, setSelectedCourtFilter] = useState<string>('all');
  // Compute real current month label
  const now = new Date();
  const monthNames = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  const [currentMonthStr, setCurrentMonthStr] = useState(`${monthNames[now.getMonth()]}, ${now.getFullYear()}`);

  // Current Time State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Manual Booking Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [courtId, setCourtId] = useState(courts[0]?.id || 'court-1');
  const [bookingDate, setBookingDate] = useState('Thứ 3, 13 Tháng 8, 2024');
  const [dayOfWeek, setDayOfWeek] = useState(2); // T3
  const [startTime, setStartTime] = useState('11:30');
  const [endTime, setEndTime] = useState('13:00');
  const [notes, setNotes] = useState('');

  // Reschedule Modal
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:30');

  // Default active booking to display in the side panel if none chosen
  const activeBooking = selectedBooking || bookings.find(b => b.id === '#BK-9482') || bookings[0];

  const filteredBookings = bookings.filter((b) => {
    if (selectedCourtFilter === 'all') return true;
    return b.courtId === selectedCourtFilter;
  });

  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestPhone.trim()) {
      onShowToast('Thiếu thông tin', 'Vui lòng nhập tên và số điện thoại khách hàng', 'warning');
      return;
    }

    const selectedCourtObj = courts.find(c => c.id === courtId) || courts[0];
    const duration = 1.5;
    const calcAmount = selectedCourtObj.pricePerHour * duration;

    const newBooking: Booking = {
      id: `#BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName,
      guestPhone,
      courtId: selectedCourtObj.id,
      courtName: selectedCourtObj.name,
      date: bookingDate,
      dayOfWeek: dayOfWeek,
      dayLabel: dayOfWeek === 1 ? 'T2' : dayOfWeek === 2 ? 'T3' : dayOfWeek === 3 ? 'T4' : dayOfWeek === 4 ? 'T5' : dayOfWeek === 5 ? 'T6' : dayOfWeek === 6 ? 'T7' : 'CN',
      dayNumber: bookingDate ? new Date(bookingDate).getDate() : new Date().getDate(),
      startTime,
      endTime,
      durationHours: duration,
      status: 'Pending',
      amount: calcAmount,
      paymentMethod: 'qr',
      notes,
    };

    onAddBooking(newBooking);
    onSelectBooking(newBooking);
    onShowToast('Đặt sân thành công', `Đã tạo đơn ${newBooking.id} cho ${guestName}`, 'success');
    setIsManualModalOpen(false);
  };

  const handleConfirmCurrentBooking = () => {
    if (activeBooking) {
      onUpdateBookingStatus(activeBooking.id, 'Paid');
      onShowToast('Đã duyệt đơn đặt sân', `Đơn ${activeBooking.id} (${activeBooking.guestName}) đã được xác nhận`, 'success');
    }
  };

  const handleCancelCurrentBooking = () => {
    if (activeBooking) {
      onUpdateBookingStatus(activeBooking.id, 'Cancelled');
      onShowToast('Đã hủy lịch đặt sân', `Đơn ${activeBooking.id} đã chuyển sang trạng thái đã hủy`, 'info');
    }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeBooking) {
      activeBooking.startTime = newStartTime;
      activeBooking.endTime = newEndTime;
      onShowToast('Đổi giờ thành công', `Đã chuyển giờ đặt sân sang ${newStartTime} - ${newEndTime}`, 'success');
      setIsRescheduleModalOpen(false);
    }
  };

  // Generate 6:00 to 22:00 time axis
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  // ===== DYNAMIC WEEK CALCULATION =====
  // Get current week's Monday
  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    // Adjust so Monday is start of week
    const monday = new Date(today);
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // if Sunday, go back 6 days
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const dowValues = [1, 2, 3, 4, 5, 6, 0]; // Mon=1...Sun=0 in JS getDay()
    return labels.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        label,
        num: d.getDate(),
        month: d.getMonth() + 1,
        dayOfWeek: dowValues[i],
        isSunday: label === 'CN',
        active: d.toDateString() === today.toDateString(), // highlight today
        fullDate: d.toISOString().split('T')[0],
      };
    });
  };
  const daysHeader = getWeekDays();

  return (
    <div className="flex flex-col w-full gap-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-earth-main tracking-tight">Quản lý đặt sân</h1>
          <p className="text-sm mt-1 text-earth-muted">
            Quản lý lịch sân, xem trạng thái đơn đặt và thêm đơn thủ công.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}>
            <button
              onClick={() => setViewMode('week')}
              className={`px-5 py-2 rounded-md font-semibold text-xs transition-all ${
                viewMode === 'week'
                  ? 'bg-earth-primary text-ink shadow-sm'
                  : 'text-earth-muted hover:text-earth-main hover:bg-slate-50'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-5 py-2 rounded-md font-semibold text-xs transition-all ${
                viewMode === 'month'
                  ? 'bg-earth-primary text-ink shadow-sm'
                  : 'text-earth-muted hover:text-earth-main hover:bg-slate-50'
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-5 py-2 rounded-md font-semibold text-xs transition-all ${
                viewMode === 'day'
                  ? 'bg-earth-primary text-ink shadow-sm'
                  : 'text-earth-muted hover:text-earth-main hover:bg-slate-50'
              }`}
            >
              Ngày
            </button>
          </div>

          {/* Court Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={selectedCourtFilter}
              onChange={(e) => setSelectedCourtFilter(e.target.value)}
              className="w-full appearance-none text-xs font-semibold py-2.5 pl-3.5 pr-9 rounded-lg focus:outline-none cursor-pointer bg-slate-50 border border-earth text-earth-main"
            >
              <option value="all">Tất cả sân</option>
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-lg">
              expand_more
            </span>
          </div>

          {/* Manual Reservation Button */}
          <button
            id="btn-manual-booking"
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer bg-earth-accent hover:bg-earth-accent-hover text-ink"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            ĐẶT SÂN THỦ CÔNG
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-earth-muted">
        <span className="font-bold text-earth-primary uppercase tracking-wider text-[11px]">
          TRẠNG THÁI:
        </span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-earth-primary shadow-sm"></div>
          <span className="font-medium">Đã xác nhận</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-earth-accent shadow-sm"></div>
          <span className="font-medium">Chờ xử lý</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
          <span className="font-medium">Chờ TT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-earth-danger shadow-sm"></div>
          <span className="font-medium">Đã hủy</span>
        </div>
      </div>

      {/* Main Split Layout: Weekly Calendar + Right Detail Side Panel */}
      <div className="flex flex-col xl:flex-row gap-6 w-full items-start">
        {/* Calendar Grid Box */}
        <div className="flex-1 w-full bg-white rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[720px] relative border border-ink/10">
          {/* Days Header */}
          <div className="flex bg-slate-50 shadow-sm z-10 border-b border-earth">
            {/* Time spacer */}
            <div className="w-16 sm:w-20 shrink-0 bg-slate-100 flex items-center justify-center border-r border-earth">
              <span className="text-[11px] font-bold text-earth-muted uppercase tracking-wider">Giờ</span>
            </div>

            {/* 7 Days Columns */}
            <div className="flex-1 grid grid-cols-7 min-w-[650px]">
              {daysHeader.map((d, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center py-3 relative group cursor-pointer transition-colors border-r border-earth ${
                    d.active ? 'bg-earth-primary-light' : 'hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`text-xs font-bold mb-0.5 ${
                      d.isSunday
                        ? 'text-earth-danger'
                        : d.active
                        ? 'text-earth-primary'
                        : 'text-earth-muted'
                    }`}
                  >
                    {d.label}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      d.isSunday
                        ? 'text-earth-danger'
                        : d.active
                        ? 'text-earth-primary'
                        : 'text-earth-main'
                    }`}
                  >
                    {d.num}
                  </span>
                  {d.active ? (
                    <div className="absolute bottom-0 w-full h-1 bg-earth-primary"></div>
                  ) : (
                    <div className="absolute bottom-0 w-full h-1 bg-earth-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Calendar Body */}
          <div className="flex-1 overflow-x-auto relative max-h-[640px] overflow-y-auto">
            <div className="flex min-w-[720px] relative">
              {/* Vertical Time Axis */}
              <div className="w-16 sm:w-20 shrink-0 bg-slate-50 flex flex-col relative z-10 border-r border-earth">
                {timeSlots.map((slot, idx) => (
                  <div key={idx} className="h-16 flex items-start justify-center pt-2 relative border-b border-earth">
                    <span className="text-xs font-mono font-medium text-earth-muted">{slot}</span>
                  </div>
                ))}
              </div>

              {/* Main Schedule Grid Body */}
              <div className="flex-1 grid grid-cols-7 relative bg-white bg-[linear-gradient(var(--admin-border)_1px,transparent_1px)] bg-[length:100%_64px]">
                {/* Vertical Separator Lines */}
                <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                  <div className="border-r border-earth"></div>
                  <div className="border-r border-earth bg-earth-primary-light opacity-50"></div> {/* Active Day Highlight */}
                  <div className="border-r border-earth"></div>
                  <div className="border-r border-earth"></div>
                  <div className="border-r border-earth"></div>
                  <div className="border-r border-earth"></div>
                  <div className="border-r border-earth bg-earth-danger-light opacity-30"></div> {/* Sunday */}
                </div>

                {/* Live Current Time Line */}
                {(() => {
                  const hours = currentTime.getHours();
                  const minutes = currentTime.getMinutes();
                  // Only show if between 06:00 and 22:00
                  if (hours < 6 || hours > 22) return null;
                  const top = (hours + minutes / 60 - 6) * 64;
                  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                  return (
                    <div
                      className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                      style={{ top: `${top}px` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-earth-danger shadow-md -ml-1"></div>
                      <div className="flex-1 h-0.5 bg-earth-danger shadow-[0_0_6px_rgba(239,68,68,0.9)] relative">
                        <span className="absolute -top-5.5 left-2 bg-earth-danger text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                          {formattedTime} (Hiện tại)
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Dynamic Bookings on Grid */}
                {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek, colIndex) => {
                  const dayBookings = filteredBookings.filter(b => {
                    if (!b.date) return false;
                    const d = new Date(b.date);
                    return d.getDay() === dayOfWeek;
                  });

                  return (
                    <div key={colIndex} className="relative min-h-[1088px]">
                      {dayBookings.map((bk, idx) => {
                        const startH = parseInt(bk.startTime.split(':')[0]);
                        const startM = parseInt(bk.startTime.split(':')[1] || '0');
                        const endH = parseInt(bk.endTime.split(':')[0]);
                        const endM = parseInt(bk.endTime.split(':')[1] || '0');
                        
                        const startTotal = startH + startM / 60;
                        const endTotal = endH + endM / 60;
                        
                        const top = (startTotal - 6) * 64;
                        const height = (endTotal - startTotal) * 64;
                        
                        const isPending = bk.status === 'Pending';
                        const isCancelled = bk.status === 'Cancelled';
                        
                        return (
                          <div
                            key={bk.id}
                            onClick={() => onSelectBooking(bk)}
                            className={`absolute left-1 right-1 rounded-lg p-2.5 shadow-md cursor-pointer hover:scale-[1.03] hover:shadow-xl transition-all z-10 flex flex-col justify-between overflow-hidden border ${
                              isCancelled ? 'bg-earth-danger-light border-earth-danger opacity-80' :
                              isPending ? 'bg-[#f9e9d6] border-[#f0cfa3]' : 'bg-earth-primary-light border-earth-primary'
                            } ${activeBooking?.id === bk.id ? 'ring-2 ring-earth-accent' : ''}`}
                            style={{ top: `${top}px`, height: `${Math.max(48, height)}px` }}
                          >
                            {!isCancelled && <div className={`absolute top-0 left-0 w-1.5 h-full ${isPending ? 'bg-earth-accent' : 'bg-earth-primary'}`}></div>}
                            <div className="flex justify-between items-start pl-2">
                              <span className={`text-xs font-bold ${isCancelled ? 'text-earth-danger' : 'text-earth-main'} truncate`}>{bk.guestName}</span>
                            </div>
                            <div className="pl-2">
                              <p className={`text-[10px] font-semibold ${isCancelled ? 'text-earth-danger opacity-80' : 'text-earth-main'} truncate`}>
                                {bk.courtName} • {bk.startTime} - {bk.endTime}
                              </p>
                              <span className={`text-[10px] font-bold uppercase mt-0.5 inline-block ${
                                isCancelled ? 'text-earth-danger' :
                                isPending ? 'text-earth-accent' :
                                'bg-earth-primary text-amber-400 px-1.5 py-0.5 rounded'
                              }`}>
                                {isCancelled ? 'Đã hủy' : isPending ? 'Chờ xử lý' : 'Đã xác nhận'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Month Navigator Floating Overlay */}
          <div className="absolute bottom-4 right-4 rounded-full px-2 py-1 shadow-2xl flex items-center backdrop-blur-md z-30 bg-white border border-earth">
            <button
              onClick={() => setCurrentMonthStr('Tháng 7, 2024')}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer text-earth-muted hover:bg-slate-100">
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <span className="text-xs font-bold px-3 text-earth-main">{currentMonthStr}</span>
            <button
              onClick={() => setCurrentMonthStr('Tháng 9, 2024')}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer text-earth-muted hover:bg-slate-100">
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Right Detail Side Panel (Matches Screenshot 3) */}
        <div className="w-full xl:w-[390px] shrink-0 rounded-xl shadow-2xl flex flex-col overflow-hidden relative bg-earth-card border border-earth">
          {/* Banner Image with Court & Shuttlecock */}
          <div
            className="h-36 w-full bg-cover bg-center relative"
            style={{
              backgroundImage:
                "url('/images/preview (3).webp')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
            <div className="absolute top-3.5 right-3.5">
              {activeBooking?.status === 'Pending' && (
                <span className="bg-earth-accent text-ink px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-md">
                  CHỜ XỬ LÝ
                </span>
              )}
              {activeBooking?.status === 'Pending_Payment' && (
                <span className="bg-amber-400 text-ink px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-md">
                  CHỜ THANH TOÁN
                </span>
              )}
              {activeBooking?.status === 'Paid' && (
                <span className="bg-earth-primary text-amber-400 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-md">
                  ĐÃ XÁC NHẬN
                </span>
              )}
              {activeBooking?.status === 'Cancelled' && (
                <span className="bg-earth-danger text-ink px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-md">
                  ĐÃ HỦY
                </span>
              )}
            </div>
          </div>

          <div className="p-6 flex flex-col flex-1 relative z-10 -mt-12">
            {/* Guest Info Box */}
            <div className="rounded-xl p-4 shadow-sm mb-5 relative overflow-hidden bg-slate-50 border border-earth">
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner shrink-0 bg-earth-accent text-ink">
                  {activeBooking ? activeBooking.guestName.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-earth-main leading-tight">
                    {activeBooking ? activeBooking.guestName : 'Phạm Văn Dũng'}
                  </h3>
                  <p className="text-xs flex items-center gap-1 mt-1 font-mono text-earth-muted">
                    <span className="material-symbols-outlined text-sm text-earth-accent">call</span>
                    {activeBooking ? activeBooking.guestPhone : '0987 654 321'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-earth">
                <span className="text-[11px] font-bold uppercase tracking-wider text-earth-muted">MÃ ĐẶT SÂN</span>
                <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-0.5 rounded bg-earth-primary-light text-earth-primary border border-earth-primary">
                  {activeBooking ? activeBooking.id : '#BK-9482'}
                </span>
              </div>
            </div>

            {/* Booking Details List */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Court */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors bg-earth-primary-light border border-earth-primary">
                  <span className="material-symbols-outlined text-lg text-earth-primary">
                    sports_kabaddi
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-earth-muted">
                    Sân thi đấu
                  </p>
                  <p className="text-sm font-semibold text-earth-main">
                    {activeBooking ? activeBooking.courtName : 'Sân 3 - Tiêu chuẩn'}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors bg-earth-primary-light border border-earth-primary">
                  <span className="material-symbols-outlined text-lg text-earth-primary">
                    schedule
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-earth-muted">
                    Thời gian
                  </p>
                  <p className="text-sm font-semibold text-earth-main">
                    {activeBooking ? `${activeBooking.startTime} - ${activeBooking.endTime} (${activeBooking.durationHours}h)` : '11:30 - 13:00 (1.5h)'}
                  </p>
                  <p className="text-xs mt-0.5 text-earth-muted opacity-80">
                    {activeBooking?.date || 'Thứ 3, 13 Tháng 8, 2024'}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors bg-earth-primary-light border border-earth-primary">
                  <span className="material-symbols-outlined text-lg text-earth-primary">
                    payments
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-earth-muted">
                    Thanh toán
                  </p>
                  <p className="text-xl font-bold font-mono text-earth-accent">
                    {activeBooking ? activeBooking.amount.toLocaleString('vi-VN') : '150,000'} đ
                  </p>
                  <p className="text-xs mt-0.5 text-earth-muted opacity-80">
                    {activeBooking?.status === 'Paid' ? 'Đã thanh toán (Bank QR)' : 'Chưa thanh toán'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col gap-2.5">
              {activeBooking?.status === 'Pending' && (
                <button
                  onClick={handleConfirmCurrentBooking}
                  className="w-full py-3 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-earth-accent hover:bg-earth-accent-hover text-ink"
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Xác nhận đặt sân
                </button>
              )}
              {activeBooking?.status === 'Pending_Payment' && (
                <button
                  onClick={handleConfirmCurrentBooking}
                  className="w-full py-3 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-amber-400 hover:bg-amber-500 text-ink"
                >
                  <span className="material-symbols-outlined text-lg">payments</span>
                  Xác nhận đã nhận tiền
                </button>
              )}

              <div className="flex gap-2.5">
                <button
                  onClick={() => setIsRescheduleModalOpen(true)}
                  className="flex-1 py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-slate-50 border-earth text-earth-main hover:bg-slate-100"
                >
                  <span className="material-symbols-outlined text-base">edit_calendar</span>
                  Đổi giờ
                </button>
                <button
                  onClick={handleCancelCurrentBooking}
                  disabled={activeBooking?.status === 'Cancelled'}
                  className="flex-1 py-2.5 bg-earth-danger-light hover:bg-red-50 text-earth-danger font-bold text-xs uppercase tracking-wider rounded-lg border border-earth-danger transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Booking Modal (+ ĐẶT SÂN THỦ CÔNG) */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto bg-earth-card border border-earth">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-earth">
              <div>
                <h2 className="text-xl font-bold text-earth-main flex items-center gap-2">
                  <span className="material-symbols-outlined text-earth-primary">event_available</span>
                  Đặt sân thủ công
                </h2>
                <p className="text-xs mt-1 text-earth-muted">Tạo lịch đặt sân nhanh cho khách tại quầy hoặc gọi điện</p>
              </div>
              <button onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg cursor-pointer transition-colors text-earth-muted hover:bg-slate-50">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleManualBookingSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Họ và tên khách hàng *
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-50 text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full bg-slate-50 text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Chọn Sân
                  </label>
                  <select
                    value={courtId}
                    onChange={(e) => setCourtId(e.target.value)}
                    className="w-full bg-slate-50 text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  >
                    {courts.map((court) => (
                      <option key={court.id} value={court.id}>
                        {court.name} ({court.pricePerHour.toLocaleString('vi-VN')}đ/h)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Thứ / Ngày trong tuần
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setDayOfWeek(val);
                      const dayName = val === 1 ? 'Thứ 2, 12' : val === 2 ? 'Thứ 3, 13' : val === 3 ? 'Thứ 4, 14' : val === 4 ? 'Thứ 5, 15' : val === 5 ? 'Thứ 6, 16' : val === 6 ? 'Thứ 7, 17' : 'Chủ Nhật, 18';
                      setBookingDate(`${dayName} Tháng 8, 2024`);
                    }}
                    className="w-full bg-slate-50 text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  >
                    <option value={1}>Thứ 2 (12/08)</option>
                    <option value={2}>Thứ 3 (13/08)</option>
                    <option value={3}>Thứ 4 (14/08)</option>
                    <option value={4}>Thứ 5 (15/08)</option>
                    <option value={5}>Thứ 6 (16/08)</option>
                    <option value={6}>Thứ 7 (17/08)</option>
                    <option value={0}>Chủ Nhật (18/08)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Giờ Bắt Đầu
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Giờ Kết Thúc
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Ghi chú đơn đặt sân
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Khách yêu cầu mượn thêm vợt, mua nước suối..."
                  rows={2}
                  className="w-full bg-slate-50 text-earth-main text-sm p-3 rounded-lg border border-earth focus:outline-none focus:border-earth-primary resize-none"
                />
              </div>

              <div className="p-3 rounded-xl flex justify-between items-center text-xs bg-earth-primary-light border border-earth-primary">
                <span className="text-earth-main">Tạm tính:</span>
                <span className="text-base font-bold font-mono text-earth-primary">
                  {(
                    ((courts.find(c => c.id === courtId)?.pricePerHour || 100000) * 1.5)
                  ).toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="flex gap-3 pt-3 border-t border-earth">
                <button type="button" onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-all bg-slate-100 text-earth-muted border border-earth hover:bg-slate-200">
                  Đóng
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm cursor-pointer bg-earth-accent hover:bg-earth-accent-hover text-ink">
                  Xác nhận đặt sân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal (ĐỔI GIỜ) */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-earth-card border border-earth">
            <h3 className="text-lg font-bold text-earth-main mb-1">Đổi giờ đặt sân</h3>
            <p className="text-xs mb-4 text-earth-muted">
              Đơn: <span className="font-mono text-earth-primary">{activeBooking?.id}</span> ({activeBooking?.guestName})
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Giờ bắt đầu mới
                </label>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full bg-slate-50 text-earth-main text-sm p-2.5 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Giờ kết thúc mới
                </label>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full bg-slate-50 text-earth-main text-sm p-2.5 rounded-lg border border-earth focus:outline-none focus:border-earth-primary"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setIsRescheduleModalOpen(false)}
                  className="flex-1 py-2 rounded-xl font-bold text-xs cursor-pointer bg-slate-100 border border-earth text-earth-muted hover:bg-slate-200">
                  Hủy
                </button>
                <button type="submit"
                  className="flex-1 py-2 rounded-xl font-bold text-xs cursor-pointer bg-earth-accent hover:bg-earth-accent-hover text-ink">
                  Cập nhật giờ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



