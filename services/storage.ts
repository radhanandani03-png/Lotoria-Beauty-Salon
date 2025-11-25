import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  onSnapshot, 
  writeBatch,
  query,
  getDocs
} from "firebase/firestore";
import { db } from './firebase';
import { User, Service, Product, Booking, Review, SiteConfig, TeamMember, GalleryItem, Offer, Order, CustomPage } from '../types';
import { INITIAL_CONFIG, INITIAL_SERVICES, INITIAL_PRODUCTS, ADMIN_MOBILE, INITIAL_TEAM, INITIAL_GALLERY, INITIAL_OFFERS } from '../constants';

// --- Local Cache (Keeps app fast while syncing) ---
let cache: {
  config: SiteConfig;
  services: Service[];
  products: Product[];
  team: TeamMember[];
  gallery: GalleryItem[];
  offers: Offer[];
  pages: CustomPage[];
  bookings: Booking[];
  orders: Order[];
  reviews: Review[];
  users: User[];
} = {
  config: INITIAL_CONFIG,
  services: [],
  products: [],
  team: [],
  gallery: [],
  offers: [],
  pages: [],
  bookings: [],
  orders: [],
  reviews: [],
  users: []
};

// --- Initialization Logic ---
const COLLECTIONS = {
  CONFIG: 'config',
  SERVICES: 'services',
  PRODUCTS: 'products',
  TEAM: 'team',
  GALLERY: 'gallery',
  OFFERS: 'offers',
  PAGES: 'pages',
  BOOKINGS: 'bookings',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  USERS: 'users'
};

// Check if DB is empty and upload defaults
const checkAndUploadDefaults = async () => {
  try {
    const configSnapshot = await getDocs(collection(db, COLLECTIONS.CONFIG));
    if (configSnapshot.empty) {
      console.log("Database empty. Uploading initial data...");
      const batch = writeBatch(db);

      // Config
      batch.set(doc(db, COLLECTIONS.CONFIG, 'main'), INITIAL_CONFIG);

      // Default Admin
      const admin: User = {
        id: 'admin_01',
        name: 'Aryan Kumar',
        mobile: ADMIN_MOBILE,
        email: 'buylotoria@gmail.com',
        address: 'Kanpur, India',
        role: 'ADMIN',
        password: 'Jyoti05'
      };
      batch.set(doc(db, COLLECTIONS.USERS, admin.id), admin);

      // Initial Data Arrays
      INITIAL_SERVICES.forEach(s => batch.set(doc(db, COLLECTIONS.SERVICES, s.id), s));
      INITIAL_PRODUCTS.forEach(p => batch.set(doc(db, COLLECTIONS.PRODUCTS, p.id), p));
      INITIAL_TEAM.forEach(t => batch.set(doc(db, COLLECTIONS.TEAM, t.id), t));
      INITIAL_GALLERY.forEach(g => batch.set(doc(db, COLLECTIONS.GALLERY, g.id), g));
      INITIAL_OFFERS.forEach(o => batch.set(doc(db, COLLECTIONS.OFFERS, o.id), o));

      await batch.commit();
      console.log("Initial data uploaded successfully.");
    }
  } catch (e) {
    console.error("Error initializing defaults:", e);
  }
};

// --- Real-time Subscription ---
export const subscribeToData = (onUpdate: () => void) => {
  // Run initialization check first
  checkAndUploadDefaults();

  const unsubscribers: (() => void)[] = [];

  const subscribe = (colName: string, cacheKey: keyof typeof cache, isSingleDoc = false) => {
    const q = collection(db, colName);
    return onSnapshot(q, (snapshot) => {
      if (isSingleDoc) {
        snapshot.forEach(doc => {
          // @ts-ignore
          cache[cacheKey] = { ...INITIAL_CONFIG, ...doc.data() };
        });
      } else {
        const data: any[] = [];
        snapshot.forEach(doc => data.push(doc.data()));
        // @ts-ignore
        cache[cacheKey] = data;
      }
      onUpdate();
    });
  };

  unsubscribers.push(subscribe(COLLECTIONS.CONFIG, 'config', true));
  unsubscribers.push(subscribe(COLLECTIONS.SERVICES, 'services'));
  unsubscribers.push(subscribe(COLLECTIONS.PRODUCTS, 'products'));
  unsubscribers.push(subscribe(COLLECTIONS.TEAM, 'team'));
  unsubscribers.push(subscribe(COLLECTIONS.GALLERY, 'gallery'));
  unsubscribers.push(subscribe(COLLECTIONS.OFFERS, 'offers'));
  unsubscribers.push(subscribe(COLLECTIONS.PAGES, 'pages'));
  unsubscribers.push(subscribe(COLLECTIONS.BOOKINGS, 'bookings'));
  unsubscribers.push(subscribe(COLLECTIONS.ORDERS, 'orders'));
  unsubscribers.push(subscribe(COLLECTIONS.REVIEWS, 'reviews'));
  unsubscribers.push(subscribe(COLLECTIONS.USERS, 'users'));

  return () => unsubscribers.forEach(unsub => unsub());
};

// --- Getters (Read from Cache) ---
export const getSiteConfig = (): SiteConfig => cache.config;
export const getServices = (): Service[] => cache.services;
export const getProducts = (): Product[] => cache.products;
export const getTeam = (): TeamMember[] => cache.team;
export const getGallery = (): GalleryItem[] => cache.gallery;
export const getOffers = (): Offer[] => cache.offers;
export const getCustomPages = (): CustomPage[] => cache.pages;
export const getBookings = (): Booking[] => cache.bookings;
export const getOrders = (): Order[] => cache.orders;
export const getReviews = (): Review[] => cache.reviews;
export const getUsers = (): User[] => cache.users;

export const loginUser = (mobile: string): User | null => {
  return cache.users.find(u => u.mobile === mobile) || null;
};

// --- Setters (Write to Firebase) ---

// Generic Helper
const saveData = async (col: string, id: string, data: any) => {
  try {
    await setDoc(doc(db, col, id), data);
  } catch (e) {
    console.error("Error saving data:", e);
    alert("Could not save data. Check internet connection.");
  }
};

const deleteData = async (col: string, id: string) => {
  try {
    await deleteDoc(doc(db, col, id));
  } catch (e) {
    console.error("Error deleting:", e);
  }
};

export const updateSiteConfig = (config: SiteConfig) => saveData(COLLECTIONS.CONFIG, 'main', config);

// For arrays, we now save individual documents, so the arguments change slightly in usage but we keep signature compatible where possible
// Actually, for AdminPanel convenience, we usually pass the whole array. 
// BUT Firebase works best with individual docs. 
// To keep App.tsx compatible, we will detect if it's an Add or Delete based on array diff, OR simpler: 
// We will just expose specific add/delete methods used by AdminPanel.

// Overwriting the array-based save functions to handle differences:
export const saveServices = (services: Service[]) => {
  // Sync logic: find diffs or just overwrite all? 
  // For simplicity in this migration: We iterate and set. 
  // Ideally, App.tsx should call addService / deleteService.
  // To fix compatibility without rewriting App.tsx entirely, we'll implement a smart sync or accept that `saveServices` expects the FULL list.
  // Since App.tsx passes the full list after modification:
  services.forEach(s => saveData(COLLECTIONS.SERVICES, s.id, s));
  
  // Handle deletions: Find IDs in cache not in new list
  const newIds = new Set(services.map(s => s.id));
  cache.services.forEach(s => {
    if (!newIds.has(s.id)) deleteData(COLLECTIONS.SERVICES, s.id);
  });
};

export const saveProducts = (products: Product[]) => {
  products.forEach(p => saveData(COLLECTIONS.PRODUCTS, p.id, p));
  const newIds = new Set(products.map(p => p.id));
  cache.products.forEach(p => { if (!newIds.has(p.id)) deleteData(COLLECTIONS.PRODUCTS, p.id); });
};

export const saveTeam = (team: TeamMember[]) => {
  team.forEach(t => saveData(COLLECTIONS.TEAM, t.id, t));
  const newIds = new Set(team.map(t => t.id));
  cache.team.forEach(t => { if (!newIds.has(t.id)) deleteData(COLLECTIONS.TEAM, t.id); });
};

export const saveGallery = (items: GalleryItem[]) => {
  items.forEach(i => saveData(COLLECTIONS.GALLERY, i.id, i));
  const newIds = new Set(items.map(i => i.id));
  cache.gallery.forEach(i => { if (!newIds.has(i.id)) deleteData(COLLECTIONS.GALLERY, i.id); });
};

export const saveOffers = (offers: Offer[]) => {
  offers.forEach(o => saveData(COLLECTIONS.OFFERS, o.id, o));
  const newIds = new Set(offers.map(o => o.id));
  cache.offers.forEach(o => { if (!newIds.has(o.id)) deleteData(COLLECTIONS.OFFERS, o.id); });
};

export const saveCustomPages = (pages: CustomPage[]) => {
  pages.forEach(p => saveData(COLLECTIONS.PAGES, p.id, p));
  const newIds = new Set(pages.map(p => p.id));
  cache.pages.forEach(p => { if (!newIds.has(p.id)) deleteData(COLLECTIONS.PAGES, p.id); });
};

export const saveReviews = (reviews: Review[]) => {
    reviews.forEach(r => saveData(COLLECTIONS.REVIEWS, r.id, r));
    const newIds = new Set(reviews.map(r => r.id));
    cache.reviews.forEach(r => { if (!newIds.has(r.id)) deleteData(COLLECTIONS.REVIEWS, r.id); });
};

// Bookings & Orders (Additive only usually)
export const addBooking = (booking: Booking) => saveData(COLLECTIONS.BOOKINGS, booking.id, booking);
export const updateBookingStatus = (id: string, status: Booking['status']) => {
  const booking = cache.bookings.find(b => b.id === id);
  if (booking) saveData(COLLECTIONS.BOOKINGS, id, { ...booking, status });
};
export const updateBookingNote = (id: string, note: string) => {
  const booking = cache.bookings.find(b => b.id === id);
  if (booking) saveData(COLLECTIONS.BOOKINGS, id, { ...booking, statusNote: note });
};

export const addOrder = (order: Order) => saveData(COLLECTIONS.ORDERS, order.id, order);
export const updateOrderStatus = (id: string, status: Order['status']) => {
  const order = cache.orders.find(o => o.id === id);
  if (order) saveData(COLLECTIONS.ORDERS, id, { ...order, status });
};
export const updateOrderNote = (id: string, note: string) => {
  const order = cache.orders.find(o => o.id === id);
  if (order) saveData(COLLECTIONS.ORDERS, id, { ...order, statusNote: note });
};

export const addReview = (review: Review) => saveData(COLLECTIONS.REVIEWS, review.id, review);

export const saveUser = (user: User) => saveData(COLLECTIONS.USERS, user.id, user);

export const resetToDefaults = async () => {
    // Only reset Config, Pages, Team to defaults
    const batch = writeBatch(db);
    batch.set(doc(db, COLLECTIONS.CONFIG, 'main'), INITIAL_CONFIG);
    
    // Clear custom pages
    const pageSnapshot = await getDocs(collection(db, COLLECTIONS.PAGES));
    pageSnapshot.forEach(d => batch.delete(d.ref));

    // Reset Team
    const teamSnapshot = await getDocs(collection(db, COLLECTIONS.TEAM));
    teamSnapshot.forEach(d => batch.delete(d.ref));
    INITIAL_TEAM.forEach(t => batch.set(doc(db, COLLECTIONS.TEAM, t.id), t));

    await batch.commit();
    window.location.reload();
};