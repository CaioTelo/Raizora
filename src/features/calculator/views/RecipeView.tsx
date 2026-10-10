import { useState } from 'react';
import type { ApplicationType } from '@/domain/nutrition/types';
import type { ResultViewProps } from './PlanView';
import { WeekStageFilter } from '../components/WeekStageFilter';
import { RecipeGroup } from '../components/RecipeGroup';
import { IncompleteNotice } from '../components/ResultValue';
import { selectWeek } from '../presentation/result-selectors';
export function RecipeView({ result, schedule, ...filters }: ResultViewProps) {
  const [via, setVia] = useState<ApplicationType | 'ALL'>('ALL');
  const projection = selectWeek(result, filters.stageId, filters.weekNumber);
  const stage = schedule.stages.find(stage => stage.id === filters.stageId);
  return <>
    <p className="view-intro">Quantidades de um preparo, separadas por via. A frequência é informativa e não multiplica a receita.</p>
    <p className="result-context">Frequência planejada de fertirrigação: {result.configuration.fertigationApplicationsPerWeek} por semana.</p>
    <WeekStageFilter stages={schedule.stages} {...filters} />
    <label htmlFor="recipe-via" className="via-filter">Via de aplicação<select id="recipe-via" value={via} onChange={event => setVia(event.target.value as ApplicationType | 'ALL')}>
      <option value="ALL">Todas as vias</option><option value="FERTIGATION">Fertirrigação</option><option value="FOLIAR">Pulverização foliar</option>
    </select></label>
    <p className="result-context">{stage?.label} · Semana {filters.weekNumber}</p>
    {projection.status === 'FOUND' ? <>
      <IncompleteNotice completeness={projection.week.completeness} context="Receita incompleta" />
      <div className="recipe-grid">
        {(via === 'ALL' || via === 'FERTIGATION') && <RecipeGroup week={projection.week} via="FERTIGATION" products={schedule.products} volume={result.configuration.fertigationVolumeLiters} />}
        {(via === 'ALL' || via === 'FOLIAR') && <RecipeGroup week={projection.week} via="FOLIAR" products={schedule.products} volume={result.configuration.foliarVolumeLiters} />}
      </div>
    </> : <p role="status">Semana não encontrada no cronograma.</p>}
  </>;
}
