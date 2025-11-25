import { collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch, getDocs } from "firebase/firestore";
import { db } from './firebase';
import { INITIAL_CONFIG, INITIAL_SERVICES, INITIAL_PRODUCTS, ADMIN_MOBILE, INITIAL_TEAM, INITIAL_GALLERY, INITIAL_OFFERS } from '../constants';

let cache: any = { config: INITIAL_CONFIG, services: [], products: [], bookings: [], orders: [], users: [], team: [], gallery: [], offers: [], pages: [], reviews: [] };

// --- Real-time Sync ---
export const subscribeToData = (onUpdate: () => void) => {
  checkAndUploadDefaults(); 
  const unsubscribers: any[] = [];
  
  const cols = ['config', 'services', 'products', 'bookings', 'orders', 'users', 'gallery', 'offers', 'team', 'reviews', 'pages'];
  cols.forEach(col => {
    unsubscribers.push(onSnapshot(collection(db, col), (snap) => {
      const data: any[] = [];
      snap.forEach(d => data.push(d.data()));
      if(col === 'config' && data.length > 0) cache.config = data[0]; // Config is single doc
      else cache[col] = data;
      onUpdate();
    }));
  });
  return () => unsubscribers.forEach(u => u());
};

// --- Auto Upload Defaults if Empty ---
const checkAndUploadDefaults = async () => {
  try {
    const snap = await getDocs(collection(db, 'config'));
    if (snap.empty) {
        console.log("Uploading defaults...");
        const batch = writeBatch(db);
        batch.set(doc(db, 'config', 'main'), INITIAL_CONFIG);
        INITIAL_SERVICES.forEach(s => batch.set(doc(db, 'services', s.id), s));
        INITIAL_PRODUCTS.forEach(p => batch.set(doc(db, 'products', p.id), p));
        // Admin User
        batch.set(doc(db, 'users', 'admin_01'), {
            id: 'admin_01', mobile: ADMIN_MOBILE, role: 'ADMIN', password: 'Jyoti05', name: 'Admin', email: 'admin@lotoria.com', address: 'Salon'
        });
        await batch.commit();
    }
  } catch (e) {
      console.error("Firebase connection error. Check API keys.", e);
  }
};

// --- Getters ---
export const getSiteConfig = () => cache.config || INITIAL_CONFIG;
export const getServices = () => cache.services || [];
export const getProducts = () => cache.products || [];
export const getBookings = () => cache.bookings || [];
export const getOrders = () => cache.orders || [];
export const getUsers = () => cache.users || [];
export const getGallery = () => cache.gallery || [];
export const getOffers = () => cache.offers || [];
export const getTeam = () => cache.team || [];
export const getReviews = () => cache.reviews || [];
export const getCustomPages = () => cache.pages || [];
export const loginUser = (mobile: string) => cache.users?.find((u:any) => u.mobile === mobile) || null;

// --- Setters ---
const saveData = async (col: string, id: string, data: any) => await setDoc(doc(db, col, id), data);
const deleteData = async (col: string, id: string) => await deleteDoc(doc(db, col, id));

export const updateSiteConfig = (c: any) => saveData('config', 'main', c);
export const saveServices = (list: any[]) => list.forEach(x => saveData('services', x.id, x));
export const saveProducts = (list: any[]) => list.forEach(x => saveData('products', x.id, x));
export const addBooking = (b: any) => saveData('bookings', b.id, b);
export const addOrder = (o: any) => saveData('orders', o.id, o);
export const saveUser = (u: any) => saveData('users', u.id, u);
export const saveGallery = (list: any[]) => list.forEach(x => saveData('gallery', x.id, x));
export const saveOffers = (list: any[]) => list.forEach(x => saveData('offers', x.id, x));
export const saveTeam = (list: any[]) => list.forEach(x => saveData('team', x.id, x));
export const saveReviews = (list: any[]) => list.forEach(x => saveData('reviews', x.id, x));
export const saveCustomPages = (list: any[]) => list.forEach(x => saveData('pages', x.id, x));

// Status Updates
export const updateBookingStatus = (id: string, status: string) => {
    const b = cache.bookings.find((x:any) => x.id === id);
    if(b) saveData('bookings', id, {...b, status});
}
export const updateOrderStatus = (id: string, status: string) => {
    const o = cache.orders.find((x:any) => x.id === id);
    if(o) saveData('orders', id, {...o, status});
}
export const updateBookingNote = (id: string, note: string) => {
    const b = cache.bookings.find((x:any) => x.id === id);
    if(b) saveData('bookings', id, {...b, statusNote: note});
}
export const resetToDefaults = async () => {
    window.location.reload();
}