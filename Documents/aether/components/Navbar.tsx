import React from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onHomeClick: () => void;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onHomeClick, onMenuClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-screen-2xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={onHomeClick}
          className="text-3xl font-display font-bold tracking-tighter hover:opacity-70 transition-opacity"
        >
          AETHER
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenCart}
            className="group flex items-center gap-2 px-4 py-2 hover:bg-black hover:text-white transition-all rounded-full"
          >
            <span className="font-medium text-sm">CART</span>
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-aether-accent text-aether-black text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;