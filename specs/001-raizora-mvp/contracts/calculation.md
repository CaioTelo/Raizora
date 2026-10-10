# Contrato de cálculo — interface local, sem API HTTP

Data: 2026-10-03. Este contrato é documentação de função pública do domínio;
não cria REST, endpoints, transporte, schema runtime ou código executável.
Tipos completos: [data-model](../data-model.md). Decisões: [research](../research.md).

## Operação pública

`calculateNutritionPlan(input): CalculationResponse`

Input obrigatório:

| Campo | Tipo | Significado |
| --- | --- | --- |
| schedule | FeedingSchedule | Catálogo, duração, slots, fontes e versão locais |
| configuration | CultivationConfiguration | Valores numéricos, não texto de formulário |
| selectedProductIds | SelectedProductSet | Seleção global; IDs pertencem ao catálogo |

É função síncrona e pura. Sem React/Next/DOM, browser, rede, arquivos, clock,
estado global ou mutation de entradas. Não importa o dataset do parceiro. Duas
entradas equivalentes produzem respostas equivalentes; ordenar seleção pelo catálogo
antes de agregar. Não usar aleatoriedade nem data de execução nos resultados.

## Validação e execução

1. `validateSchedule` verifica estrutura, IDs, unicidade, fontes, dose/unidade,
   via/frequência e duração. Dados malformados → INVALID_SCHEDULE. Lacuna de
   cobertura e slot NO_RULE são diagnósticos de completude, não erro estrutural.
2. `validateCalculationInput` verifica seleção/configuração usando o schedule.
   Fert volume finito >0; contagem inteiro seguro >=1; seleção não vazia e sem IDs
   desconhecidos/duplicados; foliar necessário quando há ACTIVE FOLIAR selecionado.
   Volume opcional informado também precisa ser finito >0. Falha → INVALID_INPUT.
3. Percorrer estágios ordenados, semanas 1..weekCount e produtos selecionados na
   ordem do catálogo. Resolver o slot exato sem if por marca, nome ou semana.
   Slot inexistente gera NO_RULE/MISSING; explícito pendente → NO_RULE/UNCONFIRMED.
4. ACTIVE: escolher volume por ApplicationType; calcular dose × volume para um
   preparo; multiplicar pela frequência efetiva FIXED ou EVERY_FERTIGATION.
   NOT_APPLICABLE produz só entry de cobertura, sem quantidade/evento.
5. Verificar resultados positivos finitos e somas finitas. Multiplicação de
   positivos que resulta zero → UNDERFLOW; não finito → OVERFLOW. Falha numérica
   retorna NUMERIC_ERROR, sem resultado parcial exibível como sucesso.
6. Agregar valores brutos ACTIVE, por produto/estágio/ciclo. Não somar unidades
   diferentes nem parcelas formatadas. Qualquer NO_RULE selecionado torna o plano
   INCOMPLETE e os agregados afetados INCOMPLETE; não há total definitivo nesses
   escopos. Scope sem ACTIVE/NO_RULE tem aggregate NOT_APPLICABLE, nunca zero.
7. Retornar SUCCESS com CalculationResult canônico, inclusive quando INCOMPLETE.
   Formatação/locale ficam fora do motor.

Helpers planejados: cálculo de quantidade/preparo, quantidade/semanal, semana,
agregação por estágio e produto/ciclo. Podem ser funções privadas no mesmo módulo;
não criar abstração/classe/arquivo por multiplicação. `calculateNutritionPlan`
coordena um único percurso e `calculateProductTotals` agrega as entries geradas.
Chamadas isoladas de helpers não dispensam validação na entrada pública.

## Saída e falhas

CalculationResponse é união de SUCCESS/result, INVALID_INPUT/issues,
INVALID_SCHEDULE/issues e NUMERIC_ERROR/issues. A UI nunca recebe uma resposta
inválida com result opcional de um cálculo anterior. Issue tem code e contexto;
o adapter de apresentação fornece mensagem compreensível em pt-BR.

Completude depende da seleção. Um NO_RULE em produto não selecionado não torna
seus resultados incompletos. Validação estrutural, entretanto, cobre todo o
objeto recebido: unidade/dose malformada não passa só porque não foi selecionada.
Não adicionar tratamento de exceção como caminho normal de validação.

## Projeções da aplicação

| Visualização | Dados canônicos usados | Operações permitidas |
| --- | --- | --- |
| Plano | weeks.entries, dose, frequency, weeklyAmount, cobertura | Filtro/ordenação de apresentação, resolver rótulos por ID |
| Receita | mesma WeekCalculation, somente ACTIVE por via | Filtrar; mostrar amountPerApplication, volume e frequência informativa |
| Resumo | productTotals.byStage/cycle, completeness | Renderizar agregado/estado; sem somar de novo na UI |

Seleção de estágio/semana não altera a matemática do ciclo. Via não é global do
Product. Receita não implica compatibilidade de mistura, sequência, pH ou EC.

## Exemplos obrigatórios de aceitação

| Caso | Regra/input | Resultado |
| --- | --- | --- |
| C-001 | Joker veg S1, 1 g/L, 10 L, 3 fert/semana | 10 g/preparo; 30 g/semana |
| C-002 | Coringa veg S3, 5 ml/L, 2 L, FIXED 2 | 10 ml/preparo; 20 ml/semana |
| C-003 | Joker veg S4, 2 g/L, 10 L, 3 fert/semana | 20 g/preparo; 60 g/semana |
| Novo caso pedido | Terpeno veg S7, 1 ml/L, 2 L, FIXED 3 | 2 ml/preparo; 6 ml/semana |
| Novo caso pedido | Joker flora S4, 3 g/L, 10 L, 3 fert | 30 g/preparo; 90 g/semana |
| Novo caso pedido | Plant Protein flora S5, 8 ml/L, 10 L, 3 fert | 80 ml/preparo; 240 ml/semana |
| Novo caso pedido | Tricomax flora S5, 1 g/L, 10 L, 3 fert | 10 g/preparo; 30 g/semana |

C-005: 10 L, 3 fert/semana, 2 L foliar, todos selecionados → COMPLETE;
Joker 780 g, Coringa 160 ml, Plant Protein 1596 ml, Terpeno 32 ml, Tricomax 300 g.
Os totais por estágio estão no data-model. Esses valores são fixtures de teste,
não valores iniciais obrigatórios dos inputs.

Dados sintéticos para segurança do contrato: substituir um slot selecionado por
NO_RULE ou removê-lo → INCOMPLETE, agregado afetado sem amount definitivo;
desmarcar produto → omiti-lo sem alterar consumo dos demais; seleção vazia →
INVALID_INPUT; unidade incompatível → INVALID_SCHEDULE; multiplicação que excede
Number → NUMERIC_ERROR. NOT_APPLICABLE não gera evento nem incompletude.
