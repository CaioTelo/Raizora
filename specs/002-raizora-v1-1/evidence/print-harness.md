# Harness de impressão e integração — T055

Execução nova em 2026-10-10. Scripts reproduzíveis em `block4/`; HTML, bundles e fixtures exclusivamente em `/tmp/raizora-v11-print-qa/`. Nenhuma rota de simulação, dependência entregue ou regra oficial alterada.

`generate-fixtures.mjs` compila o PrintPlan real com React/esbuild temporário e utiliza `applicationResultFor`/motor vigente. Origem: `tests/ui/result-fixtures.ts`, preservado. `incompleteSchedule()` substitui somente Joker/Vegetativo4 por NO_RULE no objeto sintético; subtotal esperado120g vegetativo/240g ciclo. `long-many` replica os cinco produtos em quatro conjuntos sintéticos com IDs/nomes/fontes extensos (20 produtos), mantendo as regras de cada cópia. `subcent` utiliza0,001L nas duas vias. Os casos completos/subset são percorridos na aplicação de produção, sem substituição de dados.

`prepare-integrated.mjs` gera também Wizard incompleto para execução real no navegador. Reutiliza CalculatorWizard/controller/motor/componentes e a mesma fixture NO_RULE. Somente Next Link é substituído por uma âncora no bundle temporário; nenhuma navegação nutricional é simulada. Não é evidência de uma segunda rota Next. O bundle possui0 dependências de produção novas.

Pré-requisitos temporários: Playwright/Chromium e bibliotecas em `/tmp/raizora-block2-*`; esbuild/PDF.js/canvas em `/tmp/raizora-block3-qa`; axe-core em `/tmp/raizora-block4-qa`. Detalhes de instalação históricos em block2/checks.md e block3/checks.md; este bloco reutilizou essas ferramentas e instalou apenas axe-core em/tmp. Package/lockfile preservados.

Reprodução na raiz, após build aprovado e servidor na porta3110:

```bash
node specs/002-raizora-v1-1/evidence/block4/generate-fixtures.mjs
node specs/002-raizora-v1-1/evidence/block4/prepare-integrated.mjs
LD_LIBRARY_PATH=/tmp/raizora-block2-browser-libs/extracted/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/tmp/raizora-block2-browsers node specs/002-raizora-v1-1/evidence/block4/browser-print.mjs
node specs/002-raizora-v1-1/evidence/block4/inspect-pdf.mjs
LD_LIBRARY_PATH=/tmp/raizora-block2-browser-libs/extracted/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/tmp/raizora-block2-browsers node specs/002-raizora-v1-1/evidence/block4/integrated-browser.mjs
```

CSS vem do build final em `.next/static/css`. Dependências temporárias não são requisitos da aplicação entregue. Ferramentas browser exigem acesso a sockets/processos fora do sandbox restrito. Documentação Playwright consultada pelo Context7 `/microsoft/playwright`; nenhuma API de exportação foi adicionada à aplicação.
