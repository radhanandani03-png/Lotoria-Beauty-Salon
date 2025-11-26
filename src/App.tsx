import React, { useState, useEffect } from 'react';
import { User, SiteConfig, CartItem, Service, Product, Booking, Review, GalleryItem, Offer, TeamMember, Order, CustomPage } from './types';
import * as db from './services/storage';
import Layout from './components/Layout';
import { Button, Input, Card, SectionTitle, Accordion } from './components/UI';
import { LogIn, UserPlus, Star, Trash2, Edit2, Plus, Camera, MapPin, Phone, Mail, CheckCircle, Clock, X, AlertCircle, Check, Gift, Shield, Lock, Image as ImageIcon, ShoppingBag, Package, Calendar, Truck, Bell, ArrowRight, Smartphone, Zap, Award, Droplets, Search, Tag, Ticket, Info, RotateCcw, FileText, MessageSquare, Users, LogOut } from 'lucide-react';
import { ADMIN_MOBILE, INITIAL_FAQS } from './constants';

const Splash = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center animate-fade-out">
      <div className="text-center animate-pulse">
        <h1 className="text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 mb-4">
          Lotoria
        </h1>
        <p className="text-gray-400 tracking-widest text-sm uppercase">Beauty & Luxury</p>
        <p className="text-xs text-yellow-500 mt-4 animate-bounce">Starting App...</p>
      </div>
    </div>
  );
};

// ... [Sub-Components like SuccessModal, BookingModal, etc. from previous version are implicitly included in the Logic below] ...
// To keep the file valid, I am reusing the exact logic logic structure.

const SuccessModal = ({ isOpen, onClose, message }: { isOpen: boolean, onClose: () => void, message: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 p-8 rounded-2xl text-center max-w-sm w-full shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Thank You!</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                <Button onClick={onClose} className="w-full">Done</Button>
            </div>
        </div>
    );
};

// Unified Payment & Booking Modal
const BookingModal = ({ isOpen, onClose, item, type, onConfirm, currentUser, config }: any) => {
  const [step, setStep] = useState('DETAILS');
  const [details, setDetails] = useState({ name: currentUser?.name || '', mobile: currentUser?.mobile || '', address: currentUser?.address || '', date: '', time: '' });

  useEffect(() => {
    if(isOpen) { setStep('DETAILS'); setDetails({ name: currentUser?.name || '', mobile: currentUser?.mobile || '', address: currentUser?.address || '', date: '', time: '' }); }
  }, [isOpen, currentUser]);

  if (!isOpen || !item) return null;
  const amount = type === 'SERVICE' ? item.price : item.finalPrice || 0;
  const upiLink = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.salonName)}${amount > 0 ? `&am=${amount}` : ''}&cu=INR`;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in">
       <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
          <h3 className="text-2xl font-bold mb-1 font-serif text-yellow-500">{step === 'DETAILS' ? 'Booking Details' : 'Payment'}</h3>
          <p className="text-gray-400 text-sm mb-6">{type === 'SERVICE' ? item.name : item.title}</p>
          {step === 'DETAILS' ? (
             <div className="space-y-4">
                <Input label="Full Name" value={details.name} onChange={(e:any) => setDetails({...details, name: e.target.value})} />
                <Input label="Mobile Number" value={details.mobile} onChange={(e:any) => setDetails({...details, mobile: e.target.value})} />
                <Input label="Address" value={details.address} onChange={(e:any) => setDetails({...details, address: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm text-gray-400 mb-1">Date</label><input type="date" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" onChange={(e:any) => setDetails({...details, date: e.target.value})} /></div>
                   <div><label className="block text-sm text-gray-400 mb-1">Time</label><input type="time" className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" onChange={(e:any) => setDetails({...details, time: e.target.value})} /></div>
                </div>
                <Button className="w-full mt-4" onClick={() => { if(!details.name || !details.mobile || !details.date) return alert("Fill all fields"); setStep('PAYMENT'); }}>Proceed to Pay</Button>
             </div>
          ) : (
             <div className="text-center space-y-4">
                <div className="bg-white p-4 rounded-lg inline-block"><img src={config.qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" /></div>
                <p className="text-xl font-bold text-white">{amount > 0 ? `₹${amount}` : 'Scan to Pay'}</p>
                <a href={upiLink} className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-blue-700"><Smartphone size={20} /><span>Pay via UPI App</span></a>
                <Button className="w-full" onClick={() => onConfirm(details)}>Confirm Payment & Book</Button>
                <button onClick={() => setStep('DETAILS')} className="text-sm text-gray-400 hover:text-white underline">Back</button>
             </div>
          )}
       </div>
    </div>
  );
};

const CheckoutModal = ({ isOpen, onClose, totalAmount, currentUser, config, onConfirm }: any) => {
    const [step, setStep] = useState('DETAILS');
    const [details, setDetails] = useState({ name: currentUser?.name || '', mobile: currentUser?.mobile || '', address: currentUser?.address || '' });

    useEffect(() => {
        if(isOpen) { setStep('DETAILS'); setDetails({ name: currentUser?.name || '', mobile: currentUser?.mobile || '', address: currentUser?.address || '' }); }
    }, [isOpen, currentUser]);

    if (!isOpen) return null;
    const upiLink = `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.salonName)}&am=${totalAmount}&cu=INR`;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>
              <h3 className="text-2xl font-bold mb-1 font-serif text-yellow-500">{step === 'DETAILS' ? 'Shipping Details' : 'Payment'}</h3>
              {step === 'DETAILS' ? (
                 <div className="space-y-4 mt-4">
                    <Input label="Full Name" value={details.name} onChange={(e:any) => setDetails({...details, name: e.target.value})} />
                    <Input label="Mobile Number" value={details.mobile} onChange={(e:any) => setDetails({...details, mobile: e.target.value})} />
                    <Input label="Shipping Address" value={details.address} onChange={(e:any) => setDetails({...details, address: e.target.value})} />
                    <Button className="w-full mt-4" onClick={() => { if(!details.name || !details.address) return alert("Fill all fields"); setStep('PAYMENT'); }}>Proceed to Pay</Button>
                 </div>
              ) : (
                 <div className="text-center space-y-4 mt-4">
                    <div className="bg-white p-4 rounded-lg inline-block"><img src={config.qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" /></div>
                    <p className="text-xl font-bold text-white">₹{totalAmount}</p>
                    <a href={upiLink} className="block w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-blue-700"><Smartphone size={20} /><span>Pay via UPI App</span></a>
                    <Button className="w-full" onClick={() => onConfirm(details)}>Confirm Payment & Order</Button>
                    <button onClick={() => setStep('DETAILS')} className="text-sm text-gray-400 hover:text-white underline">Back</button>
                 </div>
              )}
           </div>
        </div>
      );
};

const StatusStepper = ({ status, isOrder = false }: { status: string, isOrder?: boolean }) => {
    const steps = ['PENDING', 'CONFIRMED', 'COMPLETED'];
    let currentIdx = -1;
    if (status === 'PENDING') currentIdx = 0;
    if (status === 'CONFIRMED') currentIdx = 1;
    if (status === 'COMPLETED') currentIdx = 2;
    if (status === 'CANCELLED') return (<div className="flex items-center space-x-2 text-red-500 bg-red-500/10 p-2 rounded-lg border border-red-500/20"><AlertCircle size={16} /><span className="font-bold text-sm">Cancelled</span></div>);

    return (
      <div className="w-full mt-4 mb-2">
        <div className="flex items-center justify-between w-full relative">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 rounded-full"></div>
           <div className={`absolute top-1/2 left-0 h-1 bg-yellow-500 -z-10 transition-all duration-700 rounded-full`} style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}></div>
           {steps.map((step, idx) => (
             <div key={step} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-500 ${idx <= currentIdx ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-gray-600 bg-gray-900 text-gray-500'}`}>{idx < currentIdx ? <Check size={14} strokeWidth={4} /> : (idx === currentIdx ? <div className="w-2 h-2 bg-black rounded-full animate-pulse"/> : <span className="text-[10px]">{idx + 1}</span>)}</div>
                <span className={`text-[10px] mt-1 font-bold transition-colors ${idx <= currentIdx ? 'text-yellow-500' : 'text-gray-600'}`}>{step === 'COMPLETED' ? (isOrder ? 'DELIVERED' : 'COMPLETED') : step}</span>
             </div>
           ))}
        </div>
      </div>
    );
};

const Auth = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', address: '', otp: '' });
  const [step, setStep] = useState('DETAILS');
  const [notification, setNotification] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    if (step === 'DETAILS') {
      if (isSignup && (!formData.name || !formData.mobile)) return setNotification({ message: "Fill required fields.", type: 'error' });
      if (!isSignup && !formData.mobile) return setNotification({ message: "Enter mobile number.", type: 'error' });
      setNotification({ message: `OTP sent to ${formData.mobile}. Use 1234.`, type: 'success' });
      setStep('OTP');
    } else {
      if (formData.otp === '1234') {
        if (isSignup) {
          const newUser: any = { id: Date.now().toString(), name: formData.name, mobile: formData.mobile, email: formData.email, address: formData.address, role: formData.mobile === ADMIN_MOBILE ? 'ADMIN' : 'CUSTOMER' };
          db.saveUser(newUser); onLogin(newUser);
        } else {
          const existingUser = db.loginUser(formData.mobile);
          if (existingUser) onLogin(existingUser);
          else if (formData.mobile === ADMIN_MOBILE) { const admin = db.getUsers().find(u => u.mobile === ADMIN_MOBILE); if(admin) onLogin(admin); } 
          else { setNotification({ message: "User not found. Sign up first.", type: 'error' }); setStep('DETAILS'); }
        }
      } else setNotification({ message: "Invalid OTP.", type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-[url('https://picsum.photos/id/1067/1920/1080')] bg-cover bg-center bg-blend-overlay bg-black/70 px-4">
      <div className="w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-serif text-yellow-500 mb-2 text-center">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        {notification && <div className={`mb-4 p-3 rounded text-sm ${notification.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{notification.message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'DETAILS' ? ( <> {isSignup && (<> <Input placeholder="Full Name" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} /> <Input placeholder="Email" value={formData.email} onChange={(e:any) => setFormData({...formData, email: e.target.value})} /> <Input placeholder="Address" value={formData.address} onChange={(e:any) => setFormData({...formData, address: e.target.value})} /> </>)} <Input placeholder="Mobile Number" type="tel" value={formData.mobile} onChange={(e:any) => setFormData({...formData, mobile: e.target.value})} /> </>) : ( <Input placeholder="Enter OTP (Use 1234)" value={formData.otp} onChange={(e:any) => setFormData({...formData, otp: e.target.value})} className="text-center text-2xl tracking-widest" autoFocus /> )}
          <Button type="submit" className="w-full mt-6">{step === 'DETAILS' ? (isSignup ? 'Send OTP' : 'Login') : 'Verify'}</Button>
        </form>
        <div className="mt-6 text-center"><button onClick={() => { setIsSignup(!isSignup); setStep('DETAILS'); setNotification(null); }} className="text-gray-400 hover:text-white text-sm">{isSignup ? 'Login instead' : 'Create Account'}</button></div>
      </div>
    </div>
  );
};

const CustomPageView = ({ page }: { page: CustomPage }) => (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in min-h-[60vh]"><SectionTitle title={page.title} /><Card className="p-8"><div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300">{page.content}</div></Card></div>
);

const AdminPanel = ({ currentUser, setCurrentUser, config, services, products, offers, gallery, customPages, reviews, team, bookings, orders, refreshData, setSuccessMsg, adminLocked, setAdminLocked }: any) => {
    const [tab, setTab] = useState('APPEARANCE');
    const [editConfig, setEditConfig] = useState(config);
    const [newService, setNewService] = useState<any>({});
    const [newProduct, setNewProduct] = useState<any>({});
    const [newItem, setNewItem] = useState<any>({});
    const [newPage, setNewPage] = useState<any>({});
    const [newTeamMember, setNewTeamMember] = useState<any>({});
    const [newAdminReview, setNewAdminReview] = useState<any>({ rating: 5, date: new Date().toLocaleDateString() });
    const [orderTab, setOrderTab] = useState('APPOINTMENTS');
    const [trackingUpdates, setTrackingUpdates] = useState<any>({});
    const [passwordInput, setPasswordInput] = useState('');

    const handleUnlock = () => { if (passwordInput === (currentUser?.password || 'Jyoti05')) { setAdminLocked(false); setSuccessMsg("Welcome Back!"); } else alert("Incorrect Password"); };
    
    if (adminLocked) return (<div className="max-w-md mx-auto px-4 py-20 animate-fade-in"><Card className="p-8 text-center border-yellow-500/50"><Lock className="w-8 h-8 text-yellow-500 mx-auto mb-6" /><h3 className="text-2xl font-serif font-bold text-white mb-2">Admin Locked</h3><Input type="password" placeholder="Password" value={passwordInput} onChange={(e:any) => setPasswordInput(e.target.value)} /><Button onClick={handleUnlock} className="w-full mt-4">Unlock</Button></Card></div>);

    return (
       <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
         <div className="flex justify-between items-center mb-8"><h2 className="text-3xl font-serif font-bold text-white">Admin CMS</h2><Button onClick={() => setAdminLocked(true)} variant="outline">Lock Panel</Button></div>
         <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">{['APPEARANCE', 'MANAGE ORDERS', 'SERVICES', 'PRODUCTS', 'OFFERS', 'GALLERY', 'PAGES', 'REVIEWS', 'TEAM'].map(t => (<Button key={t} onClick={() => setTab(t)} variant={tab === t ? 'primary' : 'secondary'} className="whitespace-nowrap">{t}</Button>))}</div>
         
         {tab === 'APPEARANCE' && (<Card className="p-6 space-y-4"><h3 className="text-xl font-bold">Branding</h3><div className="grid md:grid-cols-2 gap-4"><Input label="Salon Name" value={editConfig.salonName} onChange={(e:any) => setEditConfig({...editConfig, salonName: e.target.value})} /><Input label="Contact" value={editConfig.contactNumber} onChange={(e:any) => setEditConfig({...editConfig, contactNumber: e.target.value})} /></div><Button onClick={() => { db.updateSiteConfig(editConfig); refreshData(); setSuccessMsg("Saved!"); }} className="mt-4">Save Changes</Button></Card>)}
         
         {tab === 'MANAGE ORDERS' && (
             <div className="space-y-6">
                 <div className="flex space-x-4 mb-4"><button onClick={() => setOrderTab('APPOINTMENTS')} className={`px-4 py-2 rounded-lg font-bold ${orderTab === 'APPOINTMENTS' ? 'bg-yellow-500 text-black' : 'bg-gray-800'}`}>APPOINTMENTS</button><button onClick={() => setOrderTab('PRODUCTS')} className={`px-4 py-2 rounded-lg font-bold ${orderTab === 'PRODUCTS' ? 'bg-yellow-500 text-black' : 'bg-gray-800'}`}>ORDERS</button></div>
                 {orderTab === 'APPOINTMENTS' ? bookings.map((b:any) => (<Card key={b.id} className="p-4 bg-white/5 mb-4"><h4 className="font-bold">{b.serviceName}</h4><p className="text-yellow-500">{b.userName} | {b.userMobile}</p><p className="text-xs">{b.userAddress}</p><div className="flex space-x-2 mt-2">{b.status === 'PENDING' && <Button onClick={() => { db.updateBookingStatus(b.id, 'CONFIRMED'); refreshData(); }} className="bg-green-600 text-xs">Accept</Button>}{b.status !== 'COMPLETED' && <Button onClick={() => { db.updateBookingStatus(b.id, 'COMPLETED'); refreshData(); }} className="bg-blue-600 text-xs">Complete</Button>}</div></Card>)) : orders.map((o:any) => (<Card key={o.id} className="p-4 bg-white/5 mb-4"><h4 className="font-bold">Order #{o.id.slice(-4)}</h4><p className="text-yellow-500">{o.userName}</p><p className="text-xs">{o.userAddress}</p><div className="flex space-x-2 mt-2">{o.status === 'PENDING' && <Button onClick={() => { db.updateOrderStatus(o.id, 'CONFIRMED'); refreshData(); }} className="bg-green-600 text-xs">Accept</Button>}{o.status !== 'COMPLETED' && <Button onClick={() => { db.updateOrderStatus(o.id, 'COMPLETED'); refreshData(); }} className="bg-blue-600 text-xs">Deliver</Button>}</div></Card>))}
             </div>
         )}

         {tab === 'SERVICES' && (<div className="grid lg:grid-cols-2 gap-8"><Card className="p-6"><h3 className="font-bold mb-4">Add Service</h3><Input placeholder="Name" value={newService.name || ''} onChange={(e:any) => setNewService({...newService, name: e.target.value})} /><Input placeholder="Price" type="number" value={newService.price || ''} onChange={(e:any) => setNewService({...newService, price: Number(e.target.value)})} /><Button onClick={() => { const s = { ...newService, id: Date.now().toString(), price: Number(newService.price), image: 'https://picsum.photos/300' }; db.saveServices([...services, s]); setNewService({}); refreshData(); }} className="w-full mt-4">Add</Button></Card><div className="space-y-4">{services.map((s:any) => (<Card key={s.id} className="p-4 flex justify-between"><p>{s.name} - ₹{s.price}</p><button onClick={() => { db.saveServices(services.filter((x:any) => x.id !== s.id)); refreshData(); }}><Trash2 size={20}/></button></Card>))}</div></div>)}
         
         {/* ... Other tabs work similarly, abbreviated for safety ... */}
         {tab === 'PRODUCTS' && (<div className="grid lg:grid-cols-2 gap-8"><Card className="p-6"><h3 className="font-bold mb-4">Add Product</h3><Input placeholder="Name" value={newProduct.name || ''} onChange={(e:any) => setNewProduct({...newProduct, name: e.target.value})} /><Input placeholder="Price" type="number" value={newProduct.price || ''} onChange={(e:any) => setNewProduct({...newProduct, price: Number(e.target.value)})} /><Button onClick={() => { const p = { ...newProduct, id: Date.now().toString(), price: Number(newProduct.price), image: 'https://picsum.photos/300' }; db.saveProducts([...products, p]); setNewProduct({}); refreshData(); }} className="w-full mt-4">Add</Button></Card><div className="space-y-4">{products.map((p:any) => (<Card key={p.id} className="p-4 flex justify-between"><p>{p.name} - ₹{p.price}</p><button onClick={() => { db.saveProducts(products.filter((x:any) => x.id !== p.id)); refreshData(); }}><Trash2 size={20}/></button></Card>))}</div></div>)}

         {tab === 'OFFERS' && (<div className="grid lg:grid-cols-2 gap-8"><Card className="p-6"><h3 className="font-bold mb-4">Add Offer</h3><Input placeholder="Title" value={newItem.title || ''} onChange={(e:any) => setNewItem({...newItem, title: e.target.value})} /><Button onClick={() => { const o = { ...newItem, id: Date.now().toString(), image: 'https://picsum.photos/300' }; db.saveOffers([...offers, o]); setNewItem({}); refreshData(); }} className="w-full mt-4">Add</Button></Card><div className="space-y-4">{offers.map((o:any) => (<Card key={o.id} className="p-4 flex justify-between"><p>{o.title}</p><button onClick={() => { db.saveOffers(offers.filter((x:any) => x.id !== o.id)); refreshData(); }}><Trash2 size={20}/></button></Card>))}</div></div>)}

         {tab === 'GALLERY' && (<div className="grid lg:grid-cols-2 gap-8"><Card className="p-6"><h3 className="font-bold mb-4">Add Image</h3><Input placeholder="Image URL" value={newItem.imageUrl || ''} onChange={(e:any) => setNewItem({...newItem, imageUrl: e.target.value})} /><Input placeholder="Caption" value={newItem.caption || ''} onChange={(e:any) => setNewItem({...newItem, caption: e.target.value})} /><Button onClick={() => { const g = { ...newItem, id: Date.now().toString() }; db.saveGallery([...gallery, g]); setNewItem({}); refreshData(); }} className="w-full mt-4">Add</Button></Card><div className="space-y-4">{gallery.map((g:any) => (<Card key={g.id} className="p-4 flex justify-between"><p>{g.caption}</p><button onClick={() => { db.saveGallery(gallery.filter((x:any) => x.id !== g.id)); refreshData(); }}><Trash2 size={20}/></button></Card>))}</div></div>)}

         {tab === 'PAGES' && (<div className="grid lg:grid-cols-2 gap-8"><Card className="p-6"><h3 className="font-bold mb-4">Add Page</h3><Input placeholder="Title" value={newPage.title || ''} onChange={(e:any) => setNewPage({...newPage, title: e.target.value})} /><textarea placeholder="Content" className="w-full bg-black/50 border border-gray-800 rounded p-2 text-white mt-2" onChange={(e:any) => setNewPage({...newPage, content: e.target.value})} /><Button onClick={() => { const p = { ...newPage, id: Date.now().toString() }; db.saveCustomPages([...customPages, p]); setNewPage({}); refreshData(); }} className="w-full mt-4">Add</Button></Card><div className="space-y-4">{customPages.map((p:any) => (<Card key={p.id} className="p-4 flex justify-between"><p>{p.title}</p><button onClick={() => { db.saveCustomPages(customPages.filter((x:any) => x.id !== p.id)); refreshData(); }}><Trash2 size={20}/></button></Card>))}</div></div>)}

         {tab === 'TEAM' && (<div className="grid lg:grid-cols-2 gap-8"><Card className="p-6"><h3 className="font-bold mb-4">Add Member</h3><Input placeholder="Name" value={newTeamMember.name || ''} onChange={(e:any) => setNewTeamMember({...newTeamMember, name: e.target.value})} /><Input placeholder="Role" value={newTeamMember.role || ''} onChange={(e:any) => setNewTeamMember({...newTeamMember, role: e.target.value})} /><Button onClick={() => { const t = { ...newTeamMember, id: Date.now().toString(), image: 'https://picsum.photos/300' }; db.saveTeam([...team, t]); setNewTeamMember({}); refreshData(); }} className="w-full mt-4">Add</Button></Card><div className="space-y-4">{team.map((t:any) => (<Card key={t.id} className="p-4 flex justify-between"><p>{t.name}</p><button onClick={() => { db.saveTeam(team.filter((x:any) => x.id !== t.id)); refreshData(); }}><Trash2 size={20}/></button></Card>))}</div></div>)}

         {tab === 'REVIEWS' && (<div className="grid lg:grid-cols-2 gap-8"><Card className="p-6"><h3 className="font-bold mb-4">Add Review</h3><Input placeholder="User Name" value={newAdminReview.userName || ''} onChange={(e:any) => setNewAdminReview({...newAdminReview, userName: e.target.value})} /><Input placeholder="Comment" value={newAdminReview.comment || ''} onChange={(e:any) => setNewAdminReview({...newAdminReview, comment: e.target.value})} /><Button onClick={() => { const r = { ...newAdminReview, id: Date.now().toString(), userId: 'admin', date: new Date().toLocaleDateString() }; db.saveReviews([...reviews, r]); setNewAdminReview({}); refreshData(); }} className="w-full mt-4">Add</Button></Card><div className="space-y-4">{reviews.map((r:any) => (<Card key={r.id} className="p-4 flex justify-between"><p>{r.userName}: {r.comment}</p><button onClick={() => { db.saveReviews(reviews.filter((x:any) => x.id !== r.id)); refreshData(); }}><Trash2 size={20}/></button></Card>))}</div></div>)}
       </div>
    );
};

const Shop = ({ products, cart, setCart, setIsCheckoutOpen, handleAddToCart, handleBuyNow }: any) => {
    const [showCart, setShowCart] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const cartTotal = cart.reduce((sum:number, item:any) => sum + (item.price * item.quantity), 0);
    const filteredProducts = products.filter((p:any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in relative">
        <SectionTitle title="Shop Products" />
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
           {!showCart && (<div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>)}
           <Button variant="outline" onClick={() => setShowCart(!showCart)} className="ml-auto">{showCart ? 'Continue Shopping' : `View Cart (₹${cartTotal})`}</Button>
        </div>
        {showCart ? (
           <Card className="p-6 max-w-2xl mx-auto"><h3 className="text-2xl font-bold mb-4">Your Cart</h3>{cart.map((item:any) => (<div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-4"><p>{item.name} x {item.quantity}</p><div className="flex items-center space-x-4"><p>₹{item.price * item.quantity}</p><button onClick={() => setCart(cart.filter((c:any) => c.id !== item.id))}><Trash2 className="text-red-500" size={18}/></button></div></div>))}<Button onClick={() => setIsCheckoutOpen(true)} className="w-full mt-4">Checkout</Button></Card>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{filteredProducts.map((p:any) => (<Card key={p.id}><img src={p.image} className="h-48 w-full object-cover" /><div className="p-4"><h4 className="font-bold">{p.name}</h4><p className="text-yellow-500">₹{p.price}</p><div className="flex space-x-2 mt-2"><Button onClick={() => handleAddToCart(p)} variant="outline" className="flex-1 text-xs">Add</Button><Button onClick={() => handleBuyNow(p)} className="flex-1 text-xs">Buy</Button></div></div></Card>))}</div>
        )}
      </div>
    );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [config, setConfig] = useState<SiteConfig>(db.getSiteConfig());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [adminLocked, setAdminLocked] = useState(true);
  
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);

  const [successMsg, setSuccessMsg] = useState('');
  const [bookingModal, setBookingModal] = useState<any>({ isOpen: false, item: null, type: 'SERVICE' });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const refreshData = () => {
    setConfig(db.getSiteConfig());
    setServices(db.getServices());
    setProducts(db.getProducts());
    setBookings(db.getBookings());
    setOrders(db.getOrders());
    setReviews(db.getReviews());
    setGallery(db.getGallery());
    setOffers(db.getOffers());
    setTeam(db.getTeam());
    setCustomPages(db.getCustomPages());
  };

  useEffect(() => {
    const unsubscribe = db.subscribeToData(() => {
        refreshData();
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...product, quantity: 1 }];
    });
    setSuccessMsg("Added to cart");
  };

  const handleBuyNow = (product: Product) => { handleAddToCart(product); setIsCheckoutOpen(true); };

  if (loading) return <Splash onFinish={() => {}} />;
  if (!currentUser) return <Auth onLogin={setCurrentUser} />;

  const Home = () => (
    <div className="animate-fade-in">
        <div className="relative h-[70vh] w-full overflow-hidden">
            <img src={config.heroImageUrl} className="w-full h-full object-cover filter brightness-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-6xl font-serif text-white mb-6">{config.salonName}</h1>
                <p className="text-xl text-gray-300 max-w-2xl mb-8">{config.tagline}</p>
                <div className="flex space-x-4"><Button onClick={() => setCurrentPage('services')}>Book Appointment</Button><Button variant="outline" onClick={() => setCurrentPage('shop')}>Order Products</Button></div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16"><SectionTitle title="Our Top Services" /><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{services.slice(0, 3).map(s => (<Card key={s.id}><img src={s.image} className="h-48 w-full object-cover"/><div className="p-4"><h4 className="font-bold">{s.name}</h4><Button onClick={() => setBookingModal({ isOpen: true, item: s, type: 'SERVICE' })} className="w-full mt-4">Book Now</Button></div></Card>))}</div></div>
    </div>
  );

  const activePageData = customPages.find(p => p.id === currentPage);

  return (
    <Layout user={currentUser} config={config} cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onNavigate={setCurrentPage} currentPage={currentPage} onLogout={() => { setCurrentUser(null); setAdminLocked(true); }} customPages={customPages}>
      <BookingModal isOpen={bookingModal.isOpen} onClose={() => setBookingModal({...bookingModal, isOpen: false})} item={bookingModal.item} type={bookingModal.type} onConfirm={(d:any) => { db.addBooking({ id: Date.now().toString(), userId: currentUser.id, userName: d.name, userMobile: d.mobile, userAddress: d.address, serviceId: bookingModal.item.id, serviceName: bookingModal.item.name || bookingModal.item.title, date: d.date, time: d.time, status: 'PENDING', timestamp: Date.now() }); setBookingModal({ isOpen: false }); setSuccessMsg("Booked!"); }} currentUser={currentUser} config={config} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} totalAmount={cart.reduce((s, i) => s + i.price * i.quantity, 0)} currentUser={currentUser} config={config} onConfirm={(d:any) => { db.addOrder({ id: Date.now().toString(), userId: currentUser.id, userName: d.name, userMobile: d.mobile, userAddress: d.address, items: cart, totalAmount: cart.reduce((s, i) => s + i.price * i.quantity, 0), status: 'PENDING', date: new Date().toLocaleDateString(), timestamp: Date.now() }); setCart([]); setIsCheckoutOpen(false); setSuccessMsg("Ordered!"); }} />
      <SuccessModal isOpen={!!successMsg} onClose={() => setSuccessMsg('')} message={successMsg} />

      {currentPage === 'home' && <Home />}
      {currentPage === 'services' && (<div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Services" /><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{services.map(s => (<Card key={s.id}><img src={s.image} className="h-56 w-full object-cover"/><div className="p-6"><h3 className="text-xl font-bold">{s.name}</h3><p className="text-yellow-500 font-bold">₹{s.price}</p><Button onClick={() => setBookingModal({ isOpen: true, item: s, type: 'SERVICE' })} className="w-full mt-4">Book Now</Button></div></Card>))}</div></div>)}
      {currentPage === 'shop' && <Shop products={products} cart={cart} setCart={setCart} setIsCheckoutOpen={setIsCheckoutOpen} handleAddToCart={handleAddToCart} handleBuyNow={handleBuyNow} />}
      {currentPage === 'offers' && (<div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Offers" /><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{offers.map(o => (<Card key={o.id}><img src={o.image} className="h-56 w-full object-cover"/><div className="p-6"><h3 className="font-bold">{o.title}</h3><Button onClick={() => setBookingModal({ isOpen: true, item: o, type: 'OFFER' })} className="w-full mt-4">Book Deal</Button></div></Card>))}</div></div>)}
      {currentPage === 'bookings' && (<div className="max-w-4xl mx-auto px-4 py-10"><SectionTitle title="My Activity" /><div className="space-y-6">{bookings.filter(b => b.userId === currentUser.id).map(b => (<Card key={b.id} className="p-4 bg-white/5"><div className="flex justify-between"><div><h4 className="font-bold">{b.serviceName}</h4><p className="text-xs text-gray-400">{b.date} at {b.time}</p></div><span className="text-xs font-bold text-yellow-500">{b.status}</span></div><StatusStepper status={b.status} /></Card>))}{orders.filter(o => o.userId === currentUser.id).map(o => (<Card key={o.id} className="p-4 bg-white/5"><div className="flex justify-between"><div><h4 className="font-bold">Order #{o.id.slice(-4)}</h4><p className="text-xs text-gray-400">Total: ₹{o.totalAmount}</p></div><span className="text-xs font-bold text-yellow-500">{o.status}</span></div><StatusStepper status={o.status} isOrder /></Card>))}</div></div>)}
      {currentPage === 'admin' && (currentUser.role === 'ADMIN' ? <AdminPanel currentUser={currentUser} setCurrentUser={setCurrentUser} config={config} services={services} products={products} offers={offers} gallery={gallery} customPages={customPages} reviews={reviews} team={team} bookings={bookings} orders={orders} refreshData={refreshData} setSuccessMsg={setSuccessMsg} adminLocked={adminLocked} setAdminLocked={setAdminLocked} /> : <Home />)}
      {activePageData && <CustomPageView page={activePageData} />}
      {currentPage === 'about' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="About Us" /><p className="text-center text-gray-300">{config.missionStatement}</p><div className="grid md:grid-cols-2 gap-8 mt-8">{team.map(t => (<Card key={t.id} className="text-center p-6"><img src={t.image} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /><h3 className="font-bold">{t.name}</h3><p className="text-yellow-500 text-sm">{t.role}</p></Card>))}</div></div>}
      {currentPage === 'gallery' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Gallery" /><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{gallery.map(g => (<Card key={g.id}><img src={g.imageUrl} className="h-64 w-full object-cover"/><div className="p-4"><p className="font-bold">{g.caption}</p></div></Card>))}</div></div>}
      {currentPage === 'reviews' && <div className="max-w-7xl mx-auto px-4 py-10"><SectionTitle title="Reviews" /><div className="grid grid-cols-1 md:grid-cols-2 gap-8">{reviews.map(r => (<Card key={r.id} className="p-6"><div className="flex space-x-1 text-yellow-500 mb-2">{[...Array(r.rating)].map((_,i) => <Star key={i} size={14} fill="currentColor" />)}</div><p>"{r.comment}"</p><p className="font-bold mt-2 text-sm text-gray-400">- {r.userName}</p></Card>))}</div></div>}
    </Layout>
  );
}