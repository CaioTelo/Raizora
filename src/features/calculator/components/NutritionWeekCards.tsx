import type { WeekCalculation } from '@/domain/calculation/types';
import type { Product } from '@/domain/products/types';
import { RuleDetails } from './ResultValue';
export function NutritionWeekCards({ week, products, stageLabel }: { week: WeekCalculation; products: readonly Product[]; stageLabel: string }) {
  return <section className="plan-cards" aria-label="Produtos da semana">
    <h3 className="result-context">{stageLabel} · Semana {week.weekNumber}</h3>
    <div className="nutrition-card-grid">{week.entries.map(entry => {
      const product = products.find(product => product.id === entry.productId);
      return <article className="surface-card nutrition-card" key={entry.productId} aria-label={product?.name}>
        <h4>{product?.name}</h4><RuleDetails entry={entry} />
      </article>;
    })}</div>
  </section>;
}
