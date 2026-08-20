import React from 'react';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { CourtFacility } from '../types';

interface FeaturedCourtsProps {
  courts: CourtFacility[];
  onSelectCourt: (court: CourtFacility) => void;
  onViewAllClick: () => void;
}

export const FeaturedCourts: React.FC<FeaturedCourtsProps> = ({
  courts,
  onSelectCourt,
  onViewAllClick,
}) => {
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'ĐANG TRỐNG':
        return 'bg-primary text-surface';
      case 'SẮP KÍN':
        return 'bg-secondary text-ink';
      case 'CHỈ CÒN VÀI CHỖ':
        return 'bg-secondary text-ink';
      default:
        return 'bg-slate-600 text-ink';
    }
  };

  return (
    <section id="featured-courts-section" className="py-12 md:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 id="featured-courts-heading" className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Sân Cầu Lông Nổi Bật
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink/80 max-w-2xl">
              Khám phá các cơ sở hàng đầu được tuyển chọn với ánh sáng hoàn hảo, mặt sân cao cấp và điều kiện chơi tối ưu.
            </p>
          </div>

          <button
            id="view-all-courts-link"
            onClick={onViewAllClick}
            className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-primary hover:text-ink transition-colors cursor-pointer group shrink-0"
          >
            <span>Xem tất cả các sân</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div
              key={court.id}
              id={`court-card-${court.id}`}
              onClick={() => onSelectCourt(court)}
              className="bg-white rounded-2xl sm:rounded-[24px] border border-ink/5 overflow-hidden shadow-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col group transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Card Image Box with Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={court.imageUrl}
                  alt={court.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Rating Badge Top Right */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-ink">
                  <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                  <span>{court.rating.toFixed(1)}</span>
                </div>

                {/* Status Tag Overlay Bottom Left */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-xs shadow-xs ${getBadgeStyle(
                      court.statusBadge
                    )}`}
                  >
                    {court.statusBadge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-ink group-hover:text-primary transition-colors">
                    {court.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-ink/60 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ink/50 shrink-0" />
                    <span className="truncate">{court.location}</span>
                  </div>
                </div>

                {/* Price and Book Action */}
                <div className="mt-5 pt-3 border-t border-ink/10 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-ink/50">
                      GIÁ THUÊ
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-ink">
                      {court.formattedPrice}
                      <span className="text-xs font-normal text-ink/60">/giờ</span>
                    </span>
                  </div>

                  <button
                    id={`book-court-btn-${court.id}`}
                    onClick={() => onSelectCourt(court)}
                    className="bg-primary hover:bg-secondary hover:text-ink text-surface text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-300 shadow-md transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
