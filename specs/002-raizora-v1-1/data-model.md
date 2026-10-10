# RAIZORA v1.1 — deltas de modelos e estado

**Data**: 2026-10-08 · Modelo documental, sem código executável ou migração.
Base preservada: [modelo MVP](../001-raizora-mvp/data-model.md) e
[contrato de cálculo](../001-raizora-mvp/contracts/calculation.md).

## Domínio e resultado: nenhum delta

Brand, Product, FeedingSchedule, StageDefinition, NutrientRule, Dose, Frequency,
Quantity, CultivationConfiguration, CalculationResponse, CalculationResult,
WeekCalculation, RuleCalculation, ProductCycleTotal e AmountAggregate preservados.
Schedule atual mantém 8+8, cinco produtos e 80 slots (49 ACTIVE,24 N/A ao estágio,
7 WEEK_NOT_USED). Não criar constante universal de duração, via ou frequência no produto.

| Contrato | Invariante preservado |
| --- | --- |
| configuration.fertigationApplicationsPerWeek | Inteiro seguro >=1 obrigatório no motor; aplicação v1.1 fornece1 |
| configuration.fertigationVolumeLiters | Finito >0, L/preparo |
| configuration.foliarVolumeLiters | Finito >0 quando presente; obrigatório com ACTIVE/FOLIAR selecionado em qualquer semana |
| EVERY_FERTIGATION | Multiplicador da configuração, sem alteração da fórmula |
| FIXED_PER_WEEK | Multiplicador prescrito na regra/semana; foliares não recebem fator um da aplicação |
| ACTIVE | Dose, via, frequência efetiva, volume/preparo, amountPerApplication e weeklyAmount existentes |
| NOT_APPLICABLE | STAGE_NOT_APPLICABLE ou WEEK_NOT_USED, sem números/eventos |
| NO_RULE | MISSING/UNCONFIRMED, sem consumo inventado; seleção afeta completude |
| Agregados | COMPLETE/amount, NOT_APPLICABLE sem amount, INCOMPLETE sem definitivo e subtotal opcional identificado |

## Draft e adapter: delta da aplicação

ConfigurationDraft passa de três strings para duas: fertigationVolumeLiters e
foliarVolumeLiters. ConfigurationField restringe UPDATE_CONFIGURATION a esses
dois nomes. Estado inicial mantém strings vazias, cinco selecionados e primeiro
estágio/semana1; nenhum campo oculto de frequência ou capacidade de vaso.

deriveCalculator parseia volumes, compõe configuration com count1, mantém
validateCalculationInput e calculateNutritionPlan. configurationIssues do gate
Configuração→Produtos trata volume de fertirrigação; foliar pode ficar pendente
até seleção. Produtos→Plano exige resposta SUCCESS, com seleção não vazia e
foliar quando requerido. Não relaxar validação de domínio/count nem remover o
modo count do parser genérico apenas porque a UI não o usa.

## Navegação: nova ação, mesmos campos

CalculatorState mantém currentStep, draft, selectedProductIds, viewedStageId,
viewedWeekNumber e submittedStep. Não acrescentar activeWeek separado, índice
global persistido, resultado, totais, isPrinting ou cópia do input normalizado.

| Ação | Transição |
| --- | --- |
| SET_STAGE | Preservar semana se válida; senão1; estágio desconhecido é no-op |
| SET_WEEK | Somente inteiro em 1..weekCount do estágio atual; inválido é no-op |
| MOVE_WEEK, direction -1 ou1 | Resolver posição adjacente pelo helper puro e atualizar os dois campos na mesma transição; sem adjacente, no-op |
| NEXT/BACK/SUBMIT/RETURN_TO_FOLIAR | Comportamento de etapas existente, com gates atualizados só para ausência do input de count |

WeekPosition é valor local readonly com stageId e weekNumber, sem entidade
persistida. getAdjacentWeek(stages, position, direction) retorna posição ou
undefined para fronteira/posição inválida. Ordenação de stages e weekCount são
origem dos limites. Controles e reducer usam o mesmo helper; não duplicar regra.
Troca direta Vegetativo8→Floração preserva8; MOVE_WEEK +1 nessa origem leva a
Floração1. MOVE_WEEK -1 de Floração1 leva a Vegetativo8. Sem navegação circular.

## Duração, frequência e representação de impressão

ScheduleDuration lê stages e soma weekCount para metadado total16; seleção de
produto/semana não muda esse total. Frequência planejada em contexto vem de
result.configuration; frequência por produto vem da entry efetiva/modo.

PrintPlan recebe Brand, FeedingSchedule e o mesmo CalculationResult corrente,
sem DTO com quantidades copiadas ou outro cálculo. Props da composição pertencem
ao mesmo scheduleId/brandId/dataVersion; não buscar dataset por nome dentro do componente.
É renderizado só em PLAN/SUCCESS; INCOMPLETE é estado válido desse resultado.
Impressão percorre todas weeks/entries e productTotals, independente de filtros.
Não cria timestamp no resultado, armazenamento, arquivo PDF remoto ou ciclo salvo.

## Validações preservadas

Unidades g/ml nunca somadas, sem conversões, soma de valores brutos no motor e
formatação pt-BR até duas casas. Positivo subcentésimo conserva apresentação <0,01.
NO_RULE não selecionado não incompleta selecionados; ausências confirmadas não
criam zero. Resposta inválida não oferece resultado antigo a tela ou PrintPlan.

Sem impacto em contratos públicos de domínio nem migração de dados persistidos.
Detalhes de interação e projeção: [contracts](contracts/configuration.md).
