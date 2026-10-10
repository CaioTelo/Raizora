# Implementation Plan: RAIZORA MVP — planejamento nutricional público

**Branch**: `master` (branch Git real; setup-plan retornou BRANCH vazio) | **Date**: 2026-10-03 | **Spec**: [spec.md](spec.md)

**Input**: `specs/001-raizora-mvp/spec.md`, constitution 1.0.1, SRC-007 e pedido desta rodada.
**Status**: planejamento consolidado; revisão final em [planning-review](planning-review.md).
Somente documentação: sem tasks.md, código funcional, instalação, deploy ou execução de tasks/implement.

## Summary

Calculadora pública independente RAIZORA: Landing → Configuração → Produtos → Plano → Receita → Resumo.
Plantas que Curam fornece o único FeedingSchedule do MVP. Núcleo neutro recebe schedule/configuração/seleção
em motor puro, aplica regras declarativas versionadas e devolve resultado canônico para as três visualizações.
Next.js App Router, TypeScript estrito e Tailwind; estado transitório com useReducer local e props.
Sem backend, banco, autenticação, persistência ou state manager externo. Testes priorizam cálculo e integração
UI; browser real complementa responsividade e acessibilidade que jsdom não mede.

## Technical Context

**Language/Version**: TypeScript 5.x strict; Node.js 24.x como toolchain, npm.
Famílias estáveis escolhidas; fixar patches compatíveis/atualizados no package-lock.json durante implementação.
Não existem package.json/dependências instaladas nesta rodada; não alegar patch como “latest”.

**Primary Dependencies**: Next.js 16.x, React/react-dom 19.x compatíveis, Tailwind CSS 4.x.
Desenvolvimento: TypeScript, tipos Node/React, ESLint/eslint-config-next, PostCSS/@tailwindcss/postcss,
Vitest 4.x, Vite/@vitejs/plugin-react, jsdom, @testing-library/react/dom/user-event/jest-dom.
Vite é runner de testes, não bundler da aplicação. Sem decimal library, Zod, UI kit, pacote de ícones ou store.

**Storage**: nenhum. Dataset tipado estático local e estado em memória enquanto wizard está montado.
Sem localStorage/sessionStorage/IndexedDB/cookie de cultivo, URL de configuração ou restauração após refresh.

**Testing**: Vitest projects unit/Node e ui/jsdom + Testing Library; lint/typecheck/build;
roteiro browser em 360/768/1280 px, intervalos, zoom/teclado/leitor de tela. Sem Playwright inicialmente.

**Target Platform**: web pública responsiva; Safari16.4+, Chrome111+, Firefox128+ conforme Tailwind4.
Build convencional Next com páginas pré-renderizáveis, compatível com Vercel ou plataforma equivalente.
Sem Route Handlers, Server Actions, proxy/middleware, serviços remotos ou infraestrutura stateful.

**Project Type**: aplicação web única, frontend-only quanto à funcionalidade.

**Performance Goals**: cálculo síncrono linear nos slots, sem I/O. Dataset de80 posições é pequeno;
sem SLA/benchmark inventado, cache complexo, Redis, worker ou web worker. Não carregar JPEG/PDF no runtime.

**Constraints**: matriz vigente da spec; três inputs; seleção default completa, vazia inválida;
foliar condicional à seleção; duração8+8 deste schedule, não universal. Sem fator orgânico, edição de duração
ou frequência foliar. OQ-013 opcional/deferred, sem bloquear arquitetura. Nenhuma funcionalidade futura automática.

**Scale/Scope**: seis telas, cinco produtos, dois estágios atuais, 16 semanas,
80 slots (49 ACTIVE,24 N/A ao estágio,7 não usos semanais confirmados). Nenhum dado de usuário no servidor.

## Constitution Check

Gate inicial antes de pesquisa: **PASS**. Fontes auditadas em spec/review; OQ-001–OQ-012 resolvidas;
OQ-013 opcional. Gate pós-design: revisão dos artefatos efetivos em planning-review; nenhuma exceção prevista.

| Princípio | Evidência do design | Resultado |
| --- | --- | --- |
| I Independência | RAIZORA principal; parceiro como provider | PASS |
| II Multi-marca | Brand/Product/Schedule separados, core sem imports de parceiro | PASS |
| III Regra como dado | Dose/via/frequência/status em slots semanais | PASS |
| IV Fonte oficial | Matriz da spec, provenance por aspecto, versão local separada da versão do fabricante | PASS |
| V Não inventar | Missing → NO_RULE; N/A explícito; sem Speed Vega/fator60/extrapolação | PASS |
| VI Motor independente | Entrada→saída pura, sem React/Next/DOM/I/O/global | PASS |
| VII Determinismo/testes | Ordem fixa, Number definido, soma bruta, fixtures e C-005 | PASS |
| VIII Tipagem | Dose/quantidade/via/frequência/status discriminados; unidades validadas | PASS |
| IX Responsividade | Cards mobile, grids tablet, comparação semanal desktop; teclado/labels | PASS |
| X Limites MVP | Somente fluxo público, sem persistência ou recursos futuros | PASS |
| XI Infra proporcional | Páginas estáticas/cálculo client; sem backend dedicado/banco/serviço | PASS |
| XII Contexto separado | PDF/layout só contexto/visual, não runtime matemático | PASS |
| XIII Evolução parceiros | Dataset compatível exige dados/composição, não algoritmo novo | PASS |
| XIV Ambiguidades | OQs resolvidas; NO_RULE não tem total definitivo | PASS |

PASS nesta rodada significa conformidade documental do desenho e estratégia. Testes executáveis ainda não existem
nem foram executados; não equivale a software validado. Architect revisa decisões substanciais e entrega final.

## Project Structure

### Documentation (this feature)

```text
specs/001-raizora-mvp/
├── spec.md, open-questions.md, review.md       # baseline/auditoria histórica
├── checklists/requirements.md                 # snapshot histórico de specify
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── calculation.md
│   └── wizard.md
└── planning-review.md                         # evidências/gates desta rodada
```

tasks.md é próxima fase e não é criado. review/checklist preservam história; planning-review registra estado novo.
README/AGENTS indicam continuidade atual; constitution e matriz da spec não são alteradas.

### Source Code (proposta, não criada)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                              # landing /
│   └── calculadora/page.tsx                  # composição /calculadora
├── domain/
│   ├── brands/types.ts
│   ├── products/types.ts
│   ├── nutrition/
│   │   ├── types.ts                          # schedule/stage/slot/frequency
│   │   └── validate-schedule.ts
│   └── calculation/
│       ├── types.ts                          # config/response/aggregates
│       ├── validate-input.ts
│       └── calculate-plan.ts                 # engine + helpers coesos
├── data/brands/plantas-que-curam/
│   ├── brand.ts
│   ├── products.ts
│   └── schedule.ts                           # 80 slots + metadata
└── features/calculator/
    ├── CalculatorWizard.tsx                  # raiz client
    ├── state/calculator-reducer.ts
    ├── hooks/use-calculator.ts               # validação/result derivados
    ├── presentation/
    │   ├── parse-input.ts
    │   ├── format-quantity.ts
    │   ├── validation-messages.ts
    │   ├── result-selectors.ts               # filtro/projeção, sem fórmulas
    │   └── content.ts                        # copy/placeholders substituíveis
    ├── components/
    │   ├── StepNavigation.tsx
    │   ├── ConfigurationFields.tsx
    │   ├── ProductSelection.tsx
    │   ├── WeekStageFilter.tsx
    │   ├── NutritionTable.tsx
    │   ├── NutritionWeekCards.tsx
    │   ├── RecipeGroup.tsx
    │   └── ProductTotals.tsx
    └── views/
        ├── ConfigurationView.tsx
        ├── ProductsView.tsx
        ├── PlanView.tsx
        ├── RecipeView.tsx
        └── SummaryView.tsx
tests/
├── unit/                                    # domínio/dados/parser/reducer/format
├── ui/                                      # wizard/views semânticas
└── setup/ui.ts
public/placeholders/                         # assets se necessários
package.json, package-lock.json, tsconfig.json
next.config.ts, postcss.config.mjs, eslint.config.mjs, vitest.config.ts
```

**Structure Decision**: uma aplicação, três fronteiras domain/data/features. Domain só importa domínio;
data importa tipos de domínio; features recebe schedule por props e importa contracts/validators do domínio,
sem importar parceiro. A página /calculadora compõe o único dataset/Brand. Landing fica fora do wizard client.
Não criar registry, DI/repository, service abstrata vazia ou monorepo. Não impor arquivo por helper/componente
trivial; a árvore orienta responsabilidades e futuras tasks. Alias @/ aponta src na aplicação e nos testes.

## Domínio e Calculation Engine

Brand identifica provider; Product tem unidade final, sem dose/via/frequência globais. FeedingSchedule contém
catálogo, StageDefinitions e slots/fontes/versionamento. Stage é valor com weekCount; Week é índice validado,
sem entidade persistida. Relação: Brand → Products/Schedule → StageDefinition → posições semanais → NutrientRule.
Campos/obrigatoriedade/invariantes/exemplos: [data-model](data-model.md).

ACTIVE carrega Dose, ApplicationType e Frequency discriminada; confirmação/provenance é obrigatória.
NOT_APPLICABLE carrega razão STAGE_NOT_APPLICABLE ou WEEK_NOT_USED, sem quantidade/evento.
NO_RULE carrega MISSING/UNCONFIRMED, sem consumo inventado; ausência de slot esperado tem essa semântica.
Deseleção é filtro global, não status nem redistribuição de dose.

[calculateNutritionPlan](contracts/calculation.md) recebe schedule, configuration e selectedProductIds.
Valida/normaliza, percorre stage→week→product na ordem declarada, escolhe volume por via e calcula:

```text
amountPerApplication = dosePerLiter × preparationVolumeLiters
weeklyAmount(FIXED_PER_WEEK) = amountPerApplication × prescribedApplicationsPerWeek
weeklyAmount(EVERY_FERTIGATION) = amountPerApplication × fertigationApplicationsPerWeek
cycleTotal(product) = Σ weeklyAmount de ACTIVE selecionados/confirmados
```

Somente status/modo/via/unidade determina ramos. Sem condição por nome de marca/produto/semana,
regra na UI ou import de parceiro no core. Helpers equivalentes a preparo/semana/estágio/ciclo/totais podem
permanecer no módulo calculate-plan; agregam WeekCalculation já gerado, sem recalcular fórmula nas telas.
Engine é pura, síncrona, sem clock/I/O/global/browser e não modifica entradas.

Resultado canônico inclui configuração/versão/seleção, weeks com entries e quantidades ACTIVE,
productTotals por estágio/ciclo, missingRules e completeness. Agregados discriminam COMPLETE/amount,
NOT_APPLICABLE sem número e INCOMPLETE sem total definitivo. SUCCESS pode conter INCOMPLETE;
falhas INVALID_INPUT/INVALID_SCHEDULE/NUMERIC_ERROR nunca carregam result antigo.
Dataset atual é COMPLETE; fixtures sintéticas NO_RULE/outro ID validam extensibilidade, não integram outra marca.

Provenance distingue dose/via da tabela, frequências e confirmações SRC-004/006/007. Versão local não se passa
por versão oficial; providerScheduleVersion/sourceDate podem ser null quando desconhecidas. PDF/layout são
referências documentais, não dados do motor; hashes permanecem em spec/review, sem necessidade de runtime.

## Validação, precisão e apresentação

Validação numérica/relacional pura no domínio, compartilhada com adapter UI. Parser único preserva draft string,
aceita vírgula/ponto decimal sem milhar/expoente conforme research R-006; não truncar com parseFloat/parseInt.
Fert volume finito >0 e count inteiro seguro >=1 sempre obrigatórios; foliar exigido quando existir ACTIVE FOLIAR
selecionado em qualquer semana. Sem foliar selecionado, adapter omite volume canônico e mantém draft transitório.
Domínio valida qualquer volume opcional que efetivamente receba. Seleção não vazia/única/conhecida.
Sem máximo agronômico; faixa técnica de representação não é recomendação nutricional.

Number é suficiente para referências atuais, sem garantia de decimal exato arbitrário. Não arredondar intermediários;
somar em ordem fixa. Multiplicação/soma não finita ou underflow de positivos para zero gera erro técnico.
Contagem fora de inteiro seguro é inválida. Testes inteiros conhecidos têm igualdade exata; testes decimais
usam tolerância explícita abs 1e-12/rel 1e-12 para fixtures de pequena magnitude, sem mascarar dose/frequência.
Sem toFixed/EPSILON universal no motor. [Research R-005](research.md) registra custo/alternativas/limites.

Formatter único Intl.NumberFormat pt-BR, até2 casas, sem zeros finais, halfExpand. Positivo que exibiria zero recebe
< 0,01 unidade, sem mudar valor. Estados sem consumo exibem — com motivo acessível, nunca 0. Nenhuma tela soma strings.

## Estado, navegação e UI

/ é landing estática; /calculadora contém Configuração/Produtos/Plano/Receita/Resumo internamente.
useReducer local com currentStep, três strings draft, selectedProductIds, viewedStageId/weekNumber e interação dos erros.
Config normalizada/response/totais são derivados, sem cópia no reducer nem Effect de sincronização. Cálculo barato
síncrono na raiz; views recebem mesmo resultado. Sem Context/store/URL state; useMemo não é requisito de correção.

Configuração→Produtos valida fert volume/count e permite foliar pendente. Produtos→Plano valida seleção/config final;
foliar necessário faltante oferece retorno ao campo com foco, mantendo escolhas. Remover todos foliares permite ausência.
Defaults só na criação do estado: voltar com seleção vazia não a restaura. Voltar interno preserva dados/filtros;
refresh/sair da rota ou URL compartilhada reinicia. Back do navegador segue rotas, não etapas. Progresso conta fluxo
completo de6 telas, Configuração2/6. [Contrato completo](contracts/wizard.md).

Plano/Receita compartilham filtro limitado ao schedule. Mudança de estágio preserva semana válida ou reinicia1.
Plano distingue dose oficial/L, via/frequência, preparo e semanal. Receita filtra ACTIVE/via e mostra um preparo,
frequência só informativa. Resumo usa byStage/cycle sem soma adicional. Não prometer compatibilidade de mistura,
ordem de preparo, pH/EC ou orientação agronômica adicional.

RAIZORA principal; “Plano nutricional por Plantas que Curam” identifica parceiro. Origem/versão e decisões do responsável
são identificadas sem atribuição falsa ao fabricante. Placeholders em content/public facilmente substituíveis;
sem claims/preços/formulações não validados, fatores/inputs/números incorretos do mockup. OQ-013 não bloqueia tasks.

## Responsividade e acessibilidade

Tailwind4 mobile-first com breakpoints padrão: sm40rem/640, md48rem/768, lg64rem/1024,
xl80rem/1280, 2xl96rem/1536, com base16px. Larguras de aceite não redefinem os breakpoints.

| Faixa | Composição |
| --- | --- |
| Mobile/base | Wizard vertical, inputs/cards em coluna, plano da semana em cards com todos rótulos, navegação simples |
| Tablet/md | Campos agrupados por via, seleção em grid, comparação ampliada sem mudar ordem DOM |
| Desktop/lg+ | Tabela comparativa de semanas do estágio, dose/L e semanal explícitos por célula; receita lado a lado; resumo tabela/cards |

Semana escolhida tem destaque textual, não só cor. Apresentações desktop/mobile leem mesmas entries; versão oculta
não permanece na árvore acessível. Overflow somente local em tabela nomeada e navegável por teclado, nunca página toda.
Limitar largura de texto e aproveitar largura dos painéis, sem somente esticar mobile.

Labels/fieldset/legend reais, checkbox/select/button nativos, ajuda/unidade ligada por aria-describedby,
aria-invalid/mensagem próxima; submit inválido foca primeiro erro. Mudança de etapa foca heading/progresso com aria-current.
Tab/Shift+Tab/Enter/Espaço funcionam sem armadilha; foco visível e sem dependência de hover/cor. Tabelas com caption/th scope.
Contraste visual mínimo WCAG AA:4.5:1 texto comum e3:1 texto grande/controles relevantes. Browser verifica360/768/1280,
intervalos, zoom200%, teclado e leitura de erros/— em leitor de tela; jsdom não prova compliance.

## Test strategy e aceitação

### Unit — prioridade máxima; Node sem renderizar React

| ID | Caso | Esperado |
| --- | --- | --- |
| U-01 | Joker veg S1,1g/L×10L×3 | 10g/preparo;30g/semana (C-001) |
| U-02 | Coringa veg S3,5ml/L×2L×FIXED2 | 10ml/preparo;20ml/semana (C-002) |
| U-03 | Terpeno veg S7,1ml/L×2L×FIXED3 | 6ml/semana |
| U-04 | Joker flora S4,3g/L×10L×3 | 90g/semana |
| U-05 | Protein flora S5,8ml/L×10L×3 | 240ml/semana |
| U-06 | Tricomax flora S5,1g/L×10L×3 | 30g/semana |
| U-07 | N/A de estágio e WEEK_NOT_USED | Sem amount/evento/incompletude |
| U-08 | Desmarcar produto | Omitir entries/totais, preservar restantes |
| U-09 | C-005, por estágio/ciclo | 780g/160ml/1596ml/32ml/300g; data-model |
| U-10 | Joker0.004L×3, seleção só Joker | S1:0.004g/preparo,0.012g semanal; veg0.168g,flora0.144g,ciclo0.312g; sem soma da exibição |
| U-11 | Frequência e volume por via | Count só afeta EVERY; Protein usa volume foliar veg e fert flora |
| U-12 | Dataset/provenance contra matriz | 80 slots,49 ACTIVE/24 N/A/7 não uso; todos doses/modes/vias/fontes |
| U-13 | Gap/NO_RULE selecionado ou não | Selecionado incompleta agregado sem definitivo; não selecionado não incompleta seleção |
| U-14 | Inputs/dados inválidos | IDs/duplicatas/ranges/weekCount/provenance/unit/mode inválidos, codes e sem result antigo |
| U-15 | Determinismo/mutation | Repeat igual, ordem seleção normalizada, freeze entradas |
| U-16 | Parser/formatter/extremos | Vírgula/ponto, finitude/count seguro; overflow produto/soma, underflow; empate/subcentésimo |
| U-17 | Fixture neutra IDs/labels/duração menor | Não fixa fabricante ou8 semanas; sem integrar outra marca real |

Também C-003 (Joker veg S4:20g/preparo,60g semanal) e C-004 (10+20ml=30ml sintético).
U-10 verifica regressão real de arredondamento usando tolerância binária explícita. Não aprovar somente snapshots
ou testes que espelham fórmula sem referência conhecida. Sem percentual arbitrário de coverage: todos ramos
status/frequência/unidade/falha e referências são gates obrigatórios.

### UI/integração — ui/jsdom

Wizard montado com dataset real, user-event e queries semânticas: labels e três inputs; vazio/zero/negativo/texto/fração
count, decimais positivos; foliar pendente/correção focalizada/desmarcar/reselecionar; defaults/vazio/voltar preservado;
editar atualiza resultados; filtros e limites; plano distingue dose/preparo/semanal; receita vegS4 Joker20g/Coringa10ml/
Protein6ml/Terpeno2ml, não consumo semanal, grupos por via; resumo C-005; N/A acessível/NO_RULE sem total definitivo;
foco/teclado/erros. Landing CTA em teste semântico; roteamento real/refresh no browser.

Vitest projects unit include tests/unit/**/*.test.ts, ui include tests/ui/**/*.test.tsx, setup ui jest-dom/cleanup;
alias @/ igual src; plugin React no UI. Imports de teste explícitos sem poluir globals da aplicação.
Componentes são síncronos; não há teste de async Server Component dependente de E2E.

### Browser e gates futuros

[Quickstart](quickstart.md) exige jornada dev/prod, rota direta/refresh/back, edição sem stale result,
360/768/1280/intervalos, zoom/teclado/contraste/reader e overflow. jsdom não prova CSS/rotas.
Sem Playwright inicialmente: automação browser só será reavaliada diante de lacuna concreta, sem infraestrutura nesta rodada.

| Histórias/critério | Evidência planejada |
| --- | --- |
| US1/SC-001/FR-001,002 | CTA/branding e rota browser |
| US2–3/SC-007/FR-003–007 | Parser/validator/reducer unit, seleção/gates UI |
| US4/SC-002,003/FR-008–011,014–016 | Engine/dataset/provenance unit, plano UI |
| US5/SC-002/FR-009,010,012 | Preparo/via unit, Receita UI |
| US6/SC-004,006/FR-013,014,018 | C-005/incompletude/precisão unit, resumo UI |
| FR-017/princípios II,XIII | Fixture neutra e auditoria de imports |
| SC-005/UX-001–007 | Browser responsive/a11y/conteúdo com evidências |

## Scripts definidos para implementação futura

| Script npm | Comando planejado | Uso |
| --- | --- | --- |
| dev | next dev | Desenvolvimento |
| lint | eslint . --max-warnings=0 | CLI ESLint, não next lint |
| typecheck | next typegen && tsc --noEmit | Gerar tipos de rota e verificar tipagem |
| test | vitest run | Unit + UI |
| test:unit | vitest run --project unit | Domínio/presentation/reducer |
| test:ui | vitest run --project ui | Integração jsdom, não browser runner |
| test:watch | vitest | Iteração |
| build | next build | Produção |
| start | next start | Preview do build convencional |

Quickstart distingue proposta de comandos disponíveis hoje. Fundação futura define ignores de node_modules/.next/
coverage/log/env e flat ESLint, sem ignore de tecnologia não adotada. Build não depende de fonte remota: fontes locais.

## Ordem proposta de implementação — sem tasks

Estas são fases/dependências técnicas; futura geração organiza tasks por histórias e respeita os pré-requisitos.

| Fase | Saída | Dependência/gate |
| --- | --- | --- |
| 1 Fundação | Next/TS/Tailwind/scripts/aliases/lint/Vitest/rotas shell | Preservar specs/AGENTS; dev/lint/typecheck/build básicos coerentes |
| 2 Contratos/dados | Tipos/validators/catálogo/80 slots/provenance | Fase1, auditoria independente contra spec, U-12/14 |
| 3 Motor puro | Helpers/result/agregados/falhas, testes de referência antes da implementação correspondente | Fase2; U-01–15/17 e C-001–005 passam |
| 4 Controller/presentation | Parser/formatter/reducer/hook/filter/selector/gates | Fase3; U-16/transições, sem matemática UI |
| 5 Entrada pública | Landing, Configuração, Produtos, labels/erros/retorno/defaults | Fase4; US1–3 integradas |
| 6 Visualizações | Plano, Receita, Resumo sobre resultado único | Fases3–5; US4–6 verificáveis por fixture canônica |
| 7 Validação transversal | Responsive/a11y/browser dev-prod, todos checks | Todas; SC-001–007 e14 princípios, conteúdo provisório identificado |

Testes acompanham as fases; responsividade/semântica já começam nos componentes5/6. Fase7 verifica, não adia todo layout.
Após estabilizar contratos/controller, views/landing podem trabalhar em paralelo em arquivos distintos. Não editar
reducer/dataset/contratos centralizados concorrentemente; orchestrator integra. Nenhuma fase executada nesta rodada.

## Deploy, privacidade e riscos

Build Next convencional na Vercel/equivalente, sem serviços stateful, secrets/env obrigatórios para calcular,
dados pessoais, analytics invasivo, logs de cultivo ou armazenamento desnecessário. Dataset local público.
Não configurar deploy agora. Escolha/alternativas em [research](research.md), sem duplicar stack de hosting.

Riscos concretos: transcrição futura pode errar (auditoria80 slots/fixtures); Number tem limite/aproximação
(guards/testes); jsdom não verifica rotas/layout real (browser obrigatório); copy/assets OQ-013 diferidos
(revisão antes da publicação). Não há blocker matemático/arquitetural derivado desses riscos.

## Complexity Tracking

Nenhuma violação constitucional ou exceção. Sem camadas/transporte/persistência/dependências para problemas futuros.
Contracts são interfaces úteis domínio/UI; não simulam backend ausente.

## Próxima etapa

Após revisão documental final PASS: **READY FOR TASKS**. Próximo comando em rodada autorizada: `$speckit-tasks`.
Não executar automaticamente.
