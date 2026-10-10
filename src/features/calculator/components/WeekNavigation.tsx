import { useRef } from 'react';
import type { StageDefinition } from '@/domain/nutrition/types';
import { getAdjacentWeek, type WeekDirection, type WeekPosition } from '../state/week-navigation';

export interface WeekNavigationProps extends WeekPosition {
  readonly stages: readonly StageDefinition[];
  readonly onMoveWeek: (direction: WeekDirection) => void;
}
export function WeekNavigation({ stages, stageId, weekNumber, onMoveWeek }: WeekNavigationProps) {
  const previousButton = useRef<HTMLButtonElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const position = { stageId, weekNumber };
  const previous = getAdjacentWeek(stages, position, -1);
  const next = getAdjacentWeek(stages, position, 1);
  const stage = stages.find(stage => stage.id === stageId);
  function move(direction: WeekDirection) {
    const target = direction === -1 ? previous : next;
    if (!target) return;
    // The activated button will become disabled at an edge. Keep keyboard focus
    // on the other navigation control before committing the new position.
    if (!getAdjacentWeek(stages, target, direction)) {
      (direction === -1 ? nextButton : previousButton).current?.focus();
    }
    onMoveWeek(direction);
  }
  return <div className="week-navigation" role="group" aria-label="Navegação semanal">
    <button className="button-secondary" ref={previousButton} type="button" disabled={!previous} onClick={() => move(-1)}>Anterior</button>
    <p className="week-position" role="status" aria-live="polite" aria-atomic="true">
      {stage ? `${stage.label} · Semana ${weekNumber}` : 'Semana não encontrada no cronograma.'}
      {stage && !previous && next ? <span className="value-note">Início do ciclo</span> : null}
      {stage && previous && !next ? <span className="value-note">Fim do ciclo</span> : null}
    </p>
    <button className="button-secondary" ref={nextButton} type="button" disabled={!next} onClick={() => move(1)}>Próxima</button>
  </div>;
}
