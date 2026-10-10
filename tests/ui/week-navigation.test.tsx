import { useReducer } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WeekNavigation } from '@/features/calculator/components/WeekNavigation';
import { calculatorReducer, createInitialState } from '@/features/calculator/state/calculator-reducer';
import { feedingSchedule } from './result-fixtures';

function Harness({ stageId = 'vegetative', weekNumber = 2, onSubmit }: { stageId?: string; weekNumber?: number; onSubmit: () => void }) {
  const [state, dispatch] = useReducer((state: ReturnType<typeof createInitialState>, action: Parameters<typeof calculatorReducer>[1]) => calculatorReducer(state, action, feedingSchedule), { ...createInitialState(feedingSchedule), viewedStageId: stageId, viewedWeekNumber: weekNumber });
  return <form onSubmit={event => { event.preventDefault(); onSubmit(); }}>
    <h2 tabIndex={-1}>Plano</h2>
    <WeekNavigation stages={feedingSchedule.stages} stageId={state.viewedStageId} weekNumber={state.viewedWeekNumber} onMoveWeek={direction => dispatch({ type: 'MOVE_WEEK', direction })} />
    <button type="submit">Avançar</button>
  </form>;
}
describe('weekly navigation controls', () => {
  it.each([['vegetative', 1, true, false], ['vegetative', 8, false, false], ['flowering', 1, false, false], ['flowering', 8, false, true]] as const)('names native controls and derives limits at %s %d', (stageId, weekNumber, previousDisabled, nextDisabled) => {
    const move = vi.fn(); render(<WeekNavigation stages={feedingSchedule.stages} stageId={stageId} weekNumber={weekNumber} onMoveWeek={move} />);
    const previous = screen.getByRole('button', { name: 'Anterior' }); const next = screen.getByRole('button', { name: 'Próxima' });
    for (const [button, disabled] of [[previous, previousDisabled], [next, nextDisabled]] as const) {
      expect(button.tagName).toBe('BUTTON'); expect(button).toHaveAttribute('type', 'button');
      expect((button as HTMLButtonElement).disabled).toBe(disabled);
    }
    const status = screen.getByRole('status'); expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent(`${stageId === 'vegetative' ? 'Vegetativo' : 'Floração'} · Semana ${weekNumber}`);
  });
  it('emits one direction per activation and no action for disabled buttons', async () => {
    const user = userEvent.setup(); const move = vi.fn();
    const root = render(<WeekNavigation stages={feedingSchedule.stages} stageId="vegetative" weekNumber={1} onMoveWeek={move} />);
    await user.click(screen.getByRole('button', { name: 'Anterior' })); expect(move).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Próxima' })); expect(move.mock.calls).toEqual([[1]]);
    root.rerender(<WeekNavigation stages={feedingSchedule.stages} stageId="flowering" weekNumber={8} onMoveWeek={move} />);
    await user.click(screen.getByRole('button', { name: 'Próxima' })); expect(move).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Anterior' })); expect(move.mock.calls).toEqual([[1], [-1]]);
  });
  it('supports Tab, Shift+Tab, Enter and Space without submitting or focusing the step heading', async () => {
    const user = userEvent.setup(); const submit = vi.fn(); render(<Harness onSubmit={submit} />);
    await user.tab(); expect(screen.getByRole('button', { name: 'Anterior' })).toHaveFocus();
    await user.tab(); const next = screen.getByRole('button', { name: 'Próxima' }); expect(next).toHaveFocus();
    await user.keyboard('{Enter}'); expect(screen.getByRole('status')).toHaveTextContent('Semana 3'); expect(next).toHaveFocus();
    await user.keyboard(' '); expect(screen.getByRole('status')).toHaveTextContent('Semana 4'); expect(next).toHaveFocus();
    await user.tab({ shift: true }); expect(screen.getByRole('button', { name: 'Anterior' })).toHaveFocus();
    await user.keyboard('{Enter}'); expect(screen.getByRole('status')).toHaveTextContent('Semana 3');
    expect(submit).not.toHaveBeenCalled(); expect(screen.getByRole('heading')).not.toHaveFocus();
  });
  it.each([['vegetative', 2, 'Anterior', 'Próxima', 'Semana 1'], ['flowering', 7, 'Próxima', 'Anterior', 'Semana 8']] as const)('keeps predictable focus when reaching the edge from %s %d', async (stageId, weekNumber, name, fallback, status) => {
    const user = userEvent.setup(); render(<Harness onSubmit={vi.fn()} stageId={stageId} weekNumber={weekNumber} />);
    screen.getByRole('button', { name }).focus(); await user.keyboard('{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent(status);
    expect(screen.getByRole('button', { name })).toBeDisabled(); expect(screen.getByRole('button', { name: fallback })).toHaveFocus();
  });
});
