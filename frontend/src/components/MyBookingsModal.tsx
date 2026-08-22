import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, QrCode, Trash2, CheckCircle2, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { BookingRecord } from '../types';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  walletBalance?: number;
  onCancelBooking: (id: string) => void;
  onBookMore: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  walletBalance = 0,
  onCancelBooking,
  onBookMore,
}) => {
  if (!isOpen) return null;

  const [activeQrBooking, setActiveQrBooking] = useState<BookingRecord | null>(
    bookings.length > 0 ? bookings[0] : null
  );

  return (
    <div
      id="my-bookings-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="my-bookings-modal-container"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-ink/10 overflow-hidden my-6 animate-in fade-in zoom-in-95"
      >
        {/* Header */}
        <div className="bg-white border-b border-zinc-100 p-5 sm:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Sân Đã Đặt & Thẻ QR Điện Tử</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-500">
                Xuất trình thẻ QR này tại cổng vào hoặc quầy lễ tân
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                Ví của bạn: {walletBalance.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-ink text-base">Chưa có lịch đặt sân nào</h3>
              <p className="text-xs text-ink/60 max-w-xs mx-auto">
                Bạn đã sẵn sàng? Chọn một sân và đặt ngay giờ chơi yêu thích.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookMore();
                }}
                className="mt-2 bg-primary hover:bg-secondary hover:text-ink text-surface text-base font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Xem Danh Sách Sân</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl border border-ink/10 p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ink/10">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-ink/50">
                        MÃ: {b.bookingCode}
                      </span>
                      <h4 className="font-bold text-base text-ink">{b.facilityName}</h4>
                      <p className="text-xs text-ink/60 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-ink/50" />
                        {b.facilityLocation}
                      </p>
                    </div>

                    <span
                      className={`self-start sm:self-auto text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full ${
                        b.status === 'ĐÃ XÁC NHẬN'
                          ? 'bg-primary text-surface'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="py-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-ink/80">
                    <div>
                      <span className="text-ink/50 block text-[10px] uppercase font-bold">Sân</span>
                      <span className="font-bold text-primary">{b.courtNumber}</span>
                    </div>
                    <div>
                      <span className="text-ink/50 block text-[10px] uppercase font-bold">Date & Time</span>
                      <span className="font-semibold text-ink">
                        {b.date} ({b.timeSlots.join(', ')})
                      </span>
                    </div>
                    <div>
                      <span className="text-ink/50 block text-[10px] uppercase font-bold">Total Cost</span>
                      <span className="font-extrabold text-primary">{b.formattedTotalAmount}</span>
                    </div>
                  </div>

                  {/* Dịch Vụ if any */}
                  {b.addons.length > 0 && (
                    <div className="py-2 border-t border-dashed border-ink/10 text-[11px] text-ink/60">
                      Dịch vụ thêm: {b.addons.map((a) => `${a.quantity}x ${a.name}`).join(', ')}
                    </div>
                  )}

                  {/* Actions: Show QR Pass & Hủy */}
                  <div className="pt-3 border-t border-ink/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveQrBooking(b)}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Xem Mã QR Điện Tử</span>
                    </button>

                    {b.status !== 'CANCELLED' && new Date(b.date + 'T' + b.timeSlots[0]) > new Date() && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Bạn có chắc chắn muốn hủy đơn? Nếu hủy trước 4 tiếng, bạn sẽ được hoàn 100% vào Ví. Nếu hủy sát giờ, bạn sẽ bị mất tiền phí.")) {
                            onCancelBooking(b.id);
                          }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hủy đặt sân</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* QR Modal Popover if selected */}
              {activeQrBooking && (
                <div className="mt-4 p-5 rounded-2xl bg-surface border border-ink/10 text-center shadow-inner relative">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                      Digital Pass • {activeQrBooking.bookingCode}
                    </span>
                    <button
                      onClick={() => setActiveQrBooking(null)}
                      className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 bg-white px-3 py-1 rounded-full shadow-xs border border-zinc-200"
                    >
                      Đóng QR
                    </button>
                  </div>

                  <div className="w-32 h-32 bg-white p-3 border border-zinc-200 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                    <QrCode className="w-full h-full text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-primary mt-4">
                    {activeQrBooking.facilityName} - {activeQrBooking.courtNumber}
                  </p>
                  <p className="text-xs font-medium text-zinc-500 mt-1">
                    {activeQrBooking.date} • {activeQrBooking.timeSlots.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-ink/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-ink/80 text-xs font-bold transition-colors cursor-pointer"
          >Đóng</button>
        </div>
      </div>
    </div>
  );
};



