import type { StageDefinition } from '@/domain/nutrition/types';
import { useId } from 'react';

export function ScheduleDuration({ stages }: { stages: readonly StageDefinition[] }) {
  const headingId = useId();
  const totalWeeks = stages.reduce((total, stage) => total + stage.weekCount, 0);
  return (
    <section className="duration-panel" aria-labelledby={headingId}>
      <h3 id={headingId}>Duração do ciclo</h3>
      <dl>
        {stages.map(stage => <div key={stage.id}><dt>{stage.label}</dt><dd>{stage.weekCount} semanas</dd></div>)}
        <div><dt>Total do ciclo</dt><dd>{totalWeeks} semanas</dd></div>
      </dl>
      <p>Definida pelo cronograma atual.</p>
    </section>
  );
}
