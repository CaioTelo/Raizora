import Link from 'next/link';
import type { CalculatorStep } from '../state/calculator-reducer';

const progress: readonly { step: CalculatorStep | 'LANDING'; label: string }[] = [
  { step: 'LANDING', label: 'Início' }, { step: 'CONFIGURATION', label: 'Configuração' },
  { step: 'PRODUCTS', label: 'Produtos' }, { step: 'PLAN', label: 'Plano' },
  { step: 'RECIPE', label: 'Receita' }, { step: 'SUMMARY', label: 'Resumo' },
];
export function StepProgress({ currentStep }: { currentStep: CalculatorStep }) {
  const position = progress.findIndex(item => item.step === currentStep);
  return (
    <nav aria-label="Progresso do planejamento" className="step-progress">
      <p className="eyebrow">Etapa {position + 1} de {progress.length}</p>
      <ol>
        {progress.map((item, index) => (
          <li key={item.step} aria-current={item.step === currentStep ? 'step' : undefined}>
            <span className="step-number" aria-hidden="true">{index + 1}</span><span>{item.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function StepNavigation({ currentStep, onBack, showNext = true }: {
  currentStep: CalculatorStep; onBack: () => void; showNext?: boolean;
}) {
  return (
    <div className="step-actions">
      {currentStep === 'CONFIGURATION' ? <Link className="button-secondary" href="/">Voltar ao início</Link>
        : <button className="button-secondary" type="button" onClick={onBack}>Voltar</button>}
      {showNext && <button className="button-primary" type="submit">Avançar <span aria-hidden="true">→</span></button>}
    </div>
  );
}
