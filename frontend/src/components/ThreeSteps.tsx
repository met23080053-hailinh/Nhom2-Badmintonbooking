import React from 'react';
import { Search, Calendar, Award } from 'lucide-react';

export const ThreeSteps: React.FC = () => {
  return (
    <section id="how-it-works-section" className="py-16 md:py-24 bg-primary/5/70 border-t border-b border-ink/10/60 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtitle Eyebrow Label */}
        <span
          id="steps-category-label"
          className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-primary"
        >
          QUY TRÌNH ĐƠN GIẢN
        </span>

        {/* Section Heading */}
        <h2
          id="steps-main-heading"
          className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink tracking-tight"
        >
          Sẵn sàng ra sân chỉ với 3 bước
        </h2>

        {/* 3 Step Cards with connecting line */}
        <div className="mt-14 sm:mt-18 relative">
          {/* Connecting Line (Desktop) */}
          <div
            className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-ink/20 -z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {/* Step 1 */}
            <div id="step-1-card" className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-md border border-ink/10 flex items-center justify-center text-primary transform hover:scale-105 transition-transform">
                  <Search className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
                </div>
                {/* Step Number Badge */}
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-surface text-xs font-bold flex items-center justify-center shadow-md">
                  1
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-ink">
                Tìm Sân
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-ink/70 max-w-xs leading-relaxed">
                Tìm kiếm theo khu vực, ngày và giờ để chọn sân đấu phù hợp nhất cho bạn.
              </p>
            </div>

            {/* Step 2 */}
            <div id="step-2-card" className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-md border border-ink/10 flex items-center justify-center text-primary transform hover:scale-105 transition-transform">
                  <Calendar className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2]" />
                </div>
                {/* Step Number Badge */}
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-surface text-xs font-bold flex items-center justify-center shadow-md">
                  2
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-ink">
                Đặt Sân Nhanh Chóng
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-ink/70 max-w-xs leading-relaxed">
                Chọn khung giờ và hoàn tất đặt sân một cách an toàn chỉ trong vài giây.
              </p>
            </div>

            {/* Step 3 */}
            <div id="step-3-card" className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-md border border-ink/10 flex items-center justify-center text-primary transform hover:scale-105 transition-transform">
                  {/* Racket Icon */}
                  <svg
                    className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="15" cy="9" r="6" />
                    <line x1="9.5" y1="14.5" x2="3" y2="21" />
                    <line x1="12" y1="6" x2="18" y2="12" />
                    <line x1="12" y1="12" x2="18" y2="6" />
                  </svg>
                </div>
                {/* Step Number Badge */}
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-surface text-xs font-bold flex items-center justify-center shadow-md">
                  3
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-ink">
                Tận Hưởng Trận Đấu
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-ink/70 max-w-xs leading-relaxed">
                Đến sân, xuất trình mã xác nhận đặt sân điện tử và bắt đầu trận đấu của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



