
import { SiteConfig, Service, Product, TeamMember, GalleryItem, Offer } from './types';

export const ADMIN_MOBILE = "9110111970";

export const INITIAL_CONFIG: SiteConfig = {
  salonName: "Lotoria Beauty Salon",
  tagline: "Home Beauty Service",
  logoUrl: "https://glamorous-turquoise-h1abn2tbzk-4s4mf01nhj.edgeone.dev/1000012257-removebg-preview_imresizer.png", 
  heroImageUrl: "https://picsum.photos/id/431/1920/1080",
  contactNumber: "8210667364",
  email: "buylotoria@gmail.com",
  address: "Kanpur, India",
  founderName: "Aryan Kumar",
  founderImageUrl: "https://img.sanishtech.com/u/5ad7847347e2925e939b1e6c81a43f5c.jpg",
  themeColor: 'GOLD',
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=buyfuturemart@okicici&pn=LotoriaSalon", 
  upiId: "buyfuturemart@okicici",
  missionStatement: "To provide luxury beauty services at your doorstep with premium products.",
  promoBannerText: "Grand Opening Offer: 20% OFF on all Facial Services!",
  socialLinks: {
    whatsapp: "https://whatsapp.com/channel/0029VbBFj097IUYSac2k7O0U",
    instagram: "https://www.instagram.com/_lotoria?igsh=ZnI2bTZocW0zNHow",
    facebook: "https://www.facebook.com/share/1acgbkUrSL/"
  }
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Luxury Gold Facial',
    category: 'Facial',
    price: 1499,
    duration: '60 mins',
    image: 'https://picsum.photos/id/1011/400/300',
    description: 'Premium gold radiance facial for glowing skin.'
  },
  {
    id: 's2',
    name: 'Bridal Makeup',
    category: 'Makeup',
    price: 15000,
    duration: '180 mins',
    image: 'https://picsum.photos/id/338/400/300',
    description: 'Complete bridal makeover by expert artists.'
  },
  {
    id: 's3',
    name: 'Hair Spa',
    category: 'Hair',
    price: 999,
    duration: '45 mins',
    image: 'https://picsum.photos/id/823/400/300',
    description: 'Deep conditioning spa for healthy hair.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Lotoria Glow Serum',
    price: 599,
    category: 'Skincare',
    image: 'https://picsum.photos/id/21/300/300',
    description: 'Vitamin C enriched serum for daily use.',
    stock: 50
  },
  {
    id: 'p2',
    name: 'Matte Lipstick Kit',
    price: 1200,
    category: 'Makeup',
    image: 'https://picsum.photos/id/360/300/300',
    description: 'Set of 3 long-lasting matte lipsticks.',
    stock: 20
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 't1',
    name: 'Aryan Kumar',
    role: 'Founder & Lead Stylist',
    bio: 'With over 10 years of experience, Aryan leads Lotoria with a vision of luxury at home.',
    image: 'https://img.sanishtech.com/u/5ad7847347e2925e939b1e6c81a43f5c.jpg'
  },
  {
    id: 't_jyoti',
    name: 'Jyoti',
    role: 'Co-Founder',
    bio: 'Dedicated Co-Founder ensuring the best beauty standards and customer satisfaction.',
    image: 'https://img.sanishtech.com/u/8ba608b575404233c6945be3c5c96aff.jpg'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { 
    id: 'g1', 
    imageUrl: 'https://picsum.photos/id/1027/400/400', 
    caption: 'Bridal Look 2024', 
    category: 'Makeup',
    name: 'Sneha Verma',
    serviceName: 'Bridal HD Makeup',
    date: '2024-01-15',
    description: 'Complete bridal package with airbrush makeup and hair styling.'
  },
  { 
    id: 'g2', 
    imageUrl: 'https://picsum.photos/id/64/400/400', 
    caption: 'Hair Transformation', 
    category: 'Hair',
    name: 'Anjali Gupta',
    serviceName: 'Keratin Treatment',
    date: '2024-02-10',
    description: 'Smooth and silky hair transformation using premium products.'
  },
  { 
    id: 'g3', 
    imageUrl: 'https://picsum.photos/id/129/400/400', 
    caption: 'Relaxing Spa', 
    category: 'Spa',
    name: 'Rohan Mehta',
    serviceName: 'Deep Tissue Massage',
    date: '2024-03-05',
    description: 'Relaxing full body spa session for stress relief.'
  },
  { 
    id: 'g4', 
    imageUrl: 'https://picsum.photos/id/399/400/400', 
    caption: 'Nail Art', 
    category: 'Nails',
    name: 'Kavita Singh',
    serviceName: 'Gel Nail Extensions',
    date: '2024-03-20',
    description: 'Customized nail art design for a special occasion.'
  },
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'o1',
    title: 'Bridal Glow Package',
    description: 'Complete pre-bridal package including Gold Facial, Waxing, and Manicure/Pedicure.',
    discountCode: 'BRIDE20',
    discountValue: '40% OFF',
    validUntil: '2025-12-31',
    image: 'https://picsum.photos/id/835/400/300',
    originalPrice: 12000,
    finalPrice: 6999
  },
  {
    id: 'o2',
    title: 'Weekend Spa Bliss',
    description: 'Relax with our premium hair spa and cleanup combo.',
    discountCode: 'SPA50',
    discountValue: '50% OFF',
    validUntil: '2024-12-31',
    image: 'https://picsum.photos/id/429/400/300',
    originalPrice: 2500,
    finalPrice: 1249
  }
];

export const INITIAL_FAQS = [
  { 
    question: "Do you provide home services?", 
    answer: "Yes, Lotoria brings the complete luxury salon experience to your doorstep in Kanpur. Our experts carry all necessary equipment and products." 
  },
  { 
    question: "What products do you use?", 
    answer: "We use only premium, international brands like L'Oreal, MAC, O3+, and our exclusive Lotoria organic range to ensure safety and glow." 
  },
  { 
    question: "How do I pay?", 
    answer: "You can pay securely via UPI (GPay/PhonePe/Paytm) directly through the app when you book your appointment." 
  },
  { 
    question: "Are your professionals vaccinated?", 
    answer: "Yes, safety is our priority. All our stylists are fully vaccinated and follow strict hygiene protocols including masks and sanitization." 
  }
];