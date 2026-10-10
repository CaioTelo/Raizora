# Implementation Plan: RAIZORA v1.1 — consulta semanal e impressão completa

**Branch**: `master` (branch Git real; setup-plan retornou BRANCH vazio)
**Date**: 2026-10-08 · **Spec**: [spec.md](spec.md)

**Input**: constituição 2.0.0, spec aprovada, technical-decisions, open-questions,
review e autorização explícita para executar somente plan.
**Status**: plano técnico consolidado; revisão final em [planning-review.md](planning-review.md).
Tasks, implementação, instalação, execução de testes de software e commits não fazem parte desta rodada.

## Summary

Alterações concentradas em `features/calculator` e CSS: dois volumes configuráveis,
frequência planejada um no adapter, duração no Plano, cards de uma semana em todas
as larguras, navegação sequencial no reducer existente e uma representação dedicada
para impressão. `CalculationResult` continua sendo a única fonte de quantidades,
frequências efetivas, completude e agregados para Plano, Receita, Resumo e impressão.

Não alterar `src/domain/`, `src/data/`, fórmulas, dataset, fontes ou dependências.
Contratos locais: [configuração](contracts/configuration.md),
[navegação](contracts/navigation.md) e [impressão](contracts/printing.md).
Decisões e alternativas: [research](research.md); deltas: [data-model](data-model.md).

## Technical Context

**Language/Version**: TypeScript 5.9.3 estrito; Node.js 24.x. Versões observadas
no package-lock local, sem atualização ou alegação de versão mais recente.
**Primary Dependencies**: Next.js 16.4.0, React/react-dom 19.3.0, Tailwind CSS 4.3.3.
**Storage**: estado transitório em `useReducer`; sem banco, storage ou URL de cultivo.
**Testing**: Vitest 4.1.11, Testing Library React 16.3.3, jsdom 29.1.1;
testes unitários/UI, lint/typecheck/build e browser real, conforme [quickstart](quickstart.md).
**Target Platform**: web pública; preservar baseline de navegadores do MVP
(Safari 16.4+, Chrome 111+, Firefox 128+). Opções de A4/PDF dependem do diálogo nativo;
suporte a `@page size` em versões antigas exige conferir/selecionar A4 manualmente.
**Project Type**: aplicação web existente, duas rotas, sem nova integração externa.
**Performance Goals**: cálculo síncrono existente preservado; nenhuma chamada ao
motor por ação de impressão. Navegação muda apenas filtro. Sem novo SLA ou cache.
**Constraints**: 8+8 do schedule, frequência um da aplicação, foliares prescritos,
sem matemática em componentes; impressão completa legível, sem biblioteca externa.
**Scale/Scope**: cinco produtos, 16 semanas, 80 slots existentes. PrintPlan representa
até 80 entries selecionadas e totais existentes; nenhum dado nutricional novo.

## Constitution Check

Gate inicial: **PASS** — checklist 25/25, OQs resolvidas e plan explicitamente autorizado.
Gate pós-design: **PASS documental**, sujeito à revisão final registrada no planning-review.

| Princípio | Evidência do planejamento |
| --- | --- |
| I Independência | RAIZORA principal e parceiro identificado em tela/impresso |
| II Multi-marca | Brand/Product/Schedule recebidos por props; sem branch por fabricante |
| III Regras como dados | Dose/via/frequência/estado lidos das entries canônicas |
| IV Fonte oficial | Matriz/provenance preservadas; imprimir fontes/versão atuais |
| V Não inventar | N/A, não uso e NO_RULE sem valores artificiais; sem Speed Vega/fator orgânico |
| VI Motor independente | Frequência um somente no adapter; browser/DOM fora do domínio |
| VII Determinismo | Motor/precisão imutados; fixtures de um e três separadas |
| VIII Unidades | Reutilizar formatação; preparo/semanal/ciclo e g/ml distintos |
| IX Responsividade | Uma semana em todas larguras, 16 alcançáveis e impressão completa |
| X Limites | Somente R1–R5, sem funcionalidades adicionais |
| XI Infraestrutura | Stack/dependências existentes, impressão nativa e sem backend |
| XII Contexto | Ajuda de 10% é copy aprovada, sem cálculo/validação nutricional |
| XIII Extensibilidade | Helper navega stages/weekCount; contratos do motor não mudam |
| XIV Ambiguidades | Nenhum blocker; detalhes de implementação decididos nesta fase |

Conformidade é do desenho documental; não declara v1.1 implementada ou browser validado.

## Project Structure

### Documentation (this feature)

```text
specs/002-raizora-v1-1/
├── spec.md, technical-decisions.md, open-questions.md, review.md
├── checklists/requirements.md
├── plan.md, research.md, data-model.md, quickstart.md
├── contracts/configuration.md
├── contracts/navigation.md
├── contracts/printing.md
└── planning-review.md
```

Os cinco documentos de specify/clarify são baseline preservada. `tasks.md` não é criado.

### Source Code (repository root)

Áreas existentes a modificar futuramente, sem criação/edição de produção agora:

| Área/arquivo | Delta previsto |
| --- | --- |
| `components/ConfigurationFields.tsx` | Ajuda acessível e dois campos; substituir slice/índices do array por agrupamento explícito por via |
| `views/ConfigurationView.tsx` | Remover duração e prop stages; ajustar intro para volumes |
| `state/calculator-reducer.ts` | Draft de duas strings; acrescentar MOVE_WEEK, preservando outras ações/gates |
| `presentation/validation-messages.ts` | NUMERIC_ERROR pede somente revisão dos volumes: “Os valores excedem a capacidade numérica do cálculo. Revise os volumes informados.”; preservar tratamento da falha e mensagens genéricas |
| `hooks/use-calculator.ts` | Fornecer frequência um, retirar parse/count e erro do gate da UI; manter validação compartilhada |
| `CalculatorWizard.tsx` | Conectar movimento semanal; separar bloco interativo e PrintPlan irmão fora do form; handler print no client existente |
| `views/PlanView.tsx` | Duração, política de frequência, navegação e cards únicos; retirar NutritionTable |
| `components/NutritionWeekCards.tsx` e `WeekStageFilter.tsx` | Reutilizar detalhes e selects; ajustar apenas semântica/integração necessárias |
| `components/ResultValue.tsx` e `presentation/result-selectors.ts` | Compartilhar renderização de dose/estado; rotular EVERY como frequência planejada, mantendo FIXED prescrita |
| `views/RecipeView.tsx` e `SummaryView.tsx` | Preservar resultados; identificar a frequência planejada nos contextos de resultado |
| `src/app/globals.css` | Cards em desktop sem esconder; layouts sem overflow; regras print isoladas e A4 |

Prefixo dos caminhos relativos da tabela: `src/features/calculator/`, exceto CSS.
Arquivos futuros novos: `state/week-navigation.ts` (helper puro),
`components/WeekNavigation.tsx`, `components/ScheduleDuration.tsx` e
`components/PrintPlan.tsx`. São propostas de arquivos, não assets já criados.

Remover o módulo `NutritionTable.tsx` e estilos exclusivos da comparação quando
sem consumidores após integração; não remover estilos da tabela de Resumo.
Não executar refatoração ampla de componentes ou abstrações sem uso.

**Structure Decision**: preservar fronteiras domain/data/features e o client
boundary de CalculatorWizard. Não adicionar portal, janela/rota de impressão,
Context/store, serviço PDF, captura de tela ou novo estado de resultados.

## Arquitetura e fluxo de dados

O adapter lê duas strings de volume e seleção; usa parser/validador atuais,
fornece `fertigationApplicationsPerWeek = 1` e chama o motor existente. O controller
continua derivando/memoizando a resposta pelas entradas matemáticas. Filtros,
etapa e impressão não passam a ser dependências do cálculo nem criam outra resposta.

Draft não contém campo oculto/editável de frequência. `parseInput(..., 'count')`
permanece como utilitário genérico e seus testes continuam válidos; só deixa de
ser chamado pelo adapter da aplicação. Validação de domínio não é relaxada.
Sem foliares selecionados, omitir volume canônico e manter draft local; exigência
considera ACTIVE/FOLIAR em qualquer semana, não somente a semana visível.

Plano usa `selectWeek`, cards e selects existentes. `getAdjacentWeek` é um helper
puro da feature sobre stages ordenados e weekCount; reducer e controles usam a
mesma função para limites. `MOVE_WEEK` atualiza estágio/semana em uma transição.
Não usar dois dispatches SET_STAGE/SET_WEEK para cruzar fase; isso também preserva
o significado distinto da troca direta de estágio, que mantém semana válida.

`ScheduleDuration` apenas apresenta stages e soma suas contagens (metadado, não
consumo nutricional). Exibe 8, 8 e 16 a partir do schedule, com texto não editável.
`RuleDetails`, QuantityValue/AggregateValue e formatadores permanecem responsáveis
pela mesma semântica. Extrair componentes pequenos DoseValue/RuleStateValue em
ResultValue apenas para compartilhar o trecho que já existe entre cards e impressão.
Não duplicar fórmulas nem interpretação de N/A/NO_RULE no PrintPlan.

## Composição da impressão

PrintPlan recebe `result`, `schedule` e `brand` da mesma composição do wizard.
Montar somente quando etapa PLAN e response SUCCESS, inclusive INCOMPLETE.
Conteúdo completo já existe no DOM antes do clique; display:none em tela o retira
também da árvore acessível. Não colocar aria-hidden permanente no documento impresso.

O bloco interativo do wizard recebe wrapper próprio; PrintPlan é seu irmão, fora
do form. Botão Imprimir é type=button e chama window.print no handler do client,
sem setState/Effect/beforeprint/afterprint. Cancelar não desmonta/reinicia sessão.
CSS aplica ocultação da tela apenas ao shell com documento de impressão válido;
em PLAN válido, Ctrl+P também usa a representação completa. Outras etapas não
montam um plano impresso e não reutilizam resultado antigo.

Organizar cabeçalho/contexto, uma tabela compacta por semana e tabela de totais
por produto. Cada thead contém identificação de estágio/semana e nomes das colunas;
caption sozinho não garante identidade em continuação. `result.weeks`, entries e
productTotals são lidos sem recálculo, filtro por semana ativa ou soma na UI.
Detalhes de colunas, estados e layout em [printing.md](contracts/printing.md).

CSS: @page A4 portrait, margem inicial 12 mm (186 mm úteis); @media print elimina
limites do shell, sombras, controles, paddings grandes e regras desktop conflitantes.
PrintPlan não usa `.table-scroll`, `.nutrition-table` ou min-width1900px. Fluxo
normal, largura100%, table-layout fixed e quebra de textos/unidades legíveis.
Evitar quebra de linhas pequenas; permitir que semana/tabela maior que página
continue. Repetição de thead, fragmentação e cabeçalhos do navegador precisam de
validação visual/PDF; CSS não garante quantidade de páginas idêntica entre browsers.

## Sequência técnica incremental

1. **Configuração (R1/R2/R5)**: alterar draft/adapter/campos/copy, remover duração
   desta etapa e atualizar testes de aplicação para frequência um. Preparar duração
   reutilizável e mensagens de política; preservar testes genéricos de domínio.
2. **Plano (R2/R3)**: colocar duração no Plano; integrar MOVE_WEEK/helper/controles,
   cards responsivos e filtros existentes; manter Receita compartilhada. Corrigir
   CSS desktop sem modificar apresentação do Resumo. Retirar comparação sem uso.
3. **Impressão (R4)**: montar documento completo separado, reaproveitar valores/
   estados e fontes, conectar handler, estilos A4 e agregados existentes. Depende
   de configuração canônica estabilizada e separação de tela da etapa anterior.
4. **Validação**: executar regressões por camada, integração, checks e browser/PDF;
   corrigir apenas falhas de aceite. Sequência orienta tasks futuras, sem gerar tasks.

R1/R5 têm independência funcional de R3, mas compartilham arquivos de estado e
wizard; integrar nessa ordem evita edições concorrentes. Impressão nunca depende
do valor da semana ativa; sua dependência é estrutural/semântica, não matemática.

## Estratégia de validação e regressão

| Camada | Cobertura significativa planejada |
| --- | --- |
| Unit | Helper/reducer: todas transições, extremos, par atômico, stages sintéticos sem hardcode; formato/estados preservados |
| Controller/UI | Dois volumes, count1 canônico sem input/erro de count; gates foliares, seleção vazia, edição/invalidação e resultado não recalculado por filtros |
| Componentes | Cards únicos, duração derivada, Anterior/Próxima type=button, selects, foco/status; PrintPlan 16 semanas/80 entries quando cinco selecionados |
| Integração | Plano→Receita→Resumo e retorno, mudança de volume/seleção, print mock sem SUBMIT ou mutação; INCOMPLETE imprimível e falhas sem impressão obsoleta |
| Motor | Manter C-001–005 com três, frequências foliares, precisão/unidades/NO_RULE; conferir V11-01–06/V11-CICLO com um sem alterar motor |
| Browser | 360/768/1280 e intervalos, teclado/reflow, ausência de overflow, semana única; previewA4/PDF de completo/incompleto e cancelamento |

Testes UI antigos que exigem input de count/tabela de oito semanas são substituídos
pelos novos comportamentos; fixtures de count3 para contrato genérico não são
convertidas indiscriminadamente em count1. jsdom/mock window.print prova chamada
e conteúdo DOM, não paginação ou correção visual de PDF.

Checks futuros: unit/UI/all, lint, typecheck, build; detalhe executável e expectativas
em [quickstart](quickstart.md). Nenhum desses checks foi executado como prova da
v1.1 nesta etapa, pois não há implementação nova.

## Riscos e mitigações

| Risco | Mitigação e evidência futura |
| --- | --- |
| Fixar um dentro do motor ou alterar foliares | Constante apenas adapter; regressões genéricas count3 e V11 com um |
| Campo removido quebra grupos/erros | Rever slice/índices/callbacks/draft e testes de gates/foco |
| Transição muda somente um campo | Ação atômica e helper único; Vegetativo8↔Floração1 nos dois sentidos |
| Cards continuam ocultos em desktop | Retirar só regra .plan-cards; smoke desktop e Resumo preservado |
| Clique de semana/print avança formulário | type=button e integração sem SUBMIT/NEXT |
| Imprimir apenas semana ativa/dados antigos | Montagem com SUCCESS/result atual; imprimir result.weeks inteiro; invalidar no controller |
| Confundir INCOMPLETE com resposta inválida | Imprimir SUCCESS/INCOMPLETE com aviso, N/A textual e agregado sem definitivo |
| Colunas/cabeçalhos cortam em A4 | Tabela própria sem scroll/min-width; thead contextual; preview real e PDF de cada página |
| Browser ignora fragmentação/@page | Selecionar A4 no diálogo, validar navegadores; corrigir CSS antes do aceite, sem promessa de contagem exata |

## Complexity Tracking

Nenhuma violação constitucional ou complexidade excepcional. Não adicionar
dependência/infraestrutura. Pendências técnicas de decisão: nenhuma; riscos de
execução/validação permanecem verificações futuras. Após aprovação deste plan,
`$speckit-tasks` pode ser autorizado; não é iniciado automaticamente.

## Correções pós-Analyze — 2026-10-09

A-001: incluir validation-messages.ts em T022 e integração de volume extremo em T023, com NUMERIC_ERROR real, mensagem exata, foco e ausência de plano anterior. A-002: T009/T025/T027/T039 podem ser escritos antes do módulo; criar stub mínimo sem comportamento somente na execução da tarefa quando necessário. Import não resolvido não comprova RED; assertions comportamentais devem falhar e o checkpoint GREEN após implementação é obrigatório. IDs, dependências e grupos paralelizáveis preservados. Correções documentais autorizadas; implementação desta rodada limitada a T001–T024.
