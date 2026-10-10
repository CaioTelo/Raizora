import type { ValidationIssue } from '@/domain/calculation/types';
import type { ConfigurationDraft, ConfigurationField } from '../state/calculator-reducer';
import { validationMessage } from '../presentation/validation-messages';

const fields: readonly { via: 'FERTIGATION' | 'FOLIAR'; field: ConfigurationField; label: string; mode: 'decimal'; unit: string; description: string }[] = [
  { via: 'FERTIGATION', field: 'fertigationVolumeLiters', label: 'Volume por preparo da fertirrigação', mode: 'decimal', unit: 'L', description: 'Litros de água em cada preparo. Como referência opcional, considere aproximadamente 10% da capacidade do vaso. Exemplos: vaso de 10 L → 1 L; vaso de 20 L → 2 L. O volume continua sendo informado manualmente. Use vírgula ou ponto decimal, sem separador de milhar.' },
  { via: 'FOLIAR', field: 'foliarVolumeLiters', label: 'Volume por preparo da pulverização foliar', mode: 'decimal', unit: 'L', description: 'Litros de água em cada preparo foliar. Você pode preencher depois de escolher os produtos. Use vírgula ou ponto, sem separador de milhar.' },
];
export function ConfigurationFields({ draft, issues, onChange }: {
  draft: ConfigurationDraft; issues: readonly ValidationIssue[]; onChange: (field: ConfigurationField, value: string) => void;
}) {
  function fieldInput(field: typeof fields[number]) {
    const issue = issues.find(issue => issue.path === `configuration.${field.field}`);
    return (
      <div className="input-field" key={field.field}>
        <label htmlFor={field.field}>{field.label}</label>
        <div className="input-with-unit">
          <input id={field.field} name={field.field} type="text" inputMode={field.mode} autoComplete="off"
            value={draft[field.field]} onChange={event => onChange(field.field, event.target.value)}
            aria-invalid={issue ? true : undefined} aria-describedby={`${field.field}-help${issue ? ` ${field.field}-error` : ''}`} />
          <span className="input-unit" aria-hidden="true">{field.unit}</span>
        </div>
        <p className="field-help" id={`${field.field}-help`}>{field.description}</p>
        {issue && <p className="field-error" id={`${field.field}-error`} role="alert">{validationMessage(issue)}</p>}
      </div>
    );
  }
  return (
    <div className="configuration-grid">
      <fieldset className="surface-card"><legend>Fertirrigação</legend>{fields.filter(field => field.via === 'FERTIGATION').map(fieldInput)}</fieldset>
      <fieldset className="surface-card"><legend>Pulverização foliar</legend>{fields.filter(field => field.via === 'FOLIAR').map(fieldInput)}<p className="info-note">A frequência foliar é definida pelo cronograma de cada produto.</p></fieldset>
    </div>
  );
}
