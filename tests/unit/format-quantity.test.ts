import { describe, expect, it } from 'vitest';
import { formatAggregate, formatNumber, formatQuantity } from '@/features/calculator/presentation/format-quantity';

describe('presentation quantities', () => {
  it.each([[20, '20'], [10.5, '10,5'], [10.25, '10,25'], [0.75, '0,75'], [1.125, '1,13']])('formats %s as %s', (value, text) => {
    expect(formatNumber(value)).toBe(text);
  });
  it('distinguishes a positive subcent quantity from zero', () => {
    const quantity = { value: 0.004, unit: 'GRAM' } as const;
    expect(formatQuantity(quantity)).toEqual({ text: '< 0,01 g', accessibleText: 'Quantidade positiva menor que 0,01 g' });
    expect(quantity.value).toBe(0.004);
    expect(formatQuantity({ value: 0, unit: 'MILLILITER' }).text).toBe('0 ml');
  });
  it('preserves non-numeric states', () => {
    expect(formatAggregate({ status: 'NOT_APPLICABLE', reasons: ['STAGE_NOT_APPLICABLE'] })).toEqual({ text: '—', accessibleText: 'Não aplicável neste estágio' });
    expect(formatAggregate({ status: 'INCOMPLETE', missingRuleKeys: [] }).text).toBe('Regra não confirmada');
    expect(formatAggregate({ status: 'COMPLETE', amount: { value: 10.5, unit: 'MILLILITER' } }).text).toBe('10,5 ml');
  });
});
