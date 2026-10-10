import Link from 'next/link';
import { plantasQueCuram } from '@/data/brands/plantas-que-curam/brand';
import { landingContent as content } from '@/features/calculator/presentation/content';

export default function HomePage() {
  return (
    <main className="landing-shell">
      <div className="landing-card">
        <div className="landing-identity">
          <span className="brand-symbol" aria-hidden="true">↟</span>
          <h1>{content.identity}</h1>
          <p className="eyebrow">{content.purpose}</p>
        </div>
        <div className="landing-copy">
          <h2>{content.title}</h2>
          <p>{content.description}</p>
          <Link className="button-primary" href="/calculadora">{content.cta} <span aria-hidden="true">→</span></Link>
          <p className="landing-caption">Um preparo de cada vez. Um ciclo organizado.</p>
        </div>
        <div className="partner-panel">
          <p className="eyebrow">{content.partnerLabel}</p>
          <p className="partner-name">{plantasQueCuram.name}</p>
          <p>Produtos do plano inicial</p>
        </div>
      </div>
      <p className="landing-footer">RAIZORA · Planeje com clareza.</p>
    </main>
  );
}
