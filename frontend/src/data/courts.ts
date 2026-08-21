import { CourtFacility, PartnerRequest } from '../types';

export const VIETNAM_LOCATIONS: Record<string, string[]> = {
  'Hà Nội': ['Cầu Giấy', 'Thanh Xuân', 'Đống Đa', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Hà Đông'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Tân Bình', 'Bình Thạnh'],
  'Đà Nẵng': ['Hải Châu', 'Sơn Trà', 'Thanh Khê', 'Ngũ Hành Sơn']
};

export const AVAILABLE_AMENITIES = [
  'Bãi đỗ xe',
  'Wifi',
  'Phòng thay đồ',
  'Quán Cafe',
  'Cửa hàng',
];

export const STANDARD_TIME_SLOTS = [
  { id: 'ts-06', time: '06:00 - 07:00', period: 'morning', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-07', time: '07:00 - 08:00', period: 'morning', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-08', time: '08:00 - 09:00', period: 'morning', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-09', time: '09:00 - 10:00', period: 'morning', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-10', time: '10:00 - 11:00', period: 'morning', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-11', time: '11:00 - 12:00', period: 'morning', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-12', time: '12:00 - 13:00', period: 'afternoon', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-13', time: '13:00 - 14:00', period: 'afternoon', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-14', time: '14:00 - 15:00', period: 'afternoon', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-15', time: '15:00 - 16:00', period: 'afternoon', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-16', time: '16:00 - 17:00', period: 'afternoon', priceMultiplier: 1.0, isPeak: false, isAvailable: true },
  { id: 'ts-17', time: '17:00 - 18:00', period: 'evening', priceMultiplier: 1.2, isPeak: true, isAvailable: true },
  { id: 'ts-18', time: '18:00 - 19:00', period: 'evening', priceMultiplier: 1.2, isPeak: true, isAvailable: true },
  { id: 'ts-19', time: '19:00 - 20:00', period: 'evening', priceMultiplier: 1.2, isPeak: true, isAvailable: false },
  { id: 'ts-20', time: '20:00 - 21:00', period: 'evening', priceMultiplier: 1.2, isPeak: true, isAvailable: true },
  { id: 'ts-21', time: '21:00 - 22:00', period: 'evening', priceMultiplier: 1.2, isPeak: true, isAvailable: true },
];

export const EQUIPMENT_OPTIONS = [
  { id: 'eq-1', name: 'Vợt cầu lông', description: 'Vợt tiêu chuẩn', price: 20000, formattedPrice: '20.000 VNĐ', quantity: 0 },
  { id: 'eq-2', name: 'Ống cầu', description: '12 quả', price: 180000, formattedPrice: '180.000 VNĐ', quantity: 0 },
  { id: 'eq-3', name: 'Giày cầu lông', description: 'Nhiều size', price: 50000, formattedPrice: '50.000 VNĐ', quantity: 0 }
];

