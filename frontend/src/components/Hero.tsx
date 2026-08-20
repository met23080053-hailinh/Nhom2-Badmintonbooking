import React, { useState } from 'react';
import { ArrowRight, Search, MapPin, Calendar, Clock, ChevronDown, Users } from 'lucide-react';
import { VIETNAM_LOCATIONS } from '../data/courts';

interface HeroProps {
  onSearchSubmit: (criteria: { city: string; district: string; date: string; time: string }) => void;
  onBookNowClick: () => void;
  onFindPartnerClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearchSubmit,
  onBookNowClick,
  onFindPartnerClick,
}) => {
  const [selectedCity, setSelectedCity] = useState('Hà Nội');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả các Quận');
  const [selectedDate, setSelectedDate] = useState('Hôm nay, 24 Th10');
  const [selectedTime, setSelectedTime] = useState('Bất kỳ lúc nào');

  const [openDistrictDropdown, setOpenDistrictDropdown] = useState(false);
  const [openDateDropdown, setOpenDateDropdown] = useState(false);
  const [openTimeDropdown, setOpenTimeDropdown] = useState(false);

  const datesList = [
    'Hôm nay, 24 Th10',
    'Ngày mai, 25 Th10',
    'Thứ Bảy, 26 Th10',
    'Chủ Nhật, 27 Th10',
    'Thứ Hai, 28 Th10',
    'Thứ Ba, 29 Th10',
  ];

  const timeSlotsList = [
    'Bất kỳ lúc nào',
    'Buổi sáng (06:00 - 11:00)',
    'Buổi chiều (13:00 - 17:00)',
    'Khung giờ vàng (17:00 - 22:00)',
    'Đêm muộn (21:00 - 23:30)',
  ];

  const handleSearch = () => {
    onSearchSubmit({
      city: selectedCity,
      district: selectedDistrict,
      date: selectedDate,
      time: selectedTime,
    });
  };

  return (
    <section id="hero-section" className="relative pt-12 pb-24 md:pt-18 md:pb-32 overflow-hidden">
      {/* Background Image with Dark Blue / Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src='/images/preview.webp'
          alt="Badminton Arena Arena Courts"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.45] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Soft Radial & Linear Atmospheric Vignettes */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent opacity-90" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Hero Title */}
        <h1
          id="hero-main-title"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold text-surface tracking-tight leading-[1.15] max-w-4xl drop-shadow-md"
        >
          Đập Tan Mọi Giới Hạn Với{' '}
          <span className="block mt-2 text-surface/90">
            Trận Đấu Hoàn Hảo
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          id="hero-subtitle"
          className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-100/90 max-w-4xl font-normal leading-relaxed text-balance drop-shadow-xs"
        >
          Đặt sân cầu lông chất lượng cao ngay lập tức. Dù bạn tập luyện cho giải đấu hay
          chỉ đánh giao lưu, hãy tìm một sân phù hợp và thống trị trận đấu.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Primary Gold CTA */}
          <button
            id="hero-book-now-btn"
            onClick={onBookNowClick}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary text-ink font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <span>Đặt sân ngay</span>
            <ArrowRight className="w-4 h-4 text-ink" />
          </button>

          {/* Secondary Ghost Frosted Glass CTA */}
          <button
            id="hero-find-partner-btn"
            onClick={onFindPartnerClick}
            className="flex items-center gap-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-ink font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <Users className="w-4 h-4 text-surface/90" />
            <span>Tìm bạn chơi</span>
          </button>
        </div>

        {/* Floating Quick Tìm kiếm Bar Container */}
        <div
          id="hero-quick-search-card"
          className="mt-12 sm:mt-16 w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-white/40 p-3 sm:p-4 relative text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center">
            {/* Field 1: Location / District */}
            <div className="relative md:col-span-4 p-2 sm:p-3 rounded-lg hover:bg-primary/5/60 transition-colors">
              <button
                type="button"
                id="search-field-location"
                onClick={() => {
                  setOpenDistrictDropdown(!openDistrictDropdown);
                  setOpenDateDropdown(false);
                  setOpenTimeDropdown(false);
                }}
                className="w-full flex items-start gap-3 text-left cursor-pointer focus:outline-hidden"
              >
                <MapPin className="w-5 h-5 text-ink/50 mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-ink/50">
                    KHU VỰC
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink truncate">
                      {selectedDistrict === 'Tất cả các Quận'
                        ? 'Bạn muốn chơi ở đâu?'
                        : selectedDistrict}
                    </span>
                    <ChevronDown className="w-4 h-4 text-ink/50 shrink-0 ml-1" />
                  </div>
                </div>
              </button>

              {/* District Dropdown Menu */}
              {openDistrictDropdown && (
                <div
                  id="district-dropdown-popover"
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-ink/10 py-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <p className="px-3 py-1.5 text-xs font-bold text-ink/50 uppercase tracking-wider">
                    Chọn Tỉnh / Quận in Hanoi
                  </p>
                  {(VIETNAM_LOCATIONS[selectedCity] ?? []).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDistrict(d);
                        setOpenDistrictDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between ${
                        selectedDistrict === d ? 'text-primary font-bold bg-primary/5' : 'text-ink'
                      }`}
                    >
                      <span>{d}</span>
                      {selectedDistrict === d && <span className="text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider for Desktop */}
            <div className="hidden md:block w-px h-10 bg-slate-200" />

            {/* Field 2: Date */}
            <div className="relative md:col-span-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5/60 transition-colors">
              <button
                type="button"
                id="search-field-date"
                onClick={() => {
                  setOpenDateDropdown(!openDateDropdown);
                  setOpenDistrictDropdown(false);
                  setOpenTimeDropdown(false);
                }}
                className="w-full flex items-start gap-3 text-left cursor-pointer focus:outline-hidden"
              >
                <Calendar className="w-5 h-5 text-ink/50 mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-ink/50">
                    NGÀY
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink truncate">
                      {selectedDate === '' ? 'Bạn dự định chơi khi nào?' : selectedDate}
                    </span>
                    <ChevronDown className="w-4 h-4 text-ink/50 shrink-0 ml-1" />
                  </div>
                </div>
              </button>

              {/* Date Dropdown Menu */}
              {openDateDropdown && (
                <div
                  id="date-dropdown-popover"
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-ink/10 py-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <p className="px-3 py-1.5 text-xs font-bold text-ink/50 uppercase tracking-wider">
                    Chọn Ngày Đặt
                  </p>
                  {datesList.map((dt) => (
                    <button
                      key={dt}
                      type="button"
                      onClick={() => {
                        setSelectedDate(dt);
                        setOpenDateDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between ${
                        selectedDate === dt ? 'text-primary font-bold bg-primary/5' : 'text-ink'
                      }`}
                    >
                      <span>{dt}</span>
                      {selectedDate === dt && <span className="text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider for Desktop */}
            <div className="hidden md:block w-px h-10 bg-slate-200" />

            {/* Field 3: Time */}
            <div className="relative md:col-span-3 p-2 sm:p-3 rounded-lg hover:bg-primary/5/60 transition-colors">
              <button
                type="button"
                id="search-field-time"
                onClick={() => {
                  setOpenTimeDropdown(!openTimeDropdown);
                  setOpenDistrictDropdown(false);
                  setOpenDateDropdown(false);
                }}
                className="w-full flex items-start gap-3 text-left cursor-pointer focus:outline-hidden"
              >
                <Clock className="w-5 h-5 text-ink/50 mt-1 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-ink/50">
                    GIỜ
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink truncate">
                      {selectedTime === '' ? 'Chọn khung giờ' : selectedTime}
                    </span>
                    <ChevronDown className="w-4 h-4 text-ink/50 shrink-0 ml-1" />
                  </div>
                </div>
              </button>

              {/* Time Dropdown Menu */}
              {openTimeDropdown && (
                <div
                  id="time-dropdown-popover"
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-ink/10 py-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <p className="px-3 py-1.5 text-xs font-bold text-ink/50 uppercase tracking-wider">
                    Preferred Session
                  </p>
                  {timeSlotsList.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setSelectedTime(t);
                        setOpenTimeDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between ${
                        selectedTime === t ? 'text-primary font-bold bg-primary/5' : 'text-ink'
                      }`}
                    >
                      <span>{t}</span>
                      {selectedTime === t && <span className="text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field 4: Tìm kiếm Button */}
            <div className="md:col-span-2 flex justify-center md:justify-end mt-4 md:mt-0">
              <button
                type="button"
                id="hero-search-submit-btn"
                onClick={handleSearch}
                className="w-full md:w-14 h-12 md:h-14 bg-primary hover:bg-secondary hover:text-ink text-surface text-base rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
                aria-label="Tìm kiếm courts"
              >
                <Search className="w-5 h-5 text-surface" />
                <span className="md:hidden ml-2 font-semibold text-sm">Tìm Sân</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


