import type { FormEvent } from 'react';
import type { ValidationIssue } from '@/domain/calculation/types';
import type { ConfigurationDraft, ConfigurationField } from '../state/calculator-reducer';
import { ConfigurationFields } from '../components/ConfigurationFields';
import { StepNavigation } from '../components/StepNavigation';

export function ConfigurationView({ draft, issues, onChange, onSubmit, onBack }: {
  draft: ConfigurationDraft; issues: readonly ValidationIssue[];
  onChange: (field: ConfigurationField, value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onBack: () => void;
}) {
  return (
    <form noValidate onSubmit={onSubmit}>
      <p className="view-intro">Informe o volume de água de cada preparo. Os volumes podem ser diferentes para cada via.</p>
      <ConfigurationFields draft={draft} issues={issues} onChange={onChange} />
      <StepNavigation currentStep="CONFIGURATION" onBack={onBack} />
    </form>
  );
}
