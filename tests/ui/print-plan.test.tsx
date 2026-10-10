import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PrintPlan } from '@/features/calculator/components/PrintPlan';
import { plantasQueCuram } from '@/data/brands/plantas-que-curam/brand';
import { applicationResultFor, feedingSchedule, incompleteSchedule } from './result-fixtures';

function mount(schedule = feedingSchedule, result = applicationResultFor(schedule)) {
  return render(<PrintPlan brand={plantasQueCuram} schedule={schedule} result={result} />);
}
function week(label: string) { return within(screen.getByRole('table', { name: label })); }
function entry(label: string, product: string) { return within(week(label).getByRole('rowheader', { name: product }).closest('tr')!); }
function freeze<T>(value: T): T {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
describe('complete print document', () => {
  it('renders 16 ordered weeks, 80 selected entries and all six columns from an immutable result', () => {
    const result = freeze(applicationResultFor()); const before = JSON.stringify(result); mount(feedingSchedule, result);
    const tables = screen.getAllByRole('table'); expect(tables).toHaveLength(17);
    const labels = feedingSchedule.stages.flatMap(s => Array.from({ length: s.weekCount }, (_, i) => `${s.label} · Semana ${i + 1}`));
    labels.forEach((label, index) => {
      expect(tables[index]).toHaveAccessibleName(label);
      expect(within(tables[index]).getAllByRole('rowheader')).toHaveLength(5);
      for (const heading of ['Produto / estado', 'Dose / L', 'Via / frequência', 'Volume / preparo', 'Quantidade / preparo', 'Consumo semanal']) expect(within(tables[index]).getByRole('columnheader', { name: heading })).toBeInTheDocument();
    });
    expect(JSON.stringify(result)).toBe(before);
  });
  it('prints identity, duration, canonical volumes, policy and every source reference', () => {
    mount(); expect(screen.getByText('RAIZORA')).toBeInTheDocument(); expect(screen.getByText(/Parceiro: Plantas que Curam/)).toBeInTheDocument();
    expect(screen.getByText(feedingSchedule.name)).toBeInTheDocument(); expect(screen.getByText(new RegExp(feedingSchedule.id))).toBeInTheDocument();
    expect(screen.getByText(/Versão local auditada: raizora-transcription-1/)).toBeInTheDocument(); expect(screen.getByText(/Versão do fabricante: não informada/)).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Duração do ciclo' })).toHaveTextContent('Total do ciclo16 semanas');
    expect(screen.getByRole('region', { name: 'Configuração e produtos do plano' })).toHaveTextContent('Fertirrigação: 10 L por preparo.'); expect(screen.getByRole('region', { name: 'Configuração e produtos do plano' })).toHaveTextContent('Pulverização foliar: 2 L por preparo.');
    expect(screen.getByText(/Frequência planejada de fertirrigação: 1 por semana/)).toBeInTheDocument();
    for (const source of feedingSchedule.metadata.sources) { expect(screen.getByText(new RegExp(source.id + ' ·'))).toHaveTextContent(source.reference); }
  });
  it('preserves dose, route, effective frequency, preparation and weekly quantities', () => {
    mount(); const joker = entry('Vegetativo · Semana 1', 'Joker');
    for (const text of ['1 g/L', '10 g', '10 g/semana', '10 L', 'Fertirrigação']) expect(joker.getByText(text)).toBeInTheDocument();
    expect(joker.getByText(/1 fertirrigação por semana/)).toBeInTheDocument();
    const coringa = entry('Vegetativo · Semana 3', 'Coringa Blend');
    for (const text of ['5 ml/L', '10 ml', '20 ml/semana', '2 L', 'Pulverização foliar']) expect(coringa.getByText(text)).toBeInTheDocument();
    expect(coringa.getByText(/2 aplicações foliares nesta semana/)).toBeInTheDocument();
    expect(entry('Vegetativo · Semana 7', 'Terpeno Plus').getByText('6 ml/semana')).toBeInTheDocument();
    expect(entry('Floração · Semana 5', 'Plant Protein').getByText('80 ml/semana')).toBeInTheDocument();
  });
  it('prints V11-CICLO aggregates by stage and cycle without mixing units', () => {
    mount(); const totals = within(screen.getByRole('table', { name: 'Consumo por produto e estágio / ciclo' }));
    const expected = [['Joker', ['140 g', '120 g', '260 g']], ['Coringa Blend', ['160 ml', '—', '160 ml']], ['Plant Protein', ['96 ml', '500 ml', '596 ml']], ['Terpeno Plus', ['32 ml', '—', '32 ml']], ['Tricomax', ['—', '100 g', '100 g']]] as const;
    for (const [product, values] of expected) {
      const row = within(totals.getByRole('rowheader', { name: product }).closest('tr')!);
      row.getAllByRole('cell').forEach((cell, index) => expect(cell).toHaveTextContent(values[index]));
    }
  });
  it('preserves both N/A reasons without invented dose, frequency, volume or zero', () => {
    mount(); for (const [label, product, reason] of [['Vegetativo · Semana 1', 'Tricomax', 'Não aplicável neste estágio'], ['Floração · Semana 6', 'Joker', 'Não utilizado nesta semana']]) {
      const row = entry(label, product); expect(row.getByText(reason)).toBeInTheDocument(); expect(row.getAllByRole('cell')).toHaveLength(1); expect(row.queryByText(/0 g|g\/L| L|por semana/)).not.toBeInTheDocument();
    }
  });
  it('prints valid incomplete results, affected week/product warnings and labeled partial subtotals', () => {
    mount(incompleteSchedule());
    expect(screen.getByText(/Plano incompleto:/)).toBeInTheDocument(); expect(screen.getByText(/Vegetativo · Semana 4 incompleta:/)).toBeInTheDocument();
    const unknown = entry('Vegetativo · Semana 4', 'Joker'); expect(unknown.getByText('Regra não confirmada')).toBeInTheDocument(); expect(unknown.queryByText(/0 g|—|g\/L/)).not.toBeInTheDocument();
    const row = within(screen.getByRole('table', { name: 'Consumo por produto e estágio / ciclo' })).getByRole('rowheader', { name: 'Joker' }).closest('tr')!;
    expect(within(row).getAllByLabelText('Total incompleto: regra não confirmada')).toHaveLength(2);
    expect(row).toHaveTextContent('Subtotal conhecido (parcial): 120 g'); expect(row).toHaveTextContent('Subtotal conhecido (parcial): 240 g'); expect(row).not.toHaveTextContent('260 g');
  });
  it('omits deselected products and contextualizes absent foliar volume', () => {
    mount(feedingSchedule, applicationResultFor(feedingSchedule, ['joker'], { fertigationVolumeLiters: 10 }));
    expect(screen.queryByText('Plant Protein')).not.toBeInTheDocument(); expect(screen.getAllByRole('rowheader')).toHaveLength(17);
    expect(screen.getByText('Pulverização foliar: volume não necessário para os produtos selecionados.')).toBeInTheDocument();
  });
  it('formats decimal volumes and amounts with the same presentation as screen', () => {
    mount(feedingSchedule, applicationResultFor(feedingSchedule, ['joker'], { fertigationVolumeLiters: 10.25 }));
    expect(entry('Vegetativo · Semana 1', 'Joker').getByText('10,25 g')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Configuração e produtos do plano' })).toHaveTextContent('Fertirrigação: 10,25 L por preparo.');
  });
  it('uses existing decimal and subcent formatters without losing positive quantities', () => {
    mount(feedingSchedule, applicationResultFor(feedingSchedule, ['joker'], { fertigationVolumeLiters: 0.001 }));
    const row = entry('Vegetativo · Semana 1', 'Joker'); expect(row.getByLabelText('Quantidade positiva menor que 0,01 g')).toHaveTextContent('< 0,01 g');
    expect(row.getByLabelText('Quantidade positiva menor que 0,01 g/semana')).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Consumo por produto e estágio / ciclo' })).toHaveTextContent('0,03 g');
  });
});

it('preserves positive subcent fertigation and foliar volumes in both context and preparation cells', () => {
  mount(feedingSchedule, applicationResultFor(feedingSchedule, undefined, { fertigationVolumeLiters: 0.001, foliarVolumeLiters: 0.001 }));
  const context = screen.getByRole('region', { name: 'Configuração e produtos do plano' });
  expect(context).toHaveTextContent('Fertirrigação: < 0,01 L por preparo.'); expect(context).toHaveTextContent('Pulverização foliar: < 0,01 L por preparo.');
  for (const product of ['Joker', 'Coringa Blend']) {
    const row = entry('Vegetativo · Semana 1', product);
    expect(row.getByLabelText('Volume positivo menor que 0,01 L')).toHaveTextContent('< 0,01 L'); expect(row.queryByText('0 L')).not.toBeInTheDocument();
  }
});
