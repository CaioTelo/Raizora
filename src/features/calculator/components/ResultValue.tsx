import type { AmountAggregate, RuleCalculation } from '@/domain/calculation/types';
import type { Quantity } from '@/domain/products/types';
import type { Dose } from '@/domain/nutrition/types';
import { formatAggregate, formatNumber, formatQuantity } from '../presentation/format-quantity';
import { frequencyLabel } from '../presentation/result-selectors';
export function DoseValue({ dose }: { dose: Dose }) {
  return <>{formatNumber(dose.value)} {dose.unit === 'GRAM_PER_LITER' ? 'g/L' : 'ml/L'}</>;
}
export function RuleStateValue({ entry }: { entry: Exclude<RuleCalculation, { status: 'ACTIVE' }> }) {
  if (entry.status === 'NO_RULE') return <p className="rule-missing">Regra não confirmada</p>;
  const reason = entry.reason === 'STAGE_NOT_APPLICABLE' ? 'Não aplicável neste estágio' : 'Não utilizado nesta semana';
  return <p><span aria-label={reason}>—</span><small className="value-note">{reason}</small></p>;
}
export function QuantityValue({ quantity, suffix = '' }: { quantity: Quantity; suffix?: string }) {
  const formatted = formatQuantity(quantity);
  return <span aria-label={formatted.accessibleText + suffix}>{formatted.text}{suffix}</span>;
}
export function AggregateValue({ aggregate }: { aggregate: AmountAggregate }) {
  const formatted = formatAggregate(aggregate);
  return <><span aria-label={formatted.accessibleText}>{formatted.text}</span>
    {aggregate.status === 'NOT_APPLICABLE' && <small className="value-note">{formatted.accessibleText}</small>}
    {aggregate.status === 'INCOMPLETE' && aggregate.knownSubtotal && <small className="value-note">Subtotal conhecido (parcial): <QuantityValue quantity={aggregate.knownSubtotal} /></small>}
  </>;
}
export function RuleDetails({ entry, recipe = false }: { entry: RuleCalculation; recipe?: boolean }) {
  if (entry.status !== 'ACTIVE') return <RuleStateValue entry={entry} />;
  return <><dl className="rule-values">
    <div><dt>Dose oficial</dt><dd><DoseValue dose={entry.dose} /></dd></div>
    <div><dt>Quantidade por preparo</dt><dd><QuantityValue quantity={entry.amountPerApplication} /></dd></div>
    {!recipe && <div><dt>Consumo semanal</dt><dd><QuantityValue quantity={entry.weeklyAmount} suffix="/semana" /></dd></div>}
  </dl>
    {!recipe && <p className="value-note">{entry.applicationType === 'FERTIGATION' ? 'Fertirrigação' : 'Pulverização foliar'}</p>}
    <p className="value-note">{frequencyLabel(entry)}</p>
  </>;
}
export function IncompleteNotice({ completeness, context }: { completeness: 'COMPLETE' | 'INCOMPLETE'; context: string }) {
  return completeness === 'INCOMPLETE' ? <p className="error-panel" role="status">{context}: há regras não confirmadas. Os valores conhecidos são parciais; não há total definitivo para os produtos afetados.</p> : null;
}
