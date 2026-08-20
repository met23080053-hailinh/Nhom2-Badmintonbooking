export type CourtStatus = 'ĐANG TRỐNG' | 'SẮP KÍN' | 'CHỈ CÒN VÀI CHỖ' | 'KÍN LỊCH';

export type SurfaceType = 'Taraflex BWF Pro' | 'Timber Parquet' | 'Synthetic PVC' | 'Anti-slip Rubber';

export interface CourtDetail {
  id: string;
  name: string;
  nameCourtNumber: string; // e.g. "Court 1", "Court 2"
  isAvailable: boolean;
  surface: SurfaceType;
  lightingLux: number; // e.g. 750 Lux
}

export interface CourtReview {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CourtFacility {
  id: string;
  name: string;
  city: string;
  location: string;
  district: string;
  rating: number;
  reviewCount: number;
  pricePerHour: number; // in VND
  formattedPrice: string; // e.g. "80.000 VND"
  statusBadge: CourtStatus;
  imageUrl: string;
  galleryImages: string[];
  description: string;
  amenities: string[];
  openingHours: string;
  totalCourts: number;
  availableCourtsCount: number;
  subCourts: CourtDetail[];
  reviews?: CourtReview[];
  featured?: boolean;
  phone: string;
  mapCoordinates?: { lat: number; lng: number };
}

export interface TimeSlot {
  id: string;
  time: string; // "06:00 - 07:00"
  period: 'morning' | 'afternoon' | 'evening';
  priceMultiplier: number;
  isPeak: boolean;
  isAvailable: boolean;
}

export interface EquipmentAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  quantity: number;
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  facilityId: string;
  facilityName: string;
  facilityLocation: string;
  facilityImage: string;
  courtNumber: string;
  date: string;
  timeSlots: string[];
  totalHours: number;
  totalAmount: number;
  formattedTotalAmount: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  playerName: string;
  playerPhone: string;
  playerEmail: string;
  addons: { name: string; quantity: number; price: number }[];
  paymentMethod: 'VietQR' | 'MoMo' | 'Pay at Court' | 'Wallet';
  createdAt: string;
  qrCodeSeed: string;
}

export interface PartnerRequest {
  id: string;
  hostName: string;
  hostAvatar: string;
  hostRating: number;
  skillLevel: 'Beginner (1.5 - 2.5)' | 'Intermediate (3.0 - 4.0)' | 'Advanced (4.5+)';
  matchType: 'Men Singles' | 'Women Singles' | 'Men Doubles' | 'Women Doubles' | 'Mixed Doubles' | 'Casual Rally';
  location: string;
  district: string;
  courtFacility: string;
  date: string;
  time: string;
  spotsNeeded: number;
  spotsFilled: number;
  costPerPerson: string;
  notes: string;
  status: 'OPEN' | 'FULL';
  joinedPlayers: string[];
  hostContact?: string;
  courtDetails?: string;
}

export interface FilterOptions {
  searchQuery: string;
  district: string;
  date: string;
  timePeriod: string;
  maxPrice: number;
  surfaceType: string;
  amenities: string[];
  minRating: number;
}


