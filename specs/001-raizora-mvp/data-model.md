# RAIZORA MVP — modelo de domínio

Data: 2026-10-03. Modelo conceitual para implementação TypeScript estrita;
sem código funcional, banco, persistência ou entidades ORM. Decisões em
[research](research.md); interface e falhas em [contrato](contracts/calculation.md).
Todos os arrays/objetos de entrada e saída serão readonly. IDs são identificadores
de dados, não conceitos livres de via/unidade/status.

## Tipos centrais e unidades

| Tipo | Valores / representação | Invariante |
| --- | --- | --- |
| BrandId, ProductId, ScheduleId, StageId | aliases string | Não vazios, únicos no escopo, referências validadas; não fazer branch por ID |
| StageType | VEGETATIVE / FLOWERING | Tipos iniciais conhecidos; duração não decorre do tipo |
| WeekNumber | number inteiro seguro | 1..stage.weekCount; índice local reinicia em cada estágio |
| ApplicationType | FERTIGATION / FOLIAR | FERTIGATION representa SOIL/FERTIGATION da spec; via é da regra |
| FrequencyMode | FIXED_PER_WEEK / EVERY_FERTIGATION | União discriminada descrita abaixo |
| DosageUnit | GRAM_PER_LITER / MILLILITER_PER_LITER | Dose sempre por litro |
| QuantityUnit | GRAM / MILLILITER | Sem soma/conversão entre unidades |
| RuleStatus | ACTIVE / NOT_APPLICABLE / NO_RULE | União com campos específicos, não objeto com todos os campos opcionais |
| NonApplicationReason | STAGE_NOT_APPLICABLE / WEEK_NOT_USED | Distingue N/A ao estágio e não uso semanal confirmado |
| Completeness | COMPLETE / INCOMPLETE | Depende dos slots dos produtos selecionados |

`Dose` é união {unit: GRAM_PER_LITER, value: number} ou
{unit: MILLILITER_PER_LITER, value: number}; value finito >0.
`Quantity` é união {unit: GRAM, value: number} ou
{unit: MILLILITER, value: number}; resultado calculado positivo e finito.
`preparationVolumeLiters` é number finito >0; unidade L está no nome e contrato.
A compatibilidade Produto → Dose → Quantity é validada antes de agregar.
Esses objetos não são classes, não convertem g em ml e não contêm formatação.

## Brand

| Campo | Tipo | Obrigatório | Relação / regra |
| --- | --- | --- | --- |
| id | BrandId | Sim | Identidade estável e única |
| name | string | Sim | Nome público do parceiro |

RAIZORA é identidade da aplicação, não uma Brand de fertilizantes.
Brand não fornece estratégias matemáticas. Exemplo: id `plantas-que-curam`,
name `Plantas que Curam`. Assets/copy de parceiro pertencem à apresentação e não
exigem campos adicionais na entidade inicial.

## Product

| Campo | Tipo | Obrigatório | Relação / regra |
| --- | --- | --- | --- |
| id | ProductId | Sim | Único no catálogo do schedule |
| brandId | BrandId | Sim | Deve corresponder à Brand do schedule |
| name | string | Sim | Nome de catálogo auditado |
| quantityUnit | QuantityUnit | Sim | Unidade única para consumo deste produto |
| aliases | readonly string[] | Não | Só nomes auditados, não identificação matemática |

Não contém dose, via, frequência nem duração. Plant Protein usa MILLILITER tanto
foliar quanto fertirrigação; é a NutrientRule que muda de via por estágio.
Exemplos: Joker/Tricomax → GRAM; Coringa Blend/Plant Protein/Terpeno Plus → MILLILITER.
Joker pode guardar alias Joker All-in-One. Speed Vega não integra este catálogo.

## Fonte e rastreabilidade

`SourceReference`:

| Campo | Tipo | Obrigatório | Regra |
| --- | --- | --- | --- |
| id | string | Sim | Ex.: SRC-001 / SRC-007 |
| kind | OFFICIAL_TABLE / PRODUCT_DECISION | Sim | Não rotular decisão do responsável como fabricante |
| title | string | Sim | Título curto |
| reference | string | Sim | Referência documental, sem carregar arquivo no browser |
| sourceDate | string ISO date ou null | Sim | null se data de publicação desconhecida |
| notes | string | Não | Confirmação/limites relevantes |

`RuleProvenance` possui `doseSourceIds`, `applicationSourceIds`,
`frequencySourceIds`, `applicabilitySourceIds` (readonly string[]).
ACTIVE exige todos os grupos não vazios e IDs resolvidos; campos não pertinentes
ao status inativo são arrays vazios, applicabilitySourceIds continua obrigatório.
Fonte de NO_RULE pode ser desconhecida, com arrays vazios e diagnóstico explícito.
Rastreabilidade não exige hash em runtime; fingerprints já estão na spec/review.

Metadata do schedule: `dataVersion: string` obrigatório (versão local de transcrição),
`providerScheduleVersion: string | null` obrigatório (versão do fabricante, se
conhecida), `auditedAt: string ISO date` obrigatório, `sources: SourceReference[]`
obrigatório, `notes?: string` opcional. Exemplo de dataVersion local:
`raizora-transcription-1`; providerScheduleVersion null se fonte não a informa.
auditedAt 2026-10-02 identifica a auditoria registrada, não a publicação do JPEG.
sourceDate SRC-001 null; SRC-007 2026-10-02. PDF/contexto/layout permanecem
referências de desenvolvimento em spec/review, sem autoridade de cálculo.

## FeedingSchedule

| Campo | Tipo | Obrigatório | Relação / regra |
| --- | --- | --- | --- |
| id | ScheduleId | Sim | Identidade estável |
| brandId | BrandId | Sim | Uma Brand; mesma dos produtos |
| name | string | Sim | Nome de apresentação sem claim inventado |
| metadata | ScheduleMetadata | Sim | Versão/origem/auditoria descritas acima |
| products | readonly Product[] | Sim | Catálogo ordenado, não vazio, IDs únicos |
| stages | readonly StageDefinition[] | Sim | Ordem do ciclo, IDs únicos, não vazio |
| rules | readonly NutrientRule[] | Sim | Slots declarativos; duplicata proibida |

O domínio recebe um objeto completo sem buscar catálogo global. Brand é resolvida
na composição e não precisa entrar no cálculo. Cada posição esperada é o produto
cartesiano products × stages × semanas 1..weekCount. O dataset auditado cobre
todas as posições. Validação estrutural verifica IDs, números/unidades, fontes,
frequências, referências e duplicatas; gap de cobertura não é N/A: vira NO_RULE.
Um loader de arquivos/registry genérico não faz parte do MVP.

## StageDefinition e Week

| Campo de StageDefinition | Tipo | Obrigatório | Regra |
| --- | --- | --- | --- |
| id | StageId | Sim | Identidade local ao schedule |
| type | StageType | Sim | Tipo semântico explícito |
| label | string | Sim | Vegetativo / Floração na fixture |
| weekCount | number inteiro seguro | Sim | >=1; controla limites e duração |

Stage não possui vida independente ou persistência: é valor definido no schedule.
Week não precisa de entidade nem UUID: WeekNumber + StageId identificam a posição.
Não guardar weeks[] e weekCount simultaneamente. Os oito índices de cada estágio
atual são derivados do weekCount=8, sem constante global 8. Novo tipo de estágio
exige extensão explícita de StageType, sem mudar algoritmo para fabricante.

## NutrientRule — união discriminada de cobertura

`RuleKey` é valor estrutural readonly com `productId: ProductId`,
`stageId: StageId`, `weekNumber: WeekNumber`, todos obrigatórios.
`MissingRuleDiagnostic` tem `key: RuleKey` e `reason: MISSING | UNCONFIRMED`,
obrigatórios. Um slot removido gera MISSING; um pendente explícito gera UNCONFIRMED.

Campos comuns obrigatórios: `productId`, `stageId`, `weekNumber`, `status`,
`provenance: RuleProvenance`. Chave única: productId + stageId + weekNumber.
Não precisa de id próprio. ACTIVE é o payload calculável; os outros ramos descrevem
cobertura sem evento. Confirmação não é bool que permitiria ACTIVE não confirmado.

| Ramo | Campos específicos obrigatórios | Invariantes |
| --- | --- | --- |
| ACTIVE | dose: Dose; applicationType: ApplicationType; frequency: Frequency | Dose positiva compatível com Product; confirmação/fontes presentes |
| NOT_APPLICABLE | reason: NonApplicationReason | Confirmação explícita; sem dose, via, frequência ou quantidade |
| NO_RULE | reason: MISSING / UNCONFIRMED | Regra esperada não confirmada; sem quantidade; sources podem estar ausentes |

`Frequency`:

| mode | Campos | Invariantes |
| --- | --- | --- |
| FIXED_PER_WEEK | prescribedApplicationsPerWeek: number | Inteiro seguro >=1, da regra semanal |
| EVERY_FERTIGATION | Nenhum número prescrito | Usa contagem global do input; applicationType FERTIGATION |

Uma futura frequência fixa via fertirrigação é permitida por esse contrato sem
condicional de marca. EVERY_FERTIGATION em FOLIAR é estruturalmente inválido.
O MVP suporta um único slot por produto/semana; mais de uma via para o mesmo
produto na mesma semana exigiria extensão explícita do contrato, não inferência.

NOT_APPLICABLE / STAGE_NOT_APPLICABLE se repete em todas as semanas daquele
produto/estágio na fixture; validar consistência, sem alterar para uma regra universal.
WEEK_NOT_USED marca somente semanas confirmadas sem uso em estágio com aplicação.
Produto não selecionado é filtro da execução, não quarto status. Zero não é dose
válida e ausência não recebe zero para facilitar soma.

### Fixture vigente (transcrição, não novas regras)

| Produto / estágio | Dose nas semanas | Via / frequência | Cobertura |
| --- | --- | --- | --- |
| Joker veg | 1/1/2/2/2/2/2/2 g/L | FERTIGATION, EVERY_FERTIGATION | ACTIVE S1–S8 |
| Coringa veg | 5 em todas, ml/L | FOLIAR, FIXED 1/1/2/2/2/2/3/3 | ACTIVE S1–S8 |
| Plant Protein veg | 3 em todas, ml/L | FOLIAR, FIXED 1/1/2/2/2/2/3/3 | ACTIVE S1–S8 |
| Terpeno veg | 1 em todas, ml/L | FOLIAR, FIXED 1/1/2/2/2/2/3/3 | ACTIVE S1–S8 |
| Tricomax veg | Sem dose | Sem via/frequência | STAGE_NOT_APPLICABLE S1–S8 |
| Joker flora | 2/2/2/3/3 g/L, depois sem dose | FERTIGATION, EVERY_FERTIGATION nas ativas | ACTIVE S1–S5; WEEK_NOT_USED S6–S8 |
| Plant Protein flora | 4/4/4/6/8/8/8/8 ml/L | FERTIGATION, EVERY_FERTIGATION | ACTIVE S1–S8 |
| Tricomax flora | Sem dose S1–S4; 1/2/3/4 g/L S5–S8 | FERTIGATION, EVERY_FERTIGATION nas ativas | WEEK_NOT_USED S1–S4; ACTIVE S5–S8 |
| Coringa flora | Sem dose | Sem via/frequência | STAGE_NOT_APPLICABLE S1–S8 |
| Terpeno flora | Sem dose | Sem via/frequência | STAGE_NOT_APPLICABLE S1–S8 |

São 80 slots: 49 ACTIVE, 24 N/A ao estágio e 7 não utilizados na semana.
SRC-001 fornece doses/vias/foliares; SRC-006/007 confirma frequência Joker e
interpretação todas as regas; SRC-004/007 confirma não uso; SRC-007 confirma N/A.

## CultivationConfiguration e SelectedProductSet

| Campo | Tipo | Obrigatório | Invariante |
| --- | --- | --- | --- |
| fertigationVolumeLiters | number | Sim | Finito >0 |
| fertigationApplicationsPerWeek | number | Sim | Inteiro seguro >=1 |
| foliarVolumeLiters | number | Condicional | Finito >0 quando presente; obrigatório se selecionado tem ACTIVE FOLIAR |

SelectedProductSet é readonly ProductId[] com semântica de conjunto: não vazio,
IDs únicos e presentes em schedule.products. Engine normaliza ordem pela ordem do
catálogo para tornar resultados/somas independentes da ordem de clique. A UI cria
uma nova lista em cada edição; não manter Set mutável compartilhado. Default são
os cinco IDs deste catálogo, sem lista fixa no core.

Não existem soilType, duration, doseFactor ou foliarApplicationsPerWeek.
Rascunho UI não é CultivationConfiguration: strings podem estar vazias/parciais.
O adapter parseia e chama o mesmo validador puro usado no cálculo.

## CalculationResult e resultados derivados

Resposta pública é `CalculationResponse`:

| status | Campos | Semântica |
| --- | --- | --- |
| SUCCESS | result: CalculationResult | Input válido; result pode ser COMPLETE ou INCOMPLETE |
| INVALID_INPUT | issues: readonly ValidationIssue[] | Nenhum resultado/total antigo utilizável |
| INVALID_SCHEDULE | issues: readonly ValidationIssue[] | Dados malformados; sem cálculo |
| NUMERIC_ERROR | issues: readonly NumericIssue[] | Overflow/underflow; sem resultado enganoso |

`ValidationIssue` contém `code` fechado, `path` estrutural e referências opcionais
productId/stageId/weekNumber. Mensagem pt-BR é da apresentação, não do domínio.
Codes mínimos: REQUIRED, INVALID_NUMBER, NON_POSITIVE, INVALID_COUNT,
EMPTY_SELECTION, UNKNOWN_PRODUCT, DUPLICATE_ID, INVALID_REFERENCE,
INCOMPATIBLE_UNIT, INVALID_FREQUENCY, INVALID_PROVENANCE, INVALID_COVERAGE.
`NumericIssue.code`: OVERFLOW / UNDERFLOW; inclui operação e contexto.

CalculationResult:

| Campo | Tipo | Obrigatório | Regra |
| --- | --- | --- | --- |
| scheduleId / dataVersion / brandId | aliases/string | Sim | Identifica snapshot de regras do cálculo |
| configuration | CultivationConfiguration | Sim | Input normalizado imutável |
| selectedProductIds | SelectedProductSet | Sim | Ordem do catálogo |
| completeness | Completeness | Sim | INCOMPLETE somente com NO_RULE selecionado |
| weeks | readonly WeekCalculation[] | Sim | Todos os estágios/semanas, na ordem do schedule |
| productTotals | readonly ProductCycleTotal[] | Sim | Somente produtos selecionados |
| missingRules | readonly MissingRuleDiagnostic[] | Sim | Vazio no cronograma atual |

Não incluir timestamp gerado, locale ou strings formatadas. Produtos/estágios são
resolvidos por ID no schedule recebido pelo controller; não duplicar catálogo
inteiro em cada evento. Metadata é exibida a partir do mesmo schedule/version.

### WeekCalculation e RuleCalculation

WeekCalculation: `stageId: StageId`, `weekNumber: WeekNumber`,
`entries: readonly RuleCalculation[]`, `completeness: Completeness`, todos obrigatórios.
Contém exatamente uma entry por produto selecionado na posição; N/A entra como
cobertura, sem evento calculado ou zero. Não selecionado não entra.

RuleCalculation é união:

- ACTIVE: productId, sourceRuleKey: RuleKey, dose, applicationType,
  frequency (prescrita), effectiveApplicationsPerWeek (número efetivo),
  preparationVolumeLiters, amountPerApplication: Quantity, weeklyAmount: Quantity.
- NOT_APPLICABLE: productId, reason; nenhum campo numérico de consumo.
- NO_RULE: productId, reason MISSING/UNCONFIRMED; nenhum consumo; diagnóstico.

Estágio/semana são do WeekCalculation pai, evitando redundância e inconsistência.
Dose é oficial; amountPerApplication é um preparo; weeklyAmount é consumo semanal.
Plano lê todas as entries; Receita filtra ACTIVE e via; Resumo lê productTotals.
Selectors de UI apenas filtram/agrupam, sem multiplicar doses.

### ProductCycleTotal e AmountAggregate

ProductCycleTotal: `productId: ProductId`, `quantityUnit: QuantityUnit`,
`byStage: readonly StageProductTotal[]`, `cycle: AmountAggregate`, obrigatórios.
StageProductTotal: `stageId` e `aggregate: AmountAggregate`, obrigatórios.

AmountAggregate é união:

| status | Campos | Regra |
| --- | --- | --- |
| COMPLETE | amount: Quantity | >=1 entrada ACTIVE e nenhuma NO_RULE no escopo |
| NOT_APPLICABLE | reasons: readonly NonApplicationReason[] | Nenhuma ACTIVE/NO_RULE, sem amount |
| INCOMPLETE | missingRuleKeys: readonly RuleKey[]; knownSubtotal?: Quantity | Sem total definitivo; subtotal só se existe alguma ACTIVE |

Se uma semana é N/A e outras ativas, não adicionar zero: somar somente ACTIVE.
Se um estágio todo não usa o produto, seu aggregate é NOT_APPLICABLE, mesmo que
o produto tenha total de ciclo COMPLETE em outro estágio. Se um produto selecionado
não tem ACTIVE no ciclo inteiro e tudo é confirmado, cycle também é NOT_APPLICABLE,
sem amount. NO_RULE torna agregado afetado INCOMPLETE; totais de outros produtos
podem permanecer COMPLETE, mas resumo global informa incompletude. Não mostrar
knownSubtotal como total. NO_RULE em produto não selecionado não incompleta a seleção.

### Exemplo C-005

Configuração 10 L /3 fertirrigações /2 L foliares, cinco selecionados:

| Produto | Vegetativo | Floração | Ciclo |
| --- | --- | --- | --- |
| Joker | COMPLETE 420 g | COMPLETE 360 g | COMPLETE 780 g |
| Coringa Blend | COMPLETE 160 ml | NOT_APPLICABLE | COMPLETE 160 ml |
| Plant Protein | COMPLETE 96 ml | COMPLETE 1.500 ml | COMPLETE 1.596 ml |
| Terpeno Plus | COMPLETE 32 ml | NOT_APPLICABLE | COMPLETE 32 ml |
| Tricomax | NOT_APPLICABLE | COMPLETE 300 g | COMPLETE 300 g |

Internamente valores Number 1500/1596, sem pontos de milhar. Em vegetativo S3,
Coringa ACTIVE conserva dose 5 ml/L, volume 2 L, frequência FIXED 2,
amountPerApplication 10 ml e weeklyAmount 20 ml. Em floração S6 Joker há somente
NOT_APPLICABLE/WEEK_NOT_USED; em vegetativo Tricomax somente STAGE_NOT_APPLICABLE.

## Estado de aplicação e transições

CalculatorState contém `currentStep: CONFIGURATION | PRODUCTS | PLAN | RECIPE |
SUMMARY`, `draft` com as três strings, `selectedProductIds`, `viewedStageId`,
`viewedWeekNumber`, `submittedStep`/estado de interação necessário para mostrar erros.
Não incluir configuração normalizada, resultado ou totais como estados duplicados.
Filtro inicia primeiro estágio/semana do schedule e é compartilhado por Plano e
Receita. Troca de estágio preserva semana se dentro do novo limite; caso contrário,
volta à semana 1. Duração e opções derivam dos dados, sem fixar 8 na UI.

Configuração → Produtos exige fertirrigação válida; Produtos → Plano exige seleção
e configuração final válidas; Plano → Receita → Resumo consome o mesmo cálculo.
Retorno interno mantém draft/seleção/filtros. Alteração invalida qualquer possibilidade
de usar resultado anterior; response inválida impede entrar em etapas de resultado.
Se seleção reexige foliar, retorno ao campo preserva estado e revalida antes de Plano.
Refresh reinicia; seleção vazia permanece vazia ao voltar (defaults só na criação
do estado inicial), sem persistência. Ver [contrato do fluxo](contracts/wizard.md).
