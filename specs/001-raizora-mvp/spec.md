# Feature Specification: RAIZORA MVP — planejamento nutricional público

**Feature**: `001-raizora-mvp`

**Feature Branch**: `master` (nenhuma branch de feature criada)

**Created**: 2026-10-02

**Status**: Clarified — READY FOR PLAN. Planejamento e implementação não executados.

**Input**: Calculadora pública independente para planejamento de nutrição e regas.
Plantas que Curam é o primeiro parceiro, não proprietário do RAIZORA. Fontes
oficiais auditadas e decisões explícitas do responsável consolidam o MVP.
[Constitution](../../.specify/memory/constitution.md) e [Decision Log](review.md).

## Clarifications

### Session 2026-10-02

Nenhuma pergunta adicional nesta rodada: o responsável forneceu as decisões
expressamente em SRC-007. Elas substituem as respostas de SRC-006 sobre duração
variável e input foliar editável. O histórico dessas substituições está em review.
As cinco consolidações abaixo agrupam decisões fornecidas, não perguntas repetidas.

- Q: Quais campos e duração pertencem ao MVP? → A: Remover tipo de solo/cultivo e todo fator orgânico; usar oito semanas vegetativas e oito de floração do FeedingSchedule atual, sem edição da duração. SOURCE: PRODUCT DECISION, SRC-007; OQ-002/OQ-003 RESOLVED.
- Q: Como definir frequências? → A: fertigationApplicationsPerWeek global, inteiro >=1, alimenta EVERY_FERTIGATION; remover input foliar e usar FIXED_PER_WEEK prescrito em NutrientRule/semana. SOURCE: PRODUCT DECISION, SRC-007; OQ-007/OQ-008 RESOLVED; OQ-004/OQ-006 preservadas.
- Q: Como tratar ausências e completude? → A: Combinações ausentes confirmadas são NOT_APPLICABLE; não geram dose/evento/zero. Schedule atual completo; NO_RULE esperado e não confirmado impede total definitivo em cronograma futuro. SOURCE: PRODUCT DECISION, SRC-007; OQ-012a/b/c RESOLVED.
- Q: Quais validações, exibição e defaults usar? → A: Volumes decimais >0; fertirrigação obrigatória, foliar obrigatório quando selecionado produto foliar; contagem fert obrigatória inteira >=1; sem máximo agronômico. Preservar precisão interna, exibir até duas casas pt-BR sem zeros finais. Cinco produtos pré-selecionados; vazio bloqueia cálculo. SOURCE: PRODUCT DECISION, SRC-007; OQ-009/OQ-010/OQ-011 RESOLVED.
- Q: O que cada resultado representa? → A: Plano prioriza dose por litro; receita mostra um preparo por via e sua frequência informativa, sem multiplicação semanal; plano/resumo mostram totais semanais/ciclo a partir dos valores internos. SOURCE: PRODUCT DECISION, SRC-007; FR-008/009/010/012/013 e critérios de aceite atualizados.

## User Scenarios & Testing *(mandatory)*

P1 identifica a jornada matemática central; P2 identifica apresentação e entrada.
Todas as seis telas fazem parte do MVP. Cada história pode ser verificada com
configuração/regras explícitas; uma tela isolada não constitui o MVP completo.
Os critérios abaixo estão definidos; testes executáveis pertencem à implementação futura.

### User Story 1 - Iniciar planejamento público (Priority: P2)

Como visitante, quero entender a finalidade do RAIZORA e iniciar sem criar conta.

**Why this priority**: apresenta a proposta e a independência da plataforma.

**Independent Test**: abrir landing e acionar CTA para chegar à configuração.

**Acceptance Scenarios**:

1. **Given** landing, **When** leio a apresentação, **Then** encontro mensagem curta
   sobre planejamento nutricional e CTA para iniciar.
2. **Given** CTA, **When** inicio, **Then** acesso configuração sem login.
3. **Given** identificação da marca, **When** consulto a ferramenta, **Then** RAIZORA
   aparece como plataforma independente e Plantas que Curam como parceiro.

### User Story 2 - Configurar preparos e fertirrigações (Priority: P1)

Como visitante, quero informar volumes separados por via e quantas fertirrigações
faço por semana, para obter quantidades de um preparo e consumo do plano.

**Why this priority**: define entradas da matemática sem alterar prescrição.

**Independent Test**: configurar 10 L de fertirrigação, 3 eventos/semana e 2 L foliares.

**Acceptance Scenarios**:

1. **Given** configuração, **When** consulto campos funcionais, **Then** encontro
   somente volume por preparo de fertirrigação, fertirrigações por semana e volume
   por preparo foliar. Seleção de produtos ocorre na etapa seguinte.
2. **Given** cronograma atual, **When** consulto duração, **Then** vejo vegetativo
   8 semanas e floração 8 semanas como informações não editáveis do schedule.
   Não encontro tipo de solo, duração livre ou frequência foliar editável.
3. **Given** entradas vazias, zero, negativas ou não numéricas em campo obrigatório,
   **When** tento calcular, **Then** recebo mensagem junto ao campo e cálculo bloqueado.
   Uma contagem fracionária de fertirrigação também é inválida.
4. **Given** volumes decimais positivos e contagem inteira >=1, **When** valido,
   **Then** eles são válidos sem máximo agronômico inventado; valores precisam ser finitos.
5. **Given** nenhum produto foliar selecionado, **When** volume foliar está ausente,
   **Then** isso não bloqueia o cálculo. Se seleciono um foliar e falta volume válido,
   **Then** o cálculo é bloqueado até corrigir. Revalidar ao mudar seleção.

### User Story 3 - Selecionar produtos (Priority: P1)

Como visitante, quero escolher produtos do cronograma sem alterar doses dos demais.

**Why this priority**: determina quais regras confirmadas serão avaliadas.

**Independent Test**: selecionar somente Joker e Coringa e conferir exclusão dos demais.

**Acceptance Scenarios**:

1. **Given** primeira abertura da etapa, **When** vejo produtos, **Then** Joker,
   Coringa Blend, Plant Protein, Terpeno Plus e Tricomax estão selecionados por padrão.
   Speed Vega não aparece como calculável.
2. **Given** produto desmarcado, **When** consulto resultados, **Then** não há consumo
   dele nem compensação de doses nos restantes. Ao voltar à etapa, manter seleção atual.
3. **Given** seleção/configuração alterada, **When** consulto resultados novamente,
   **Then** vejo os valores atuais, sem resultados antigos.
4. **Given** todos desmarcados, **When** tento avançar/calcular, **Then** avanço para
   cálculo é bloqueado e uma mensagem pede selecionar pelo menos um produto.
5. **Given** Tricomax selecionado globalmente, **When** consulto vegetativo,
   **Then** ele é NOT_APPLICABLE e não participa da receita ou consumo desse estágio.

### User Story 4 - Consultar doses e consumo semanal (Priority: P1)

Como visitante, quero consultar o plano por estágio/semana distinguindo prescrição
por litro de quantidade calculada, para compreender meu cronograma.

**Why this priority**: torna dose, aplicação e frequência compreensíveis.

**Independent Test**: consultar vegetativo S1/S3/S7 e comparar com regras auditadas.

**Acceptance Scenarios**:

1. **Given** produto selecionado e aplicável, **When** consulto uma semana,
   **Then** vejo dose por litro, unidade, via e frequência com rótulos explícitos.
2. **Given** Joker vegetativo S1/S3, **When** consulto doses, **Then** vejo 1 g/L e
   2 g/L. Valores calculados para 10 L não aparecem como se fossem doses por litro.
3. **Given** Coringa vegetativo S3, **When** consulto regra, **Then** vejo 5 ml/L,
   via foliar e 2 aplicações prescritas na semana, sem opção de sobrescrever.
4. **Given** Joker floração S6–S8 ou Tricomax S1–S4, **When** consulto semana,
   **Then** vejo “—” como não utilizado confirmado, sem dose/evento nessa posição.
5. **Given** Tricomax vegetativo ou Coringa/Terpeno floração, **When** consulto plano,
   **Then** vejo NOT_APPLICABLE (pode ser “—” com significado acessível), sem dose zero.
6. **Given** quantidade semanal, **When** consulto consumo no plano,
   **Then** ele tem rótulo próprio e não é confundido com dose/L ou preparo.

### User Story 5 - Obter receita de um preparo (Priority: P1)

Como visitante, quero selecionar estágio/semana e consultar a quantidade para um
preparo de cada via, sem confundir essa receita com consumo da semana.

**Why this priority**: entrega quantidades concretas de preparação.

**Independent Test**: vegetativo S4 com 10 L de fertirrigação e 2 L de foliar.

**Acceptance Scenarios**:

1. **Given** Joker vegetativo S1 e 10 L, **When** consulto receita,
   **Then** vejo `1 g/L × 10 L = 10 g` para um preparo.
2. **Given** vegetativo S4 e 10 L, **When** consulto fertirrigação,
   **Then** vejo Joker `2 g/L × 10 L = 20 g` por preparo; com contagem global 3,
   informar 3 fertirrigações/semana sem transformar a receita em 60 g.
3. **Given** vegetativo S4 e 2 L foliares, **When** consulto pulverização,
   **Then** vejo Coringa 10 ml, Plant Protein 6 ml e Terpeno 2 ml por preparo;
   informar 2 aplicações naquela semana, sem multiplicar os valores da receita.
4. **Given** receita de qualquer semana, **When** alterno via,
   **Then** vejo apenas selecionados aplicáveis à via/semana. Não incluir
   NOT_APPLICABLE, não utilizado, NO_RULE ou produtos da outra via.
5. **Given** nenhum produto aplicável à via/semana, **When** consulto seu grupo,
   **Then** ele não contém quantidades e indica claramente ausência de aplicação;
   isso não torna o cronograma atual incompleto.
6. **Given** receita, **When** leio números, **Then** estágio/semana, volume,
   dose/unidade, quantidade por preparo e frequência informativa estão identificados.
   Totais semanais/ciclo ficam no plano/resumo, não são a receita.

### User Story 6 - Consultar consumo total do ciclo (Priority: P1)

Como visitante, quero consultar consumo por produto das dezesseis semanas do
cronograma atual para planejar quantidades sem somar unidades incompatíveis.

**Why this priority**: consolida regras aplicáveis confirmadas em resultado completo.

**Independent Test**: caso C-005, todos selecionados, 10 L/3 fertirrigações/2 L foliares.

**Acceptance Scenarios**:

1. **Given** configuração válida e cronograma atual, **When** consulto resumo,
   **Then** vejo total completo por produto: NOT_APPLICABLE e não utilizado não
   geram eventos e não causam flag de incompletude.
2. **Given** C-005, **When** somo semanas aplicáveis,
   **Then** recebo Joker 780 g, Coringa 160 ml, Plant Protein 1.596 ml,
   Terpeno 32 ml e Tricomax 300 g.
3. **Given** Plant Protein em dois estágios, **When** agrego,
   **Then** calculo primeiro vegetativo foliar e floração via fertirrigação,
   usando os volumes/frequências corretos antes de somar seus ml.
4. **Given** necessidade futura de regra esperada mas não confirmada (NO_RULE),
   **When** avalio esse cronograma, **Then** marco incompleto e não apresento
   soma conhecida como total definitivo. Essa situação não existe no schedule atual.
5. **Given** valores exibidos arredondados, **When** somo o ciclo,
   **Then** o motor usa valores internos anteriores à formatação; exibição pt-BR
   tem no máximo duas casas sem zeros finais e não modifica o total interno.

### Edge Cases

- Tipo de cultivo não existe como input do MVP; não aplicar fator de dose.
  Isso não afirma equivalência agronômica entre orgânico e inerte.
- Semana fora de S1–S8 do estágio atual não é seleção válida. Não repetir,
  interpolar, compactar, extrapolar ou permitir duração alternativa neste schedule.
- Zero/negativo/não finito/não numérico em volume requerido é inválido;
  fertirrigações requer inteiro >=1. Volume foliar ausente é permitido sem foliares.
- Produtos vêm inicialmente selecionados; desmarcar todos bloqueia cálculo.
- Frequência foliar não é input: usar 1/2/3 prescritos para cada semana.
- A contagem global de fertirrigação é a mesma nas dezesseis semanas deste MVP;
  uma alteração recalcula todas as regras EVERY_FERTIGATION aplicáveis.
- Plant Protein muda de FOLIAR no vegetativo para SOIL/FERTIGATION na floração;
  não inferir via global por nome de produto.
- NOT_APPLICABLE confirma ausência de aplicação nesse contexto; NO_RULE indica
  expectativa sem regra confirmada. Nenhum dos dois significa dose zero.
- Não utilizado em semana ativa do estágio também não gera preparo ou consumo;
  o estado permanece distinguível de não aplicabilidade ao estágio inteiro.
- Deseleção não redistribui dose. Voltar mantém valores/seleção na sessão aberta;
  restaurar após recarga/fechamento não é requisito.
- Valores positivos pequenos e empates de arredondamento: definir mecanismo técnico
  determinístico no plan, preservando precisão interna, limite visual e semântica
  dos estados. Isso não muda dosagem nem reabre decisão de formato do produto.
- Tela estreita: manter nomes/unidades/vias legíveis; rolagem local de tabela
  é permitida, sem overflow horizontal da página inteira.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Disponibilizar as seis etapas sem autenticação.
- **FR-002**: Identificar RAIZORA independente e Plantas que Curam como parceiro.
- **FR-003**: Permitir avançar/voltar preservando entradas e seleção transitórias;
  mudanças invalidam/recalculam resultados; não persistir cultivos.
- **FR-004**: Oferecer exatamente três inputs numéricos de configuração:
  volume de fertirrigação em L/preparo, fertigationApplicationsPerWeek global e
  volume foliar em L/preparo. A contagem global vale nas semanas dos dois estágios.
- **FR-005**: Remover tipo de solo/cultivo, redução de dose, duração editável e
  frequência foliar editável. Informar 8 semanas vegetativas +8 de floração do
  FeedingSchedule atual; isso não é duração universal de RAIZORA.
- **FR-006**: Exigir volume de fertirrigação finito >0 aceitando decimais; contagem
  de fertirrigação obrigatória inteira >=1; volume foliar finito >0 aceitando
  decimais e obrigatório somente com produto foliar selecionado. Não criar máximo
  agronômico; proteção contra valores extremos fica no plan como limite técnico.
- **FR-007**: Oferecer somente os cinco produtos do schedule, pré-selecionados
  inicialmente, com possibilidade de remover; seleção vazia bloqueia avanço/cálculo
  com mensagem. Speed Vega não participa e doses não são compensadas por deseleção.
- **FR-008**: Priorizar dose oficial por litro no plano por estágio/semana. Identificar
  separadamente qualquer quantidade semanal calculada; não misturar dose/L e preparo.
- **FR-009**: Calcular amountPerApplication = dosePerLiter × preparationVolumeLiters
  da via da regra, com unidade resultante g ou ml. Não usar volume da outra via.
- **FR-010**: Representar frequencyMode por NutrientRule: FIXED_PER_WEEK multiplica
  pelo prescribedApplicationsPerWeek da semana; EVERY_FERTIGATION multiplica por
  fertigationApplicationsPerWeek da configuração. Não criar frequência global no
  Product nem multiplicar frequência prescrita por frequência informada.
- **FR-011**: Usar EVERY_FERTIGATION para Joker vegetativo S1–S8 e floração S1–S5,
  Plant Protein floração S1–S8 e Tricomax floração S5–S8. “Todas as regas” relaciona-se
  à fertirrigação configurada; não contar regas comuns automaticamente ou fixar 3.
- **FR-012**: Receita mostra um preparo separado por SOIL/FERTIGATION e FOLIAR,
  com dose/unidade, volume, quantidade e frequência informativa; não multiplicar
  pela frequência semanal nem incluir produtos não aplicáveis à via/semana.
- **FR-013**: cycleTotal(product) soma weeklyAmount das regras selecionadas,
  aplicáveis e confirmadas. Schedule atual completo; NOT_APPLICABLE e não utilizado
  não geram quantidade/evento e não tornam o resumo incompleto. Não somar g e ml;
  não arredondar intermediários ou somar parcelas formatadas. Exibir até duas casas
  pt-BR sem zeros finais. NO_RULE esperado no futuro impede total definitivo.
- **FR-014**: Distinguir não selecionado, não utilizado, NOT_APPLICABLE, NO_RULE,
  regra não confirmada e zero numérico. “—” pode representar não utilizado ou
  NOT_APPLICABLE com semântica acessível; nunca inferir zero de ausência. Confirmar
  escopo antes de classificar novos dados como NOT_APPLICABLE.
- **FR-015**: Manter doses oficiais da tabela e rastrear decisões do responsável.
  PDF/layout não criam cálculo; não aplicar fator orgânico ou dosagem do Speed Vega.
- **FR-016**: Identificar marca, schedule, versão/referência e fontes do plano,
  incluindo confirmações de frequência/aplicabilidade. Não cria histórico persistido.
- **FR-017**: Permitir futuros parceiros/schedules com estágios/durações próprios;
  duração, via e frequência atuais são dados. Contratos neutros, sem condicionais
  de fabricante no motor; novos modos exigem extensão explícita quando necessários.
- **FR-018**: Motor determinístico independente da UI, com unidades fortes e testes
  unitários futuros de regras, preparo, frequência, agregação sem arredondamento
  intermediário, seleção e estados. Verificar C-001–C-005 independentemente da tela.

### Requisitos de experiência e responsividade

- **UX-001**: Fluxo Landing → Configuração → Produtos → Plano → Receita → Resumo.
  Configuração apresenta somente os três inputs e duração informativa; produtos
  têm seleção/default/estado vazio claros; resultados distinguem dose/preparo/total.
  Remover do mockup os controles incompatíveis com SRC-007.
- **UX-002**: Mobile mantém leitura e percurso sequencial, com produto/dose/unidade/
  via identificáveis sem depender de hover.
- **UX-003**: Tablet agrupa campos por via e amplia comparação semanal mantendo
  ordem de leitura e mesmos dados do mobile.
- **UX-004**: Desktop aproveita largura para tabela semanal e grupos de via/estágio,
  com navegação entre etapas; não apenas esticar a coluna mobile. SRC-003 contém
  somente mobile; preservar hierarquia visual com composições próprias.
- **UX-005**: Verificar larguras 360, 768 e 1280 px e intervalos sem corte,
  sobreposição ou overflow da página; tabelas podem rolar localmente com identificação
  das linhas/colunas. São alvos de teste, não breakpoints impostos pela imagem.
- **UX-006**: Rótulos/unidades claros, seleção, foco e uso por teclado; erros,
  estágios e significado de “—” não dependem só de cor ou símbolo sem descrição.
- **UX-007**: Usar SRC-003 como referência de fundo claro, verde, cards, imagens e
  navegação, adaptando identidade para RAIZORA e inputs para SRC-007. Não copiar
  quantidades incorretas do mockup. Copy/imagens finais são OQ-013 DEFERRED.

### Key Entities *(include if feature involves data)*

- **Brand**: identidade de fabricante/parceiro, separada da plataforma RAIZORA.
- **Product**: identidade/nome vinculado a Brand; não fixa dose, via ou frequência global.
- **FeedingSchedule**: conjunto versionado de uma Brand, com referência oficial,
  estágios/durações e cobertura confirmada. O atual tem vegetativo 8 e floração 8;
  outros schedules podem ter outros estágios/durações. Completo para os cinco produtos.
- **Stage**: estágio e duração definidos no schedule, não na plataforma nem input do MVP.
- **Week**: posição no Stage; semanas selecionáveis seguem cobertura do schedule.
- **NutrientRule**: productId, estágio/semana, dose, unidade, applicationType,
  frequencyMode, prescribedApplicationsPerWeek quando FIXED_PER_WEEK, origem e
  confirmação. NOT_APPLICABLE/não utilização são cobertura sem evento, não dose zero.
- **ApplicationType**: SOIL/FERTIGATION ou FOLIAR nesta versão; volume por preparo
  é escolhido conforme a regra, não conforme o nome do produto.
- **CultivationConfiguration**: somente os três valores numéricos definidos em FR-004;
  seleção global é estado do fluxo à parte. Contagem de fertirrigação única no MVP.
- **CalculationEngine**: capacidade neutra para aplicar regras e configuração,
  sem definir prescrição e sem depender de interface/fabricante.
- **CalculationResult**: dose/L, quantidade/preparo, semana, produto/estágio/ciclo,
  unidades, memória e estado de completude. NÃO converter ausência em zero.

Relações: Brand → Product; Brand → FeedingSchedule → Stage → Week → NutrientRule →
Product. Sem esquema técnico executável nesta fase; contratos e pastas ficam para plan.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Percorrer seis etapas sem login, editar entradas/seleção e consultar
  resultados atualizados; configuração não possui os campos removidos.
- **SC-002**: C-001 dá 10 g por preparo; C-002 dá 10 ml por preparo e 20 ml na função
  semanal; C-003 dá 20 g por preparo e 60 g/semana quando a contagem explícita é3.
  A receita exibe somente o preparo, sem total semanal apresentado como preparo.
- **SC-003**: 100% das doses/vias/frequências/aplicabilidades dos resultados possuem
  fonte ou confirmação identificável; ausência não cria dose, zero ou evento.
- **SC-004**: C-005 resulta nos cinco totais confirmados; cada total coincide com
  soma interna das semanas aplicáveis. Produto desmarcado não altera os demais.
- **SC-005**: Em 360/768/1280 px e intervalos, todos os controles/unidades/resultados
  essenciais são acessíveis sem corte/sobreposição/overflow; desktop compara semanas.
- **SC-006**: Entradas/schedule/seleção iguais reproduzem quantidades iguais; até duas
  casas pt-BR sem zeros finais na tela não alteram precisão dos totais internos.
- **SC-007**: Seleção vazia impede cálculo com mensagem; zero/não finito/negativo em
  volume obrigatório e contagem não inteira ou <1 são rejeitados. Sem foliares,
  volume foliar ausente não bloqueia. NOT_APPLICABLE não marca o ciclo como incompleto.

## Assumptions

- Navegador e sessão transitória; sem restaurar cultivo após recarga/fechamento.
- Volumes por preparo, separados por via, mantidos como configuração do ciclo atual.
- Marca única no MVP; extensibilidade não adiciona seletor de marcas, administração,
  mistura de marcas ou integração remota.
- Duração e frequências são decisões confirmadas/dados do schedule, não guesses;
  uniformidade da contagem global não é regra para cronogramas futuros.
- Detalhes de parser decimal, algoritmo interno/empates/subcentésimos e proteção
  contra valores extremos ficam para plan. Não são regras agronômicas nem blockers
  do comportamento confirmado; garantir determinismo e precisão conforme constitution.
- OQ-013 pode aguardar revisão de conteúdo antes de publicação, sem mudar a matemática.

## Sources & Rule Provenance (RAIZORA)

### Inventário de fontes e auditoria direta

| ID | Fonte | Papel | Disponibilidade e verificação |
| --- | --- | --- | --- |
| SRC-001 | [tabela_nutricional.jpeg](../../tabela_nutricional.jpeg) | Doses, unidades, vias e frequência impressa | JPEG 1600 × 776 auditado na rodada anterior; hashes preservados |
| SRC-002 | [base_conhecimento_plantas_que_curam_ia.pdf](../../base_conhecimento_plantas_que_curam_ia.pdf) | Nomes e contexto | Seis páginas lidas; atualização interna 07/06/2026; não fonte de cálculo |
| SRC-003 | [Layout_celular.jpeg](../../Layout_celular.jpeg) | Referência visual | JPEG 1536 × 448, seis telas auditadas; inputs/números corrigidos conforme decisões |
| SRC-004 | Pedido inicial do responsável,2026-10-02 | Escopo/não utilização | Joker floração S6–S8 e Tricomax floração S1–S4 não utilizados |
| SRC-005 | Diretrizes do primeiro clarify,2026-10-02 | Contexto de decisões | Estados e deferimento de conteúdo; refinados por SRC-007 |
| SRC-006 | Respostas interativas anteriores,2026-10-02 | SOURCE: PRODUCT DECISION | Joker/eventos de rega preservados; duração variável e input foliar editável SUPERSEDED por SRC-007 |
| SRC-007 | Decisões explícitas desta rodada,2026-10-02 | SOURCE: PRODUCT DECISION | Escopo/inputs, duração8+8 atual, frequências, cobertura, validação, precisão, seleção e separação das telas |

Hierarquia de cálculo: SRC-001 → confirmação explícita do responsável. PDF é contexto;
layout é UX. Decisões de produto não são apresentadas como afirmações técnicas do fabricante.
SHA-256 das fontes auditadas:

- SRC-001: `0dc9128d6c48ce7d492058449ee99336bbdd413763df1bad46d35d25609793a7`
- SRC-002: `e0cff5da172b2a0b9fc0787771d6399c73eec8d7afb2ca5cf07506d08762a760`
- SRC-003: `dd4926ebef81e5eea5ab3f530c17abcd210ee68f393c9affb8a646fcb6d2d571`

Legenda SRC-001: lilás = pulverização em folhas/caules/colmos; verde claro = solo/
fertirrigação. Plant Protein muda de via por estágio. Joker não possui frequência
textual no JPEG: EVERY_FERTIGATION vem de SRC-006/SRC-007, não de inferência visual.

### Vegetativo — matriz auditada e cobertura confirmada

| Produto | Unidade de dose | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | Via | Frequência/estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Joker | g/L | 1 | 1 | 2 | 2 | 2 | 2 | 2 | 2 | Solo/fertirrigação | EVERY_FERTIGATION; SRC-006/007 |
| Coringa Blend | ml/L | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | Foliar | FIXED_PER_WEEK:1/1/2/2/2/2/3/3; SRC-001 |
| Plant Protein | ml/L | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | Foliar | FIXED_PER_WEEK:1/1/2/2/2/2/3/3; SRC-001 |
| Terpeno Plus | ml/L | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | Foliar | FIXED_PER_WEEK:1/1/2/2/2/2/3/3; SRC-001 |
| Tricomax | Não aplicável | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Não aplicável neste estágio | NOT_APPLICABLE; SRC-007 |

### Floração — matriz auditada e cobertura confirmada

| Produto | Unidade de dose | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | Via | Frequência/estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Joker | g/L | 2 | 2 | 2 | 3 | 3 | — | — | — | Solo/fertirrigação | EVERY_FERTIGATION em S1–S5; SRC-006/007 |
| Plant Protein | ml/L | 4 | 4 | 4 | 6 | 8 | 8 | 8 | 8 | Solo/fertirrigação | EVERY_FERTIGATION; “todas as regas” SRC-001 + vínculo SRC-006/007 |
| Tricomax | g/L | — | — | — | — | 1 | 2 | 3 | 4 | Solo/fertirrigação | EVERY_FERTIGATION em S5–S8; SRC-001 + SRC-006/007 |
| Coringa Blend | Não aplicável | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Não aplicável neste estágio | NOT_APPLICABLE; SRC-007 |
| Terpeno Plus | Não aplicável | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | Não aplicável neste estágio | NOT_APPLICABLE; SRC-007 |

“N/A” documental = NOT_APPLICABLE confirmado pelo responsável em SRC-007 para
Tricomax vegetativo e Coringa/Terpeno floração. Na UI pode aparecer “—” com descrição
acessível. Nenhuma quantidade, dose zero ou evento é criado para essas combinações.
“—” nas células semanais Joker/Tricomax é não uso explícito SRC-004, coerente com
células vazias do JPEG; sem consumo. Ambos os estados preservam completude do schedule.
NO_RULE fica reservado a regra esperada sem confirmação; não existe no schedule atual.

O PDF confirma nomes: Joker (alias Joker All-in-One), Coringa Blend, Plant Protein,
Terpeno Plus e Tricomax. Speed Vega aparece como contexto, sem linha neste schedule;
fora da seleção/cálculo. Não inferir doses dele do PDF, que exige validação de rótulo/dose.

### Fórmulas e casos de referência

`amountPerApplication = dosePerLiter × preparationVolumeLiters`

`weeklyAmount(FIXED_PER_WEEK) = amountPerApplication × prescribedApplicationsPerWeek`

`weeklyAmount(EVERY_FERTIGATION) = amountPerApplication × fertigationApplicationsPerWeek`

`cycleTotal(product) = Σ weeklyAmount(product, stage, week)`

Somar somente regras confirmadas, aplicáveis e selecionadas. NOT_APPLICABLE e não
utilizado não geram eventos/quantidades; não adicionar um zero artificial à soma.
SOIL/FERTIGATION usa volume de fertirrigação; FOLIAR usa volume foliar. Nunca multiplicar
frequência fixa por contagem de fertirrigação. Receita é amountPerApplication;
weeklyAmount e cycleTotal são resultados distintos, não quantidades do preparo.

| Caso | Entradas explícitas | Resultado esperado |
| --- | --- | --- |
| C-001 | Vegetativo S1; Joker 1 g/L;10 L;3 fertirrigações/semana | 10 g por preparo;30 g na função semanal, não na receita |
| C-002 | Vegetativo S3; Coringa 5 ml/L;2 L foliares; regra prescreve 2/semana | 10 ml por preparo;20 ml na função semanal; sem input foliar de frequência |
| C-003 | Vegetativo S4; Joker 2 g/L;10 L;3 fertirrigações/semana | 20 g por preparo;60 g na função semanal |
| C-004 | Vetor aritmético, não prescrição: quantidades semanais10 ml e 20 ml do mesmo produto | 30 ml agregados antes da exibição |
| C-005 | Schedule 8+8; todos cinco selecionados;10 L fertirrigação;3/semana;2 L foliares | Totais por produto na tabela seguinte; N/A não gera evento nem incompletude |

| Produto em C-005 | Vegetativo | Floração | Total do ciclo |
| --- | --- | --- | --- |
| Joker | 420 g | 360 g | 780 g |
| Coringa Blend | 160 ml | NOT_APPLICABLE | 160 ml |
| Plant Protein | 96 ml | 1.500 ml | 1.596 ml |
| Terpeno Plus | 32 ml | NOT_APPLICABLE | 32 ml |
| Tricomax | NOT_APPLICABLE | 300 g | 300 g |

Conferência: soma das doses Joker veg 14 g/L-semana, flora 12 g/L-semana ativa;
foliares somam16 aplicações prescritas; Plant Protein flora 50 ml/L-semana;
Tricomax flora 10 g/L-semana ativa. Multiplicar pelos respectivos volumes/contagens.
Esses números são caso de referência, não defaults obrigatórios de inputs.
Exibição:20 → 20 g;10.5 → 10,5 ml;10.25 → 10,25 ml;0.75 → 0,75 g. Totais usam valores internos.
Compatibilidade de mistura, ordem de preparo, pH/EC e orientações agronômicas
adicionais não foram fornecidas e não são prometidas pela receita.

## Open Questions & Divergences (RAIZORA)

[open-questions.md](open-questions.md): OQ-001–OQ-012 RESOLVED, incluindo subitens 12a/b/c.
OQ-013 DEFERRED/OPTIONAL, sem blocker funcional ou matemático. SRC-007 substitui
explicitamente SRC-006 sobre duração/input foliar e encerra cobertura/classificação.
Histórico e rastreabilidade completos em [review.md](review.md).

Divergências da auditoria preservadas: marca principal do mockup corrigida para
RAIZORA; fator60 e campos antigos removidos; doses/preparos misturados e totais
ilustrativos do mockup não são regra matemática. PDF contextualiza Joker ciclo todo
ou Terpeno na floração, mas não cria regras fora do schedule. SRC-007 confirma N/A.
Coringa 3–5 ml/L do PDF inclui5 da tabela; dose dobrada via solo e formulações
históricas não entram no cálculo. Copy final fica diferida, sem claim técnico inventado.

### Fora do escopo e gate de continuidade

Sem login, contas, histórico, persistência de cultivos, administração, pagamentos,
chatbot, RAG, marketplace, compra automática, backend/banco ou integração de outra marca.
Nesta rodada: somente clarificação/documentação/revisão. Não existem plan.md,
research.md, data-model.md, quickstart.md, contratos ou tasks.md da feature, nem app.
Templates/skills de fases posteriores são infraestrutura, não execução dessas fases.

**READY FOR PLAN** após revisão e validação documental. Próximo comando recomendado:
**`$speckit-plan`**, em rodada seguinte; não executado automaticamente aqui.
A revisão `$speckit-analyze` formal pertence à fase após tasks; não foi executada.
