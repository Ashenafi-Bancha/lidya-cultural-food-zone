export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
}

export interface Branch {
  id: string;
  name: string;
  label: string | null;
  address: string;
  phone: string;
  email: string | null;
  workingHours: string;
  note: string | null;
  imageUrl: string | null;
  capacity: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  tag: string | null;
  isAvailable: boolean;
  order: number;
  categoryId: string;
  branchId: string | null;
}

export interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  thumbUrl: string | null;
  span: string;
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED';
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}
