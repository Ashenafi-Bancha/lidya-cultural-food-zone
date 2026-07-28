export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
}

export interface Branch {
  id: string;
  name: string;
  nameAm?: string | null;
  label: string | null;
  labelAm?: string | null;
  address: string;
  phone: string;
  email: string | null;
  workingHours: string;
  workingHoursAm?: string | null;
  note: string | null;
  noteAm?: string | null;
  imageUrl: string | null;
  capacity: number;
}

export interface Category {
  id: string;
  name: string;
  nameAm?: string | null;
  order: number;
  parentId?: string | null;
  // Present on top-level categories returned by GET /categories.
  children?: Category[];
}

export interface MenuItem {
  id: string;
  name: string;
  nameAm?: string | null;
  description: string | null;
  descriptionAm?: string | null;
  price: string;
  imageUrl: string | null;
  tag: string | null;
  isAvailable: boolean;
  order: number;
  categoryId: string;
  branchId: string | null;
  // Included by GET /menus for filtering/display.
  category?: Category;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  titleAm?: string | null;
  description: string | null;
  descriptionAm?: string | null;
  imageUrl: string;
  thumbUrl: string | null;
  span: string;
  group?: string; // 'MOMENTS' | 'LIFE'
  alt: string | null;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  partySize: number;
  specialRequest: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED';
  branchId: string;
}

export type EventType =
  | 'WEDDING'
  | 'ENGAGEMENT'
  | 'HALL_RENTAL'
  | 'CATERING'
  | 'CORPORATE'
  | 'BIRTHDAY'
  | 'VIP'
  | 'VVIP'
  | 'OTHER';

export interface EventBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  serviceType: EventType;
  eventDate: string;
  guestCount: number | null;
  message: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED';
  branchId: string | null;
  branch?: Branch;
  createdAt?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  roleAm?: string | null;
  quote: string;
  quoteAm?: string | null;
  imageUrl: string | null;
  rating: number;
  order: number;
  isActive: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}
