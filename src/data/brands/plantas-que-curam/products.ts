import type { Product } from '@/domain/products/types';
import { plantasQueCuram } from './brand';
export const products: readonly Product[] = [
  { id: 'joker', brandId: plantasQueCuram.id, name: 'Joker', quantityUnit: 'GRAM', aliases: ['Joker All-in-One'] },
  { id: 'coringa-blend', brandId: plantasQueCuram.id, name: 'Coringa Blend', quantityUnit: 'MILLILITER' },
  { id: 'plant-protein', brandId: plantasQueCuram.id, name: 'Plant Protein', quantityUnit: 'MILLILITER' },
  { id: 'terpeno-plus', brandId: plantasQueCuram.id, name: 'Terpeno Plus', quantityUnit: 'MILLILITER' },
  { id: 'tricomax', brandId: plantasQueCuram.id, name: 'Tricomax', quantityUnit: 'GRAM' },
];
