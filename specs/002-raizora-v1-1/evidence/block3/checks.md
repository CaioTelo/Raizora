# Checks — Bloco 3 (T038–T051)

Execução em 2026-10-10, Node 24.16.0, dependências originais. Nenhum commit, deploy ou tarefa T052+ executada.

| Gate | Comando / evidência | Resultado |
| --- | --- | --- |
| Checklist / prerequisites | check-prerequisites.sh --json --require-tasks --include-tasks; requirements.md | feature002; checklist25/25 PASS; sem hooks before/after_implement |
| RED comportamental | npm run test:ui -- tests/ui/result-value.test.tsx tests/ui/print-plan.test.tsx tests/ui/calculator-wizard.test.tsx; red.log | 20 falhas /13 passes; stubs tipados, nenhuma falha de import |
| GREEN local | sete suites UI afetadas; green-first.log | 78/78 antes dos testes adicionais de precisão |
| Regressão final | npm test; tests.log | **398/398, 26 suites PASS** |
| Lint | npm run lint; lint.log | PASS, --max-warnings=0 |
| Tipos | npm run typecheck; typecheck.log | PASS, next typegen+tsc |
| Build | npm run build; build.log | PASS, Next16.4.0/webpack, rotas estáticas; fora do sandbox pelo EPERM conhecido |
| Print media / browser | browser-print.mjs; browser-print.json | Chromium 156.0.8078.4, seis casos PASS;16 semanas,sem controles/overflow; navegação e sessão preservadas |
| PDFs reais | inspect-pdf.mjs; pdf-inspection.json | todas páginas A4, margens/ordem/linhas PASS; texto e pixels iguais nas duas semanas ativas |
| Prévia / cancelamento nativo | native-preview.mjs; native-preview.json/png | Chromium com janela, ISO_A4, fundos/headers nativos desativados, cancelamento e sessão PASS |
| Integridade / escopo | python3 evidence/block3/audit.py; integrity.json/changed-files.json |54 hashes protegidos intactos; definições/dependências preservadas; T052–T062 pendentes |

## PDFs e inspeção

| Caso | PDF | Páginas | Linhas de produtos (semanas+totais) |
| --- | --- | --- | --- |
| Todos, Vegetativo1 ativa | complete-vegetative1.pdf |10|85|
| Mesmo resultado, Floração4 ativa | complete-flowering4.pdf |10|85|
| Joker10,25L, sem foliar | subset-decimal.pdf |5|17|
| NO_RULE em Joker/Vegetativo4 | incomplete.pdf |11|85|
|20 produtos sintéticos, nomes/fontes longos | long-many.pdf |59|340|
| Cinco produtos,0,001L nas duas vias | subcent.pdf |10|85|

As seis saídas finais totalizam105 páginas (10+10+5+11+59+10); PNG individual de cada página em pages/, contact sheets e arquivos .txt. Não há número de páginas exigido; os cabeçalhos de estágio/semana repetem nas continuações. As16 semanas e80 entradas do caso normal permanecem únicas; repetição de cabeçalhos é contextual, não duplicação de produtos.

Principal inspecionou páginas detalhadas/contact sheets completos/incompletos/subset/subcent e o início do cenário extenso. Architect conferiu todas59 páginas extensas e os completos/incompletos na revisão independente, mais fontes em resolução normal. PDF.js verifica os105 media boxes/limites de texto e contagens. O achado0L foi corrigido com <0,01L acessível no PrintPlan e PDF subcent final revalidado.

## Reprodução

Preparação de QA em /tmp, sem mexer em package.json/lockfile:

```bash
npm install --prefix /tmp/raizora-block3-qa esbuild pdfjs-dist @napi-rs/canvas --no-package-lock --cache /tmp/raizora-npm-cache
```

Playwright/Chromium e bibliotecas do sistema seguem a preparação já registrada em evidence/block2/checks.md. Para reproduzir, usar o build final e iniciar produção local na porta3106. Não reconstruir .next enquanto o servidor estiver em uso; reiniciar após um novo build.

```bash
npm run start -- --hostname 127.0.0.1 --port 3106
node specs/002-raizora-v1-1/evidence/block3/generate-fixtures.mjs
LD_LIBRARY_PATH=/tmp/raizora-block2-browser-libs/extracted/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/tmp/raizora-block2-browsers node specs/002-raizora-v1-1/evidence/block3/browser-print.mjs
node specs/002-raizora-v1-1/evidence/block3/inspect-pdf.mjs
LD_LIBRARY_PATH=/tmp/raizora-block2-browser-libs/extracted/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/tmp/raizora-block2-browsers node specs/002-raizora-v1-1/evidence/block3/native-preview.mjs
```

Generate-fixtures compila PrintPlan/React e fixtures pelo esbuild temporário, usa o motor existente para todos os resultados e grava HTML/json exclusivamente em /tmp/raizora-block3-fixtures. Browser-print abre os HTMLs em página de QA temporária com CSS compilado do build; não cria rota pública ou modifica matriz oficial. Native-preview usa o alvo interno chrome://print por CDP e botão Cancel do próprio diálogo. Inspect-pdf usa PDF.js/canvas para métricas/raster, sem biblioteca de geração de PDF na aplicação. Ferramentas/documentação primária consultadas via Context7.

Audit usa baseline.json, os54 caminhos protegidos do Bloco2 e a cópia temporária de tasks anterior em /tmp/raizora-block3-tasks-before.md para comprovar que apenas marcadores/cabeçalho mudaram. Os hashes persistidos permitem conferir produção protegida sem a cópia temporária.

## Limites

Somente Chromium 156 disponível/exercitado. Firefox/WebKit/Safari, impressora física, leitor de tela, Ctrl+P e conclusão pelo botão Salvar não validados. Headless gera PDF real pelo motor nativo e não prova o diálogo de salvar. A abertura e o cancelamento do diálogo de impressão foram verificados separadamente com janela. A cobertura de T052–T062 permanece pendente e exige autorização para Bloco4. Revisão do architect aqui é específica do incremento, sem executar T060.
