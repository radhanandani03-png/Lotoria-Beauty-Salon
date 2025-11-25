
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = "px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    outline: "border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}
    <input 
      className={`w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors ${className}`}
      {...props} 
    />
  </div>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl font-serif font-bold text-white mb-2">{title}</h2>
    <div className="w-16 h-1 bg-yellow-500 mx-auto rounded-full mb-4"></div>
    {subtitle && <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

export const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden mb-4 bg-white/5 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-lg text-white">{title}</span>
        {isOpen ? <ChevronUp className="text-yellow-500" /> : <ChevronDown className="text-gray-400" />}
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 py-4 opacity-100 border-t border-white/10' : 'max-h-0 py-0 opacity-0'}`}
      >
        <p className="text-gray-300">{children}</p>
      </div>
    </div>
  );
};
