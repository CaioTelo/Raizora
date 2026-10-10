import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import * as engine from '@/domain/calculation/calculate-plan';
import HomePage from '@/app/page';
import CalculatorPage from '@/app/calculadora/page';
import { CalculatorWizard } from '@/features/calculator/CalculatorWizard';
import { plantasQueCuram } from '@/data/brands/plantas-que-curam/brand';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import { feedingSchedule, incompleteSchedule } from './result-fixtures';

async function configure(user: ReturnType<typeof userEvent.setup>, volume = '10', foliar = '2') {
  await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' }), volume);
  if (foliar) await user.type(screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' }), foliar);
  await next(user);
}
async function next(user: ReturnType<typeof userEvent.setup>) { await user.click(screen.getByRole('button', { name: /Avançar/ })); }
async function back(user: ReturnType<typeof userEvent.setup>) { await user.click(screen.getByRole('button', { name: 'Voltar' })); }
async function openPlan(schedule = feedingSchedule) {
  const user = userEvent.setup(); render(<CalculatorWizard brand={plantasQueCuram} schedule={schedule} />);
  await configure(user); await next(user); return user;
}
function currentJoker() { return within(screen.getByRole('region', { name: 'Produtos da semana' })).getByRole('article', { name: 'Joker' }); }
function totalJoker() { return within(screen.getByRole('region', { name: 'Totais por produto' })).getByRole('article', { name: 'Joker' }); }

describe('complete calculator journey', () => {
  it('runs Landing → CTA → configuration → products → plan → recipe → summary with initial inputs affecting final totals', async () => {
    // Model only the route boundary; browser smoke separately verifies Next navigation.
    function Entry() {
      const [started, setStarted] = useState(false);
      return <div onClick={event => { if ((event.target as HTMLElement).closest('a')?.getAttribute('href') === '/calculadora') { event.preventDefault(); setStarted(true); } }}>
        {started ? <CalculatorPage /> : <HomePage />}
      </div>;
    }
    const user = userEvent.setup(); render(<Entry />);
    expect(screen.getByRole('heading', { level: 1, name: 'RAIZORA' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Começar agora' }));
    await configure(user, '20');
    expect(screen.getAllByRole('checkbox')).toHaveLength(5); await next(user);
    expect(currentJoker()).toHaveTextContent('20 g/semana');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '4'); await next(user);
    expect(screen.getByRole('heading', { level: 2, name: 'Receita' })).toHaveFocus();
    expect(screen.getByRole('region', { name: 'Fertirrigação' })).toHaveTextContent('40 g');
    expect(screen.getByRole('region', { name: 'Fertirrigação' })).not.toHaveTextContent('120 g');
    await next(user); expect(screen.getByRole('heading', { level: 2, name: 'Resumo' })).toHaveFocus();
    expect(totalJoker()).toHaveTextContent('520 g'); expect(screen.queryByRole('button', { name: /Avançar/ })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Progresso do planejamento' })).toHaveTextContent('Etapa 6 de 6');
  });
  it('preserves filters across plan, recipe, summary and return; source result stays current after editing', async () => {
    const user = await openPlan();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estágio' }), 'flowering');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '5');
    await next(user); expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('5');
    await next(user); expect(totalJoker()).toHaveTextContent('260 g');
    await back(user); await back(user);
    expect(screen.getByRole('combobox', { name: 'Estágio' })).toHaveValue('flowering');
    expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('5');
    await back(user); await user.click(screen.getByRole('checkbox', { name: 'Plant Protein' })); await back(user);
    const volume = screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' });
    await user.clear(volume); await user.type(volume, '20'); await next(user); await next(user);
    expect(currentJoker()).toHaveTextContent('60 g/semana'); expect(screen.queryByText('Plant Protein')).not.toBeInTheDocument();
    await next(user); expect(screen.getByRole('region', { name: 'Fertirrigação' })).toHaveTextContent('60 g');
    await next(user); expect(totalJoker()).toHaveTextContent('520 g'); expect(screen.queryByText('Plant Protein')).not.toBeInTheDocument();
  });
  it('blocks empty selections, preserves the empty set on return and revalidates foliar with focused correction', async () => {
    const user = userEvent.setup(); render(<CalculatorPage />); await configure(user, '10', '');
    for (const checkbox of screen.getAllByRole('checkbox')) await user.click(checkbox);
    await next(user); expect(screen.getByRole('group', { name: 'Produtos do planejamento' })).toHaveFocus();
    await back(user); await next(user);
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).not.toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Joker' })); await next(user);
    expect(currentJoker()).toHaveTextContent('10 g/semana');
    await back(user); await user.click(screen.getByRole('checkbox', { name: 'Plant Protein' })); await next(user);
    expect(screen.getByRole('button', { name: 'Preencher volume foliar' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Preencher volume foliar' }));
    const foliar = screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' }); expect(foliar).toHaveFocus();
    await user.type(foliar, '2'); await next(user); await next(user);
    expect(screen.getByRole('region', { name: 'Produtos da semana' })).toHaveTextContent('Plant Protein');
  });
  it('restarts the transient wizard on remount', async () => {
    const user = userEvent.setup(); const root = render(<CalculatorPage />); await configure(user); await next(user); await next(user); await next(user);
    root.unmount(); render(<CalculatorPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Configuração' })).toHaveFocus();
    for (const input of screen.getAllByRole('textbox')) expect(input).toHaveValue('');
    await configure(user); for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toBeChecked();
  });
  it('keeps unknown rules incomplete in all three canonical presentations', async () => {
    const user = await openPlan(incompleteSchedule()); await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '4');
    expect(currentJoker()).toHaveTextContent('Regra não confirmada');
    await next(user); expect(screen.getByRole('status')).toHaveTextContent('Receita incompleta');
    expect(screen.getByRole('region', { name: 'Fertirrigação' })).not.toHaveTextContent('20 g');
    await next(user); expect(totalJoker()).toHaveTextContent('Subtotal conhecido (parcial): 240 g');
    expect(totalJoker()).not.toHaveTextContent('260 g');
  });
  it.each(['NUMERIC_ERROR', 'INVALID_SCHEDULE'])('blocks %s without presenting a stale plan after valid results', async kind => {
    const user = userEvent.setup(); const root = render(<CalculatorWizard brand={plantasQueCuram} schedule={feedingSchedule} />);
    await configure(user); await next(user); expect(currentJoker()).toHaveTextContent('10 g/semana'); await back(user);
    if (kind === 'INVALID_SCHEDULE') {
      const invalid: FeedingSchedule = { ...feedingSchedule, rules: [...feedingSchedule.rules, feedingSchedule.rules[0]!] };
      root.rerender(<CalculatorWizard brand={plantasQueCuram} schedule={invalid} />);
    } else {
      await back(user); const volume = screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' });
      await user.clear(volume); await user.click(volume); await user.paste('1' + '0'.repeat(307)); await next(user);
    }
    await next(user);
    expect(screen.getByRole('heading', { level: 2, name: 'Produtos' })).toBeInTheDocument();
    const error = screen.getByRole('alert');
    expect(error).toHaveFocus();
    if (kind === 'NUMERIC_ERROR') expect(error).toHaveTextContent('Os valores excedem a capacidade numérica do cálculo. Revise os volumes informados.');
    expect(error).not.toHaveTextContent(/quantidade de fertirrigações|frequência editável/);
    expect(screen.queryByRole('region', { name: 'Produtos da semana' })).not.toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Totais por produto' })).not.toBeInTheDocument();
  });
});


describe('integrated weekly plan navigation', () => {
  it('visits all 16 positions in both directions, including atomic phase boundaries and limits', async () => {
    const user = await openPlan();
    const positions = feedingSchedule.stages.flatMap(stage => Array.from({ length: stage.weekCount }, (_, i) => ({ stageId: stage.id, weekNumber: i + 1, label: stage.label })));
    const checkPosition = (index: number) => {
      const position = positions[index];
      expect(screen.getByRole('combobox', { name: 'Estágio' })).toHaveValue(position.stageId);
      expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue(String(position.weekNumber));
      expect(screen.getByRole('region', { name: 'Produtos da semana' })).toHaveTextContent(`${position.label} · Semana ${position.weekNumber}`);
      expect(screen.getAllByRole('article')).toHaveLength(5);
      expect(within(screen.getByRole('region', { name: 'Produtos da semana' })).queryByRole('table', { hidden: true })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Plano' })).toBeInTheDocument();
    };
    checkPosition(0); expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    for (let index = 1; index < positions.length; index++) {
      await user.click(screen.getByRole('button', { name: 'Próxima' })); checkPosition(index);
    }
    expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Anterior' })).toHaveFocus();
    for (let index = positions.length - 2; index >= 0; index--) {
      await user.click(screen.getByRole('button', { name: 'Anterior' })); checkPosition(index);
    }
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Próxima' })).toHaveFocus();
    expect(currentJoker()).toHaveTextContent('10 g/semana');
  });
  it('keeps direct selection distinct and shares the position edited in Recipe across Summary and return', async () => {
    const user = await openPlan();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '8');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estágio' }), 'flowering');
    expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('8');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '5');
    expect(screen.getByRole('heading', { name: 'Floração · Semana 5' })).toBeInTheDocument();
    expect(currentJoker()).toHaveTextContent('30 g/semana');
    await next(user);
    expect(screen.getByRole('combobox', { name: 'Estágio' })).toHaveValue('flowering');
    expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('5');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estágio' }), 'vegetative');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '3');
    expect(screen.getByRole('region', { name: 'Pulverização foliar' })).toHaveTextContent('10 ml');
    await next(user); expect(totalJoker()).toHaveTextContent('260 g');
    await back(user); await back(user);
    expect(screen.getByRole('heading', { name: 'Vegetativo · Semana 3' })).toBeInTheDocument();
    await back(user);
    for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toBeChecked();
    await back(user);
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' })).toHaveValue('10');
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' })).toHaveValue('2');
  });
  it('keeps focus on weekly controls and selectors without submitting the enclosing form', async () => {
    const user = await openPlan();
    const nextWeek = screen.getByRole('button', { name: 'Próxima' }); nextWeek.focus();
    await user.keyboard('{Enter}'); expect(nextWeek).toHaveFocus();
    await user.keyboard(' '); expect(nextWeek).toHaveFocus();
    expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('3');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estágio' }), 'flowering');
    expect(screen.getByRole('combobox', { name: 'Estágio' })).toHaveFocus();
    expect(screen.getByRole('heading', { level: 2, name: 'Plano' })).not.toHaveFocus();
    expect(screen.getByRole('heading', { name: 'Floração · Semana 3' })).toBeInTheDocument();
  });
});

// jsdom does not load the Next global stylesheet; reproduce its screen-only rule.
let screenStyles: HTMLStyleElement;
beforeEach(() => {
  screenStyles = document.createElement('style'); screenStyles.textContent = '.print-plan { display: none; }'; document.head.append(screenStyles);
});
afterEach(() => { screenStyles.remove(); vi.restoreAllMocks(); });
function printDocument() { return document.querySelector('.print-plan'); }

describe('integrated native printing', () => {
  it('mounts only in PLAN/SUCCESS, outside form with unique duration IDs and no screen accessibility', async () => {
    const user = userEvent.setup(); render(<CalculatorPage />); expect(printDocument()).toBeNull();
    await configure(user); expect(printDocument()).toBeNull(); await next(user);
    const document = printDocument()!; expect(document).not.toBeNull(); expect(document.closest('form')).toBeNull(); expect(document.parentElement).toBe(screen.getByRole('main'));
    expect(document).not.toHaveAttribute('aria-hidden'); expect(document).not.toBeVisible();
    expect(screen.getAllByRole('region', { name: 'Duração do ciclo' })).toHaveLength(1);
    const regions = [...document.parentElement!.querySelectorAll('[aria-labelledby]')];
    const ids = regions.map(r => r.getAttribute('aria-labelledby')!); expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(document.ownerDocument.getElementById(id)).not.toBeNull();
    await next(user); expect(printDocument()).toBeNull(); expect(screen.queryByRole('button', { name: 'Imprimir plano completo' })).not.toBeInTheDocument();
    await next(user); expect(printDocument()).toBeNull();
  });
  it('prints once without submit, recalculation or session changes; any active week produces the same document', async () => {
    const calculate = vi.spyOn(engine, 'calculateNutritionPlan'); const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    const user = await openPlan(); const before = printDocument()!.innerHTML;
    await user.selectOptions(screen.getByRole('combobox', { name: 'Estágio' }), 'flowering'); await user.selectOptions(screen.getByRole('combobox', { name: 'Semana' }), '4');
    expect(printDocument()!.innerHTML).toBe(before);
    const calls = calculate.mock.calls.length; const response = calculate.mock.results[calls - 1].value;
    const submit = vi.fn(); const button = screen.getByRole('button', { name: 'Imprimir plano completo' }); button.closest('form')!.addEventListener('submit', submit);
    expect(button).toHaveAttribute('type', 'button'); expect(print).not.toHaveBeenCalled(); await user.click(button);
    expect(print).toHaveBeenCalledTimes(1); expect(submit).not.toHaveBeenCalled(); expect(calculate).toHaveBeenCalledTimes(calls); expect(calculate.mock.results[calls - 1].value).toBe(response);
    expect(screen.getByRole('heading', { level: 2, name: 'Plano' })).toBeInTheDocument(); expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('4');
    // Returning from a native print call covers both outcomes: the app does not observe success/cancel.
    await user.click(screen.getByRole('button', { name: 'Próxima' })); expect(screen.getByRole('combobox', { name: 'Semana' })).toHaveValue('5');
    await back(user); for (const checkbox of screen.getAllByRole('checkbox')) expect(checkbox).toBeChecked(); await back(user);
    expect(screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' })).toHaveValue('10'); expect(screen.getByRole('textbox', { name: 'Volume por preparo da pulverização foliar' })).toHaveValue('2');
  });
  it('allows SUCCESS/INCOMPLETE printing without promoting partial totals', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {}); const user = await openPlan(incompleteSchedule());
    expect(printDocument()).toHaveTextContent('Subtotal conhecido (parcial): 240 g'); expect(printDocument()).not.toHaveTextContent('260 g');
    await user.click(screen.getByRole('button', { name: 'Imprimir plano completo' })); expect(print).toHaveBeenCalledTimes(1);
  });
  it.each(['INVALID_INPUT', 'INVALID_SCHEDULE', 'NUMERIC_ERROR'])('removes stale document and print action for %s after a valid plan', async kind => {
    const user = userEvent.setup(); const root = render(<CalculatorWizard brand={plantasQueCuram} schedule={feedingSchedule} />); await configure(user); await next(user); expect(printDocument()).not.toBeNull();
    if (kind === 'INVALID_SCHEDULE') root.rerender(<CalculatorWizard brand={plantasQueCuram} schedule={{ ...feedingSchedule, rules: [...feedingSchedule.rules, feedingSchedule.rules[0]!] }} />);
    else {
      await back(user); await back(user); const volume = screen.getByRole('textbox', { name: 'Volume por preparo da fertirrigação' }); await user.clear(volume);
      if (kind === 'NUMERIC_ERROR') { await user.click(volume); await user.paste('1' + '0'.repeat(307)); await next(user); }
      await next(user);
    }
    expect(printDocument()).toBeNull(); expect(screen.queryByRole('button', { name: 'Imprimir plano completo' })).not.toBeInTheDocument();
  });
});
