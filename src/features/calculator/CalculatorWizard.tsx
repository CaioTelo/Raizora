'use client';

import { useEffect, useRef, type FormEvent } from 'react';
import Link from 'next/link';
import type { Brand } from '@/domain/brands/types';
import type { FeedingSchedule } from '@/domain/nutrition/types';
import { useCalculator } from './hooks/use-calculator';
import { StepNavigation, StepProgress } from './components/StepNavigation';
import { ConfigurationView } from './views/ConfigurationView';
import { SummaryView } from './views/SummaryView';
import { RecipeView } from './views/RecipeView';
import { PlanView } from './views/PlanView';
import { PrintPlan } from './components/PrintPlan';
import { ProductsView } from './views/ProductsView';
import { responseMessage } from './presentation/validation-messages';

export function CalculatorWizard({ brand, schedule }: { brand: Brand; schedule: FeedingSchedule }) {
  const controller = useCalculator(schedule);
  const heading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const previousStep = useRef<string | null>(null);
  const currentStep = controller.state.currentStep;
  const result = controller.response.status === 'SUCCESS' ? controller.response.result : null;
  const canPrint = currentStep === 'PLAN' && result !== null;
  const filters = { stageId: controller.state.viewedStageId, weekNumber: controller.state.viewedWeekNumber,
    onStageChange: (stageId: string) => controller.dispatch({ type: 'SET_STAGE', stageId }),
    onWeekChange: (weekNumber: number) => controller.dispatch({ type: 'SET_WEEK', weekNumber }) };
  const stepLabels = { CONFIGURATION: 'Configuração', PRODUCTS: 'Produtos', PLAN: 'Plano', RECIPE: 'Receita', SUMMARY: 'Resumo' };
  useEffect(() => {
    const target = pendingFocus.current ? root.current?.querySelector<HTMLElement>(`#${pendingFocus.current}`)
      : previousStep.current !== currentStep ? heading.current : null;
    target?.focus(); pendingFocus.current = null; previousStep.current = currentStep;
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!controller.next()) {
      const target = currentStep === 'CONFIGURATION' ? controller.configurationIssues[0]?.path.split('.')[1]
        : controller.issues.some(issue => issue.path.startsWith('selectedProductIds')) ? 'selectedProductIds'
        : controller.issues.some(issue => issue.path === 'configuration.foliarVolumeLiters') ? 'return-to-foliar' : 'calculation-error';
      // Apply focus after React commits the error controls, including repeated submits.
      pendingFocus.current = target ?? null;
    }
  }
  const configurationIssues = controller.state.submittedStep === 'PRODUCTS' ? controller.issues
    : controller.state.submittedStep === 'CONFIGURATION' ? controller.configurationIssues : [];
  const productIssues = controller.state.submittedStep === 'PRODUCTS' ? controller.issues : [];
  return (
    <main className={`app-shell${canPrint ? ' has-print-plan' : ''}`} ref={root}>
      <div className="calculator-screen">
      <header className="app-header"><Link className="wordmark" href="/" aria-label="RAIZORA, início">RAIZORA</Link><span>Planejamento nutricional</span></header>
      <StepProgress currentStep={controller.state.currentStep} />
      <h1 className="calculator-title">Calculadora RAIZORA</h1>
      <h2 className="step-heading" ref={heading} tabIndex={-1}>{stepLabels[currentStep]}</h2>
      {currentStep === 'CONFIGURATION' ? <ConfigurationView draft={controller.state.draft} issues={configurationIssues}
        onChange={(field, value) => controller.dispatch({ type: 'UPDATE_CONFIGURATION', field, value })} onSubmit={submit} onBack={controller.back} />
        : currentStep === 'PRODUCTS' ? <ProductsView brand={brand} products={schedule.products} selectedProductIds={controller.state.selectedProductIds}
          issues={productIssues} technicalError={controller.state.submittedStep === 'PRODUCTS' ? responseMessage(controller.response) : undefined}
          onToggle={productId => controller.dispatch({ type: 'TOGGLE_PRODUCT', productId })} onSubmit={submit} onBack={controller.back}
          onReturnToFoliar={() => { pendingFocus.current = 'foliarVolumeLiters'; controller.returnToFoliar(); }} />
        : <form onSubmit={submit}>{result ? currentStep === 'PLAN' ? <PlanView result={result} schedule={schedule} {...filters} onPrint={() => window.print()} onMoveWeek={direction => controller.dispatch({ type: 'MOVE_WEEK', direction })} /> : currentStep === 'RECIPE' ? <RecipeView result={result} schedule={schedule} {...filters} /> : <SummaryView result={result} schedule={schedule} />
          : <p id="calculation-error" className="error-panel" role="alert" tabIndex={-1}>{responseMessage(controller.response)}</p>}
          <StepNavigation currentStep={currentStep} onBack={controller.back} showNext={result !== null && currentStep !== 'SUMMARY'} /></form>}
      </div>
      {canPrint && <PrintPlan result={result} schedule={schedule} brand={brand} />}
    </main>
  );
}
