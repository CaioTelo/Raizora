import type { WeekCalculation } from '@/domain/calculation/types';
import type { ApplicationType } from '@/domain/nutrition/types';
import type { Product } from '@/domain/products/types';
import { formatNumber } from '../presentation/format-quantity';
import { selectApplicationEntries } from '../presentation/result-selectors';
import { RuleDetails } from './ResultValue';
export function RecipeGroup({ week, via, products, volume }: {
  week: WeekCalculation; via: ApplicationType; products: readonly Product[]; volume: number | undefined;
}) {
  const entries = selectApplicationEntries(week, via);
  const label = via === 'FERTIGATION' ? 'Fertirrigação' : 'Pulverização foliar';
  return <section className="surface-card recipe-group" aria-label={label}>
    <h3>{label}</h3>
    {entries.length > 0 ? <>
      <p className="recipe-volume">Volume por preparo: {volume !== undefined ? formatNumber(volume) : 'não informado'} L</p>
      {entries.map(entry => <article className="recipe-entry" key={entry.productId} aria-label={products.find(product => product.id === entry.productId)?.name}>
        <h4>{products.find(product => product.id === entry.productId)?.name}</h4><RuleDetails entry={entry} recipe />
      </article>)}
    </> : <p className="empty-route">{week.completeness === 'INCOMPLETE' ? 'Via sem quantidade confirmada: receita incompleta nesta semana.'
      : via === 'FERTIGATION' ? 'Nenhuma fertirrigação prevista nesta semana.' : 'Nenhuma aplicação foliar prevista nesta semana.'}</p>}
  </section>;
}
