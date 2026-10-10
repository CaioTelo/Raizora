import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AggregateValue, DoseValue, QuantityValue, RuleStateValue } from '@/features/calculator/components/ResultValue';
import { applicationResultFor, incompleteSchedule } from './result-fixtures';

describe('shared result presentation', () => {
  it.each([['GRAM_PER_LITER', '1 g/L'], ['MILLILITER_PER_LITER', '1 ml/L']] as const)('preserves dose unit %s', (unit, text) => {
    render(<DoseValue dose={{ unit, value: 1 }} />); expect(screen.getByText(text)).toBeInTheDocument();
  });
  it('formats quantities, positive subcent amounts and accessible text', () => {
    render(<><QuantityValue quantity={{ unit: 'GRAM', value: 10.25 }} /><QuantityValue quantity={{ unit: 'MILLILITER', value: 0.001 }} suffix="/semana" /></>);
    expect(screen.getByText('10,25 g')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantidade positiva menor que 0,01 ml/semana')).toHaveTextContent('< 0,01 ml/semana');
  });
  it.each([['STAGE_NOT_APPLICABLE', 'Não aplicável neste estágio'], ['WEEK_NOT_USED', 'Não utilizado nesta semana']] as const)('keeps N/A reason %s without zero', (reason, text) => {
    render(<RuleStateValue entry={{ status: 'NOT_APPLICABLE', productId: 'joker', reason }} />);
    expect(screen.getByLabelText(text)).toHaveTextContent('—'); expect(screen.getByText(text)).toBeInTheDocument(); expect(screen.queryByText(/0 g/)).not.toBeInTheDocument();
  });
  it.each(['MISSING', 'UNCONFIRMED'] as const)('keeps NO_RULE %s unknown without zero or absence', reason => {
    render(<RuleStateValue entry={{ status: 'NO_RULE', productId: 'joker', reason }} />);
    expect(screen.getByText('Regra não confirmada')).toBeInTheDocument(); expect(screen.queryByText('—')).not.toBeInTheDocument();
  });
  it('labels affected aggregates incomplete and their known subtotal partial', () => {
    const result = applicationResultFor(incompleteSchedule()); const joker = result.productTotals.find(t => t.productId === 'joker')!;
    render(<AggregateValue aggregate={joker.cycle} />);
    expect(screen.getByLabelText('Total incompleto: regra não confirmada')).toBeInTheDocument(); expect(screen.getByText(/Subtotal conhecido \(parcial\):/)).toHaveTextContent('240 g'); expect(screen.queryByText('260 g')).not.toBeInTheDocument();
  });
  it('preserves complete and N/A aggregates and units', () => {
    render(<><AggregateValue aggregate={{ status: 'COMPLETE', amount: { unit: 'GRAM', value: 260 } }} /><AggregateValue aggregate={{ status: 'NOT_APPLICABLE', reasons: ['STAGE_NOT_APPLICABLE'] }} /></>);
    expect(screen.getByText('260 g')).toBeInTheDocument(); expect(screen.getByLabelText('Não aplicável neste estágio')).toHaveTextContent('—');
  });
});

it('does not manufacture a subtotal when every affected amount is unknown', () => {
  render(<AggregateValue aggregate={{ status: 'INCOMPLETE', missingRuleKeys: [{ productId: 'joker', stageId: 'vegetative', weekNumber: 1 }] }} />);
  expect(screen.getByLabelText('Total incompleto: regra não confirmada')).toBeInTheDocument(); expect(screen.queryByText(/Subtotal|0 g/)).not.toBeInTheDocument();
});
