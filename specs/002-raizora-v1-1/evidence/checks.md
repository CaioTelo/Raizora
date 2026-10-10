# Gates finais — T052–T059

Execução nova em2026-10-10; Node24.16.0/npm11.16.0, versões/dependências do projeto preservadas. Todos os logs desta execução estão em `block4/`.

| Gate | Comando/evidência | Resultado |
| --- | --- | --- |
| Fechamento final conjunto | `npm test`; tests-final.log | 398/398,26 suites PASS |
| Unit/regressão matemática | `npm run test:unit`; unit.log | 272/272,13 suites PASS |
| Componentes/integração/regressão UI | `npm run test:ui`; ui.log | 126/126,13 suites PASS |
| Oráculos completos | `node .../block4/prepare-integrated.mjs`; mathematical-oracles.json | 16 semanas/80 entradas, V11/REG PASS |
| Navegação/layout/teclado | `node .../block4/browser-check.mjs`; browser-smoke.json | 7 configurações PASS |
| Jornada/axe/células print | `node .../block4/integrated-browser.mjs`; integrated-browser.json | 7 fluxos,41 auditorias,0 violações PASS |
| PDFs/print/smoke final | `node .../block4/browser-print.mjs`; production-smoke.log/browser-print.json | 6 casos PASS, produção reiniciada após build final |
| Inspeção de PDFs | `node .../block4/inspect-pdf.mjs`; pdf-inspection.json/log | 105 páginas A4 PASS |
| Lint | `npm run lint`; lint.log | PASS, max-warnings=0 |
| Typecheck | `npm run typecheck`; typecheck.log | PASS, next typegen+tsc |
| Build final | `npm run build`; build.log | PASS, rotas estáticas, sem warning |
| Integridade | `python3 .../block4/audit.py`; integrity.json/changed-files.json | 54 hashes protegidos e todos src/tests intactos |

Os scripts unit/UI são equivalentes ao `npm test` conjunto. O fechamento T058/T062 repetiu a suite conjunta após estabilizar o QA; não há contagem duplicada. Total398/398 em26 suites. Os casos de componentes, integração e regressão pertencem às suites listadas, não são contagens adicionais de testes. Suites T052/T053 foram executadas integralmente nesta rodada. Contrato de identidade/memoização do controller passa: navegação/filtros reutilizam response; volumes/seleção invalidam resultado. Plano, Receita, Resumo e PrintPlan recebem o mesmo CalculationResult.

Reprodução do browser usa `LD_LIBRARY_PATH=/tmp/raizora-block2-browser-libs/extracted/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/tmp/raizora-block2-browsers` antes do comando node. Servidor: `npm run start -- --hostname 127.0.0.1 --port 3110`. Comandos completos em print-harness.md. Preparação de axe: `npm install --prefix /tmp/raizora-block4-qa axe-core --no-package-lock --cache /tmp/raizora-npm-cache`, sem mudança de package/lockfile. Documentação atual consultada via skill context7-mcp, ID `/microsoft/playwright`.

Sandbox: primeira inicialização do servidor falhou com listen EPERM; build-sandbox.log registra falha de captura TypeScript --showConfig. Servidor, browsers e build final passaram fora do sandbox com revisão automática de aprovação, sem mudar configuração/dependências. Nenhuma rejeição de aprovação ocorreu. Execução final do build reiniciou produção antes do smoke.

Harnesses iniciais detectaram expectativas inadequadas: count de todas as tabelas incluía print oculto;20L com semana3 preservada produz40g de Joker e foliar3L produz18ml semanais de Plant Protein; fontes oficiais mencionam Joker mesmo desmarcado. Corrigidas somente assertions de QA; falhas anteriores preservadas em integrated-browser-harness-first/second.log. Nenhuma correção de produção ou teste da aplicação foi necessária.

Responsividade:360/640/768/1024/1280px e reflow1280→640/640→320 com deviceScaleFactor2. Nenhum overflow/corte observado. Tab/Shift+Tab/Enter/Espaço, selects sincronizados, disabled, foco solid3px nas bordas, labels/help/errors e status aria-live=polite passam. Cards e tabela do Resumo e Receita legíveis nas capturas; impressão oculta fora da árvore acessível de tela.

Axe verificou WCAG2A/AA e2.1A/AA com0 violações, mas retornou checks incompletos de color-contrast/aria-prohibited-attr em alguns nós; não são alegação de certificação WCAG. Valores/avisos/rótulos e foco foram conferidos visualmente e por assertions; sem leitor de tela. Reflow não equivale a executar zoom pela barra do navegador. Firefox/WebKit/Safari e impressora física não exercitados por indisponibilidade. Cobertura nativa adicional e parecer independente constam em implementation-review.md; nenhum resultado anterior substitui gate final.
