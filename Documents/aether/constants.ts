import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Structure Coat',
    price: 450,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=800',
    description: 'A structural masterpiece designed for the modern silhouette. Features reinforced shoulders and a draped back.',
    isNew: true
  },
  {
    id: '2',
    name: 'Void Trousers',
    price: 220,
    category: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800',
    description: 'Relaxed fit trousers made from Japanese wool blend. Deep pleats for added volume and movement.',
  },
  {
    id: '3',
    name: 'Nebula Knit',
    price: 310,
    category: 'Knitwear',
    image: 'https://images.unsplash.com/photo-1621072156002-e2982177e4e7?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1621072156002-e2982177e4e7?auto=format&fit=crop&q=80&w=800',
    description: 'Heavyweight cotton knit with a distressed finish. Each piece is hand-dyed for a unique patina.',
  },
  {
    id: '4',
    name: 'Axis Shirt',
    price: 180,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    description: 'Crisp poplin shirt with asymmetrical button placement and an extended collar.',
    isNew: true
  },
  {
    id: '5',
    name: 'Kinetics Hoodie',
    price: 260,
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    description: 'Oversized silhouette with drop shoulders. Features our signature raw hem detailing.',
  },
  {
    id: '6',
    name: 'Mono Blazer',
    price: 520,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800',
    description: 'Single-button blazer constructed from technical nylon. Water-resistant and breathable.',
  }
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];