import React, { useState } from 'react';
import { Users, Plus, Star, MapPin, Calendar, Clock, CheckCircle2, UserPlus, X, Filter, Search, Map, Phone } from 'lucide-react';
import { PartnerRequest, CourtFacility } from '../types';
import { INITIAL_PARTNER_REQUESTS, VIETNAM_LOCATIONS } from '../data/courts';

interface FindPartnerViewProps {
  courts: CourtFacility[];
  onBookCourtRedirect: (court: CourtFacility) => void;
}

export const FindPartnerView: React.FC<FindPartnerViewProps> = ({ courts, onBookCourtRedirect }) => {
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Hà Nội');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả các Quận');
  const [selectedSkill, setSelectedSkill] = useState('Mọi Trình Độ');
  const [showHostModal, setShowHostModal] = useState(false);
  const [joinedMatches, setJoinedMatches] = useState<string[]>([]);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Host Form State
  const [hostName, setHostName] = useState('');
  const [hostPhone, setHostPhone] = useState('');
  const [genderReq, setGenderReq] = useState('Bất kỳ');
  const [courtNumber, setCourtNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Người mới chơi (Trung bình yếu) (1.5 - 2.5)' | 'Trung bình (3.0 - 4.0)' | 'Khá - Giỏi (Nâng cao) (4.5+)'>('Trung bình (3.0 - 4.0)');
  const [matchType, setMatchType] = useState<'Đôi Nam' | 'Đôi Nam Nữ' | 'Men Đánh Đơn' | 'Casual Rally'>('Đôi Nam');
  const [facilityId, setFacilityId] = useState(courts[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [spotsNeeded, setSpotsNeeded] = useState(1);
  const [costPerPerson, setCostPerPerson] = useState('');
  const [notes, setNotes] = useState('');

  const skillOptions = ['Mọi Trình Độ', 'Người mới chơi (Trung bình yếu) (1.5 - 2.5)', 'Trung bình (3.0 - 4.0)', 'Khá - Giỏi (Nâng cao) (4.5+)'];

  React.useEffect(() => {
    fetch(`/backend/get_partner_requests.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const mappedRequests = data.data.map((dbReq: any) => ({
            id: 'pr-' + dbReq.id,
            hostName: dbReq.author_name || 'Người dùng ẩn danh',
            hostAvatar: '/images/25c7353614db742fe9114f39d9db0167.jpg',
            hostRating: 5.0,
            skillLevel: dbReq.required_level || 'Mọi Trình Độ',
            matchType: 'Đôi Nam',
            location: dbReq.court_location || 'Hà Nội',
            district: 'Tất cả các Quận', 
            courtFacility: dbReq.court_name || 'Hệ thống sân cầu lông',
            date: dbReq.play_date,
            time: `${dbReq.start_time.substring(0,5)} - ${dbReq.end_time.substring(0,5)}`,
            spotsNeeded: dbReq.spots_needed || 2,
            spotsFilled: dbReq.spots_filled || 1,
            costPerPerson: dbReq.cost_per_person || 'Thỏa thuận',
            notes: dbReq.note,
            status: dbReq.status,
            phone: dbReq.author_phone || 'Không công khai',
            genderReq: dbReq.gender_req || 'Bất kỳ',
            courtNumber: dbReq.court_number || '',
            joinedPlayers: [dbReq.author_name, ...(dbReq.participants?.map((p: any) => p.user_name) || [])],
            dbId: dbReq.id
          }));
          
          // Thêm dữ liệu giả phong phú
          const extraMocks = [
            { id: 'pr-m1', hostName: 'Thành Phạm', hostAvatar: '/images/preview (1).webp', hostRating: 4.8, skillLevel: 'Trung bình (3.0 - 4.0)', matchType: 'Đôi Nam Nữ', location: 'Cầu Giấy, Hà Nội', district: 'Cầu Giấy', courtFacility: 'Sân Cầu Lông Duy Hưng', date: 'Hôm nay, Oct 24', time: '19:00 - 21:00', spotsNeeded: 2, spotsFilled: 2, costPerPerson: '40.000 VND', notes: 'Cần tìm 1 nữ đánh lưới cứng', status: 'OPEN', joinedPlayers: ['Thành Phạm', 'Hoàng'], phone: '0981234567', genderReq: 'Nữ', courtNumber: 'Sân 3' },
            { id: 'pr-m2', hostName: 'Linh Nguyễn', hostAvatar: '/images/preview (3).webp', hostRating: 5.0, skillLevel: 'Khá - Giỏi (Nâng cao) (4.5+)', matchType: 'Đôi Nam', location: 'Thanh Xuân, Hà Nội', district: 'Thanh Xuân', courtFacility: 'Sân Hoàng Mai', date: 'Hôm nay, Oct 24', time: '20:00 - 22:00', spotsNeeded: 1, spotsFilled: 3, costPerPerson: '60.000 VND', notes: 'Giao lưu cường độ cao', status: 'OPEN', joinedPlayers: ['Linh Nguyễn', 'Tuấn', 'Hải'], phone: '0912233445', genderReq: 'Nam', courtNumber: 'Sân VIP 1' },
            { id: 'pr-m3', hostName: 'Quang Đại', hostAvatar: '/images/preview.webp', hostRating: 4.5, skillLevel: 'Người mới chơi (Trung bình yếu) (1.5 - 2.5)', matchType: 'Casual Rally', location: 'Đống Đa, Hà Nội', district: 'Đống Đa', courtFacility: 'Sân Đại Học Thủy Lợi', date: 'Ngày mai, Oct 25', time: '18:00 - 20:00', spotsNeeded: 3, spotsFilled: 1, costPerPerson: '30.000 VND', notes: 'Vui vẻ ra mồ hôi là chính', status: 'OPEN', joinedPlayers: ['Quang Đại'], phone: '0977889900', genderReq: 'Bất kỳ', courtNumber: 'Sân 5' }
          ];
          setPartnerRequests([...mappedRequests, ...extraMocks]);

        }
      })
      .catch(err => console.error('Lỗi lấy danh sách:', err));
  }, []);

  const filteredRequests = partnerRequests.filter((req) => {
    if (selectedDistrict !== 'Tất cả các Quận' && req.district !== selectedDistrict) return false;
    if (selectedSkill !== 'Mọi Trình Độ' && req.skillLevel !== selectedSkill) return false;
    if (searchQuery && !req.courtFacility.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleJoinMatch = (requestId: string, dbId?: number) => {
    if (joinedMatches.includes(requestId)) return;

    if (dbId) {
      // API call to join real match
      fetch(`/backend/join_matchmaking.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchmaking_id: dbId,
          user_name: 'Khách hàng', // Defaulting since we don't have auth state here
          user_phone: '0900000000'
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          updateUIAfterJoin(requestId);
        } else {
          alert('Lỗi: ' + data.message);
        }
      })
      .catch(err => console.error(err));
    } else {
      updateUIAfterJoin(requestId);
    }
  };

  const updateUIAfterJoin = (requestId: string) => {
    setPartnerRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId && req.spotsFilled < req.spotsNeeded) {
          return {
            ...req,
            spotsFilled: req.spotsFilled + 1,
            joinedPlayers: [...req.joinedPlayers, 'Bạn (Đã Tham Gia)'],
          };
        }
        return req;
      })
    );

    setJoinedMatches([...joinedMatches, requestId]);
    setFeedbackToast('Đăng ký tham gia thành công! Hệ thống đã gửi thông báo đến chủ phòng.');
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const facility = courts.find((c) => c.id === facilityId) || courts[0];

    // Lấy thời gian tách từ chuỗi "18:00 - 20:00"
    const timeParts = time.split(' - ');
    const startTimeStr = timeParts[0] ? `${timeParts[0]}:00` : '18:00:00';
    const endTimeStr = timeParts[1] ? `${timeParts[1]}:00` : '20:00:00';

    fetch(`/backend/create_partner_request.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1, // Tạm fix cứng user_id demo
        court_id: parseInt(String(facility.id).replace('court-', '')) || 1,
        play_date: new Date().toISOString().split('T')[0], // Lấy ngày hôm nay
        start_time: startTimeStr,
        end_time: endTimeStr,
        required_level: skillLevel,
        note: notes,
        contact_phone: phone,
        gender_req: genderReq,
        court_number: courtNumber,
        spots_needed: Number(spotsNeeded),
        cost_per_person: costPerPerson
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        const newReq: PartnerRequest = {
          id: 'pr-' + Date.now(),
          hostName: hostName || 'Player',
          hostAvatar: '/images/25c7353614db742fe9114f39d9db0167.jpg',
          hostRating: 5.0,
          skillLevel,
          matchType: matchType as any,
          location: facility.location,
          district: facility.district,
          courtFacility: facility.name,
          date,
          time,
          spotsNeeded: Number(spotsNeeded),
          spotsFilled: 1,
          costPerPerson,
          notes,
          status: 'OPEN',
          phone: hostPhone,
          genderReq,
          courtNumber,

          joinedPlayers: [hostName],
        };

        setPartnerRequests([newReq, ...partnerRequests]);
        setShowHostModal(false);
        setFeedbackToast('Yêu cầu tìm bạn chơi của bạn đã được đăng lên hệ thống!');
        setTimeout(() => setFeedbackToast(null), 4000);
      } else {
        alert("Lỗi: " + data.message);
      }
    })
    .catch(err => console.error("Lỗi đăng tin:", err));
  };

  return (
    <div id="find-partner-page" className="py-8 sm:py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {feedbackToast && (
          <div className="mb-6 p-4 rounded-xl bg-primary text-surface font-semibold text-sm shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-3">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              {feedbackToast}
            </span>
            <button onClick={() => setFeedbackToast(null)} className="text-ink/80 hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header with CTA to host */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              Cộng Đồng Giao Lưu & Tìm Bạn Chơi
            </h1>
            <p className="mt-2 text-sm sm:text-base text-ink/70">
              Bạn cần tìm đối thủ cọ xát hoặc thiếu người đánh đôi? Hãy tham gia một trận đấu đang mở hoặc tạo nhóm của riêng bạn.
            </p>
          </div>

          <button
            type="button"
            id="host-partner-btn"
            onClick={() => setShowHostModal(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary hover:text-ink text-surface text-base font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Kèo Giao Lưu</span>
          </button>
        </div>

        {/* District Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
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
              onClick={() => setSelectedDistrict('Tất cả các Quận')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDistrict === 'Tất cả các Quận'
                  ? 'bg-primary text-surface shadow-xs'
                  : 'bg-white text-ink/70 border border-ink/10 hover:bg-slate-50'
              }`}
            >
              Tất cả các Quận
            </button>
            {VIETNAM_LOCATIONS[selectedCity as keyof typeof VIETNAM_LOCATIONS]?.map((district) => (
              <button
                key={district}
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

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-ink/10 shadow-xs mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Tìm theo tên sân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs font-semibold focus:outline-none w-32"
            />
          </div>

          {/* Skill selector */}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-white border border-ink/10 text-xs font-semibold text-ink rounded-lg px-3 py-2 focus:outline-hidden focus:border-primary cursor-pointer"
          >
            {skillOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <span className="text-xs text-ink/50 ml-auto">
            {filteredRequests.length} nhóm đang mở
          </span>
        </div>

        {/* Partner Request Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredRequests.map((req) => {
            const isJoined = joinedMatches.includes(req.id);
            const spotsRemaining = Math.max(0, req.spotsNeeded - req.spotsFilled);
            const isFull = spotsRemaining === 0;

            return (
              <div
                key={req.id}
                id={`partner-card-${req.id}`}
                className="bg-white rounded-2xl border border-ink/10 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Host Info Header */}
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-ink/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.hostAvatar}
                        alt={req.hostName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                      />
                      <div>
                        <h3 className="font-bold text-base text-ink flex items-center gap-1.5">
                          {req.hostName}
                          <span className="flex items-center text-xs text-secondary font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-secondary" /> {req.hostRating}
                          </span>
                        </h3>
                        <p className="text-xs text-primary font-semibold">{req.matchType}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-ink/10">
                      {req.skillLevel}
                    </span>
                  </div>

                  {/* Match Schedule Details */}
                  <div className="py-4 space-y-2 text-xs text-ink/80">
                    
                    {/* Phí, Nam/Nữ, Sân */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {req.costPerPerson && (
                        <span className="px-2 py-1 rounded-md bg-earth/30 text-ink/70 text-xs font-semibold">
                          💰 {req.costPerPerson}
                        </span>
                      )}
                      {req.genderReq && req.genderReq !== 'Bất kỳ' && (
                        <span className="px-2 py-1 rounded-md bg-earth-accent/10 text-earth-accent text-xs font-semibold">
                          🚻 Nam/Nữ: {req.genderReq}
                        </span>
                      )}
                      {req.courtNumber && (
                        <span className="px-2 py-1 rounded-md bg-earth-primary/10 text-earth-primary text-xs font-semibold">
                          📍 {req.courtNumber}
                        </span>
                      )}
                      {req.phone && (
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                          📞 {req.phone}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-ink/50 shrink-0" />
                      <span className="font-bold text-ink">{req.courtFacility}</span>
                      <span className="text-ink/50">({req.district})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-ink/50 shrink-0" />
                      <span>{req.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ink/50 shrink-0" />
                      <span>{req.time}</span>
                    </div>

                    {req.notes && (
                      <p className="mt-2.5 p-2.5 bg-white rounded-lg text-xs text-ink/70 italic">
                        &ldquo;{req.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer with spots, share cost, and join button */}
                <div className="pt-4 border-t border-ink/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-ink/50">
                      CHIA SẺ CHI PHÍ
                    </span>
                    <span className="text-sm font-extrabold text-primary">
                      {req.costPerPerson}
                      <span className="text-xs font-normal text-ink/60"> / người</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleJoinMatch(req.id, (req as any).dbId)}
                    disabled={isFull || isJoined}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${isFull
                      ? 'bg-ink/5 text-ink/40 cursor-not-allowed'
                      : isJoined
                        ? 'bg-earth-primary text-white cursor-default'
                        : 'bg-primary hover:bg-secondary hover:text-ink text-surface shadow-md transform hover:-translate-y-0.5 cursor-pointer'
                      }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Đã tham gia</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Tham gia (còn {spotsRemaining} chỗ)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal to Post a Partner Request */}
        {showHostModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-ink/10 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="bg-ink text-surface text-base p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Tạo Yêu Cầu Tìm Bạn Chơi</h3>
                  <p className="text-xs text-zinc-100">Tìm bạn chơi cầu lông tại Hà Nội</p>
                </div>
                <button
                  onClick={() => setShowHostModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-ink flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRequest} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                    Tên Hiển Thị Của Bạn
                  </label>
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-ink/10 rounded-lg focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Trình Độ
                    </label>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                    >
                      <option value="Người mới chơi (Trung bình yếu) (1.5 - 2.5)">Người mới chơi (Trung bình yếu) (1.5 - 2.5)</option>
                      <option value="Trung bình (3.0 - 4.0)">Trung bình (3.0 - 4.0)</option>
                      <option value="Khá - Giỏi (Nâng cao) (4.5+)">Khá - Giỏi (Nâng cao) (4.5+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Giới Tính
                    </label>
                    <select
                      value={genderReq}
                      onChange={(e) => setGenderReq(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                    >
                      <option value="Bất kỳ">Bất kỳ</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Số Điện Thoại Liên Hệ
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg focus:outline-hidden focus:border-primary"
                      placeholder="0912345678"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Loại Hình Giao Lưu
                    </label>
                    <select
                      value={matchType}
                      onChange={(e) => setMatchType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                    >
                      <option value="Đôi Nam">Đôi Nam</option>
                      <option value="Đôi Nam Nữ">Đôi Nam Nữ</option>
                      <option value="Men Đánh Đơn">Men Đánh Đơn</option>
                      <option value="Casual Rally">Casual Rally</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                    Sân Cầu Lông
                  </label>
                  <select
                    value={facilityId}
                    onChange={(e) => setFacilityId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Sân Số (Không bắt buộc)
                    </label>
                    <input
                      type="text"
                      value={courtNumber}
                      onChange={(e) => setCourtNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                      placeholder="VD: Sân 3"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Ngày
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                      placeholder="Ví dụ: Ngày mai, Oct 25"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Khung Giờ
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                      placeholder="Ví dụ: 18:00 - 20:00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Số người cần tìm
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={spotsNeeded}
                      onChange={(e) => setSpotsNeeded(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                      Phí chia sẻ (VND)
                    </label>
                    <input
                      type="text"
                      value={costPerPerson}
                      onChange={(e) => setCostPerPerson(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                      placeholder="e.g. 50.000 VND"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-ink/60 mb-1">
                    Ghi Chú & Lối Chơi
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-ink/10 rounded-lg"
                    placeholder="Ghi chú thêm về loại cầu, yêu cầu đối thủ..."
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowHostModal(false)}
                    className="flex-1 py-2.5 text-xs font-bold text-ink/70 border border-ink/20 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold bg-primary text-surface rounded-xl hover:bg-secondary hover:text-ink shadow-xs cursor-pointer"
                  >
                    Đăng Yêu Cầu Giao Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



