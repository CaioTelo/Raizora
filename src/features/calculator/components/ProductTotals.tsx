import type { ProductCycleTotal } from '@/domain/calculation/types';
import type { Product } from '@/domain/products/types';
import type { StageDefinition } from '@/domain/nutrition/types';
import { AggregateValue } from './ResultValue';
export function ProductTotals({ totals, products, stages }: {
  totals: readonly ProductCycleTotal[]; products: readonly Product[]; stages: readonly StageDefinition[];
}) {
  function productName(id: string) { return products.find(product => product.id === id)?.name; }
  return <>
    <section className="totals-cards" aria-label="Totais por produto"><div className="totals-card-grid">{totals.map(total =>
      <article className="surface-card totals-card" key={total.productId} aria-label={productName(total.productId)}>
        <h3>{productName(total.productId)}</h3><dl className="rule-values">
          {total.byStage.map(stageTotal => <div key={stageTotal.stageId}><dt>{stages.find(stage => stage.id === stageTotal.stageId)?.label}</dt><dd><AggregateValue aggregate={stageTotal.aggregate} /></dd></div>)}
          <div className="cycle-total"><dt>Total do ciclo</dt><dd><AggregateValue aggregate={total.cycle} /></dd></div>
        </dl>
      </article>)}</div></section>
    <div className="totals-table table-scroll" role="region" aria-label="Tabela de totais do ciclo" tabIndex={0}>
      <table><caption>Consumo por produto no ciclo</caption><thead><tr><th scope="col">Produto</th>{stages.map(stage => <th scope="col" key={stage.id}>{stage.label}</th>)}<th scope="col">Total do ciclo</th></tr></thead>
        <tbody>{totals.map(total => <tr key={total.productId}><th scope="row">{productName(total.productId)}</th>{stages.map(stage => {
          const aggregate = total.byStage.find(stageTotal => stageTotal.stageId === stage.id)?.aggregate;
          return <td key={stage.id}>{aggregate && <AggregateValue aggregate={aggregate} />}</td>;
        })}<td className="cycle-total"><AggregateValue aggregate={total.cycle} /></td></tr>)}</tbody>
      </table>
    </div>
  </>;
}
