import React from 'react';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShopClick: () => void;
  onLookbookClick: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onShopClick, onLookbookClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-fade-in">
        <div className="p-6 flex justify-between items-center">
            <span className="font-display font-bold text-2xl tracking-tighter">AETHER</span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-8 h-8" />
            </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-10">
            <button 
                onClick={() => { onShopClick(); onClose(); }} 
                className="text-5xl md:text-6xl font-display font-bold hover:text-gray-500 transition-colors tracking-tight"
            >
                SHOP
            </button>
            <button 
                onClick={() => { onLookbookClick(); onClose(); }} 
                className="text-5xl md:text-6xl font-display font-bold hover:text-gray-500 transition-colors tracking-tight"
            >
                LOOKBOOK
            </button>
            <button 
                onClick={onClose} 
                className="text-5xl md:text-6xl font-display font-bold hover:text-gray-500 transition-colors tracking-tight text-gray-400"
            >
                ACCOUNT
            </button>
        </div>
        <div className="p-8 text-center text-sm text-gray-500 uppercase tracking-widest">
            Aether Apparel © 2025
        </div>
    </div>
  );
};

export default MobileMenu;