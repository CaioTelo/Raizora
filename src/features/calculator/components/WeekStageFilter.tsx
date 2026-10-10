import type { StageDefinition } from '@/domain/nutrition/types';
export function WeekStageFilter({ stages, stageId, weekNumber, onStageChange, onWeekChange }: {
  stages: readonly StageDefinition[]; stageId: string; weekNumber: number;
  onStageChange: (value: string) => void; onWeekChange: (value: number) => void;
}) {
  const stage = stages.find(stage => stage.id === stageId);
  return <fieldset className="result-filters"><legend>Consultar cronograma</legend>
    <label htmlFor="viewed-stage">Estágio<select id="viewed-stage" value={stageId} onChange={event => onStageChange(event.target.value)}>
      {stages.map(stage => <option key={stage.id} value={stage.id}>{stage.label}</option>)}
    </select></label>
    <label htmlFor="viewed-week">Semana<select id="viewed-week" value={weekNumber} onChange={event => onWeekChange(Number(event.target.value))}>
      {Array.from({ length: stage?.weekCount ?? 0 }, (_, index) => <option key={index + 1} value={index + 1}>Semana {index + 1}</option>)}
    </select></label>
  </fieldset>;
}
