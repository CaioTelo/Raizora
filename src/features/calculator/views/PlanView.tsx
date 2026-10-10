import type { CalculationResult } from '@/domain/calculation/types';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import { selectWeek } from '../presentation/result-selectors';
import { WeekStageFilter } from '../components/WeekStageFilter';
import { NutritionWeekCards } from '../components/NutritionWeekCards';
import { WeekNavigation } from '../components/WeekNavigation';
import type { WeekDirection } from '../state/week-navigation';
import { ScheduleDuration } from '../components/ScheduleDuration';
import { IncompleteNotice } from '../components/ResultValue';
export interface ResultViewProps {
  result: CalculationResult; schedule: FeedingSchedule;
  stageId: string; weekNumber: number;
  onStageChange: (stageId: string) => void; onWeekChange: (weekNumber: number) => void;
}
export function PlanView({ result, schedule, onMoveWeek, onPrint, ...filters }: ResultViewProps & { onMoveWeek: (direction: WeekDirection) => void; onPrint?: () => void }) {
  const projection = selectWeek(result, filters.stageId, filters.weekNumber);
  const stageLabel = schedule.stages.find(stage => stage.id === filters.stageId)?.label ?? '';
  const products = schedule.products.filter(product => result.selectedProductIds.includes(product.id));
  return <>
    <p className="view-intro">Consulte a dose oficial por litro e as quantidades calculadas para seu preparo e sua semana.</p>
    <p className="result-context">Frequência planejada de fertirrigação: {result.configuration.fertigationApplicationsPerWeek} por semana.</p>
    <IncompleteNotice completeness={result.completeness} context="Plano incompleto" />
    <ScheduleDuration stages={schedule.stages} />
    {onPrint && <button className="button-secondary print-action" type="button" onClick={onPrint}>Imprimir plano completo</button>}
    <WeekStageFilter stages={schedule.stages} {...filters} />
    <WeekNavigation stages={schedule.stages} stageId={filters.stageId} weekNumber={filters.weekNumber} onMoveWeek={onMoveWeek} />
    {projection.status === 'FOUND' ? <>
      <NutritionWeekCards week={projection.week} products={products} stageLabel={stageLabel} />
    </> : <p role="status">Semana não encontrada no cronograma.</p>}
    <details className="source-details"><summary>Fontes e versão do cronograma</summary>
      <p>{schedule.name} · Parceiro do plano</p><p>Versão local auditada: {result.dataVersion} · Auditoria: {schedule.metadata.auditedAt}</p>
      <p>Versão do fabricante: {schedule.metadata.providerScheduleVersion ?? 'não informada'}</p>
      <ul>{schedule.metadata.sources.map(source => <li key={source.id}>{source.id} · {source.title} · {source.kind === 'OFFICIAL_TABLE' ? 'Tabela oficial' : 'Decisão do responsável'} ({source.reference})</li>)}</ul>
    </details>
  </>;
}
