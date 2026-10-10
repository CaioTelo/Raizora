import type { Brand } from '@/domain/brands/types';
import type { CalculationResult } from '@/domain/calculation/types';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import { formatNumber } from '../presentation/format-quantity';
import { frequencyLabel } from '../presentation/result-selectors';
import { AggregateValue, DoseValue, IncompleteNotice, QuantityValue, RuleStateValue } from './ResultValue';
import { ScheduleDuration } from './ScheduleDuration';

function PrintVolumeValue({ liters }: { liters: number }) {
  const formatted = formatNumber(liters);
  const subcent = liters > 0 && formatted === '0';
  return <span aria-label={subcent ? 'Volume positivo menor que 0,01 L' : `${formatted} L`}>
    {subcent ? '< 0,01 L' : `${formatted} L`}
  </span>;
}

export function PrintPlan({ result, schedule, brand }: { result: CalculationResult; schedule: FeedingSchedule; brand: Brand }) {
  const productName = (id: string) => schedule.products.find(product => product.id === id)?.name;
  const stageLabel = (id: string) => schedule.stages.find(stage => stage.id === id)?.label;
  return <section className="print-plan" aria-label="Plano de Nutrição completo para impressão">
    <header className="print-heading">
      <h1>RAIZORA</h1><h2>Plano de Nutrição completo</h2>
      <p>Parceiro: {brand.name}</p><p>{schedule.name}</p>
      <p>Identificação do cronograma: {result.scheduleId}</p>
      <p>Versão local auditada: {result.dataVersion} · Auditoria: {schedule.metadata.auditedAt}</p>
      <p>Versão do fabricante: {schedule.metadata.providerScheduleVersion ?? 'não informada'}</p>
    </header>
    <IncompleteNotice completeness={result.completeness} context="Plano incompleto" />
    <ScheduleDuration stages={schedule.stages} />
    <section className="print-context" aria-label="Configuração e produtos do plano">
      <h3>Volumes e aplicações</h3>
      <p>Fertirrigação: <PrintVolumeValue liters={result.configuration.fertigationVolumeLiters} /> por preparo.</p>
      <p>{result.configuration.foliarVolumeLiters === undefined ? 'Pulverização foliar: volume não necessário para os produtos selecionados.'
        : <>Pulverização foliar: <PrintVolumeValue liters={result.configuration.foliarVolumeLiters} /> por preparo.</>}</p>
      <p>Frequência planejada de fertirrigação: {result.configuration.fertigationApplicationsPerWeek} por semana.</p>
      <p>As frequências foliares são prescritas pelo cronograma em cada semana. O planejamento não representa o total de regas comuns.</p>
      <h3>Produtos selecionados</h3>
      <ul>{result.selectedProductIds.map(id => <li key={id}>{productName(id)}</li>)}</ul>
    </section>
    {result.weeks.map(week => {
      const label = `${stageLabel(week.stageId)} · Semana ${week.weekNumber}`;
      return <section className="print-week" key={`${week.stageId}-${week.weekNumber}`}>
        <IncompleteNotice completeness={week.completeness} context={`${label} incompleta`} />
        <table className="print-week-table">
          <caption>{label}</caption>
          <colgroup><col className="print-product-column" /><col className="print-dose-column" /><col className="print-route-column" /><col className="print-volume-column" /><col className="print-amount-column" /><col className="print-weekly-column" /></colgroup>
          <thead>
            <tr><th colSpan={6}>{label}<small className="value-note">RAIZORA · Plano de Nutrição completo</small></th></tr>
            <tr><th scope="col">Produto / estado</th><th scope="col">Dose / L</th><th scope="col">Via / frequência</th><th scope="col">Volume / preparo</th><th scope="col">Quantidade / preparo</th><th scope="col">Consumo semanal</th></tr>
          </thead>
          <tbody>{week.entries.map(entry => <tr key={entry.productId}>
            <th scope="row">{productName(entry.productId)}</th>
            {entry.status === 'ACTIVE' ? <>
              <td><DoseValue dose={entry.dose} /></td>
              <td><p>{entry.applicationType === 'FERTIGATION' ? 'Fertirrigação' : 'Pulverização foliar'}</p><p>{frequencyLabel(entry)}</p></td>
              <td><PrintVolumeValue liters={entry.preparationVolumeLiters} /></td>
              <td><QuantityValue quantity={entry.amountPerApplication} /></td>
              <td><QuantityValue quantity={entry.weeklyAmount} suffix="/semana" /></td>
            </> : <td colSpan={5}><RuleStateValue entry={entry} /></td>}
          </tr>)}</tbody>
        </table>
      </section>;
    })}
    <section className="print-totals" aria-label="Agregados do plano">
      <table>
        <caption>Consumo por produto e estágio / ciclo</caption>
        <thead><tr><th colSpan={schedule.stages.length + 2}>RAIZORA · Consumo por produto e estágio / ciclo</th></tr>
          <tr><th scope="col">Produto</th>{schedule.stages.map(stage => <th scope="col" key={stage.id}>{stage.label}</th>)}<th scope="col">Total do ciclo</th></tr></thead>
        <tbody>{result.productTotals.map(total => <tr key={total.productId}>
          <th scope="row">{productName(total.productId)}</th>
          {total.byStage.map(stage => <td key={stage.stageId}><AggregateValue aggregate={stage.aggregate} /></td>)}
          <td><AggregateValue aggregate={total.cycle} /></td>
        </tr>)}</tbody>
      </table>
    </section>
    <section className="print-sources" aria-label="Fontes e referências do cronograma">
      <h3>Fontes e referências</h3>
      {schedule.metadata.notes && <p>{schedule.metadata.notes}</p>}
      <ul>{schedule.metadata.sources.map(source => <li key={source.id}>
        {source.id} · {source.title} · {source.kind === 'OFFICIAL_TABLE' ? 'Tabela oficial' : 'Decisão do responsável'} ({source.reference})
        {source.sourceDate && <p>Data da fonte: {source.sourceDate}</p>}
        {source.notes && <p>{source.notes}</p>}
      </li>)}</ul>
    </section>
  </section>;
}
