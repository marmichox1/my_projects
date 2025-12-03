import React from 'react';
import { CartItem } from '../types';
import { X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemoveItem: (id: string, size: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-up md:animate-none md:translate-x-0">
        <div className="p-6 flex items-center justify-between border-b">
          <h2 className="text-xl font-display font-bold">YOUR BAG ({cartItems.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <span className="text-4xl">☹</span>
              <p>Your bag is empty.</p>
              <button onClick={onClose} className="text-black underline underline-offset-4">Start Shopping</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="font-bold">${item.price * item.quantity}</p>
                    </div>
                    <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-gray-200">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, -1)}
                        className="p-1 hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.id, item.selectedSize)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl font-display font-bold">${subtotal}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center">Shipping & taxes calculated at checkout.</p>
            <button className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;