# Feature Specification: RAIZORA v1.1 — configuração, consulta semanal e impressão

**Feature**: `002-raizora-v1-1`

**Feature Branch**: `master` (branch atual; nenhuma branch criada nesta etapa)

**Created**: 2026-10-08

**Status**: Clarified — READY FOR PLAN. Aprovação funcional recebida; consolidação
documental concluída. Execução de plan aguarda autorização do responsável.

**Input**: Requisitos R1–R5 aprovados pelo responsável nesta solicitação, sobre o
MVP concluído. Aprovação funcional e instruções de clarify/consolidação fornecidas
pelo responsável em 2026-10-08. Documentos históricos preservados; plan não executado.

O objetivo é simplificar a configuração, concentrar a consulta em uma semana e
permitir imprimir o plano completo. Os contratos existentes continuam sendo
referência para comportamentos preservados; as substituições são delimitadas aqui.

## Clarifications

### Session 2026-10-08

Nenhuma ambiguidade crítica exige pergunta adicional. As três consolidações
abaixo registram decisões já fornecidas pelo responsável nesta rodada, sem
simular perguntas respondidas ou nova aprovação de soluções técnicas.

- Q: Como resolver o conflito com o princípio IX? → A: Atualizar somente IX para semana selecionada em desktop/mobile, acesso às 16 semanas atuais, transição contínua Vegetativo 8 ↔ Floração 1 e impressão do ciclo completo, sem alterar matriz ou engine. Revisão constitucional 1.0.1 → 2.0.0 registrada em GOV-V11-001 no [review](review.md).
- Q: Como registrar o relatório técnico caso não exista arquivo persistido? → A: Registrar a ausência observada e criar [technical-decisions.md](technical-decisions.md) como resumo posterior das decisões confirmadas. Não apresentar esse resumo como relatório original recuperado. OQ-V11-002 resolvida por esse encaminhamento autorizado.
- Q: O que permanece aprovado para a v1.1? → A: Os mesmos 20 FR e cinco histórias: 8+8 semanas, uma fertirrigação planejada semanal na aplicação, foliares oficiais, matriz/doses/motor/estados preservados e impressão completa independente da semana ativa. Nenhum requisito funcional novo; nenhuma autorização de plan, tasks ou implement.

## User Scenarios & Testing *(mandatory)*

Os cenários são critérios para testes futuros, não testes executados nesta rodada.
Todos os cinco requisitos integram a v1.1; prioridades não tornam itens opcionais.

### User Story 1 - Configurar volumes e obter frequência planejada definida (Priority: P1)

Como visitante, quero informar volumes por preparo e compreender a referência
opcional de volume, obtendo um plano com uma fertirrigação planejada por semana.

**Why this priority**: estabelece as entradas das quantidades sem pedir uma
frequência que esta versão define internamente.

**Independent Test**: informar 10 L de fertirrigação e 2 L foliares, manter os
cinco produtos e consultar Plano, Receita e Resumo.

**Acceptance Scenarios**:

1. **Given** Configuração, **When** consulto o volume de fertirrigação, **Then** vejo
   ajuda associada ao campo apresentando aproximadamente 10% da capacidade do vaso
   como referência opcional, sem afirmar volume obrigatório ou ideal.
2. **Given** essa ajuda, **When** informo ou altero volume, **Then** ele permanece
   manual: não existe input de capacidade do vaso, preenchimento, cálculo, ajuste
   ou limite de validação baseado nos 10%.
3. **Given** Configuração, **When** consulto seus controles e informações, **Then**
   encontro os dois inputs de volume por preparo, nenhum input de frequência,
   duração ou capacidade do vaso e nenhum painel informativo de duração.
4. **Given** 10 L e Joker vegetativo 1, **When** consulto resultados, **Then** vejo
   1 g/L, 10 g/preparo e 10 g de consumo semanal; os resultados identificam uma
   aplicação planejada de fertirrigação por semana.
5. **Given** 2 L foliares e Coringa vegetativo 3, **When** consulto resultados,
   **Then** vejo 5 ml/L, 10 ml/preparo, duas aplicações foliares prescritas e
   20 ml/semana. A frequência de fertirrigação não substitui a foliar.
6. **Given** volume de fertirrigação ausente, zero, negativo ou inválido, **When**
   avanço, **Then** recebo orientação para corrigir o volume; não há erro pedindo frequência.
7. **Given** somente Joker selecionado, volume de fertirrigação válido e foliar
   ausente, **When** avanço ao Plano, **Then** o acesso é permitido; ao selecionar
   produto ACTIVE/FOLIAR em qualquer semana, volume foliar válido volta a ser exigido.
8. **Given** sessão configurada, **When** volto e altero volumes ou seleção,
   **Then** a frequência planejada permanece uma, os valores são atualizados e
   nenhum resultado inválido anterior é reutilizado.

### User Story 2 - Consultar uma semana por vez (Priority: P1)

Como visitante, quero consultar uma semana e navegar pelo ciclo inteiro, para
compreender doses, preparos e consumo com a mesma experiência em todas as telas.

**Why this priority**: define a leitura principal do Plano em todas as larguras.

**Independent Test**: em 360, 768 e 1280 px, percorrer 16 semanas por Anterior/
Próxima e alcançar uma semana específica pelos seletores de estágio e semana.

**Acceptance Scenarios**:

1. **Given** primeira entrada no Plano, **When** ele aparece, **Then** Vegetativo 1
   é a única semana com detalhamento de produtos, doses e quantidades.
2. **Given** qualquer semana ativa, **When** consulto mobile, tablet ou desktop,
   **Then** somente ela tem detalhamento; não existe tabela de comparação de várias
   semanas. Seletores, contexto do plano e duração continuam disponíveis.
3. **Given** Vegetativo 8, **When** aciono Próxima, **Then** chego a Floração 1;
   **Given** Floração 1, **When** aciono Anterior, **Then** retorno a Vegetativo 8.
4. **Given** Vegetativo 1 ou Floração 8, **When** consulto respectivamente Anterior
   ou Próxima, **Then** a ação indisponível é identificada; não ultrapasso o ciclo
   nem retorno automaticamente ao outro extremo.
5. **Given** seletores diretos de estágio e semana, **When** escolho Floração 5,
   **Then** chego ao detalhamento sem percorrer semanas intermediárias. Trocar
   somente estágio preserva a semana válida, conforme contrato existente.
6. **Given** navegação sequencial ou direta, **When** a semana muda, **Then** estágio,
   número, controles e dados concordam; volumes, produtos e totais do ciclo não mudam.
7. **Given** semana escolhida, **When** avanço à Receita e retorno ao Plano,
   **Then** a seleção de estágio/semana compartilhada permanece, como no MVP.
8. **Given** uso por teclado, **When** opero os controles, **Then** alcanço todas as
   semanas com foco visível, rótulos claros e identificação textual da semana ativa,
   sem depender exclusivamente de cor, hover ou gesto.

### User Story 3 - Entender a duração no Plano (Priority: P2)

Como visitante, quero encontrar a duração junto do cronograma, para compreender
o alcance do plano sem configurá-la.

**Why this priority**: mantém a informação no contexto de consulta.

**Independent Test**: conferir ausência da duração na Configuração e presença
dos estágios e total no Plano do cronograma atual.

**Acceptance Scenarios**:

1. **Given** Plano atual, **When** consulto duração, **Then** vejo 8 semanas
   vegetativas, 8 de floração e 16 no total, derivados do cronograma, independentemente
   da semana ativa e dos produtos selecionados.
2. **Given** duração apresentada, **When** procuro alterá-la, **Then** não há
   controle de edição; ela descreve este cronograma, sem ser duração universal de RAIZORA.

### User Story 4 - Imprimir o plano completo (Priority: P1)

Como visitante, quero imprimir o ciclo completo em A4, para consultar todas as
semanas e quantidades fora da navegação da calculadora.

**Why this priority**: entrega uma cópia completa do planejamento.

**Independent Test**: com cinco produtos, 10 L de fertirrigação, 2 L foliares e
Floração 4 ativa, imprimir e comparar a prévia A4 com os resultados da configuração.

**Acceptance Scenarios**:

1. **Given** Plano válido, **When** aciono Imprimir plano completo, **Then** acesso
   a impressão nativa do navegador com Vegetativo 1–8 e Floração 1–8 em ordem,
   independentemente da semana ativa.
2. **Given** prévia A4, **When** confiro cada semana, **Then** encontro estágio,
   semana, produtos selecionados e estados; cada ACTIVE mostra dose oficial/L e
   unidade, via, volume/preparo, quantidade/preparo, frequência efetiva e consumo semanal.
3. **Given** prévia completa, **When** consulto contexto e consumo do ciclo,
   **Then** encontro RAIZORA, parceiro, identificação/versão/fontes do cronograma,
   duração 8+8, volumes, política de uma fertirrigação planejada/semana e totais
   por produto e estágio/ciclo com os estados do resultado existente.
4. **Given** Tricomax vegetativo, Joker floração 6 e fixture sintética NO_RULE,
   **When** imprimo, **Then** reconheço não aplicável ao estágio, não utilizado na
   semana e regra não confirmada, respectivamente; não há quantidade ou zero inventado.
5. **Given** resultado sintético válido INCOMPLETE, **When** imprimo, **Then** a
   incompletude é explícita, escopos afetados não têm total definitivo e valores
   conhecidos, se apresentados, são identificados como subtotais.
6. **Given** produto desmarcado, **When** imprimo, **Then** ele é omitido sem mudar
   valores dos demais; NOT_APPLICABLE de produto selecionado continua representado.
7. **Given** várias páginas A4, **When** leio, **Then** dados e unidades são legíveis,
   sem cortes ou sobreposição, e blocos que continuam em outra página mantêm
   identificação de estágio/semana. Não há controles, inputs, seletores ou botões impressos.
8. **Given** impressão concluída ou cancelada, **When** retorno à calculadora,
   **Then** volumes, produtos, etapa e semana ativa permanecem; a tela continua
   detalhando uma única semana.
9. **Given** configuração inválida ou falha de cálculo, **When** tento imprimir,
   **Then** nenhum resultado antigo é apresentado como plano válido.

### User Story 5 - Preservar matemática e estados (Priority: P1)

Como visitante, quero que as melhorias preservem regras oficiais e distinções
entre dose, preparo e consumo, para confiar nos resultados.

**Why this priority**: a política de entrada muda sem substituir prescrição ou fórmulas.

**Independent Test**: conferir casos V11 e regressões abaixo, incluindo outras
frequências válidas em chamadas diretas ao motor.

**Acceptance Scenarios**:

1. **Given** V11-CICLO, **When** consulto Plano, Receita, Resumo e impressão,
   **Then** quantidades coincidem com as referências; navegar ou imprimir não altera totais.
2. **Given** contrato genérico chamado com três fertirrigações, **When** verifico
   C-001 e C-005 históricos, **Then** seus resultados permanecem. O valor um é
   política da aplicação v1.1, não restrição nova do motor.
3. **Given** NOT_APPLICABLE confirmado ou WEEK_NOT_USED, **When** calculo/exibo,
   **Then** não há evento/quantidade nem incompletude; **Given** NO_RULE selecionado,
   **Then** plano e agregados afetados permanecem incompletos, sem total definitivo.

### Casos de referência e cenários de regressão

Casos V11 usam uma fertirrigação planejada/semana. Casos históricos com três
continuam válidos para o motor, sem serem opções na interface da v1.1.

| Caso | Entradas explícitas | Aceite esperado |
| --- | --- | --- |
| V11-01 | Joker vegetativo 1; 1 g/L; 10 L; uma fertirrigação/semana | 10 g/preparo; 10 g/semana |
| V11-02 | Joker vegetativo 4; 2 g/L; 10 L; uma fertirrigação/semana | 20 g/preparo; 20 g/semana |
| V11-03 | Coringa vegetativo 3; 5 ml/L; 2 L foliares; FIXED_PER_WEEK 2 | 10 ml/preparo; 20 ml/semana |
| V11-04 | Terpeno vegetativo 7; 1 ml/L; 2 L foliares; FIXED_PER_WEEK 3 | 2 ml/preparo; 6 ml/semana |
| V11-05 | Plant Protein floração 5; 8 ml/L; 10 L; uma fertirrigação/semana | 80 ml/preparo; 80 ml/semana; via fertirrigação |
| V11-06 | Tricomax floração 5; 1 g/L; 10 L; uma fertirrigação/semana | 10 g/preparo; 10 g/semana |
| REG-01 | C-001 histórico: Joker vegetativo 1; 10 L; três fertirrigações/semana; chamada ao motor | 10 g/preparo; 30 g/semana |
| REG-02 | C-005 histórico: cinco produtos; 10 L; três fertirrigações/semana; 2 L foliares; chamada ao motor | Joker 780 g; Coringa 160 ml; Plant Protein 1.596 ml; Terpeno 32 ml; Tricomax 300 g |
| REG-03 | Fixture com NO_RULE selecionado; repetir sem esse produto selecionado | Primeiro: incompletude sem total definitivo afetado; segundo: ausência não afeta completude dos selecionados |

**V11-CICLO**: cinco produtos selecionados, 10 L de fertirrigação, uma aplicação
planejada/semana, 2 L foliares, cronograma atual 8+8.

| Produto | Vegetativo | Floração | Consumo do ciclo |
| --- | --- | --- | --- |
| Joker | 140 g | 120 g | 260 g |
| Coringa Blend | 160 ml | NOT_APPLICABLE | 160 ml |
| Plant Protein | 96 ml | 500 ml | 596 ml |
| Terpeno Plus | 32 ml | NOT_APPLICABLE | 32 ml |
| Tricomax | NOT_APPLICABLE | 100 g | 100 g |

Diferenças para C-005 decorrem exclusivamente da entrada de fertirrigação passar
de três para uma; foliares continuam somando 16 aplicações prescritas. Não muda
dose, fórmula, via ou frequência prescrita.

### Edge Cases

- Vegetativo 8 ↔ Floração 1 é contínuo nos dois sentidos; extremos não são circulares.
- Troca direta somente de estágio preserva semana válida; Próxima em Vegetativo 8
  leva a Floração 1. São interações distintas, explicitamente definidas.
- Semana inválida ou fora da cobertura não é oferecida nem cria resultado.
- Mudar semana, largura ou imprimir não modifica configuração matemática.
- Igualdade numérica entre preparo e consumo semanal na fertirrigação não elimina
  rótulos distintos; foliares podem ter consumo múltiplo do preparo.
- NOT_APPLICABLE preserva STAGE_NOT_APPLICABLE e WEEK_NOT_USED. Seleção global,
  ausência confirmada e desconhecimento continuam conceitos distintos.
- NO_RULE não existe na matriz atual; testes usam fixture sintética, sem nova integração.
- Sem foliares, volume foliar ausente não bloqueia; seleção vazia bloqueia. Erros
  de volumes e precisão/valores extremos mantêm o contrato vigente.
- A4 pode ocupar várias páginas; não se exige 16 semanas em uma folha ou uma
  semana por folha. Estados não dependem de impressão colorida.
- Cancelar impressão preserva a sessão. Impressoras e destinos disponíveis
  pertencem ao navegador, sem alterar cálculo ou exigir exportador próprio.
- Arredondamento e positivos inferiores a 0,01 mantêm a apresentação vigente,
  inclusive na impressão; totais não somam valores formatados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (R1)**: Associar ao campo de fertirrigação ajuda com aproximadamente
  10% da capacidade do vaso como referência opcional.
- **FR-002 (R1)**: Manter volume manual, sem input de capacidade, preenchimento,
  cálculo, ajuste de dose ou validação derivada da orientação de 10%.
- **FR-003 (R2)**: Remover duração da Configuração e apresentar no Plano duração
  por estágio e total derivada do FeedingSchedule: 8+8=16 no atual, não editável
  e não universal.
- **FR-004 (R3)**: Detalhar uma única semana ativa no Plano em todas as larguras,
  preservando produto, dose/L, unidade, via, frequência, preparo, consumo e estados.
- **FR-005 (R3)**: Oferecer Anterior/Próxima em ordem de cronograma, inclusive
  Vegetativo 8 ↔ Floração 1, sem extrapolar ou circular nos extremos.
- **FR-006 (R3)**: Oferecer seletores diretos de estágio e semana do cronograma,
  sincronizados com a semana ativa; trocar somente estágio preserva semana válida.
- **FR-007 (R3)**: Preservar entradas, produtos, totais e seleção de estágio/semana
  compartilhada com Receita durante a navegação.
- **FR-008 (R4)**: Disponibilizar no Plano impressão completa por recursos nativos
  do navegador, independente da semana ativa na tela.
- **FR-009 (R4)**: Imprimir todas as 16 semanas em ordem, produtos selecionados e
  estados; para ACTIVE, dose/L, unidades, via, volume/preparo, quantidade/preparo,
  frequência efetiva e consumo semanal.
- **FR-010 (R4)**: Imprimir contexto: RAIZORA, parceiro, cronograma, versão/fontes,
  duração, volumes, frequência planejada e consumo por produto e estágio/ciclo
  já calculado, com estados de completude.
- **FR-011 (R4)**: Produzir saída legível em A4, admitindo múltiplas páginas,
  sem cortes/sobreposição, identificando blocos em continuações e excluindo controles.
- **FR-012 (R4)**: Preservar sessão e semana ativa ao concluir/cancelar impressão;
  não apresentar resultado obsoleto ou inválido como plano válido.
- **FR-013 (R5)**: Remover input de frequência semanal e fornecer internamente
  `fertigationApplicationsPerWeek = 1` em toda configuração enviada pela aplicação
  v1.1 ao motor, sem depender de preenchimento ou edição pelo usuário.
- **FR-014 (R5)**: Identificar nos resultados uma aplicação planejada de fertirrigação
  por semana, sem atribuí-la à prescrição oficial ou ao total de regas comuns.
- **FR-015 (R5)**: Preservar contrato genérico do motor: campo de frequência inteiro
  válido maior ou igual a um, EVERY_FERTIGATION, FIXED_PER_WEEK e validação vigente;
  chamadas com três continuam válidas.
- **FR-016 (R5)**: Preservar frequências foliares prescritas por regra/semana/estágio;
  a política de fertirrigação não as substitui nem multiplica.
- **FR-017 (transversal)**: Preservar cronograma 8+8, cinco produtos, seleção/gates
  de volumes, matriz oficial, doses, unidades, vias, fontes e fórmulas; não adicionar
  extrapolação, fator orgânico ou Speed Vega.
- **FR-018 (transversal)**: Preservar ACTIVE, NOT_APPLICABLE, NO_RULE e motivos;
  não converter ausência em zero/evento nem incompletude em total definitivo,
  tanto na consulta quanto na impressão.
- **FR-019 (transversal)**: Preservar distinções dose/L, preparo, consumo semanal/
  ciclo, separação de vias, precisão interna e apresentação vigente; usar resultados
  existentes sem novas fórmulas na consulta ou impressão.
- **FR-020 (transversal)**: Manter ajuda, controles, unidades, estados e erros
  acessíveis por teclado, com foco visível e rótulos textuais; verificar 360, 768
  e 1280 px e intervalos sem cortes/sobreposição/overflow horizontal da página.

### Rastreabilidade de aceite e contratos existentes

| Origem | Requisitos | Aceite e cenários |
| --- | --- | --- |
| R1 | FR-001–002 | História 1, cenários 1–2; SC-001 |
| R2 | FR-003 | História 1, cenário 3; História 3; SC-002 |
| R3 | FR-004–007 | História 2; SC-003–004 |
| R4 | FR-008–012 | História 4; SC-005–006 |
| R5 | FR-013–016 | História 1, cenários 3–8; História 5, cenário 2; V11/REG; SC-007–008 |
| Restrições | FR-017–020 | Histórias 1/2/4/5; Edge Cases; V11-CICLO/REG; SC-006–009 |

| Referência | Preservação e substituição delimitada |
| --- | --- |
| [Contrato de cálculo](../001-raizora-mvp/contracts/calculation.md) | Preservados operação, entradas genéricas, validação, fórmulas, saídas, estados e casos históricos. O valor um é política da aplicação. A projeção do Plano muda somente na apresentação. |
| [Contrato do wizard](../001-raizora-mvp/contracts/wizard.md) | Preservados fluxo, seleção, sessão, gates de volumes, erros, Receita/Resumo e filtro compartilhado. Substituídos terceiro input, coleta/erro de frequência, rótulo de contagem configurada pelo usuário e comparação semanal desktop. Acrescentadas navegação sequencial e impressão. |
| [Modelo existente](../001-raizora-mvp/data-model.md) | Entidades, unidades, regras e resultados preservados. Três strings históricas de formulário não obrigam manter input de frequência. Não se cria modelo técnico novo nesta etapa. |
| [Spec do MVP](../001-raizora-mvp/spec.md) | Substituições localizadas sobre FR-004/006, UX-001/003/004 e SC-005: inputs, frequência da aplicação, localização da duração e comparação simultânea. Fórmulas/prescrição preservadas; original intacto. |

### Key Entities *(include if feature involves data)*

- **FeedingSchedule / StageDefinition**: origem dos estágios, duração e semanas;
  cobertura atual preservada.
- **CultivationConfiguration**: volumes e frequência; contrato genérico preservado,
  com a aplicação v1.1 fornecendo frequência um.
- **NutrientRule**: dose, via, frequência prescrita, fonte e estado semanal
  preservados, incluindo mudança de via de Plant Protein entre estágios.
- **CalculationResult / WeekCalculation / ProductCycleTotal**: resultados e
  completude existentes usados em consulta, Receita, Resumo e impressão.
- **Semana ativa**: par estágio/semana de apresentação compartilhado com Receita;
  não restringe cálculo ou impressão ao período visível.
- **Plano impresso**: representação completa do resultado atual, sem entidade
  persistida, fonte nutricional ou cálculo independente novo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ajuda de 10% legível e opcional nas três larguras; editar volume não
  aciona cálculo, ajuste ou restrição baseado em capacidade do vaso.
- **SC-002**: Configuração tem dois inputs numéricos de volume e nenhuma duração;
  Plano apresenta 8 semanas vegetativas + 8 de floração = 16.
- **SC-003**: Nas três larguras, uma semana detalhada por estado de consulta;
  16 semanas alcançáveis sequencialmente e qualquer semana pelos dois seletores,
  sem percorrer intermediárias.
- **SC-004**: Vegetativo 8 ↔ Floração 1 exige uma ação por sentido; extremos não
  ultrapassam o ciclo, controles funcionam por teclado, com foco e identificação textual.
- **SC-005**: Prévia A4 inclui exatamente 16 semanas em ordem para qualquer semana
  ativa, com 100% dos campos FR-009/010, sem controles, corte ou sobreposição.
- **SC-006**: Para a mesma configuração/seleção, 100% das doses, quantidades,
  unidades, frequências e estados impressos coincidem com o resultado consultado;
  concluir/cancelar preserva integralmente a sessão.
- **SC-007**: V11-01–06 e V11-CICLO coincidem com as referências; preparo e consumo
  mantêm rótulos distintos mesmo quando numericamente iguais.
- **SC-008**: REG-01/02 mantêm resultados históricos com três em chamada direta
  ao motor; foliares de uma, duas e três aplicações mantêm a prescrição na v1.1.
- **SC-009**: Nenhuma ausência confirmada apresenta dose/consumo zero inventado;
  todo NO_RULE selecionado em REG-03 mantém incompletude e ausência de total
  definitivo afetado em tela e impressão.

## Assumptions

- MVP concluído é a baseline; ver [implementation-review](../001-raizora-mvp/implementation-review.md).
  Snapshots antigos não autorizam reabrir decisões nem retomar etapas do MVP.
- Impressão representa produtos selecionados, incluindo ausências confirmadas;
  não reinsere produtos desmarcados.
- A4 completo significa todas as semanas em quantas páginas forem necessárias,
  com detalhamento e totais existentes; não é impressão de todas as telas do wizard.
- Uma semana ativa limita o detalhamento, preservando contexto de duração,
  configuração/fontes e controles. Impressão é a exceção explícita de todas as semanas.
- Copy final da ajuda pode ser ajustada mantendo “aproximadamente 10%”, “capacidade
  do vaso” e caráter opcional; conteúdo aprovado pelo responsável, sem fonte oficial atribuída.
- Uma fertirrigação planejada/semana vale no ciclo da aplicação v1.1; não redefine
  regas comuns, frequências prescritas ou limites do contrato genérico.
- Mantêm-se sessão transitória, fluxo público, sem login/backend/banco/persistência;
  não há migração de cultivos salvos.
- Navegadores suportados seguem a baseline; impressoras, destinos e salvar em PDF
  dependem do navegador, sem exportador ou serviço próprio.
- Premissas são explícitas para revisão, sem decisão nutricional nova.

## Sources & Rule Provenance (RAIZORA)

| Referência | Autoridade e situação nesta etapa |
| --- | --- |
| Solicitação RAIZORA v1.1, 2026-10-08, R1–R5 | Decisão explícita do responsável para orientação textual, consulta, impressão e frequência planejada; não substitui prescrição oficial. |
| Solicitação de clarify/consolidação, 2026-10-08 | Aprovação funcional dos cinco refinamentos e autorização explícita para ajuste de IX e consolidação documental, sem executar plan. Registro em [review.md](review.md). |
| Relatório técnico dos cinco refinamentos | Aprovação do relatório informada pelo responsável; arquivo original não localizado na busca documental. [Resumo posterior](technical-decisions.md) criado conforme instrução desta rodada, sem alegação de recuperação do original. OQ-V11-002 resolvida documentalmente. |
| [Spec/fontes do MVP](../001-raizora-mvp/spec.md#sources--rule-provenance-raizora) e [decisões](../001-raizora-mvp/review.md) | Baseline auditada SRC-001–007, matriz e hashes preservados, sem nova transcrição ou alegação de auditoria repetida. |
| [Questões resolvidas do MVP](../001-raizora-mvp/open-questions.md) | SRC-007: duração, foliares e estados preservados; somente coleta/frequência da aplicação substituída explicitamente por R5. |
| [Constituição 2.0.0](../../.specify/memory/constitution.md) | IX atualizado explicitamente nesta rodada; demais princípios preservados. Justificativa, versão e impacto em GOV-V11-001 no [review](review.md). |

Tabela continua autoridade de dose/via/prescrição; confirmações explícitas dos
aspectos já decididos permanecem. PDF contextualiza e layout orienta o visual,
sem definir matemática. V11-CICLO deriva das fórmulas existentes com entrada um.

## Open Questions & Divergences (RAIZORA)

IDs, prioridades, impactos, responsáveis e encaminhamento em
[open-questions.md](open-questions.md).

### Atualização pontual do princípio IX — resolvida

Na constituição 1.0.1, IX exigia comparação semanal em telas amplas, em conflito
com R3. Conforme autorização explícita desta rodada, IX agora estabelece uma
semana selecionada por vez, navegação em desktop/mobile, acesso às 16 semanas
do cronograma atual, transição contínua Vegetativo 8 ↔ Floração 1 e impressão
do ciclo completo independentemente da semana selecionada.

Responsividade, uso da largura, agrupamento, acessibilidade, matriz e engine
permanecem preservados. Apenas IX e os metadados de alteração constitucional
foram atualizados: 1.0.1 → 2.0.0, MAJOR por redefinição incompatível de orientação.
Essa versão documental não muda a identificação de produto/feature v1.1.

OQ-V11-001 está RESOLVED. A conformidade histórica do MVP continua vinculada à
sua baseline 1.0.1; os documentos históricos não são reescritos. A revisão atual
está em [review.md](review.md), sem afirmar conformidade de software ainda não implementado.

### Fora do escopo e gate de continuidade

Somente clarify/consolidação documental e ajuste autorizado de IX nesta rodada.
Não criar plan, tasks, pesquisa/modelagem técnica nova, código de produção,
testes executáveis, commits ou deploy. O resumo de decisões confirmadas não é
pesquisa ou plano técnico. Não adicionar backend, banco, autenticação, marcas,
prescrição, cálculo por capacidade do vaso ou duração alternativa.

**READY FOR PLAN**: aprovação funcional recebida, OQ-V11-001/002 resolvidas e
revisão documental sem bloqueios. A próxima etapa possível é `$speckit-plan`,
somente após nova autorização do responsável. Nenhuma etapa seguinte foi
iniciada ou começa automaticamente.
