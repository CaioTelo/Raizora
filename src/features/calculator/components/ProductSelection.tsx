import type { Product } from '@/domain/products/types';
import type { ValidationIssue } from '@/domain/calculation/types';
import { validationMessage } from '../presentation/validation-messages';

export function ProductSelection({ products, selectedProductIds, issues, onToggle }: {
  products: readonly Product[]; selectedProductIds: readonly string[]; issues: readonly ValidationIssue[]; onToggle: (productId: string) => void;
}) {
  const issue = issues.find(issue => issue.path.startsWith('selectedProductIds'));
  return (
    <fieldset className="product-fieldset" id="selectedProductIds" tabIndex={-1} aria-invalid={issue ? true : undefined}
      aria-describedby={issue ? 'selection-error' : undefined}>
      <legend>Produtos do planejamento</legend>
      <div className="product-grid">
        {products.map(product => {
          const selected = selectedProductIds.includes(product.id);
          return <label className="product-card" key={product.id}>
            <input type="checkbox" checked={selected} onChange={() => onToggle(product.id)} aria-labelledby={`product-${product.id}-name`} />
            <span><strong id={`product-${product.id}-name`}>{product.name}</strong><small>{selected ? 'Incluído no planejamento' : 'Fora do planejamento'}</small></span>
          </label>;
        })}
      </div>
      <p className="selection-count">{selectedProductIds.length} {selectedProductIds.length === 1 ? 'produto selecionado' : 'produtos selecionados'}</p>
      {issue && <p className="field-error" id="selection-error" role="alert">{validationMessage(issue)}</p>}
    </fieldset>
  );
}
