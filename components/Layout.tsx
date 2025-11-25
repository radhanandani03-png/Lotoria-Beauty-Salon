
import React, { useState } from 'react';
import { User, SiteConfig, CustomPage } from '../types';
import { ShoppingBag, Home, Calendar, User as UserIcon, Menu, X, Settings, ShoppingCart, LogOut, Gift, Image as ImageIcon, Star, Facebook, Instagram, MessageCircle, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  config: SiteConfig;
  cartCount: number;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
  customPages: CustomPage[];
}

const Layout: React.FC<LayoutProps> = ({ children, user, config, cartCount, onNavigate, currentPage, onLogout, customPages }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const themeColors: Record<string, string> = {
    GOLD: 'text-yellow-500 border-yellow-500',
    SILVER: 'text-gray-300 border-gray-300',
    ROSE: 'text-rose-400 border-rose-400',
  };
  const activeColor = themeColors[config.themeColor] || themeColors.GOLD;

  const NavItem: React.FC<{ page: string; icon: any; label: string }> = ({ page, icon: Icon, label }) => (
    <button
      onClick={() => {
        onNavigate(page);
        setIsMenuOpen(false);
      }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        currentPage === page ? `bg-white/10 ${activeColor}` : 'text-gray-400 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-yellow-500/30 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer flex items-center space-x-2" onClick={() => onNavigate('home')}>
              {config.logoUrl && !logoError ? (
                <img 
                  src={config.logoUrl} 
                  alt="Lotoria" 
                  className="h-10 w-auto object-contain" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <h1 className={`text-2xl font-bold tracking-tighter uppercase font-serif ${activeColor.split(' ')[0]}`}>
                  {config.salonName}
                </h1>
              )}
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex space-x-1">
              <NavItem page="home" icon={Home} label="Home" />
              <NavItem page="services" icon={Calendar} label="Services" />
              <NavItem page="offers" icon={Gift} label="Offers" />
              <NavItem page="shop" icon={ShoppingBag} label="Shop" />
              <NavItem page="gallery" icon={ImageIcon} label="Gallery" />
              <NavItem page="reviews" icon={Star} label="Reviews" />
              <NavItem page="about" icon={UserIcon} label="About Us" />
              {user?.role === 'ADMIN' && <NavItem page="admin" icon={Settings} label="Admin" />}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button onClick={() => onNavigate('shop')} className="relative p-2 text-gray-400 hover:text-white">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/4 -translate-y-1/4 bg-yellow-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <div className="hidden md:block">
                 {user ? (
                   <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
                 ) : (
                   <button onClick={() => onNavigate('login')} className="text-sm text-yellow-500 hover:text-yellow-400">Login</button>
                 )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-white focus:outline-none"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 animate-fade-in-down h-screen overflow-y-auto pb-20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavItem page="home" icon={Home} label="Home" />
              <NavItem page="services" icon={Calendar} label="Services" />
              <NavItem page="offers" icon={Gift} label="Special Offers" />
              <NavItem page="shop" icon={ShoppingBag} label="Shop Products" />
              <NavItem page="gallery" icon={ImageIcon} label="Gallery" />
              <NavItem page="bookings" icon={Calendar} label="My Bookings" />
              <NavItem page="reviews" icon={Star} label="Reviews" />
              <NavItem page="about" icon={UserIcon} label="About Us" />
              
              {customPages.length > 0 && (
                 <div className="pt-2 pb-2 border-t border-white/10 mt-2">
                    <p className="px-4 text-xs text-gray-500 uppercase mb-2">Information</p>
                    {customPages.map(page => (
                        <NavItem key={page.id} page={page.id} icon={FileText} label={page.title} />
                    ))}
                 </div>
              )}

              {user?.role === 'ADMIN' && <NavItem page="admin" icon={Settings} label="Admin Panel" />}
              {user && (
                 <button onClick={onLogout} className="flex w-full items-center space-x-2 px-4 py-2 text-red-400">
                    <LogOut size={20} />
                    <span>Logout</span>
                 </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 pb-20 md:pb-0 flex-grow">
        {children}
      </main>

      {/* Footer (Desktop & Mobile) */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
                     {config.logoUrl && !logoError ? (
                         <img src={config.logoUrl} alt="Lotoria" className="h-8 w-auto" onError={() => setLogoError(true)} />
                     ) : (
                         <h3 className="text-2xl font-serif text-yellow-500">{config.salonName}</h3>
                     )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{config.missionStatement}</p>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                    <li><button onClick={() => onNavigate('home')} className="hover:text-yellow-500 transition-colors">Home</button></li>
                    <li><button onClick={() => onNavigate('services')} className="hover:text-yellow-500 transition-colors">Services</button></li>
                    <li><button onClick={() => onNavigate('shop')} className="hover:text-yellow-500 transition-colors">Shop</button></li>
                    <li><button onClick={() => onNavigate('about')} className="hover:text-yellow-500 transition-colors">About Us</button></li>
                </ul>
            </div>

            <div>
                 <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Information</h4>
                 <ul className="space-y-2 text-gray-400 text-sm">
                    {customPages.map(page => (
                        <li key={page.id}>
                            <button onClick={() => onNavigate(page.id)} className="hover:text-yellow-500 transition-colors">{page.title}</button>
                        </li>
                    ))}
                    <li>{config.address}</li>
                    <li>+91 {config.contactNumber}</li>
                    <li>{config.email}</li>
                 </ul>
            </div>

            <div>
                <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Follow Us</h4>
                <div className="flex space-x-4">
                    {config.socialLinks?.whatsapp && (
                        <a href={config.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="bg-green-600/20 text-green-500 p-3 rounded-full hover:bg-green-600 hover:text-white transition-all">
                            <MessageCircle size={20} />
                        </a>
                    )}
                    {config.socialLinks?.instagram && (
                        <a href={config.socialLinks.instagram} target="_blank" rel="noreferrer" className="bg-pink-600/20 text-pink-500 p-3 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                            <Instagram size={20} />
                        </a>
                    )}
                    {config.socialLinks?.facebook && (
                        <a href={config.socialLinks.facebook} target="_blank" rel="noreferrer" className="bg-blue-600/20 text-blue-500 p-3 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                            <Facebook size={20} />
                        </a>
                    )}
                </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-white/5 pt-8 text-center">
            <p className="text-gray-600 text-xs">&copy; {new Date().getFullYear()} {config.salonName}. All rights reserved.</p>
        </div>
      </footer>

      {/* Bottom Nav (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 w-full bg-black/90 backdrop-blur-lg border-t border-white/10 z-50 flex justify-around py-3">
         <button onClick={() => onNavigate('home')} className={`flex flex-col items-center ${currentPage === 'home' ? 'text-yellow-500' : 'text-gray-500'}`}>
            <Home size={20} />
            <span className="text-[10px] mt-1">Home</span>
         </button>
         <button onClick={() => onNavigate('offers')} className={`flex flex-col items-center ${currentPage === 'offers' ? 'text-yellow-500' : 'text-gray-500'}`}>
            <Gift size={20} />
            <span className="text-[10px] mt-1">Offers</span>
         </button>
         <button onClick={() => onNavigate('shop')} className={`flex flex-col items-center ${currentPage === 'shop' ? 'text-yellow-500' : 'text-gray-500'}`}>
            <ShoppingCart size={20} />
            <span className="text-[10px] mt-1">Shop</span>
         </button>
         <button onClick={() => onNavigate(user ? 'bookings' : 'login')} className={`flex flex-col items-center ${currentPage === 'bookings' ? 'text-yellow-500' : 'text-gray-500'}`}>
            <UserIcon size={20} />
            <span className="text-[10px] mt-1">Profile</span>
         </button>
      </div>
    </div>
  );
};

export default Layout;
