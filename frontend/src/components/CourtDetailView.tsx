import React from 'react';
import { CourtFacility } from '../types';
import { MapPin, Phone, Clock, Grid, CheckCircle2, Navigation, Info, MessageSquare, Shield } from 'lucide-react';
import { STANDARD_TIME_SLOTS } from '../data/courts';

interface CourtDetailViewProps {
  court: CourtFacility;
  onBookNow: () => void;
  onBack: () => void;
}

export const CourtDetailView: React.FC<CourtDetailViewProps> = ({ court, onBookNow, onBack }) => {
  return (
    <div className="bg-[#f3f4f6] min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-ink/10 py-3 mb-6">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center gap-2 text-xs text-ink/60">
          <button onClick={onBack} className="hover:text-primary transition-colors">Trang chủ</button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-primary transition-colors">Cầu lông</button>
          <span>/</span>
          <span className="font-bold text-ink">{court.name}</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Header Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Cầu Lông
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-ink mb-4">{court.name}</h1>
            
            <div className="flex items-start gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-ink/80">{court.location}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-ink/10 pt-5">
              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Clock className="w-5 h-5 text-sky-600 mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-sky-600/70 font-bold mb-0.5">Mở cửa</span>
                <span className="text-sm font-extrabold text-sky-900">{court.openingHours}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Phone className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-emerald-600/70 font-bold mb-0.5">Hotline</span>
                <span className="text-sm font-extrabold text-emerald-900">{court.phone || '0987400019'}</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Grid className="w-5 h-5 text-amber-600 mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-amber-600/70 font-bold mb-0.5">Quy mô</span>
                <span className="text-sm font-extrabold text-amber-900">{court.totalCourts} sân</span>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-5 h-5 text-primary mb-1" />
                <span className="text-[11px] uppercase tracking-wider text-primary/70 font-bold mb-0.5">Trạng thái</span>
                <span className="text-sm font-extrabold text-primary">Đang hoạt động</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-ink mb-2">Giới thiệu</h3>
              <p className="text-sm text-ink/70 leading-relaxed">{court.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
                <Grid className="w-5 h-5 text-primary" /> Danh sách sân ({court.totalCourts})
              </h3>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: court.totalCourts }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 border border-ink/10 rounded-lg text-sm bg-surface/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="font-semibold">Sân {i + 1}</span>
                    <span className="text-xs text-ink/50">(4 người)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Pricing Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink/5">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-xs">$</span>
              Bảng giá thuê sân
            </h3>
            
            <div className="overflow-x-auto rounded-xl border border-ink/10">
              <table className="w-full text-sm text-left">
                <thead className="bg-primary text-white font-bold">
                  <tr>
                    <th className="px-4 py-3">Khung giờ</th>
                    <th className="px-4 py-3">Thứ 2 - Thứ 6</th>
                    <th className="px-4 py-3">Thứ 7 - CN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  <tr className="bg-white hover:bg-surface/20">
                    <td className="px-4 py-3">06:00 - 17:00</td>
                    <td className="px-4 py-3 font-bold text-primary">{(court.pricePerHour).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-4 py-3 font-bold text-primary">{(court.pricePerHour + 30000).toLocaleString('vi-VN')} VNĐ</td>
                  </tr>
                  <tr className="bg-surface/10 hover:bg-surface/20">
                    <td className="px-4 py-3">17:00 - 22:00 (Giờ vàng)</td>
                    <td className="px-4 py-3 font-bold text-primary">{(court.pricePerHour + 20000).toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-4 py-3 font-bold text-primary">{(court.pricePerHour + 50000).toLocaleString('vi-VN')} VNĐ</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink/50 mt-2 italic flex items-center gap-1">
              <Info className="w-3 h-3" /> Giá đã bao gồm thuế và đèn chiếu sáng.
            </p>
          </div>

          {/* 3. Availability Matrix */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink/5 overflow-hidden">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Lịch trống hôm nay
            </h3>
            
            <div className="space-y-6">
              {Array.from({ length: court.totalCourts }).map((_, scIdx) => (
                <div key={scIdx}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-ink text-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      Sân {scIdx + 1}
                    </h4>
                    <span className="text-xs font-bold text-primary">{(court.pricePerHour).toLocaleString('vi-VN')} VNĐ/h</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {STANDARD_TIME_SLOTS.map((slot) => {
                      const isBooked = !slot.isAvailable;
                      return (
                        <div 
                          key={slot.id} 
                          className={`
                            py-2 rounded-md text-center text-xs font-semibold border transition-all cursor-pointer
                            ${isBooked ? 'bg-ink/5 border-ink/10 text-ink/40 cursor-not-allowed' : 'bg-white border-primary/30 text-ink hover:border-primary hover:bg-primary/5'}
                          `}
                        >
                          {slot.time}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-ink/10 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-white border border-primary/30 rounded-sm"></div>
                <span className="text-ink/70">Trống</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-ink/10 rounded-sm"></div>
                <span className="text-ink/70">Đã đặt</span>
              </div>
            </div>
          </div>

          {/* 4. Map Placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink/5">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Vị trí
            </h3>
            <div className="w-full h-64 bg-[#e5e7eb] rounded-xl overflow-hidden relative border border-ink/10">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1861.8761358153213!2d105.837383!3d21.042596!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9f8fa3cbed%3A0x46daededde3a68b5!2zTGnDqm4gxJFvw6BuIFF14bqnbiBW4bujdCBWaeG7h3QgTmFt!5e0!3m2!1svi!2sus!4v1787216781721!5m2!1svi!2sus" 
                className="w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors">
                <Navigation className="w-4 h-4" /> Chỉ đường
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Sticky Widget) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 space-y-4">
            
            {/* Booking Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-ink/10">
              <h2 className="text-2xl font-extrabold text-primary mb-6">{court.totalCourts} sân</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                  <span className="text-sm text-ink/70">Giá thuê (từ)</span>
                  <span className="text-sm font-bold text-ink">{(court.pricePerHour).toLocaleString('vi-VN')} VNĐ/h</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm text-ink/70">Tùy chọn</span>
                  <span className="text-sm font-bold text-ink">Chọn ngày & giờ</span>
                </div>
              </div>

              <button 
                onClick={onBookNow}
                className="w-full bg-primary hover:bg-secondary hover:text-ink text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mb-3"
              >
                <Clock className="w-5 h-5" /> Đặt sân ngay
              </button>

              <button className="w-full bg-white hover:bg-surface/30 text-primary border-2 border-primary font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Gọi: {court.phone || '0987400019'}
              </button>

              <p className="text-center text-[11px] text-ink/50 mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> Đặt cọc an toàn • Hủy trước 2h miễn phí
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink/5">
              <h3 className="font-bold text-ink mb-4">Thông tin liên hệ</h3>
              <div className="space-y-3 text-sm text-ink/80">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <strong className="text-primary">{court.phone || '0987400019'}</strong>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{court.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{court.openingHours} hàng ngày</span>
                </div>
              </div>
              <button className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-secondary hover:text-ink transition-colors">
                <MessageSquare className="w-4 h-4" /> Chat với chủ sân
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};



