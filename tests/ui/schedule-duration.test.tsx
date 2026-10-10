import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScheduleDuration } from '@/features/calculator/components/ScheduleDuration';
import { feedingSchedule } from './result-fixtures';

describe('duration derived from schedule metadata', () => {
  it.each([[8, 8, 16], [3, 5, 8]])('shows %d + %d = %d without controls', (first, second, total) => {
    render(<ScheduleDuration stages={feedingSchedule.stages.map((stage, i) => ({ ...stage, weekCount: i === 0 ? first : second }))} />);
    const duration = within(screen.getByRole('region', { name: 'Duração do ciclo' }));
    expect(duration.getByText('Vegetativo').nextElementSibling).toHaveTextContent(`${first} semanas`);
    expect(duration.getByText('Floração').nextElementSibling).toHaveTextContent(`${second} semanas`);
    expect(duration.getByText('Total do ciclo').nextElementSibling).toHaveTextContent(`${total} semanas`);
    expect(duration.getByText('Definida pelo cronograma atual.')).toBeInTheDocument();
    expect(duration.queryByRole('textbox')).not.toBeInTheDocument();
    expect(duration.queryByRole('spinbutton')).not.toBeInTheDocument();
    expect(duration.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
