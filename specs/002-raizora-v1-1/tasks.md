# Tasks: RAIZORA v1.1 — configuração, consulta semanal e impressão completa

**Feature**: `002-raizora-v1-1` · **Data**: 2026-10-09
**Status**: **READY FOR RELEASE — T001–T062 validadas**; 62/62 concluídas, nenhuma tarefa pendente.
Execução exclusiva T052–T062 encerrada; limitações de cobertura nativa/browser registradas.
**Escopo desta rodada**: execução exclusiva T052–T062 autorizada em2026-10-10.
Blocos1–3 preservados. Sem commit/publicação/nova versão.
Evidências finais e limitações reais em [implementation-review](implementation-review.md) e `evidence/block4/`.

## Fontes e convenções

Base obrigatória: [constituição 2.0.0](../../.specify/memory/constitution.md),
[spec](spec.md), [plan](plan.md), [research](research.md),
[data-model](data-model.md), contratos de [configuração](contracts/configuration.md),
[navegação](contracts/navigation.md) e [impressão](contracts/printing.md),
[quickstart](quickstart.md), [planning-review](planning-review.md) e
[technical-decisions](technical-decisions.md). Status antigos nesses documentos
são snapshots das etapas anteriores, preservados.

Os caminhos existentes foram conferidos no repositório. Arquivos novos previstos
no plano ou necessários aos testes/evidências são identificados como **novo**.
Não criar estrutura de projeto, dependências, backend, banco, autenticação, rota de
impressão, exportador PDF ou estado paralelo. `src/domain/`, `src/data/`, fontes,
lockfile, fórmulas e documentos históricos são baseline protegida.

Formato: `- [ ] Tnnn [P?] [USn?] ação — arquivos; Dep.: IDs; Aceite: resultado verificável`.
`Dep.: nenhuma` indica raiz; todas as outras dependências são cumulativas.
Além das dependências locais, cada fase começa após o checkpoint da anterior.
`[P]` permite trabalho simultâneo apenas quando os pré-requisitos já estiverem
concluídos e os arquivos forem distintos. Não executar edições concorrentes de
Wizard, CSS, reducer, fixtures ou suites compartilhadas.

Testes unitários/de componentes precedem a implementação do comportamento.
Integrações T023/T036 complementam a cobertura após conectar os incrementos.
O aceite inicial dos testes que precedem implementação
é cobertura executável com falha pelo comportamento ainda ausente quando aplicável;
o checkpoint exige esses testes GREEN. Falha de infraestrutura não comprova RED. Testes podem ser escritos antes da implementação; falhas de resolução de imports não representam RED comportamental válido. Quando necessário, criar o módulo mínimo tipado, sem comportamento, antes de executar a suite. Stubs só são criados ao executar a tarefa correspondente. O checkpoint GREEN permanece obrigatório após implementar.
Checks e evidências aqui descritos são futuros, sem alegação de PASS de software.

### Correspondência de histórias

Os labels US abaixo seguem os cinco recortes e a ordem explicitamente solicitados
para tasks. **H1–H5** designam as histórias numeradas na spec aprovada; não são
renumeradas nem substituídas. Todos os cinco recortes são obrigatórios.

| Label em tasks | Requisito | História/aceite da spec | Prioridade de origem |
| --- | --- | --- | --- |
| US1 — ajuda contextual | R1 | H1, cenários 1–2 | P1 |
| US2 — duração no Plano | R2 | H1, cenário 3; H3 | P2 |
| US5 — frequência fixa | R5 | H1, cenários 3–8; H5, cenário 2 | P1 |
| US3 — navegação semanal | R3 | H2 | P1 |
| US4 — impressão completa | R4 | H4 | P1 |
| Validação transversal | FR-017–020 | H1/H2/H4/H5, V11/REG e edge cases | Obrigatória |

## Fase 1 — Setup e preparação

**Objetivo**: preparar uma execução futura sobre o MVP existente, sem reinstalação
ou pesquisa de arquitetura já aprovada.

- [X] T001 Registrar baseline e limites de alteração após ler os documentos obrigatórios — `specs/002-raizora-v1-1/implementation-review.md` e `specs/002-raizora-v1-1/evidence/baseline.json` (novos); Dep.: nenhuma; Aceite: inventário/hashes de produção, testes, domínio, dados, fontes, lockfile e documentos históricos registrados; fronteiras protegidas e tarefas autorizadas identificadas, sem reabrir regras nutricionais.
- [X] T002 [P] Conferir ambiente e scripts existentes — `.nvmrc`, `package.json`, `package-lock.json`, `vitest.config.ts` (leitura) e `specs/002-raizora-v1-1/evidence/environment.md` (novo); Dep.: nenhuma; Aceite: Node 24.x, dependências instaladas e scripts de unit/UI/lint/typecheck/build identificados; `npm ci` somente se necessário, com cache gravável, sem mudança de versões/lockfile ou runner novo.

**Checkpoint**: T001–T002 concluídas; execução futura delimitada e reproduzível.

## Fase 2 — Fundamentos compartilhados

**Objetivo**: separar oráculos da aplicação v1.1 e do motor genérico antes das
migrações de formulário e apresentação.

- [X] T003 Adicionar fixture explícita de aplicação com frequência 1 e resultados completos/incompletos — `tests/ui/result-fixtures.ts`; Dep.: T001, T002; Aceite: helper v1.1 produz 10 L/2 L/count1 pelo motor existente, permite subset/volumes e reutiliza NO_RULE sintético; helper histórico count3 permanece explícito, sem trocar silenciosamente todas as fixtures.
- [X] T004 [P] Acrescentar oráculos matemáticos v1.1 sem alterar os casos genéricos — `tests/unit/calculation-reference.test.ts`; Dep.: T001, T002; Aceite: V11-01–06 e V11-CICLO conferem preparo/semanal/estágio/ciclo com count1; C-001/C-005 count3 continuam intactos; nenhum arquivo em `src/domain/` ou `src/data/` é modificado.

**Checkpoint**: fixtures separadas disponíveis e oráculos matemáticos GREEN.

## Fase 3 — US1: ajuda contextual de volume (R1)

**Objetivo**: orientação opcional de aproximadamente 10% associada ao campo manual.
**Teste independente**: preencher/editar volumes decimais e consultar a descrição
acessível, inclusive após erro; nenhum input ou cálculo de capacidade do vaso.

- [X] T005 [US1] Cobrir ajuda opcional e edição manual — `tests/ui/configuration.test.tsx`; Dep.: T003, T004; Aceite: assertions verificam aproximadamente 10%, capacidade do vaso, exemplos estáticos, `aria-describedby` apontando para ajuda/erro existentes, manutenção da ajuda decimal e ausência de preenchimento/limite baseado nos 10%.
- [X] T006 [US1] Atualizar somente a descrição do volume de fertirrigação — `src/features/calculator/components/ConfigurationFields.tsx`; Dep.: T005; Aceite: copy comunica referência opcional de aproximadamente 10% e exemplos como texto estático; label, entrada manual, parser/validação e vínculo com ajuda/erro permanecem, sem capacidade numérica nova ou cálculo automático.
- [X] T007 [US1] Validar o incremento de ajuda — `tests/ui/configuration.test.tsx`; Dep.: T006; Aceite: suite GREEN para descrição acessível, exemplos, edição com vírgula/ponto, volumes inválidos e foco; registrar resultado em `specs/002-raizora-v1-1/implementation-review.md`, sem tratar os 10% como prescrição oficial.

**Checkpoint**: R1 demonstrável sem depender da navegação ou da impressão.

## Fase 4 — US2: duração no Plano (R2)

**Objetivo**: retirar duração da Configuração e derivar estágios/total no Plano.
**Teste independente**: Configuração sem painel/input de duração; Plano com 8+8=16,
independente de produto/semana; fixture sintética demonstra ausência de hardcode.

- [X] T008 [US2] Substituir expectativas de localização da duração — `tests/ui/configuration.test.tsx` e `tests/ui/plan.test.tsx`; Dep.: T007; Aceite: testes exigem ausência de duração em Configuração e presença no Plano com estágios e total não editáveis, invariantes sob mudança de semana/seleção.
- [X] T009 [P] [US2] Criar testes da duração derivada — `tests/ui/schedule-duration.test.tsx` (novo); Dep.: T007; Aceite: contagens atuais e estágios sintéticos com outras contagens determinam texto/total; componente não oferece edição nem declara duração universal de RAIZORA. Teste pode preceder implementação; antes da execução, criar módulo mínimo sem comportamento se ausente, para obter RED por assertion comportamental e nunca por import não resolvido; exigir GREEN no checkpoint após implementar.
- [X] T010 [US2] Retirar painel e prop de duração com seu callsite — `src/features/calculator/views/ConfigurationView.tsx` e `src/features/calculator/CalculatorWizard.tsx`; Dep.: T008; Aceite: painel, import/type/prop `stages` e argumento correspondente removidos em conjunto; fluxo do formulário preservado.
- [X] T011 [US2] Criar duração por metadados e integrá-la ao Plano — `src/features/calculator/components/ScheduleDuration.tsx` (novo) e `src/features/calculator/views/PlanView.tsx`; Dep.: T008, T009, T010; Aceite: lê `schedule.stages`/`weekCount`, soma somente contagens de duração e apresenta 8+8=16; não calcula consumo nem depende da semana/produtos.
- [X] T012 [US2] Validar mudança de contexto da duração — `tests/ui/configuration.test.tsx`, `tests/ui/schedule-duration.test.tsx` e `tests/ui/plan.test.tsx`; Dep.: T011; Aceite: suites GREEN, sem prop órfã; duração correta no Plano e ausente na Configuração, com filtros e dados preservados; registrar evidência em `specs/002-raizora-v1-1/implementation-review.md`.

**Checkpoint**: R2 concluído antes de alterar draft/adapter.

## Fase 5 — US5: frequência semanal fixa (R5)

**Objetivo**: dois volumes editáveis e count1 apenas no adapter da aplicação.
**Teste independente**: configurar 10 L/2 L sem input de frequência, consultar
Plano/Receita/Resumo e comparar V11-CICLO; motor direto continua aceitando count3.

- [X] T013 [US5] Cobrir draft de duas strings e ações permitidas — `tests/unit/calculator-reducer.test.ts`; Dep.: T012; Aceite: estado inicial possui somente volumes, cinco selecionados e posição inicial; atualização dos volumes/retorno preserva estado e não existe frequência editável no contrato do draft.
- [X] T014 [P] [US5] Cobrir adapter/gates com frequência interna 1 — `tests/ui/use-calculator.test.tsx`; Dep.: T012; Aceite: resultado canônico count1 sem parse/erro de contagem; volume obrigatório, foliar pendente, exigência ACTIVE/FOLIAR em qualquer semana, seleção vazia, omissão canônica foliar sem selecionados foliares e preservação do draft local; edição/falha invalida resposta anterior.
- [X] T015 [P] [US5] Migrar testes do formulário para somente dois inputs — `tests/ui/configuration.test.tsx`; Dep.: T012; Aceite: coleta/erro de frequência deixam de ser expectativas; labels, agrupamento por via, ajuda R1, ausência de duração R2, decimal, submit por teclado e foco no erro continuam cobertos.
- [X] T016 [P] [US5] Cobrir rótulos de frequência efetiva por modo — `tests/unit/result-selectors.test.ts`; Dep.: T012; Aceite: EVERY_FERTIGATION usa valor efetivo como planejado; FIXED_PER_WEEK identifica prescrição foliar de 1, 2 e 3; apresentação genérica count3 não é substituída por texto fixo 1.
- [X] T017 [P] [US5] Migrar referências de Plano e Receita para a fixture v1.1 — `tests/ui/plan.test.tsx` e `tests/ui/recipe.test.tsx`; Dep.: T003, T012; Aceite: Joker 10 g/preparo e 10 g/semana, Coringa 10 ml/preparo e 20 ml/semana, Terpeno 2 ml/preparo e 6 ml/semana e Plant Protein floração 5 com 80 ml; preparo/consumo e vias mantêm rótulos distintos, inclusive quando valores coincidem.
- [X] T018 [P] [US5] Migrar Resumo para referências v1.1 e incompletude — `tests/ui/summary.test.tsx`; Dep.: T003, T012; Aceite: totais de ciclo 260 g/160 ml/596 ml/32 ml/100 g e totais por estágio da spec; N/A sem amount, NO_RULE sem definitivo afetado e subtotal parcial com rótulo; subset omite produtos e unidades não são somadas.
- [X] T019 [US5] Remover frequência do draft e reagrupar campos por via — `src/features/calculator/state/calculator-reducer.ts` e `src/features/calculator/components/ConfigurationFields.tsx`; Dep.: T013, T015; Aceite: `ConfigurationDraft`/`ConfigurationField`/estado inicial só contêm dois volumes; frequência e seu input/label/ajuda removidos, sem campo oculto; substituir `slice(0, 2)`/`fields[2]` por agrupamento explícito, preservando foliar e ajuda R1.
- [X] T020 [US5] Fornecer frequência 1 no adapter e atualizar o gate — `src/features/calculator/hooks/use-calculator.ts`; Dep.: T014, T019; Aceite: toda entrada da aplicação usa `fertigationApplicationsPerWeek = 1`, sem parse/count/override do draft; gate inicial valida fertirrigação e gate Produtos→Plano preserva seleção/foliar; parser count, validador e fórmulas genéricos permanecem intactos.
- [X] T021 [US5] Rotular EVERY como planejado preservando FIXED — `src/features/calculator/presentation/result-selectors.ts`; Dep.: T016, T020; Aceite: `frequencyLabel` lê `effectiveApplicationsPerWeek`, distingue planejada/prescrita e conserva contagens foliares, sem atribuir count1 ao fabricante nem confundir com regas comuns.
- [X] T022 [US5] Atualizar contexto de volumes e frequência nos resultados — `src/features/calculator/views/ConfigurationView.tsx`, `src/features/calculator/views/PlanView.tsx`, `src/features/calculator/views/RecipeView.tsx` e `src/features/calculator/views/SummaryView.tsx` e `src/features/calculator/presentation/validation-messages.ts`; Dep.: T017, T018, T020, T021; Aceite: Configuração pede apenas volumes; Plano/Receita/Resumo identificam frequência planejada de `result.configuration`, sem fórmula nova; foliar continua prescrito por entry e detalhes de preparo/semanal permanecem; NUMERIC_ERROR orienta somente volumes: “Os valores excedem a capacidade numérica do cálculo. Revise os volumes informados.”
- [X] T023 [US5] Migrar helpers e verificar fluxo com a política fixa — `tests/ui/products.test.tsx` e `tests/ui/calculator-wizard.test.tsx`; Dep.: T022; Aceite: testes não procuram input de count; seis etapas, edição/retorno, seleção vazia, Joker sem foliar e reativação de ACTIVE/FOLIAR mantêm gates/foco; volumes/seleção novos produzem resultados atuais com count1, e falhas não reapresentam plano antigo; integração com volume extremo provoca NUMERIC_ERROR real, confere mensagem exata sem frequência editável, foco no erro e ausência de resultado antigo.
- [X] T024 [US5] Validar a fronteira aplicação versus domínio — `tests/unit/calculator-reducer.test.ts`, `tests/unit/result-selectors.test.ts`, `tests/unit/calculation-reference.test.ts` e `tests/ui/`; Dep.: T019, T020, T021, T022, T023; Aceite: suites afetadas GREEN; busca de usos confirma ausência de count no draft/controles, preservando contrato/parser/validação genéricos e fixtures count3; registrar checks em `specs/002-raizora-v1-1/implementation-review.md`.

**Checkpoint**: entradas e fixtures de aplicação estabilizadas; R5 não restringe o motor.

## Fase 6 — US3: navegação semanal (R3)

**Objetivo**: uma semana detalhada em todas as larguras, seleção única com Receita.
**Teste independente**: percorrer 16 posições nos dois sentidos, cruzar
Vegetativo 8 ↔ Floração 1, usar seleção direta e retornar da Receita.

- [X] T025 [US3] Testar helper de posição adjacente — `tests/unit/week-navigation.test.ts` (novo); Dep.: T024; Aceite: 16 posições e todos pares adjacentes nos dois sentidos, extremos sem wrap, posição/estágio inválido sem destino e stages sintéticos com contagens diferentes; sem condicionais por fabricante ou constante universal 8/16. Teste pode preceder implementação; antes da execução, criar módulo mínimo sem comportamento se ausente, para obter RED por assertion comportamental e nunca por import não resolvido; exigir GREEN no checkpoint após implementar.
- [X] T026 [P] [US3] Cobrir transição atômica do reducer — `tests/unit/calculator-reducer.test.ts`; Dep.: T024; Aceite: `MOVE_WEEK` altera par estágio/semana em um retorno, extremos/posição inválida são no-op, draft/seleção/etapa preservados; `SET_STAGE` de Vegetativo 8 para Floração mantém 8, diferente de movimento sequencial para 1.
- [X] T027 [P] [US3] Testar controles semanais por teclado e limites — `tests/ui/week-navigation.test.tsx` (novo); Dep.: T024; Aceite: botões nativos Anterior/Próxima `type="button"`, disabled nas bordas, evento/direção correto, rótulos e status curto `aria-live="polite"`; operar teclado não submete form nem muda foco para heading da etapa. Teste pode preceder implementação; antes da execução, criar módulo mínimo sem comportamento se ausente, para obter RED por assertion comportamental e nunca por import não resolvido; exigir GREEN no checkpoint após implementar.
- [X] T028 [P] [US3] Substituir testes de comparação por semana única — `tests/ui/plan.test.tsx`; Dep.: T024; Aceite: uma região de produtos da semana, nenhuma NutritionTable escondida, seletores diretos controlados, fontes/duração/política mantidas, selecionados e ACTIVE/N/A/NO_RULE preservados; todas as semanas têm detalhamento acessível sem duplicação.
- [X] T029 [US3] Implementar helper puro por ordem/contagens dos stages — `src/features/calculator/state/week-navigation.ts` (novo); Dep.: T025; Aceite: `getAdjacentWeek` retorna `WeekPosition` ou ausência conforme contrato, sem estado persistido, cálculo nutricional ou hardcode de fases/duração.
- [X] T030 [US3] Acrescentar ação MOVE_WEEK ao reducer existente — `src/features/calculator/state/calculator-reducer.ts`; Dep.: T026, T029; Aceite: direction -1/1 usa helper, atualiza par atomicamente e preserva todas as demais ações/gates, sem dispatch duplo ou novo campo de semana ativa.
- [X] T031 [P] [US3] Criar controles sequenciais com o mesmo helper — `src/features/calculator/components/WeekNavigation.tsx` (novo); Dep.: T027, T029; Aceite: limites derivados pelo helper, botões `type="button"`, disabled textual/semântico e status curto da semana; posição recebida por props sem `useState` paralelo.
- [X] T032 [US3] Integrar apenas a semana selecionada ao Plano — `src/features/calculator/views/PlanView.tsx`, `src/features/calculator/components/NutritionWeekCards.tsx` e `src/features/calculator/components/WeekStageFilter.tsx`; Dep.: T028, T031; Aceite: reutiliza `selectWeek`, cards e selects existentes; integra WeekNavigation, remove NutritionTable da árvore em todas as larguras e preserva produtos, doses, unidades, vias, frequências e estados.
- [X] T033 [US3] Conectar movimento semanal ao estado compartilhado — `src/features/calculator/CalculatorWizard.tsx`; Dep.: T030, T032; Aceite: callbacks disparam somente MOVE_WEEK, mantêm seleção única Plano/Receita e não chamam SUBMIT/NEXT; mudanças de filtros não entram nas dependências do cálculo nem provocam foco no heading.
- [X] T034 [US3] Ajustar layout da semana em desktop/mobile sem overflow — `src/app/globals.css`; Dep.: T033; Aceite: `.plan-cards` visível também em desktop, grid com colunas que podem encolher e textos/unidades legíveis; eliminar regras de comparação conflitantes sem esconder dados/cortes e preservar `.totals-cards`/`.totals-table` do Resumo.
- [X] T035 [US3] Remover módulo de comparação sem consumidores — `src/features/calculator/components/NutritionTable.tsx` e seus estilos exclusivos em `src/app/globals.css`; Dep.: T032, T034; Aceite: busca confirma zero imports/consumidores antes da remoção; nenhuma regra de tabela do Resumo ou seletor genérico ainda utilizado é removido.
- [X] T036 [US3] Cobrir navegação integrada e compartilhamento com Receita — `tests/ui/calculator-wizard.test.tsx` e `tests/ui/use-calculator.test.tsx`; Dep.: T033, T035; Aceite: percurso completo de ida/volta, fronteira em uma ação, seleção direta Floração 5 e troca de estágio preservando semana; Plano→Receita→Plano preserva par; navegação não muda volumes/produtos/totais, não avança etapa e não recalcula o resultado por filtro.
- [X] T037 [US3] Validar incremento semanal — `tests/unit/week-navigation.test.ts`, `tests/unit/calculator-reducer.test.ts`, `tests/ui/week-navigation.test.tsx`, `tests/ui/plan.test.tsx` e suites de integração afetadas; Dep.: T029, T030, T031, T035, T036; Aceite: suites GREEN, nenhum consumidor da comparação, filtros controlados e ausência de estado duplicado; registrar checks em `specs/002-raizora-v1-1/implementation-review.md`; overflow/foco reais permanecem gate T054.

**Checkpoint**: R3 integrado; impressão permanece independente do valor da posição ativa.

## Fase 7 — US4: impressão completa (R4)

**Objetivo**: documento completo pré-renderizado do resultado corrente com A4 nativo.
**Teste independente**: com Floração 4 ativa, imprimir todas as 16 semanas em ordem;
comparar ACTIVE/ausências/totais e preservar sessão ao cancelar/concluir.

- [X] T038 [US4] Testar valores/estados a compartilhar com impressão — `tests/ui/result-value.test.tsx` (novo); Dep.: T037; Aceite: dose g/L/ml/L, quantidade/aggregate, motivos N/A, NO_RULE, subtotal identificado e positivo <0,01 preservam semântica e texto acessível; testes verificam apresentação existente sem duplicar fórmulas.
- [X] T039 [P] [US4] Criar cobertura de documento completo — `tests/ui/print-plan.test.tsx` (novo); Dep.: T037; Aceite: exatamente 16 blocos e 80 entries com cinco selecionados, em ordem, todos os campos FR-009/010, unidades/vias/frequências/volumes, fontes/versão e V11-CICLO; props não dependem da semana ativa e resultado recebido permanece imutado. Teste pode preceder implementação; antes da execução, criar módulo mínimo sem comportamento se ausente, para obter RED por assertion comportamental e nunca por import não resolvido; exigir GREEN no checkpoint após implementar.
- [X] T040 [US4] Cobrir estados, subset e precisão do documento — `tests/ui/print-plan.test.tsx`; Dep.: T039; Aceite: Tricomax vegetativo STAGE_NOT_APPLICABLE, Joker floração 6 WEEK_NOT_USED, NO_RULE sintético e SUCCESS/INCOMPLETE; sem dose/quantidade/zero inventado ou definitivo afetado, subtotal rotulado; subset omite desmarcados, decimais/<0,01 seguem formatadores e ausência de volume foliar é contextualizada.
- [X] T041 [P] [US4] Cobrir integração de print e elegibilidade — `tests/ui/calculator-wizard.test.tsx`; Dep.: T037; Aceite: botão `type="button"`, mock de `window.print()` uma chamada, documento irmão fora do form só em PLAN/SUCCESS inclusive INCOMPLETE; INVALID_INPUT/INVALID_SCHEDULE/NUMERIC_ERROR e outras etapas não oferecem plano antigo; clique preserva etapa/volumes/seleção/posição e não recalcula nem submete.
- [X] T042 [US4] Extrair apresentação compartilhada de dose/estado — `src/features/calculator/components/ResultValue.tsx`; Dep.: T038; Aceite: DoseValue/RuleStateValue reutilizados por RuleDetails e futuros cells, preservando QuantityValue/AggregateValue/IncompleteNotice, rótulos/motivos e formato; sem nova interpretação nutricional ou fórmula.
- [X] T043 [US4] Criar PrintPlan com cabeçalho e contexto canônicos — `src/features/calculator/components/PrintPlan.tsx` (novo); Dep.: T039, T042; Aceite: recebe somente result/schedule/brand compatíveis; exibe RAIZORA, parceiro, cronograma/id/dataVersion, versão de fabricante/auditoria/fontes, ScheduleDuration, volumes e política de `result.configuration`; sem motor, DTO copiado, semana ativa ou fetch.
- [X] T044 [US4] Renderizar todas as semanas e campos do resultado — `src/features/calculator/components/PrintPlan.tsx`; Dep.: T040, T043; Aceite: percorre `result.weeks`/entries de selecionados em ordem; seis colunas do contrato com ACTIVE completo e motivos textuais N/A/NO_RULE, caption e thead contextual com estágio/semana; reutiliza componentes/formatadores/frequencyLabel, sem somas/filtro de semana ou quantidades artificiais.
- [X] T045 [US4] Renderizar agregados e avisos do resultado — `src/features/calculator/components/PrintPlan.tsx`; Dep.: T044; Aceite: tabela própria de `productTotals.byStage/cycle`, unidade por produto, AggregateValue e IncompleteNotice; sem total misto, recálculo ou ProductTotals duplicado por breakpoint; INCOMPLETE global/por escopo sem definitivo e subtotal conhecido explicitamente parcial.
- [X] T046 [US4] Separar shell interativo e documento elegível fora do form — `src/features/calculator/CalculatorWizard.tsx`; Dep.: T041, T045; Aceite: PrintPlan irmão do wrapper de tela, já montado antes do clique apenas em PLAN/SUCCESS, incluindo INCOMPLETE; shell identifica disponibilidade para CSS, sem `aria-hidden` permanente no print, estado de impressão, portal, listeners, efeitos ou nova rota.
- [X] T047 [US4] Conectar botão nativo de impressão no Plano — `src/features/calculator/views/PlanView.tsx` e `src/features/calculator/CalculatorWizard.tsx`; Dep.: T046; Aceite: Imprimir plano completo `type="button"` invoca `window.print()` no handler do client existente, sem acesso a window no render/módulo, dispatch/setState/Effect, submit ou alteração do input/result/posição.
- [X] T048 [US4] Criar CSS de tela/impressão com A4 e fragmentação — `src/app/globals.css`; Dep.: T045, T046, T047; Aceite: display:none de PrintPlan em tela retira árvore acessível/overflow; `@page` A4 portrait/margem inicial 12 mm, 186 mm úteis e `@media print` só no shell elegível; oculta wrapper/controles e restaura largura/padding; tabelas próprias fixed/100%, quebra de textos e thead repetível, sem min-width1900/table-scroll/visibility-hidden ou avoid da semana inteira; Ctrl+P em PLAN válido usa documento completo.
- [X] T049 [US4] Validar regressões da extração de valores — `tests/ui/result-value.test.tsx`, `tests/ui/plan.test.tsx`, `tests/ui/recipe.test.tsx`, `tests/ui/summary.test.tsx` e `tests/unit/format-quantity.test.ts`; Dep.: T042, T047; Aceite: suites GREEN para cards/Receita/agregados, planejada versus prescrita e ausência/precisão; nenhum comportamento de tela mudou por compartilhar renderer.
- [X] T050 [US4] Validar documento DOM e acionamento integrado — `tests/ui/print-plan.test.tsx` e `tests/ui/calculator-wizard.test.tsx`; Dep.: T048, T049; Aceite: conteúdo completo GREEN com estados/totais/fontes e mock uma chamada; posição ativa diferente produz mesmo print, shell não monta plano em falhas/outras etapas, sessão permanece; prova de DOM identificada separadamente de PDF visual.
- [X] T051 [US4] Conferir fronteira de fonte única e isolamento de impressão — `src/features/calculator/components/PrintPlan.tsx`, `src/features/calculator/CalculatorWizard.tsx`, `src/features/calculator/views/PlanView.tsx` e `src/app/globals.css` (revisão); Dep.: T050; Aceite: sem cálculo/soma/clone de resultado, dependência de semana ativa, estado paralelo ou botão submit; registrar revisão em `specs/002-raizora-v1-1/implementation-review.md`; paginação real continua gate T055–T057.

**Checkpoint**: R4 automatizado GREEN; aceite de A4/PDF ainda depende de browser real.

## Fase 8 — Validação e regressão

**Objetivo**: demonstrar os 20 FR e nove SC com oráculos, suites e browser/PDF.
Nenhum mock substitui paginação/foco/layout reais. Corrigir falhas somente nos
arquivos das histórias responsáveis e reexecutar os checks afetados antes do gate.

- [X] T052 Conferir regressões matemáticas e estados nos oráculos — `tests/unit/calculation-reference.test.ts`, `tests/unit/calculation-contract.test.ts`, `tests/unit/calculation-weeks.test.ts`, `tests/unit/calculation-totals.test.ts`, `tests/unit/validate-input.test.ts`, `tests/unit/feeding-schedule.test.ts`, `tests/unit/validate-schedule.test.ts` e `tests/unit/parse-input.test.ts`; Dep.: T051; Aceite: V11-01–06/V11-CICLO, REG-01/02 count3, REG-03 com/sem seleção NO_RULE, frequência foliar 1/2/3, vias/unidades, precisão e agregação antes de arredondamento passam; domínio/dataset e fixtures genéricas continuam preservados.
- [X] T053 [P] Validar jornada completa e invalidação de resultados — `tests/ui/calculator-wizard.test.tsx`, `tests/ui/use-calculator.test.tsx`, `tests/ui/products.test.tsx` e `tests/ui/print-plan.test.tsx`; Dep.: T051; Aceite: fluxo de seis etapas, count1 sempre, gates/foco, edição/seleção, Receita compartilhada, subset, estados e ausência de print/plano obsoleto passam; relatórios de suites unit/UI separados, sem marcar CSS/PDF como verificados por jsdom.
- [X] T054 Validar layout e teclado em browser real — `src/app/globals.css`, componentes/fluxo de `src/features/calculator/` (áreas verificadas) e `specs/002-raizora-v1-1/evidence/browser-smoke.json`/capturas (novos); Dep.: T052, T053; Aceite: 360/768/1280 px, intervalos de 640/1024 e reflow equivalente a zoom 200%, sem overflow/corte da página; semana única e 16 acessíveis, fronteira ida/volta e limites; Tab/Shift+Tab/Enter/Espaço, labels/help/errors, foco previsível nas bordas/status e print oculto em tela; Receita/Resumo e suas tabelas intactos; registrar browser/versão e limitações reais.
- [X] T055 Preparar harness temporário de QA para impressão incompleta — `/tmp/raizora-v11-print-qa/` (novo, fora da aplicação entregue), `tests/ui/result-fixtures.ts` (reuso) e `specs/002-raizora-v1-1/evidence/print-harness.md` (novo); Dep.: T054; Aceite: exercita PrintPlan/motor existentes com NO_RULE sintético, nomes/fontes longos e decimais/subcentésimos, sem alterar matriz ou entregar rota de simulação; instruções de reprodução e origem das fixtures registradas, sem nova dependência de produção.
- [X] T056 Validar prévia A4/PDF completo em Chromium — `src/features/calculator/components/PrintPlan.tsx` e `src/app/globals.css` (áreas verificadas), `specs/002-raizora-v1-1/evidence/print-review.md` e PDFs/capturas em `specs/002-raizora-v1-1/evidence/` (novos); Dep.: T055; Aceite: com cinco produtos/10 L/2 L e Floração 4 ativa, todas as páginas mostram 16 semanas em ordem, campos FR-009/010 e totais V11-CICLO sem omissão/duplicação/corte/sobreposição/controles; thead identifica continuações, estados legíveis com fundos desligados; A4 retrato/escala100% e ajustes manuais registrados; Ctrl+P igual ao botão, outra semana ativa mantém documento, cancelar/concluir preserva sessão.
- [X] T057 Validar PDF de casos adversos e demais navegadores disponíveis — harness `/tmp/raizora-v11-print-qa/`, `specs/002-raizora-v1-1/evidence/print-review.md` e respectivos PDFs/capturas; Dep.: T056; Aceite: conferir todas as páginas de subset, NO_RULE/INCOMPLETE com subtotal sem definitivo, textos longos e <0,01; preservar identificadores nas continuações e unidades; conferir Firefox/WebKit/Safari da baseline disponíveis, registrando versões, ajustes e cobertura indisponível sem alegar PASS; corrigir fragmentação necessária antes do aceite, sem exigir número fixo de páginas.
- [X] T058 Executar gates oficiais após correções de aceite — `package.json` (scripts existentes) e `specs/002-raizora-v1-1/evidence/checks.md` (novo); Dep.: T052, T053, T054, T056, T057; Aceite: `npm test` (unit+UI, ou scripts separados equivalentes), `npm run lint`, `npm run typecheck` e `npm run build` PASS sem warnings/erros; checks afetados repetidos após correções, sem duplicar suites sem motivo, alterar dependências ou relaxar critérios.
- [X] T059 Conferir build de produção e rastreabilidade de aceite — `specs/002-raizora-v1-1/implementation-review.md` e evidências da feature; Dep.: T058; Aceite: smoke com `npm run start` sobre build aprovado percorre configuração→Plano→Receita→Resumo e print; tabela 20 FR/9 SC aponta evidências reais; hashes/diff confirmam motor/matriz/fontes/lockfile/docs históricos preservados e só arquivos previstos alterados; indisponibilidades e falhas não aparecem como PASS.

**Checkpoint**: suites/gates PASS e evidências browser/PDF revisáveis, sem pendências
de aceite. Cobertura indisponível deve ser registrada e avaliada na revisão final;
nunca dispensar falha observada de legibilidade/continuação em navegador conferido.

## Fase 9 — Revisão final e encerramento

**Objetivo**: revisão independente e encerramento futuro com provas, sem publicar.

- [X] T060 Solicitar revisão advisory do architect sobre a implementação e evidências — `specs/002-raizora-v1-1/tasks.md`, `spec.md`, `plan.md`, `contracts/`, `implementation-review.md` e `evidence/`, com alterações de `src/features/calculator/`/`src/app/globals.css`; Dep.: T059; Aceite: parecer concreto sobre organização executada, aceite, fronteiras, regressões, acessibilidade e PDF, sem mutação pelo architect; achados impeditivos identificados e vinculados a tarefas/arquivos.
- [X] T061 Resolver achados da revisão dentro do escopo e fechar evidências — arquivos identificados em T060 e `specs/002-raizora-v1-1/implementation-review.md`; Dep.: T060; Aceite: cada achado tem resolução verificável ou ausência explicitamente confirmada; checks/browser/PDF afetados reexecutados e architect reconfirma achados substanciais; nenhuma mudança de fórmula/matriz/escopo, e nenhuma pendência impeditiva permanece.
- [X] T062 Encerrar somente a execução autorizada e entregar relatório — `specs/002-raizora-v1-1/tasks.md` e `specs/002-raizora-v1-1/implementation-review.md`; Dep.: T061; Aceite: marcar somente tarefas efetivamente concluídas, reportar 20 FR/9 SC, checks/evidências/riscos residuais e arquivos alterados; documentação histórica preservada; sem commit/deploy ou início de nova fase e aguardar instrução explícita do responsável.

## Distribuição e rastreabilidade

| Fase | IDs | Quantidade | História |
| --- | --- | ---: | --- |
| 1 — Setup | T001–T002 | 2 | Compartilhada |
| 2 — Fundamentos | T003–T004 | 2 | Compartilhada |
| 3 — Ajuda | T005–T007 | 3 | US1 |
| 4 — Duração | T008–T012 | 5 | US2 |
| 5 — Frequência | T013–T024 | 12 | US5 |
| 6 — Navegação | T025–T037 | 13 | US3 |
| 7 — Impressão | T038–T051 | 14 | US4 |
| 8 — Validação | T052–T059 | 8 | Transversal |
| 9 — Encerramento | T060–T062 | 3 | Transversal |
| **Total** | **T001–T062** | **62** | **47 por história + 15 compartilhadas/transversais** |

| Requisito | Tasks principais | Aceite e gates |
| --- | --- | --- |
| R1 / FR-001–002 | T005–T007; preservação T015/T019 | H1.1–2, SC-001; T054 |
| R2 / FR-003 | T008–T012 | H1.3/H3, SC-002; T054 |
| R5 / FR-013–016 | T013–T024; oráculos T004 | H1.3–8/H5.2, SC-007–008; T052/T053 |
| R3 / FR-004–007 | T025–T037 | H2, SC-003–004; T054 |
| R4 / FR-008–012 | T038–T051 | H4, SC-005–006; T055–T057 |
| FR-017 — cronograma/matriz/gates | T001/T003/T004/T014/T023/T029 | H1/H5; T052/T053/T059 |
| FR-018 — estados/completude | T018/T028/T038/T040/T044/T045 | H4/H5, REG-03/SC-009; T052/T057 |
| FR-019 — precisão/vias/fonte única | T004/T017/T021/T038/T042–T045/T051 | V11-CICLO, REG, SC-006–008; T049/T052/T056/T057 |
| FR-020 — acessibilidade/layout | T005/T015/T027/T031/T034/T048 | H1/H2/H4, SC-001/003–006; T054/T056/T057 |

Oráculos sem arredondamento de intermediários: Joker 140+120=260 g; Coringa
160 ml no vegetativo, floração NOT_APPLICABLE; Plant Protein 96+500=596 ml;
Terpeno 32 ml no vegetativo, floração NOT_APPLICABLE; Tricomax vegetativo
NOT_APPLICABLE e floração 100 g. REG-01 preserva Joker 10 g/preparo e 30 g/semana
com count3; REG-02 preserva 780 g/160 ml/1.596 ml/32 ml/300 g. Foliares continuam
1/1/2/2/2/2/3/3 e 16 aplicações prescritas no vegetativo, sem multiplicador count1.

## Dependências e caminho crítico

Ordem de integração obrigatória:
**Setup → Fundamentos → US1 → US2 → US5 → US3 → US4 → Validação → Encerramento**.
Essa ordem serializa arquivos compartilhados; não afirma que R1 ou R5 sejam
dependências matemáticas da navegação. Dependência de R4 sobre R3 é estrutural;
o print não depende da semana ativa.

Sem estimativa de esforço, não há duração calculada de caminho crítico. A cadeia
estrutural que bloqueia entrega segue os checkpoints **T002/T001 → T003/T004 →
T007 → T012 → T024 → T037 → T051 → T059 → T062**. Dentro dela, as cadeias
principais são:

- Configuração: T013/T015 → T019 → T020 → T021/T022 → T023 → T024, com join dos demais testes de US5.
- Navegação: T025 → T029 → T030/T031 → T032 → T033 → T034 → T035 → T036 → T037.
- Print: T038 → T042 → T043 → T044 → T045 → T046 → T047 → T048 → T050 → T051, com joins T039/T040/T041/T049.
- Aceite final: T052/T053 → T054 → T055 → T056 → T057 → T058 → T059 → T060 → T061 → T062.

Dependências locais estão indicadas em cada tarefa; os checkpoints de fase são
dependências adicionais de execução, inclusive quando o ID local só cita testes.
T055–T057 bloqueiam encerramento: mock/DOM não aprovam impressão visual.

## Oportunidades e exemplos de paralelismo

**15 tasks com `[P]`**: T002, T004, T009, T014, T015, T016, T017, T018,
T026, T027, T028, T031, T039, T041, T053.

O marcador indica tarefa que pode acompanhar outra trilha da fase; não autoriza
ignorar dependências nem iniciar fases posteriores. Pares/grupos seguros:

| Fase/história | Execução simultânea permitida | Restrição |
| --- | --- | --- |
| Setup/fundamentos | T001 + T002; depois T003 + T004 | Evidências e fixtures/suite unit em arquivos distintos |
| US1 | Sem trilha interna útil | Teste → copy → gate sequenciais |
| US2 | T008 + T009; T010 pode acompanhar escrita de T009 após T008 | T011 integra depois dos três pré-requisitos |
| US5 | T013 + T014 + T015 + T016 + T017 + T018 | Cada task possui suites exclusivas; não executar T023 junto de outra edição do Wizard test |
| US3 | T025 + T026 + T027 + T028; depois T030 + T031 após T029 | Reducer e componente separados; T032/T033/CSS seguem sequenciais |
| US4 | T038 + T039 + T041; T040 após T039 pode acompanhar T042 após T038 | Mesma suite print é serial; PrintPlan/T043–T045, Wizard/T046–T047 e CSS/T048 são serializados |
| Validação | T052 + T053 em processos/suites distintos | Não disputar servidor/porta, estado de harness ou saídas de evidência |

Cada executor modifica somente seus arquivos; principal integra e valida. Roles
explorer/researcher/architect são advisory; somente principal/worker podem mutar.

## Riscos e validações obrigatórias

| Risco | Prevenção/gate |
| --- | --- |
| Count1 vazar para o motor ou substituir foliares | T004/T014/T020/T021/T052; regressões explícitas count3 e foliar1/2/3 |
| Remover campo quebra agrupamento, gate ou foco | T013–T015/T019/T020/T023/T054; sem slice/índice antigo |
| Cruzar fase produz par inconsistente ou submit | T025–T031/T033/T036; MOVE_WEEK único e botões type=button |
| Cards invisíveis no desktop ou tabelas de Resumo afetadas | T028/T034/T035/T054; medir overflow real, sem ocultar dados |
| Print filtra semana ativa ou expõe resultado anterior | T039–T041/T043–T047/T050/T053; PLAN/SUCCESS atual, inclusive INCOMPLETE |
| Renderização compartilhada muda ausência, frequência ou precisão | T038/T042/T049/T052; N/A/NO_RULE sem zero, subtotal sem definitivo |
| PDF corta unidades ou perde estágio/semana na continuação | T044/T048/T055–T057; conferir todas páginas e corrigir composição |
| CSS A4 varia entre browsers ou mock gera falso aceite | T054/T056/T057; versão/ajustes/limitações explícitos, sem promessa de páginas fixas |
| Renumeração da spec perde cobertura de histórias | Correspondência H/US e matriz acima; T059/T060 confrontam 20 FR/9 SC |

## Estratégia e gate originais de geração (snapshot histórico)

Executar apenas após autorização posterior e preparação exigida pelo workflow.
Validar cada história como incremento antes de integrar a próxima. US1 é o
primeiro incremento demonstrável; não é entrega completa da v1.1. R1–R5,
regressões transversais e gates A4/PDF são todos obrigatórios. Não alterar tarefas
para incorporar trabalho fora desses requisitos ou reescrever snapshots históricos.

Setup oficial `setup-tasks.sh --json` resolveu esta feature e o template ativo.
`.specify/extensions.yml` não registra hooks `before_tasks`/`after_tasks`;
nenhum hook de outra etapa deve ser disparado.

**Gate desta geração**: conferir formato/IDs, contagens, dependências acíclicas,
labels/caminhos, cobertura 20 FR/9 SC, integridade da baseline e revisão advisory
do architect sobre este documento. Essa revisão documental é distinta de T060,
que pertence à execução futura. `analyze` não foi executado.

**Resultado em 2026-10-09**: PASS documental. Principal conferiu 62 IDs sequenciais,
dependências para IDs anteriores, nove fases, distribuição de 47 tarefas por história
e 15 compartilhadas/transversais, 15 marcadores de paralelismo, links e caminhos
existentes/novos previstos e rastreabilidade dos 20 FR/nove SC. Comparação SHA-256
da baseline registrada nesta rodada confirmou 143 arquivos intactos e somente
este `tasks.md` adicionado; produção, testes, dependências e snapshots preservados.
Architect revisou organização, cobertura, dependências e paralelismo, sem achados
impeditivos; ajustes editoriais foram incorporados (contagem dos marcadores
e convenção de testes/integração, com limpeza de caractere de formatação).
Nenhuma tarefa foi executada e nenhum teste/check de software foi usado como
evidência de implementação nesta rodada.

**Snapshot de continuidade anterior ao Bloco 3 (2026-10-10)**: Blocos 1 e 2 concluídos e validados; T001–T037 concluídas, T038–T062 pendentes. Bloco 3 pronto para iniciar somente após autorização explícita; não avançar, criar commit ou publicar automaticamente.


**Encerramento atual — Bloco4 (2026-10-10)**: T052–T062 concluídas conforme evidências novas, revisão independente PASS e ausência de achados em T061. Total62/62, **READY FOR RELEASE**.20FR/noveSC rastreados em implementation-review.md. Limitações adicionais permitidas pelo pedido atual: Ctrl+P/Salvar e A4 consolidado no diálogo nativo não concluídos; PDFsA4 completos medidos/inspecionados PASS. Somente Chromium; reflow equivalente200%, sem leitor de tela/impressora física. Nenhuma tarefa nova, commit, deploy ou publicação; execução encerrada aguardando instrução explícita.
