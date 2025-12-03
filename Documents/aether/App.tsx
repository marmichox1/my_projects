import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import CartDrawer from './components/CartDrawer';
import MobileMenu from './components/MobileMenu';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Refs for scrolling
  const productSectionRef = useRef<HTMLElement>(null);
  const lookbookSectionRef = useRef<HTMLElement>(null);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLookbook = () => {
    lookbookSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === newItem.id && item.selectedSize === newItem.selectedSize);
      if (existing) {
        return prev.map(item => 
          (item.id === newItem.id && item.selectedSize === newItem.selectedSize)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string, size: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-aether-black font-sans selection:bg-black selection:text-white">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onMenuClick={() => setIsMenuOpen(true)}
      />

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onShopClick={scrollToProducts}
        onLookbookClick={scrollToLookbook}
      />

      <main className="pt-20">
        <Hero 
          onShopClick={scrollToProducts}
          onLookbookClick={scrollToLookbook}
        />

        <section ref={productSectionRef} className="px-6 py-20 max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold">LATEST<br />ARRIVALS</h2>
            <div className="hidden md:flex gap-4 text-sm font-medium">
               <span className="cursor-pointer underline underline-offset-4">ALL</span>
               <span className="cursor-pointer text-gray-400 hover:text-black transition-colors">OUTERWEAR</span>
               <span className="cursor-pointer text-gray-400 hover:text-black transition-colors">TOPS</span>
               <span className="cursor-pointer text-gray-400 hover:text-black transition-colors">BOTTOMS</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={setSelectedProduct} 
              />
            ))}
          </div>
        </section>

        {/* Lookbook Section */}
        <section ref={lookbookSectionRef} className="py-24 bg-white">
          <div className="max-w-screen-2xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">SEASONAL<br/>EDITORIAL</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] group overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200" 
                  alt="Editorial 1" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 text-white">
                   <p className="text-sm font-bold uppercase tracking-widest mb-1">Campaign 01</p>
                   <p className="text-2xl font-display">URBAN DECAY</p>
                </div>
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="relative group overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200" 
                    alt="Editorial 2" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-2xl font-display">NEON NIGHTS</p>
                  </div>
                </div>
                <div className="relative group overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200" 
                    alt="Editorial 3" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                   <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-2xl font-display">VOID WALKER</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-aether-black text-white">
           <div className="max-w-screen-xl mx-auto px-6 text-center">
              <h3 className="text-2xl font-display mb-6">JOIN THE MOVEMENT</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                 Subscribe to receive early access to drops, exclusive events, and editorial content.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
                 <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS" 
                    className="bg-transparent border-b border-gray-600 py-3 px-2 focus:outline-none focus:border-white w-full text-center md:text-left"
                 />
                 <button className="bg-white text-black font-bold uppercase tracking-widest px-8 py-3 hover:bg-gray-200 transition-colors">
                    Subscribe
                 </button>
              </div>
           </div>
        </section>

        <footer className="bg-white border-t border-gray-200 py-12 px-6">
           <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-bold tracking-widest">AETHER © 2025</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wide">built with love by Ayman AABIYDA</div>
              </div>
              <div className="flex gap-8 text-sm text-gray-500">
                 <a href="#" className="hover:text-black">Instagram</a>
                 <a href="#" className="hover:text-black">Twitter</a>
                 <a href="#" className="hover:text-black">Terms</a>
                 <a href="#" className="hover:text-black">Privacy</a>
              </div>
           </div>
        </footer>
      </main>

      {/* Overlays */}
      {selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default App;