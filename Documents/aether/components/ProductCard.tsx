import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3"
      onClick={() => onClick(product)}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
        {product.isNew && (
          <span className="absolute top-3 left-3 z-20 bg-black text-white text-xs px-2 py-1 uppercase tracking-wider font-bold">
            New Arrival
          </span>
        )}
        <img 
          src={product.image} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
        />
        <img 
          src={product.hoverImage} 
          alt={`${product.name} alternate`}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 scale-105 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 font-bold uppercase tracking-widest translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
            Quick View
        </button>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium leading-tight group-hover:underline decoration-1 underline-offset-4">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <span className="text-lg font-display font-bold">
          ${product.price}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;