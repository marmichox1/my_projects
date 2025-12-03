import React from 'react';

interface HeroProps {
  onShopClick: () => void;
  onLookbookClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopClick, onLookbookClick }) => {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=1920" 
          alt="Campaign" 
          className="w-full h-full object-cover filter brightness-[0.6] grayscale contrast-125"
        />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 animate-slide-up">
        <h2 className="text-sm md:text-base font-medium tracking-[0.3em] mb-4 uppercase text-gray-300">
          Collection 2025
        </h2>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight mb-8">
          SILENCE<br/>IN NOISE
        </h1>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <button 
              onClick={onShopClick}
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-aether-accent transition-colors duration-300"
            >
                Shop Collection
            </button>
            <button 
              onClick={onLookbookClick}
              className="px-8 py-4 border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
            >
                View Lookbook
            </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;