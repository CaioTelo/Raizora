# Checks — Bloco 2 (T025–T037)

Execução 2026-10-10; Node24.16.0/npm11.16.0. Versões/dependências do projeto preservadas. Sem commits ou T038+. Estes gates validam o incremento, sem marcar T052–T062.

| Verificação | Comando/evidência | Resultado |
| --- | --- | --- |
| RED comportamental | npm test -- tests/unit/week-navigation.test.ts tests/unit/calculator-reducer.test.ts tests/ui/week-navigation.test.tsx tests/ui/plan.test.tsx; red.log | 48 falhas e 29 passes; imports resolvidos e assertions de comportamento |
| GREEN local | Mesmo comando, green.log | 77/77, quatro suites |
| Regressão completa | npm test; tests.log | 372/372, 24 suites |
| Lint | npm run lint; lint.log | PASS, max-warnings=0, inclui harness após sua correção |
| Tipos | npm run typecheck; typecheck.log | PASS (next typegen + tsc --noEmit) |
| Produção | npm run build; build.log | PASS; Next16.4.0/webpack, TypeScript e rotas estáticas |
| Browser real | npm run start -- --hostname 127.0.0.1 --port 3102; browser.log/browser-smoke.json | PASS, Chromium156.0.8078.4, sete cenários |
| Integridade | baseline.json/integrity.json/changed-files.json | SHA-256 dos protegidos e inventário de alterações |

O build foi executado fora do sandbox pelo erro EPERM conhecido no subprocesso TypeScript da rodada anterior. Download/execução do browser também recebeu aprovação automática para sair do sandbox: DNS restrito ao CDN e sockets do Chromium bloqueados. Nenhuma aprovação rejeitada; nenhum ajuste de infraestrutura na aplicação.

Browser/Playwright e três bibliotecas do sistema foram baixados/extratos somente em /tmp, sem instalar pacotes no sistema, mudar package/lock ou criar rota de QA. Context7 /reactjs/react.dev e /microsoft/playwright consultados; estado derivado, reducer único e DOM estável orientam integração/foco. Documentação primária: https://react.dev/learn/extracting-state-logic-into-a-reducer e https://playwright.dev/docs/library.

## Reprodução do smoke

Pré-requisito: build aprovado e servidor local de produção na porta3102. Preparação temporária usada nesta sessão (requer acesso de rede e permissão de subprocessos/sockets):

```bash
npm install --prefix /tmp/raizora-block2-browser playwright --no-package-lock --cache /tmp/raizora-npm-cache
PLAYWRIGHT_BROWSERS_PATH=/tmp/raizora-block2-browsers node /tmp/raizora-block2-browser/node_modules/playwright/cli.js install chromium
mkdir -p /tmp/raizora-block2-browser-libs
cd /tmp/raizora-block2-browser-libs
apt-get download libnspr4 libnss3 libasound2t64
for package in *.deb; do dpkg-deb -x "$package" extracted; done
```

A partir da raiz do projeto:

```bash
LD_LIBRARY_PATH=/tmp/raizora-block2-browser-libs/extracted/usr/lib/x86_64-linux-gnu PLAYWRIGHT_BROWSERS_PATH=/tmp/raizora-block2-browsers node specs/002-raizora-v1-1/evidence/block2/browser-check.mjs
```

Harness faz assertions de seletores/semana única, 16 posições ida/volta, type=button/disabled/status, Enter/Espaço nas fronteiras e bordas, foco visível e Tab/Shift+Tab; verifica preservação de volumes/produtos/semana e totais em Plano↔Receita↔Resumo. Em todos estados de ida mede scrollWidth da página e recortes/overflow interno de controles/valores. Capturas de Floração5 permitem revisão visual das cinco larguras e reflow. Todas as sete configurações passaram, sem erros de console/página.

A primeira tentativa do harness abriu menu nativo do select antes de Shift+Tab; o popup consumiu a tecla. Corrigido somente no harness com Escape, registrado em browser-harness-first.log. Falha do harness não foi apresentada como regressão da aplicação ou aprovação de teste.

Limitações: somente Chromium headless; Firefox/WebKit/Safari, leitura com leitor de tela e zoom pela interface do navegador não exercitados. Reflow200% equivale a 1280→640 e 640→320 CSS px com deviceScaleFactor2; isso não substitui toda a experiência de zoom nativo. Impressão não pertence ao bloco. Artefatos temporários e logs anteriores do Bloco1 preservados; sem novas dependências entregues.
