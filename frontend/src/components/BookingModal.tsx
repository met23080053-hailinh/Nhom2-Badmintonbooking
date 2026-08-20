import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Star, Check, ShieldCheck, ChevronRight, AlertCircle, QrCode, Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SânFacility, SânDetail, TimeSlot, EquipmentAddon, BookingRecord } from '../types';
import { STANDARD_TIME_SLOTS, EQUIPMENT_OPTIONS } from '../data/courts';
import { CheckoutModal } from './CheckoutModal';

interface BookingModalProps {
  court: SânFacility | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (booking: BookingRecord) => void;
  defaultNgày?: string;
  defaultTime?: string;
  isLoggedIn: boolean;
  userId: number | null;
  userName: string;
  userPhone: string;
  onRequireLogin: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  court,
  isOpen,
  onClose,
  onBookingSuccess,
  defaultNgày,
  defaultTime,
  isLoggedIn,
  userId,
  userName,
  userPhone,
  onRequireLogin,
}) => {

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [modalTab, setModalTab] = useState<'booking' | 'reviews'>('booking');
  // Generate dynamic courts based on totalCourts
  const generatedSubSâns = Array.from({ length: court?.totalCourts || 1 }).map((_, i) => ({
    id: `sub-${i+1}`,
    nameSânNumber: `Sân ${i+1}`,
    surface: 'Thảm PVC',
    isAvailable: true
  }));

  const [selectedSubSân, setSelectedSubSân] = useState<any>(
    generatedSubSâns[0]
  );
  const [bookingNgày, setBookingNgày] = useState<string>(defaultNgày || 'Hôm nay, 24 Th10');
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [addons, setAddons] = useState<EquipmentAddon[]>(
    EQUIPMENT_OPTIONS.map((item) => ({ ...item, quantity: 0 }))
  );
  const [playerName, setPlayerName] = useState(userName || '');
  const [playerPhone, setPlayerPhone] = useState(userPhone || '');
  const [playerEmail, setPlayerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'VietQR' | 'MoMo' | 'Thanh toán tại sân'>('VietQR');
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  // Available dates
  const availableNgàys = [
    { label: 'Hôm nay', sub: '24 Th10', value: 'Hôm nay, 24 Th10' },
    { label: 'Ngày mai', sub: '25 Th10', value: 'Ngày mai, 25 Th10' },
    { label: 'Thứ Bảy', sub: '26 Th10', value: 'Thứ Bảy, 26 Th10' },
    { label: 'Chủ Nhật', sub: '27 Th10', value: 'Chủ Nhật, 27 Th10' },
    { label: 'Thứ Hai', sub: '28 Th10', value: 'Thứ Hai, 28 Th10' },
  ];

  // Toggle slot selection
  const handleToggleSlot = (slotId: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    if (selectedSlotIds.includes(slotId)) {
      if (selectedSlotIds.length > 1) {
        setSelectedSlotIds(selectedSlotIds.filter((id) => id !== slotId));
      }
    } else {
      setSelectedSlotIds([...selectedSlotIds, slotId]);
    }
  };

  // Adjust addon quantity
  const handleUpdateAddon = (addonId: string, delta: number) => {
    setAddons((prev) =>
      prev.map((item) => {
        if (item.id === addonId) {
          const newQty = Math.max(0, Math.min(10, item.quantity + delta));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  if (!isOpen || !court) return null;

  // Calculate pricing
  const baseSânGiá = court.pricePerHour;
  const slotCount = selectedSlotIds.length;

  const totalSânCost = selectedSlotIds.reduce((sum, slotId) => {
    const slot = STANDARD_TIME_SLOTS.find((s) => s.id === slotId);
    const multiplier = slot ? slot.priceMultiplier : 1;
    return sum + baseSânGiá * multiplier;
  }, 0);

  const totalAddonsCost = addons.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const finalTotal = totalSânCost + totalAddonsCost;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' VND';
  };

  const handleProceedToPayment = () => {
    if (!isLoggedIn) {
      onClose();
      onRequireLogin();
      return;
    }
    if (!playerName.trim() || !playerPhone.trim()) {
      setValidationError("Vui lòng điền đầy đủ Tên và SĐT trước khi thanh toán.");
      return;
    }
    setValidationError(null);
    handleConfirmBooking();
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    const selectedSlotTimes = selectedSlotIds.map(
      (id) => STANDARD_TIME_SLOTS.find((s) => s.id === id)?.time || ''
    );

    const timeParts = selectedSlotTimes[0]?.split(' - ') || ['18:00', '20:00'];
    const startTimeStr = timeParts[0] + ':00';
    const endTimeStr = timeParts[1] + ':00'; // Simply using the first slot for simplicity of API demo

    fetch(`http://${window.location.hostname}:8000/create_booking.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        court_id: parseInt(court.id.replace('court-', '')) || 1,
        start_time: `2026-10-24 ${startTimeStr}`, // Hardcoded date for demo
        end_time: `2026-10-24 ${endTimeStr}`,
        player_name: playerName,
        player_phone: playerPhone
      })
    })
    .then(res => res.json())
    .then(data => {
      setIsSubmitting(false);
      if (data.status === 'success') {
        const bd = data.data;
        const newBooking: BookingRecord = {
          id: 'book-' + bd.booking_id,
          bookingCode: bd.booking_code,
          facilityId: court.id,
          facilityName: court.name,
          facilityLocation: court.location,
          facilityImage: court.imageUrl,
          courtNumber: selectedSubSân.nameSânNumber,
          date: bookingNgày,
          timeSlots: selectedSlotTimes,
          totalHours: slotCount,
          totalAmount: finalTotal,
          formattedTotalAmount: formatVND(finalTotal),
          status: 'ĐANG CHỜ DUYỆT',
          playerName,
          playerPhone,
          playerEmail,
          addons: [],
          paymentMethod,
          createdAt: new Date().toISOString(),
          qrCodeSeed: bd.booking_code,
        };

        setCreatedBooking(newBooking);
        setCheckoutData({
          bookingId: bd.booking_id,
          bookingCode: bd.booking_code,
          totalPrice: finalTotal, // using UI calculated total
          qrUrl: bd.payment_qr_url
        });
        setShowCheckout(true);
      } else {
        alert("Lỗi: " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      setIsSubmitting(false);
      alert("Lỗi kết nối máy chủ");
    });
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    if (createdBooking) {
      onBookingSuccess(createdBooking);
    }
    setStep('success');

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-ink)', '#22c55e'],
      });
    } catch {
      // Ignore if confetti context unavailable
    }
  };

  if (!isOpen || !court) return null;

  return (
    <>
      <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="booking-modal-content"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-ink/10 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="relative bg-ink text-surface text-base p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-secondary text-[#1A1A1A] px-2.5 py-0.5 rounded-full">
                Instant Reservation
              </span>
              <span className="flex items-center gap-1 text-xs text-ink/90">
                <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                {court.rating} ({court.reviewCount} reviews)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {court.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {court.location}
            </p>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-ink flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' && (
          <div className="flex border-b border-ink/10">
            <button
              onClick={() => setModalTab('booking')}
              className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
                modalTab === 'booking' ? 'text-primary border-b-2 border-primary' : 'text-ink/60 hover:text-ink'
              }`}
            >
              Đặt Sân
            </button>
            <button
              onClick={() => setModalTab('reviews')}
              className={`flex-1 py-3 text-sm font-bold text-center transition-colors ${
                modalTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-ink/60 hover:text-ink'
              }`}
            >
              Đánh Giá & Nhận Xét
            </button>
          </div>
        )}

        {step === 'details' && modalTab === 'booking' ? (
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Step 1: Select Specific Sân with 2D Visual Map */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                  1. Chọn Số Sân
                </label>
                <span className="text-xs text-ink/60">
                  Mặt sân: {selectedSubSân.surface}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {generatedSubSâns.map((c) => {
                  const isSelected = selectedSubSân.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={!c.isAvailable}
                      onClick={() => setSelectedSubSân(c)}
                      className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        !c.isAvailable
                          ? 'bg-slate-100 border-ink/10 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary/5 border-[#d97706] ring-2 ring-[#d97706] shadow-xs'
                          : 'bg-white border-ink/10 hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-extrabold text-ink">
                          {c.nameSânNumber}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-primary text-surface flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink/60 truncate">{c.name}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                            c.isAvailable
                              ? 'bg-zinc-100 text-primary'
                              : 'bg-slate-200 text-ink/70'
                          }`}
                        >
                          {c.isAvailable ? 'Còn trống' : 'Đã đặt'}
                        </span>
                        <span className="text-[10px] text-ink/50 font-mono">
                          {c.lightingLux} Lux
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Ngày Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-3">
                2. Chọn Ngày
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {availableNgàys.map((d) => {
                  const isSelected = bookingNgày === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setBookingNgày(d.value)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-surface border-primary shadow-sm'
                          : 'bg-white text-ink/80 border-ink/10 hover:border-primary'
                      }`}
                    >
                      <span className="block text-xs font-bold">{d.label}</span>
                      <span
                        className={`text-[11px] block mt-0.5 ${
                          isSelected ? 'text-zinc-100' : 'text-ink/60'
                        }`}
                      >
                        {d.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Time Slot Matrix */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                  3. Chọn Khung Giờ ({selectedSlotIds.length} giờ đã chọn)
                </label>
                <div className="flex items-center gap-3 text-[11px] text-ink/60">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Đang chọn
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Đã đặt
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STANDARD_TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlotIds.includes(slot.id);
                  const slotGiá = court.pricePerHour * slot.priceMultiplier;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => handleToggleSlot(slot.id, slot.isAvailable)}
                      className={`p-2.5 rounded-lg border text-left transition-all relative ${
                        !slot.isAvailable
                          ? 'bg-slate-100 border-ink/10 text-ink/50 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary text-surface border-primary shadow-xs'
                          : 'bg-white text-ink border-ink/10 hover:border-primary cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{slot.time}</span>
                        {slot.isPeak && (
                          <span
                            className={`text-[9px] font-extrabold px-1 rounded-sm ${
                              isSelected
                                ? 'bg-secondary text-[#1A1A1A]'
                                : 'bg-zinc-100 text-primary'
                            }`}
                          >
                            CAO ĐIỂM
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] block mt-1 ${
                          isSelected ? 'text-zinc-100' : 'text-ink/60'
                        }`}
                      >
                        {formatVND(slotGiá)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Equipment & Addons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-3">
                4. Thuê Dụng Cụ (Tùy chọn)
              </label>

              <div className="space-y-2.5">
                {addons.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-ink/10 bg-white hover:bg-slate-50/50"
                  >
                    <div className="pr-2">
                      <h4 className="text-xs sm:text-sm font-bold text-ink">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-ink/60">{item.description}</p>
                      <span className="text-xs font-bold text-primary mt-0.5 inline-block">
                        +{item.formattedPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateAddon(item.id, -1)}
                        disabled={item.quantity === 0}
                        className="w-7 h-7 rounded-md border border-ink/20 bg-white flex items-center justify-center text-sm font-bold text-ink/80 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateAddon(item.id, 1)}
                        className="w-7 h-7 rounded-md bg-primary text-surface flex items-center justify-center text-sm font-bold hover:bg-secondary hover:text-ink cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 5: Player Info & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                  Tên người chơi
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-ink/10 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                  Số điện thoại (Nhận mã QR)
                </label>
                <input
                  type="text"
                  value={playerPhone}
                  onChange={(e) => setPlayerPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-ink/10 focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="09xx xxx xxx"
                />
              </div>
            </div>

            {/* Phương Thức Thanh Toán Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                Phương Thức Thanh Toán
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'VietQR', name: 'Chuyển Khoản VietQR', desc: 'Miễn phí giao dịch' },
                  { id: 'MoMo', name: 'Ví MoMo', desc: 'Hoàn tiền tự động' },
                  { id: 'Thanh toán tại sân', name: 'Thanh toán tại sân', desc: 'Tiền mặt / Thẻ' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                        : 'bg-white border-ink/10 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-ink block">
                      {pm.name}
                    </span>
                    <span className="text-[10px] text-ink/60 block mt-0.5">
                      {pm.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Giá Box & Submit */}
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-ink/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-ink/70">Tổng cộng Tổng tiền</span>
                <div className="text-2xl font-extrabold text-primary">
                  {formatVND(finalTotal)}
                </div>
                <p className="text-[11px] text-ink/60">
                  {selectedSubSân.nameSânNumber} • {bookingNgày} • {slotCount} giờ
                </p>
              </div>

              {/* Proceed to Payment Action */}
              <div className="pt-2 border-t border-ink/10">
                {validationError && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{validationError}</p>
                  </div>
                )}
                <button
                  type="button"
                  disabled={selectedSlotIds.length === 0}
                  onClick={handleProceedToPayment}
                  className="w-full bg-primary hover:bg-secondary hover:text-ink text-surface font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoggedIn ? 'Tiếp Tục Thanh Toán' : 'Đăng Nhập Để Đặt Sân'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : step === 'details' && modalTab === 'reviews' ? (
          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-white">
            <div className="bg-white rounded-2xl p-5 border border-ink/10">
              <h3 className="font-bold text-lg text-ink mb-4">Nhận xét từ người chơi</h3>
              {court.reviews && court.reviews.length > 0 ? (
                <div className="space-y-4">
                  {court.reviews.map((r) => (
                    <div key={r.id} className="pb-4 border-b border-ink/10 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={r.avatar} alt={r.user} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-bold text-sm text-ink">{r.user}</span>
                        </div>
                        <span className="text-xs text-ink/50">{r.date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-secondary text-secondary' : 'fill-slate-200 text-slate-200'}`} />
                        ))}
                      </div>
                      <p className="text-sm text-ink/70">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink/60 italic">Chưa có đánh giá nào cho sân này.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-ink/10">
              <h3 className="font-bold text-lg text-ink mb-3">Viết đánh giá</h3>
              <div className="flex items-center gap-2 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-slate-200 text-slate-200 cursor-pointer hover:fill-secondary hover:text-secondary" />
                ))}
              </div>
              <textarea 
                className="w-full px-3 py-2 text-sm rounded-lg border border-ink/10 focus:outline-hidden focus:border-primary mb-3" 
                rows={3} 
                placeholder="Chia sẻ trải nghiệm của bạn..."
              ></textarea>
              <button className="bg-primary text-surface font-bold px-6 py-2 rounded-lg hover:bg-secondary hover:text-ink transition-colors">
                Gửi đánh giá
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Success Screen with Digital QR Code Pass */
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-zinc-100 text-primary flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                YÊU CẦU ĐÃ ĐƯỢC GỬI
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Chờ Admin Xác Nhận
              </h3>
              <p className="text-sm text-ink/70 max-w-md mx-auto mt-2">
                Thông tin thanh toán của bạn đã được ghi nhận. Hệ thống sẽ tự động cập nhật trạng thái khi Admin xác nhận thành công.
              </p>
            </div>

            {/* Digital Ticket Pass Card */}
            {createdBooking && (
              <div className="max-w-md mx-auto bg-white border-2 border-dashed border-primary/40 rounded-2xl p-5 text-left shadow-sm relative overflow-hidden">
                {/* Top Ticket Header */}
                <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                  <div>
                    <span className="text-[10px] font-bold text-ink/50 uppercase">
                      MÃ ĐẶT SÂN (CHỜ DUYỆT)
                    </span>
                    <p className="text-lg font-mono font-extrabold text-primary">
                      {createdBooking.bookingCode}
                    </p>
                  </div>
                  <span className="bg-zinc-100 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
                    {createdBooking.status}
                  </span>
                </div>

                {/* Ticket Details */}
                <div className="py-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink/60">Cơ sở:</span>
                    <span className="font-bold text-ink">
                      {createdBooking.facilityName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Sân:</span>
                    <span className="font-bold text-primary">
                      {createdBooking.courtNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Ngày & Giờ:</span>
                    <span className="font-bold text-ink">
                      {createdBooking.date} ({createdBooking.timeSlots.join(', ')})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Người đặt:</span>
                    <span className="font-semibold text-ink">
                      {createdBooking.playerName} ({createdBooking.playerPhone})
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-ink/10">
                    <span className="text-ink/70 font-medium">Tổng tiền:</span>
                    <span className="font-extrabold text-sm text-primary">
                      {createdBooking.formattedTotalAmount}
                    </span>
                  </div>
                </div>

                {/* Simulated Visual QR Matrix */}
                <div className="pt-3 border-t border-dashed border-ink/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-ink/10 shadow-xs flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-ink" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-ink">
                        Lưu lại mã này
                      </p>
                      <p className="text-[10px] text-ink/50">
                        PIN: {createdBooking.bookingCode.replace('BB-', '')}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] bg-white border border-ink/10 px-2 py-1 rounded-md text-ink/60 font-mono">
                    {paymentMethod}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-ink hover:bg-ink/90 text-surface text-base font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Đóng
                  </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Checkout Modal Overlay */}
    {showCheckout && checkoutData && (
      <CheckoutModal
        bookingId={checkoutData.bookingId}
        bookingCode={checkoutData.bookingCode}
        totalPrice={checkoutData.totalPrice}
        qrUrl={checkoutData.qrUrl}
        onClose={() => setShowCheckout(false)}
        onSuccess={handlePaymentSuccess}
      />
    )}
    </>
  );
};
