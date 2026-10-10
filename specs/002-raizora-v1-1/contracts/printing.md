# Contrato local — documento completo e impressão nativa

**Data**: 2026-10-08 · FR-008–012/017–020 ·
[Spec](../spec.md), [resultado preservado](../../001-raizora-mvp/contracts/calculation.md).

## Entrada, elegibilidade e acionamento

PrintPlan recebe result:CalculationResult, schedule:FeedingSchedule e brand:Brand,
correspondentes à composição atual do wizard. Não recebe semana ativa, callback
de cálculo, entrada textual ou DTO de quantidades copiado. Montar somente em PLAN
com CalculationResponse SUCCESS. SUCCESS/INCOMPLETE é imprimível; INVALID_INPUT,
INVALID_SCHEDULE e NUMERIC_ERROR não montam o documento nem oferecem impressão de
resultado anterior. Componente não valida/recalcula outro resultado nutricional.

Documento é irmão do wrapper interativo, fora do form. Está pronto no DOM com
display:none em tela; não aparece na árvore acessível/overflow de tela. Não usar
aria-hidden permanente que mantenha o conteúdo impresso inacessível.
Imprimir é botão type=button e handler chama window.print no client boundary
existente. Sem setState, Effect, nova rota, popup, portal, listeners de impressão,
requisição ou biblioteca PDF. Ctrl+P em PLAN/SUCCESS usa o mesmo documento pelo CSS.

Conclusão/cancelamento não despacha ações, muda seleção, reset de filtro ou draft.
Nenhuma detecção de arquivo salvo ou de impressão bem-sucedida é prometida; salvar
como PDF é opção nativa quando oferecida pelo navegador/sistema.

## Conteúdo completo e fonte única

| Bloco | Campos de origem e apresentação |
| --- | --- |
| Cabeçalho | RAIZORA e brand.name como parceiro, schedule.name/id, result.dataVersion, versão do fabricante ou não informada, auditoria/fontes do mesmo schedule |
| Contexto | Stages/weekCount e total16; volumes de result.configuration e frequência planejada da mesma configuração; foliar ausente identificado como não necessário quando aplicável |
| Cada uma das16 semanas | Ordem de result.weeks e estágio/semana; entries de todos os selecionados, sem filtrar pela semana ativa |
| ACTIVE | Nome, dose/L/unidade, via, frequência efetiva/modo, preparationVolumeLiters, amountPerApplication e weeklyAmount |
| NOT_APPLICABLE | Nome e motivo textual STAGE_NOT_APPLICABLE ou WEEK_NOT_USED; sem dose/volume/quantidade/frequência artificiais |
| NO_RULE | Nome e regra não confirmada; aviso de incompletude sem valores inventados |
| Totais | productTotals.byStage/cycle existentes e unidade por produto; estado/avisos e subtotal conhecido identificado quando existente |

Somente selecionados; desmarcados não reaparecem como zero. Fonte nutritiva,
precisão e valores não mudam. Usar QuantityValue/AggregateValue, formatters e
frequencyLabel; compartilhar DoseValue/RuleStateValue com RuleDetails. Não
somar weeklyAmount, formatados ou quantidades de vias diferentes na impressão.
Em INCOMPLETE, informar globalmente e por escopo afetado: não existe definitivo;
conhecido parcial só como subtotal. NÃO tratar esse estado como ausência confirmada.

## Layout A4 e paginação

- @page size A4 portrait; margem inicial12mm. Área útil de largura186mm; limites
  de layout, paddings e larguras se ajustam à página, sem largura mínima de desktop.
- @media print atua no shell com PrintPlan válido: oculta wrapper de tela por
  display:none e exibe somente documento. Reset de max-width/margin/padding do
  app-shell e estilos próprios para th/td, cores, textos e grades. Não usar body
  inteiro com visibility:hidden, que preserva caixas vazias.
- Uma tabela por semana com6 colunas: produto/estado; dose/L; via/frequência;
  volume/preparo; quantidade/preparo; consumo semanal. N/A/NO_RULE usam motivo
  textual abrangendo células sem quantidade. Textos quebram sem cortar unidades.
- Caption identifica a tabela; uma primeira linha abrangente do thead também
  identifica estágio/semana, seguida pelos rótulos de colunas. Repetir thead nas
  continuações; verificar resultado real, pois caption sozinho não repete.
- Fluxo normal e largura100% com table-layout fixed; sem .table-scroll,
  .nutrition-table ou overflow ocultando conteúdo. Tabela de totais própria usa
  AggregateValue e não instancia ProductTotals com duas versões por breakpoint.
- Evitar quebra no cabeçalho e em linhas pequenas; não aplicar avoid a uma
  semana/tabela inteira que possa exceder página. Não usar posição fixa para
  cabeçalhos/rodapés, nem exigir número de páginas ou uma semana por folha.
- Texto de estado e identificadores devem funcionar em preto e branco e com
  fundos desativados. Cabeçalhos/rodapés, escala, destino e margens de impressão
  dependem do diálogo; escolher A4 manualmente se o browser não aplicar @page.

## Evidência requerida na implementação

Teste DOM: exatamente16 blocos, valores V11-CICLO, selecionados, fontes, vias,
todos estados e totais canônicos; mock window.print chamado uma vez sem submit.
Não confundir conteúdo presente no DOM oculto com evidência de impressão correta.

Browser/PDF: previewA4 de semana ativa inicial/diferente, completo/incompleto,
nomes/fontes longos e decimais/subcentésimos; conferir todas páginas, ordem,
legibilidade, cabeçalhos de continuação, ausência de corte/duplicação/controles,
equivalência de quantidades e sessão preservada ao cancelar/concluir. Se um
browser não repetir cabeçalho adequadamente, corrigir composição/fragmentação
antes do aceite; não dispensar FR-011 com base na limitação de CSS.
