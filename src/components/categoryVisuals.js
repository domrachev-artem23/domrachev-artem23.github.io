import { ArrowUpRight, Clapperboard, Heart, Home, MoreHorizontal, ShoppingBag, ShoppingCart, Train } from 'lucide-react';

export const categoryVisuals = {
  Продукты: { Icon: ShoppingCart, color: '#159b6d' },
  Транспорт: { Icon: Train, color: '#db921e' },
  Развлечения: { Icon: Clapperboard, color: '#8658d4' },
  Жильё: { Icon: Home, color: '#df4e63' },
  Здоровье: { Icon: Heart, color: '#dc62a5' },
  Покупки: { Icon: ShoppingBag, color: '#258f83' },
  Другое: { Icon: MoreHorizontal, color: '#718198' },
};

export const incomeVisual = { Icon: ArrowUpRight, color: '#13a677' };
export const visualForCategory = category => categoryVisuals[category] || categoryVisuals.Другое;
