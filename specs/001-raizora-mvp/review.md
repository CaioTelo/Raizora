# RAIZORA MVP — clarify final e revisão multi-agent

Rodada iniciada em 2026-10-02; revisão final concluída em 2026-10-03.
**READY FOR PLAN**. Sem blocker funcional/matemático restante.
OQ-001–OQ-012 RESOLVED; OQ-013 OPTIONAL/DEFERRED. Nenhum plano, tarefa, aplicação,
backend, banco ou autenticação foi criado/executado nesta rodada.

## Fontes e alcance

A auditoria direta dos três arquivos aconteceu na rodada anterior: SRC-001,
tabela nutricional (JPEG 1600 × 776, células e legenda); SRC-003, layout mobile
(JPEG 1536 × 448, seis telas); SRC-002, seis páginas do PDF, atualização interna
07/06/2026, leitura completa via streams/CMaps sem glifos faltantes. Não foi
repetida a auditoria visual/PDF nesta rodada. Originais/hashes foram preservados.

SRC-004 contém o pedido inicial e não uso explícito; SRC-005 contém diretrizes do
primeiro clarify; SRC-006 contém respostas interativas anteriores. **SRC-007** é
a mensagem atual de decisões explícitas do responsável, **SOURCE: PRODUCT DECISION**.
Não é ficha técnica do fabricante. O autor da confirmação de escopo/frequência é
identificado separadamente da dosagem/unidade/via impressas no JPEG.

RAIZORA permanece independente. Doses/vias seguem a tabela; PDF é contexto, layout
é referência de UX. Nenhuma nova dose, fator orgânico ou regra de mistura foi criada.

## Histórico e decisões substituídas

| Decisão anterior | Origem | Estado e decisão vigente |
| --- | --- | --- |
| Manter duração variável pendente | SRC-006, primeira sessão | SUPERSEDED por SRC-007 seção 2: fixo8+8 do schedule atual, sem edição |
| Manter input foliar com validação contra prescrição | SRC-006, primeira sessão | SUPERSEDED por SRC-007 seção 3: remover input, usar frequência da regra |
| Linhas ausentes eram cobertura não confirmada | Auditoria SRC-001 + cautela anterior | Encerrada por confirmação SRC-007 seção 4: NOT_APPLICABLE para as três combinações atuais |
| Seleção, validação e formato eram propostas | SRC-005/primeiro clarify | Confirmadas explicitamente em SRC-007 seções 6–8 |
| Joker a cada fertirrigação só nas semanas com dose | SRC-006 | Preservada em SRC-007; OQ-004 não reaberta |
| Todas as regas usa eventos de fertirrigação configurados | SRC-006 | Preservada em SRC-007; contagem agora definida global |

A rodada inicial sem arquivos e o primeiro clarify NOT READY são histórico real,
não status atual. Não transformar sua limitação em falta de auditoria vigente.

## Decision Log — fonte → decisão → requisito

| ID | OQ | Fonte | Decisão vigente | Impacto |
| --- | --- | --- | --- | --- |
| DL-001 | OQ-001 | SRC-001/002/003, auditoria anterior | Doses/vias/frequências impressas e nomes auditados; fingerprints na spec | FR-007/008/009/012/016, matrizes e UX-007 |
| DL-002 | OQ-005 | SRC-001, legenda de cores | Solo/fertirrigação em toda floração; foliar nos três produtos vegetativos; via por regra | FR-009/012, ApplicationType |
| DL-003 | OQ-004 | SRC-006 + SRC-007 seção 9 — PRODUCT DECISION | Joker EVERY_FERTIGATION nas semanas com dose; não ampliar S6–S8 floração | FR-010/011/013 |
| DL-004 | OQ-006 | SRC-001 + SRC-006/007 seção 9 — PRODUCT DECISION | PP/Tricomax “todas as regas” = eventos de fertirrigação configurados | FR-011/013 |
| DL-005 | OQ-007 | SRC-007 seção 3 — PRODUCT DECISION | Input foliar removido; usar prescrição da semana, sem override | FR-004/005/010; substitui SRC-006 |
| DL-006 | OQ-003 | SRC-001 + SRC-007 seção 2 — PRODUCT DECISION | Schedule atual fixo vegetativo 8 + floração 8; informar, não editar; não universal | FR-005/008/013/017, Stage/Week; substitui variável pendente |
| DL-007 | OQ-008 | SRC-007 seção 3 — PRODUCT DECISION | Contagem global de fertirrigação; FIXED_PER_WEEK ou EVERY_FERTIGATION na regra | FR-004/010/011, NutrientRule/Configuração |
| DL-008 | OQ-012a/b | SRC-004/005 + SRC-007 seção 4 — PRODUCT DECISION | NOT_APPLICABLE confirmado para Tricomax veg e Coringa/Terpeno flora; sem evento/zero; “—” acessível permitido | FR-013/014, matriz e histórias 3/4/5/6 |
| DL-009 | OQ-013 | SRC-005 + SRC-007 saída — PRODUCT DECISION | Copy/imagens finais DEFERRED; não bloqueiam matemática | FR-002, UX-007 |
| DL-010 | OQ-001 | SRC-001/002 + SRC-007 seção 4 | Joker nome/alias; Speed Vega fora do schedule/cálculo, sem dose inferida do PDF | FR-007/015/016 |
| DL-011 | OQ-002 | SRC-007 seção 1 — PRODUCT DECISION | Remover tipo de cultivo/fator60; nenhuma equivalência agronômica afirmada | FR-005/015 |
| DL-012 | OQ-009 | SRC-007 seção 6 — PRODUCT DECISION/UX | Volume fert obrigatório decimal>0; frequência obrigatória int>=1; foliar>0 condicional à seleção; sem máximo agronômico | FR-006, história 2 |
| DL-013 | OQ-010 | SRC-007 seção 7 — PRODUCT DECISION | Precisão interna, sem intermediários arredondados; apresentação até 2 casas pt-BR sem zeros finais | FR-013/018, SC-006 |
| DL-014 | OQ-011 | SRC-007 seção 8 — PRODUCT DECISION | Cinco pré-selecionados; remover permitido; seleção vazia impede cálculo com mensagem | FR-007, história 3 |
| DL-015 | OQ-012c | SRC-007 seção 5 — PRODUCT DECISION | Schedule atual completo; resumo normal; NO_RULE esperado futuro marca incompleto e impede total definitivo | FR-013/014, CalculationResult |
| DL-016 | Separação das telas | SRC-007 seções 9–11 — PRODUCT DECISION | Plano: dose/L e semanal identificado; receita: um preparo por via; resumo: soma ciclo | FR-008/009/010/012/013, histórias 4/5/6 |

Todas as OQs resolvidas são verificáveis por requisitos/aceite atualizados; decisões
não ficam isoladas no log. Nenhuma confirmação de frequência ou N/A é atribuída
falsamente a texto ausente no JPEG.

## Configuração e frequência consolidadas

Exatamente três inputs numéricos: volume fertirrigação L/preparo obrigatório >0;
fertigationApplicationsPerWeek global inteiro>=1; volume foliar L/preparo >0
obrigatório com foliares selecionados. Seleção global de produtos fica na etapa própria.
Não existe campo tipo de cultivo, duração ou frequência foliar editável.

Duração8+8 é dado do FeedingSchedule atual. FIXED_PER_WEEK lê a contagem prescrita
na NutrientRule da semana; EVERY_FERTIGATION usa o input global. Product não possui
frequência universal; o motor não conhece fabricante ou lista fixa de estágios.

NOT_APPLICABLE confirma escopo sem evento; NO_RULE significa expectativa sem regra
confirmada. Os três N/A atuais não tornam resumo incompleto, não geram quantidades
semanais/estágio e não são convertidos em zero. Não generalizar ausência gráfica
para futuros schedules sem confirmação equivalente.

## Matemática e casos de referência

amountPerApplication = dosePerLiter × preparationVolumeLiters da via.
weeklyAmount(FIXED_PER_WEEK) = amountPerApplication × prescribedApplicationsPerWeek.
weeklyAmount(EVERY_FERTIGATION) = amountPerApplication × fertigationApplicationsPerWeek.
cycleTotal(product) = soma dos weeklyAmount confirmados/aplicáveis/selecionados.
Não multiplicar as duas frequências, misturar volumes/vias ou somar massa e volume.

C-005 usa volumes constantes10 L e 2 L, contagem global3 e todos cinco selecionados:

| Produto | Vegetativo | Floração | Ciclo |
| --- | --- | --- | --- |
| Joker | 420 g | 360 g | 780 g |
| Coringa Blend | 160 ml | NOT_APPLICABLE | 160 ml |
| Plant Protein | 96 ml | 1.500 ml | 1.596 ml |
| Terpeno Plus | 32 ml | NOT_APPLICABLE | 32 ml |
| Tricomax | NOT_APPLICABLE | 300 g | 300 g |

Joker: somas 14 e 12 g/L-semana × 10 L × 3. Foliares:16 aplicações prescritas
(1+1+2+2+2+2+3+3) × 2 L × dose. Plant Protein flora: soma 50 ml/L-semana × 10 × 3;
Tricomax flora: soma 10 g/L-semana ativa × 10 × 3. N/A não recebe valor numérico.

Receita vegetativo S4: Joker 20 g/10 L; foliar 2 L: Coringa 10 ml, Protein 6 ml,
Terpeno 2 ml. Informar3 fertirrigações/semana e 2 aplicações foliares nessa semana,
sem transformar o preparo em consumo semanal. Exemplos são testes de referência,
não defaults de volumes/contagem nem aplicação implementada.

Mecanismo de precisão, parser decimal, proteção técnica contra valores extremos,
empates e subcentésimos ficam no plan sob determinismo e formatação aprovada.
Não são máximos agronômicos ou blockers de produto; não se afirma método de
arredondamento como regra do fabricante.

## Divergências auditadas e tratamento atual

| Tema / fonte | Tratamento vigente |
| --- | --- |
| Layout: marca principal Plantas que Curam | FR-002/UX-007 usam RAIZORA independente e parceiro identificado |
| Layout: Orgânico−60% | SRC-007 remove campo/fator; nenhuma redução matemática |
| Layout: campos de duração/frequência foliar | SRC-007 remove edição; duração informativa e frequência prescrita por semana |
| Layout: plano por litro com Joker já × 10 L | Plano usa dose/L; quantidades calculadas identificadas separadamente |
| Layout: receita inclui foliares na aba solo e números para1 L quando configura2 L | Receita separa vias e multiplica somente pelo volume de um preparo da via |
| Layout: resumo ilustrativo incompatível com ciclo completo | Recalcular por regras/inputs; referência C-005 substitui números do mockup |
| PDF: Joker do início ao fim e Terpeno associado à floração | Não amplia semanas/doses; escopo atual confirmado por tabela + responsável |
| PDF: Coringa 3–5 ml/L inclui5 da tabela, mas menciona uso solo/dose dobrada a validar | Não é conflito numérico de5; não importar aplicação/dose fora do schedule |
| PDF: formulações históricas divergentes, claims/registro/preços a validar | OQ-013 diferida; não publicar dados não validados nem inflar MVP |
| PDF: Speed Vega com dosagem/formulação/rótulo pendentes | Fora do FeedingSchedule e seleção calculável |

A adaptação de layout não declara equivalência técnica de substratos, propriedade
da plataforma pelo fabricante ou revisão técnica de claims ainda pendentes.

## Multi-agent e revisão focada

| Agente | Frente | Parecer integrado |
| --- | --- | --- |
| product_ux / explorer | PRODUCT/SPEC + UX | Tradução de campos simplificados/defaults/validação; plano/receita/resumo separados; comportamento atual suficiente sem pergunta nova |
| nutrition_rules / researcher | NUTRITION/RULES | Conferiu coerência de frequências e C-005; apontou políticas antigas e totais indevidos na receita para correção |
| architecture / architect | ARCHITECTURE | Multi-marca preservado; duração por schedule, frequência por regra, N/A confirmado por responsável; sincronizar constitution/README/AGENTS |
| product_ux + architect, revisão final | QA/REVIEW | Documentos efetivos aprovados como READY FOR PLAN, sem blocker objetivo ou aceite matemático incorreto |
| Orchestrator | Integração/validação | Só documentação; confirmou texto integral de SRC-007 e não tratou resumo de tarefa como ausência de resposta |

Agentes advisory não editaram nem implementaram. Investigações focadas iniciais
foram paralelas; revisão dos arquivos consolidados é posterior. Não houve nova
consulta às fontes como requisito nem geração de código para calculadora.

## Spec-Kit, integração e sincronização

Skill speckit-clarify aplicada: precheck uma vez com --json --paths-only, constitution
carregada, feature ativa confirmada. Nenhum hook before_clarify/after_clarify está
registrado; nenhum hook pendente. Não executar setup-plan ou workflow completo.
Skill plan fornecida foi considerada como próxima fase, respeitando a proibição
explícita de executar planejamento nesta rodada.

Zero perguntas novas; todas as decisões foram fornecidas antecipadamente por SRC-007.
Cinco bullets de consolidação Q → A na sessão da spec, cobrindo as respostas sem
simular entrevista nova. Respostas anteriores contraditórias só permanecem como
histórico SUPERSEDED. OQ-004/005/006 preservadas, não reabertas.

Seções da spec atualizadas: Clarifications, histórias/aceite, Edge Cases,
Functional Requirements, UX, Key Entities, Success Criteria, Assumptions,
Sources & Rule Provenance, fórmulas/referências, Open Questions & Divergences e gate.

Constitution 1.0.1: esclarecimento localizado do escopo/schedule e condição geral
para fontes ausentes;14 princípios preservados. README/AGENTS apontam próxima
fase plan, sem indicar que existe um plan.md. Templates revisados sem mudança adicional.

## Cobertura do clarify

| Categoria | Estado | Resultado |
| --- | --- | --- |
| Functional Scope & Behavior | Resolved | Escopo/inputs/duração/defaults confirmados; seis etapas |
| Domain & Data Model | Resolved | Schedule atual completo; frequência por regra, contagem global e N/A confirmado |
| Interaction & UX Flow | Resolved | Três inputs, validação, seleção vazia e separação de doses/preparos/totais |
| Non-Functional Quality Attributes | Clear | Responsividade, acessibilidade e determinismo definidos; detalhes técnicos de execução cabem ao plan |
| Integration & External Dependencies | Clear | Sem integrações remotas; fontes auditadas com referência/hash |
| Edge Cases & Failure Handling | Resolved | Volumes/contagens inválidos, zero, seleção vazia, N/A e NO_RULE definidos |
| Constraints & Tradeoffs | Clear | Sem backend/auth/persistência, outras marcas integradas ou fases automáticas |
| Terminology & Consistency | Resolved | Dose/L versus preparo/semana/ciclo; dois modos; N/A versus NO_RULE |
| Completion Signals | Resolved | Critérios e C-001–C-005 verificáveis; nenhum blocker de plan |
| Misc / Placeholders | Clear | Nenhuma OQ funcional pendente; só conteúdo opcional OQ-013 diferido |

OQ-013 DEFERRED: refinamento de conteúdo/arte final antes de publicação. Não impede
plan. Escolhas técnicas futuras não foram convertidas em perguntas de produto.

## Checklist e validação

Spec Quality Checklist: **19/23 → 22/23 itens passando**.
Novos aprovados: ausência de dúvidas de comportamento; requisitos inequívocos e
implementáveis; feature pronta para plan. Nenhuma regressão.
Único desmarcado: resultados funcionais testados, não aplicável sem implementação.

Somente esses três marcadores foram alterados, conforme instrução expressa da
skill. Metadados, textos/justificativas antigos do checklist são snapshot histórico
preservado; não são estado vigente das OQs. Status/evidências atuais estão aqui e
na spec. Não marcar testes executáveis como realizados.

Validação documental: matrizes e hashes preservados, valores C-001–C-005,
transições de status e políticas substituídas, campos/enum/formulas, links e
estrutura. Verificar que somente arquivos documentais foram alterados e que
plan/tasks/research/data-model/quickstart/contracts/app continuam ausentes.
Resultado final das verificações: seis histórias, 18 requisitos funcionais,
sete critérios de sucesso, 14 princípios e 13 OQs com status consistente.
Dez linhas matriciais conferidas; C-001–C-005 e preservação de valores internos
validados; 17 links locais válidos e hashes dos três originais preservados.
Nenhum artefato prematuro da feature ou aplicação foi encontrado.
Architect e QA/UX confirmaram READY FOR PLAN na revisão dos arquivos efetivos.
Revisão formal speckit-analyze só após tasks; não executada nesta fase.

## Status e próximo passo

**READY FOR PLAN.** Nenhum blocker funcional/matemático residual.
OQ-001–OQ-012 RESOLVED, OQ-013 OPTIONAL/DEFERRED. Próxima etapa: **$speckit-plan**,
em rodada posterior. Não criada nem executada automaticamente nesta sessão.

## Arquivos alterados

- specs/001-raizora-mvp/spec.md
- specs/001-raizora-mvp/open-questions.md
- specs/001-raizora-mvp/review.md
- specs/001-raizora-mvp/checklists/requirements.md (três marcadores)
- .specify/memory/constitution.md (1.0.1, ajuste localizado)
- README.md (estado/inputs/continuidade)
- AGENTS.md (continuidade e decisões vigentes)

Fontes originais, skills/scripts/templates e arquivo de feature não foram alterados.
Nenhum commit, código, backend ou infraestrutura da aplicação foi criado.
