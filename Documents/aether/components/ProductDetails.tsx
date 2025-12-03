import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { SIZES } from '../constants';
import { X, Check } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    onAddToCart({
      ...product,
      quantity: 1,
      selectedSize,
    });
    
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 h-[50vh] md:h-auto relative bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white">
          <span className="text-sm text-gray-500 uppercase tracking-widest mb-2">
            {product.category}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {product.name}
          </h2>
          <p className="text-2xl mb-8 font-light">
            ${product.price}
          </p>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-wider">Select Size</span>
                <span className="text-sm text-gray-400 underline cursor-pointer">Size Guide</span>
            </div>
            <div className="flex gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    w-12 h-12 flex items-center justify-center border font-medium transition-all
                    ${selectedSize === size 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-gray-200 hover:border-black'}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`
              w-full py-5 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300
              disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
              ${isAdded ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}
            `}
          >
            {isAdded ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Added to Cart
              </span>
            ) : (
              'Add to Cart'
            )}
          </button>
          
          <div className="mt-8 border-t pt-6 space-y-3">
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                In stock, ready to ship
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">
                Ref: {product.id}-{product.category.substring(0,3).toUpperCase()}-25
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;