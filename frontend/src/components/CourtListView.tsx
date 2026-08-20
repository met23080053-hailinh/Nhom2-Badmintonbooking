import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Filter, SlidersHorizontal, Check, Wind, Shield, Coffee, Wifi, Phone } from 'lucide-react';
import { CourtFacility } from '../types';
import { VIETNAM_LOCATIONS, AVAILABLE_AMENITIES } from '../data/courts';

interface CourtListViewProps {
  courts: CourtFacility[];
  onSelectCourt: (court: CourtFacility) => void;
  initialCity?: string;
  initialDistrict?: string;
  initialQuery?: string;
}

export const CourtListView: React.FC<CourtListViewProps> = ({
  courts,
  onSelectCourt,
  initialCity = 'Hà Nội',
  initialDistrict = 'Tất cả các Quận',
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedSurface, setSelectedSurface] = useState<string>('Tất cả mặt sân');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxGiá, setMaxGiá] = useState<number>(200000);

  const surfaceOptions = ['Tất cả mặt sân', 'Thảm Taraflex BWF', 'Sàn Gỗ', 'Sàn PVC'];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const filteredCourts = useMemo(() => {
    return courts
      .filter((court) => {
        // City & District filter
        if (court.city !== selectedCity) return false;
        if (selectedDistrict !== 'Tất cả các Quận' && court.district !== selectedDistrict) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = court.name.toLowerCase().includes(q);
          const matchesLoc = court.location.toLowerCase().includes(q);
          const matchesDesc = court.description.toLowerCase().includes(q);
          if (!matchesName && !matchesLoc && !matchesDesc) return false;
        }
        // Max price
        if (court.pricePerHour > maxGiá) {
          return false;
        }
        // Surface filter
        if (selectedSurface !== 'Tất cả mặt sân') {
          const hasSurface = court.subCourts.some((sc) => sc.surface === selectedSurface);
          if (!hasSurface) return false;
        }
        // Tiện ích
        if (selectedAmenities.length > 0) {
          const hasAllAmenities = selectedAmenities.every((a) => court.amenities.includes(a));
          if (!hasAllAmenities) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerHour - b.pricePerHour;
        if (sortBy === 'price-desc') return b.pricePerHour - a.pricePerHour;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [courts, selectedCity, selectedDistrict, searchQuery, maxGiá, selectedSurface, selectedAmenities, sortBy]);

  return (
    <div id="court-list-page" className="py-8 sm:py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Khám Phá Sân Cầu Lông
          </h1>
          <p className="mt-2 text-sm sm:text-base text-ink/70">
            So sánh các sân thể thao hàng đầu, xem tình trạng sân trống theo thời gian thực và đặt lịch ngay.
          </p>

          {/* Search bar & District quick chips */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-ink/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên sân, quận (vd: Thanh Xuân, Cầu Giấy), hoặc tên đường..."
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-ink/10 shadow-xs text-sm text-ink focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/50 hover:text-slate-600 cursor-pointer"
                >
                  Xóa
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-ink/10 text-sm text-ink rounded-xl px-4 py-3 shadow-xs focus:outline-hidden focus:border-primary cursor-pointer"
              >
                <option value="recommended">Nổi bật & Gợi ý</option>
                <option value="rating">Đánh giá cao (5.0★)</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* City & District Bộ lọc */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedDistrict('Tất cả các Quận');
              }}
              className="bg-white border border-ink/10 text-sm font-bold text-primary rounded-full px-4 py-1.5 shadow-xs focus:outline-none cursor-pointer"
            >
              {Object.keys(VIETNAM_LOCATIONS).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin w-full">
              <button
                type="button"
                onClick={() => setSelectedDistrict('Tất cả các Quận')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDistrict === 'Tất cả các Quận'
                    ? 'bg-primary text-surface shadow-xs'
                    : 'bg-white text-ink/70 border border-ink/10 hover:bg-slate-50'
                }`}
              >
                Tất cả các Quận
              </button>
              {VIETNAM_LOCATIONS[selectedCity]?.map((district) => (
                <button
                  key={district}
                  type="button"
                  onClick={() => setSelectedDistrict(district)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDistrict === district
                      ? 'bg-primary text-surface shadow-xs'
                      : 'bg-white text-ink/70 border border-ink/10 hover:bg-slate-50'
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar Bộ lọc + Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Filter Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-ink/10 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-ink/10 mb-4">
                <span className="font-bold text-sm text-ink flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-primary" /> Bộ lọc
                </span>
                {(selectedDistrict !== 'Tất cả các Quận' ||
                  selectedSurface !== 'Tất cả mặt sân' ||
                  selectedAmenities.length > 0 ||
                  maxGiá < 200000) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrict('Tất cả các Quận');
                      setSelectedSurface('Tất cả mặt sân');
                      setSelectedAmenities([]);
                      setMaxGiá(200000);
                      setSearchQuery('');
                    }}
                    className="text-xs text-primary hover:underline cursor-pointer font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              {/* Surface Type */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                  Loại Mặt Sân
                </label>
                <div className="space-y-1.5">
                  {surfaceOptions.map((surface) => (
                    <label
                      key={surface}
                      className="flex items-center gap-2 text-xs text-ink/80 cursor-pointer hover:text-primary"
                    >
                      <input
                        type="radio"
                        name="surface"
                        checked={selectedSurface === surface}
                        onChange={() => setSelectedSurface(surface)}
                        className="text-primary focus:ring-primary"
                      />
                      <span>{surface}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Hourly Rate */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink/60">
                    Giá tối đa / Giờ
                  </label>
                  <span className="text-xs font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN').format(maxGiá)} VND
                  </span>
                </div>
                <input
                  type="range"
                  min="60000"
                  max="200000"
                  step="10000"
                  value={maxGiá}
                  onChange={(e) => setMaxGiá(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Tiện ích */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                  Tiện ích
                </label>
                <div className="space-y-2">
                  {AVAILABLE_AMENITIES.slice(0, 5).map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-xs text-ink/80 cursor-pointer hover:text-primary"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded-sm text-primary focus:ring-primary"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Courts Grid */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm text-ink/60">
                Đang hiển thị <span className="font-bold text-ink">{filteredCourts.length}</span> cơ sở sân
              </p>
            </div>

            {filteredCourts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-ink/10 p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-ink/50 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-ink">Không tìm thấy sân nào phù hợp</h3>
                <p className="text-xs text-ink/60 mt-1 max-w-sm mx-auto">
                  Hãy thử điều chỉnh lại khu vực, mức giá hoặc các tiện ích để tìm được nhiều sân hơn.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDistrict('Tất cả các Quận');
                    setSelectedSurface('Tất cả mặt sân');
                    setSelectedAmenities([]);
                    setMaxGiá(200000);
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-primary/5 text-primary text-xs font-bold rounded-lg hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourts.map((court) => (
                  <div
                    key={court.id}
                    onClick={() => onSelectCourt(court)}
                    className="bg-white rounded-xl border border-ink/10 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col cursor-pointer group"
                  >
                    {/* Image Header */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <img
                        src={court.imageUrl}
                        alt={court.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold text-ink">
                        <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                        <span>{court.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-ink/50">({court.reviewCount})</span>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-xs shadow-xs bg-primary text-surface">
                          {court.availableCourtsCount} / {court.totalCourts} Sân Trống
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-lg text-ink">
                              {court.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-ink/60 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-ink/50 shrink-0" />
                              <span className="truncate">{court.location}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-ink/70 mt-3 line-clamp-2 leading-relaxed">
                          {court.description}
                        </p>

                        {/* Tiện ích Tags */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {court.amenities.slice(0, 3).map((a) => (
                            <span
                              key={a}
                              className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-sm font-medium"
                            >
                              {a}
                            </span>
                          ))}
                          {court.amenities.length > 3 && (
                            <span className="text-[10px] text-ink/50 px-1 py-0.5">
                              +{court.amenities.length - 3} khác
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Giá and Book Action */}
                      <div className="mt-5 pt-3 border-t border-ink/10 flex items-center justify-between">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-ink/50">
                            GIÁ THEO GIỜ
                          </span>
                          <span className="text-base font-extrabold text-ink">
                            {court.formattedGiá}
                            <span className="text-xs font-normal text-ink/60">/giờ</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectCourt(court)}
                          className="bg-primary hover:bg-secondary hover:text-ink text-surface text-base font-bold text-xs sm:text-sm px-5 py-2 rounded-lg transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
                        >
                          Đặt Sân
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
