import type { BrandId } from '../brands/types';

export type ProductId = string;
export type QuantityUnit = 'GRAM' | 'MILLILITER';
export type Quantity =
  | { readonly unit: 'GRAM'; readonly value: number }
  | { readonly unit: 'MILLILITER'; readonly value: number };
export interface Product {
  readonly id: ProductId;
  readonly brandId: BrandId;
  readonly name: string;
  readonly quantityUnit: QuantityUnit;
  readonly aliases?: readonly string[];
}
