
export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  role: UserRole;
  password?: string; // specific for admin login
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string; // e.g., "30 mins"
  image: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  userAddress: string; // Captured at time of booking
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  statusNote?: string; // Custom message from Admin (e.g., "Wait 15 mins")
  timestamp: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  userAddress: string; // Captured at time of order
  items: CartItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  statusNote?: string; // Custom message from Admin (e.g., "On the way")
  date: string;
  timestamp: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string; // Optional user photo
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
  image?: string; // Fallback
  name?: string;       // New: Customer Name / Title
  serviceName?: string; // New: Service performed
  date?: string;       // New: Date of service
  description?: string;// New: Detailed description
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountCode: string; // e.g., "GOLD20"
  discountValue: string; // e.g., "20% OFF" - kept for fallback/text
  validUntil: string;
  image: string;
  originalPrice?: number; // New: For strikethrough
  finalPrice?: number;   // New: For display
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  description?: string; // Optional if needed for backward compatibility
}

export interface CustomPage {
  id: string;
  title: string;
  content: string;
}

export interface SiteConfig {
  salonName: string;
  tagline: string;
  logoUrl: string; // New: Customizable Logo
  heroImageUrl: string; // New: Customizable Hero Background
  contactNumber: string;
  email: string;
  address: string;
  founderName: string;
  founderImageUrl: string; // New: Customizable Founder Image
  themeColor: 'GOLD' | 'SILVER' | 'ROSE';
  qrCodeUrl: string; // URL for Payment QR
  upiId: string; // New: UPI ID for deep links
  missionStatement: string;
  promoBannerText: string;
  socialLinks: {
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}