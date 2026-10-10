import type { AmountAggregate } from '@/domain/calculation/types';
import type { Quantity } from '@/domain/products/types';
export interface FormattedQuantity { readonly text: string; readonly accessibleText: string }
const formatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
export function formatNumber(value: number): string { return formatter.format(value); }
export function formatQuantity(quantity: Quantity): FormattedQuantity {
  const unit = quantity.unit === 'GRAM' ? 'g' : 'ml';
  if (quantity.value > 0 && formatter.format(quantity.value) === '0') {
    return { text: `< 0,01 ${unit}`, accessibleText: `Quantidade positiva menor que 0,01 ${unit}` };
  }
  const text = `${formatNumber(quantity.value)} ${unit}`;
  return { text, accessibleText: text };
}
export function formatAggregate(aggregate: AmountAggregate): FormattedQuantity {
  if (aggregate.status === 'COMPLETE') return formatQuantity(aggregate.amount);
  if (aggregate.status === 'INCOMPLETE') return { text: 'Regra não confirmada', accessibleText: 'Total incompleto: regra não confirmada' };
  return { text: '—', accessibleText: aggregate.reasons.includes('STAGE_NOT_APPLICABLE') ? 'Não aplicável neste estágio' : 'Não utilizado nesta semana' };
}
