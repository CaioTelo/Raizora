import type { FormEvent } from 'react';
import type { Brand } from '@/domain/brands/types';
import type { Product } from '@/domain/products/types';
import type { ValidationIssue } from '@/domain/calculation/types';
import { ProductSelection } from '../components/ProductSelection';
import { StepNavigation } from '../components/StepNavigation';
import { validationMessage } from '../presentation/validation-messages';

export function ProductsView({ brand, products, selectedProductIds, issues, technicalError, onToggle, onSubmit, onBack, onReturnToFoliar }: {
  brand: Brand; products: readonly Product[]; selectedProductIds: readonly string[]; issues: readonly ValidationIssue[]; technicalError?: string;
  onToggle: (productId: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onBack: () => void; onReturnToFoliar: () => void;
}) {
  const foliarIssue = issues.find(issue => issue.path === 'configuration.foliarVolumeLiters');
  return (
    <form noValidate onSubmit={onSubmit}>
      <p className="view-intro">Escolha os produtos que farão parte do ciclo. Você pode marcar ou desmarcar cada um; selecione pelo menos um para continuar.</p>
      <div className="product-partner"><p className="eyebrow">Parceiro de fertilizantes</p><strong>{brand.name}</strong></div>
      <ProductSelection products={products} selectedProductIds={selectedProductIds} issues={issues} onToggle={onToggle} />
      {foliarIssue && <div className="error-panel">
        <p className="field-error" id="foliar-selection-error" role="alert">{validationMessage(foliarIssue)}</p>
        <button className="button-secondary" type="button" id="return-to-foliar" aria-describedby="foliar-selection-error" onClick={onReturnToFoliar}>Preencher volume foliar</button>
      </div>}
      {technicalError && <p className="error-panel field-error" id="calculation-error" tabIndex={-1} role="alert">{technicalError}</p>}
      <StepNavigation currentStep="PRODUCTS" onBack={onBack} />
    </form>
  );
}
