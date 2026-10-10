# RAIZORA v1.1 — decisões técnicas do planejamento

**Data**: 2026-10-08 · **Status**: decisões resolvidas para plan.
Base: [spec](spec.md), [resumo confirmado](technical-decisions.md), implementação
local inspecionada e revisão preliminar do architect. Não é relatório técnico
original recuperado, implementação ou evidência de testes executados.

## R-001 — frequência no adapter da aplicação

**Decision**: retirar frequência de ConfigurationDraft/inputs e fornecer um no
adapter de useCalculator. Preservar CultivationConfiguration e motor existentes.
**Rationale**: hook atual já faz parsing e compõe input canônico; é a fronteira
correta para política da aplicação. Dose×volume e multiplicação de frequência
continuam no motor. Não alterar FIXED_PER_WEEK nem parser genérico de contagens.
**Alternatives considered**: campo oculto no draft conserva estado desnecessário;
default somente no formulário permite inconsistência; fixar no domínio quebra REG-01/02.
**Evidence**: [hook atual](../../src/features/calculator/hooks/use-calculator.ts),
[contrato genérico](../001-raizora-mvp/contracts/calculation.md). Observação local,
sem documentação externa necessária para a regra de negócio.

## R-002 — estado semanal atômico e compartilhado

**Decision**: manter viewedStageId/viewedWeekNumber no reducer e acrescentar
MOVE_WEEK com direction -1 ou 1; helper puro da feature retorna posição adjacente
ou ausência. Controles usam o mesmo helper para disponibilidade; nenhuma cópia
de semana ativa ou resultado no componente.
**Rationale**: mantém Receita sincronizada, evita transição intermediária em
fronteira e preserva SET_STAGE direto mantendo semana válida. Schedule ordenado
define limites, sem constante universal 8 ou16 no reducer.
**Alternatives considered**: dois dispatches independentes podem expor par errado;
índice global persistido duplica estado; componente com useState perde compartilhamento.
**Docs**: [React useReducer](https://react.dev/reference/react/useReducer),
[estrutura de estado](https://react.dev/learn/choosing-the-state-structure) e
[dados derivados sem Effect](https://react.dev/learn/you-might-not-need-an-effect).
Reducer puro retorna próximo estado; dados derivados não precisam sincronização por Effect.

## R-003 — uma apresentação semanal responsiva

**Decision**: reutilizar NutritionWeekCards para todas larguras, WeekStageFilter
para seleção direta e componente WeekNavigation para anterior/próxima. Remover
NutritionTable do Plano e estilos exclusivos sem uso; manter tabelas de Resumo.
**Rationale**: cards existentes já consomem RuleCalculation/RuleDetails; mudança
de layout não exige matemática ou duas árvores semanais. Corrigir seletor CSS que
hoje esconde .plan-cards em >=64rem, preservando .totals-cards/.totals-table.
**Alternatives considered**: adaptar tabela de oito semanas escondendo colunas
mantém semântica/overflow desnecessários; reescrever os detalhes duplica formato/estados.
**Evidence**: [cards](../../src/features/calculator/components/NutritionWeekCards.tsx),
[Plano](../../src/features/calculator/views/PlanView.tsx) e [CSS](../../src/app/globals.css).

## R-004 — duração e ajuda são apresentação

**Decision**: ScheduleDuration usa stages/weekCount e total dessas contagens;
Configuração perde painel/prop stages. Ajuda de aproximadamente 10% permanece
no texto ligado ao campo por aria-describedby, junto da ajuda decimal e erros.
Manter os exemplos de 10% como texto estático, conforme solicitação de plan;
nunca input/cálculo automático nem nova regra nutricional. Não atribuir exemplos
inéditos ao relatório original ou a uma aprovação anterior.
**Rationale**: mantém origem da cobertura e validações atuais; nenhum dado novo
de capacidade de vaso nem estimativa agronômica entra em configuração/motor.
**Alternatives considered**: hardcode de duração ou sugestão calculada viola FR-002/003.
**Evidence**: [Configuração atual](../../src/features/calculator/views/ConfigurationView.tsx)
e [campos](../../src/features/calculator/components/ConfigurationFields.tsx), com
agrupamento atual por índices que deve mudar ao remover um campo.

## R-005 — impressão pré-renderizada no mesmo documento

**Decision**: PrintPlan dedicado, irmão do wrapper interativo, fora do form,
montado em PLAN/SUCCESS com todas result.weeks e agregados. CSS alterna tela/print;
botão type=button chama window.print em evento no client boundary existente.
**Rationale**: documento pronto antes do clique elimina corrida com setState e
desacopla impressão da semana ativa. SUCCESS/INCOMPLETE é imprimível com avisos.
**Alternatives considered**: imprimir DOM de tela perde 15 semanas; popup/rota/portal
exige transporte de estado; geração PDF externa acrescenta dependência/segundo renderer;
beforeprint/afterprint não são necessários sem mutação de estado.
**Docs**: [MDN window.print](https://developer.mozilla.org/en-US/docs/Web/API/Window/print),
[CSS para impressão](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing),
[Next server/client](https://nextjs.org/docs/app/getting-started/server-and-client-components)
e [APIs de browser](https://nextjs.org/docs/app/guides/static-exports#browser-apis).
Window não é acessado durante render/escopo de módulo. Salvar PDF é destino nativo
quando disponível; não existe API prometida de download ou detecção de sucesso/cancelamento.

## R-006 — A4 com fragmentação validada em browser

**Decision**: A4 retrato, margem12mm; tabela compacta por semana, contexto no thead
repetível e caption; totais em tabela compacta própria. Fluxo normal e sem scroll.
Break-inside avoid apenas em linhas/blocos pequenos; semana inteira pode continuar.
**Rationale**: 186mm úteis precisam estilos próprios, não padding1rem/min-width1900
ou duas versões responsivas do ProductTotals. Colunas e cabeçalhos precisam caber
sem reduzir legibilidade; identificação no thead atende continuações.
**Alternatives considered**: uma semana/página é desnecessário; evitar quebra da
semana inteira pode causar vazios/cortes; tabela de todas semanas em colunas não cabe.
**Docs**: [@page size](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40page/size)
e [break-inside](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/break-inside).
Fragmentação é sujeita a browser e área útil; A4 pode precisar ser escolhido no
diálogo em versões antigas. Não fixar contagem de páginas nem prometer repetição
de header só por CSS: validar cada página real/PDF, incluindo NO_RULE e textos longos.

## R-007 — reutilização de valores/estados sem cálculo no print

**Decision**: compartilhar QuantityValue, AggregateValue, IncompleteNotice,
formatadores e frequencyLabel; extrair DoseValue/RuleStateValue dos trechos atuais
de RuleDetails para reuso. PrintPlan possui composição/colunas, não matemática.
**Rationale**: evita divergência de unidade, <0,01, estados e subtotal. Coluna de
volume por preparo é explícita, pois RuleDetails atual não mostra esse campo.
FrequencyLabel usa effectiveApplicationsPerWeek da entry, EVERY como planejada e
FIXED como prescrita; contexto global usa result.configuration, nunca valor hardcoded no print.
**Alternatives considered**: reutilizar ProductTotals inteiro imprime cards+table
dependentes de breakpoint; somar/recalcular em PrintPlan viola fonte única.

## R-008 — regressões separadas por fronteira

**Decision**: atualizar testes de aplicação que coletam count ou exigem comparação;
manter fixtures genéricas count3 e acrescentar fixtures explícitas da política count1.
Unit/UI cobrem dados/interações; browser/PDF cobre media, fragmentação e overflow.
**Rationale**: mudar todas as fixtures para um esconderia regressão do motor;
mock window.print/jsdom não prova papel, quebra de página ou PDF.
**Alternatives considered**: testes apenas de DOM ou screenshots sem comparar
valores/estados não verificam o contrato completo.

## Fontes, versões e limites da pesquisa

Pesquisa advisory via Context7 resolve→query para React e Next, mais consulta
às fontes primárias MDN, em 2026-10-08. React oficial identifica v19.3. Índice
Context7 de Next expôs versão16.2.9, enquanto lock local fixa16.4.0; orientação
genérica de client boundary foi confirmada nas páginas oficiais atuais, sem
alegar documentação específica de patch16.4 ou atualizar dependências.
Links são referências técnicas, não fonte de prescrição nutricional.

Todos os pontos de decisão foram resolvidos. Testar suporte/fragmentação reais
é gate futuro da implementação, não lacuna funcional para gerar tasks.
