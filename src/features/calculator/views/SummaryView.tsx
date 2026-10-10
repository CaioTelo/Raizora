import type { CalculationResult } from '@/domain/calculation/types';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import { ProductTotals } from '../components/ProductTotals';
import { IncompleteNotice } from '../components/ResultValue';
import { selectProductTotals } from '../presentation/result-selectors';
export function SummaryView({ result, schedule }: { result: CalculationResult; schedule: FeedingSchedule }) {
  const totals = selectProductTotals(result);
  return <>
    <p className="view-intro">Consumo de todo o cronograma, por produto. As unidades de cada produto são preservadas.</p>
    <p className="result-context">Frequência planejada de fertirrigação: {result.configuration.fertigationApplicationsPerWeek} por semana.</p>
    <IncompleteNotice completeness={result.completeness} context="Resumo incompleto" />
    {totals.length > 0 ? <ProductTotals totals={totals} products={schedule.products} stages={schedule.stages} /> : <p>Nenhum produto selecionado para o resumo.</p>}
    <p className="info-note">Você pode voltar para consultar as receitas ou ajustar sua configuração e seleção de produtos.</p>
  </>;
}
