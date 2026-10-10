# Contrato do wizard — interação local

Data: 2026-10-03. Complementa [plan](../plan.md) e [modelo](../data-model.md).
Não é API remota e não promete serialização/restauração de cultivo.

## Rotas, estado e controles

`/`: landing de RAIZORA, parceiro identificado, CTA Link para `/calculadora`.
`/calculadora`: cinco etapas internas, iniciando em CONFIGURATION; etapa atual
em useReducer local. Produtos inicializados uma única vez a partir do catálogo.
Inputs começam vazios. Filtro inicia no primeiro estágio e semana 1.
Voltar/Avançar são botões internos; sair para landing usa Link. O progresso exibe
a posição dentro do fluxo completo de seis telas, com CONFIGURATION como 2/6.
Sem atalhos de progresso para pular validação e sem etapa na URL.

| Origem → destino | Gate | Comportamento |
| --- | --- | --- |
| Landing → Configuração | Nenhum login | Abrir wizard vazio com seleção default |
| Configuração → Produtos | fert volume e contagem válidos | Foliar pode ficar pendente para seleção |
| Produtos → Plano | seleção não vazia e configuração completa conforme seleção | Bloquear/focar erro; foliar faltante oferece voltar ao campo |
| Plano → Receita → Resumo | CalculationResponse SUCCESS | Consumir mesmo resultado derivado |
| Retorno interno | Nenhuma perda de draft/seleção | Preservar filtro; edição revalida resultado |
| Refresh / nova montagem | Estado transitório descartado | Reiniciar Configuração; não restaurar cultivo |

Sem ACTIVE FOLIAR selecionado, omitir volume foliar no input canônico e preservar
seu draft só na sessão. Com foliar reativado, validar novamente antes de Plano.
Produto não selecionado nunca aparece com consumo zero nos resultados.
Back do navegador segue `/` ↔ `/calculadora`, sem histórico de cada etapa.
Compartilhar URL abre wizard novo sem configuração, conforme escopo sem persistência.

## Inputs e erros

Labels associados aos três inputs, ajuda sobre litros/preparo/semana e decimal sem
milhar. Parser único aceita vírgula/ponto conforme [research R-006](../research.md).
Erros são textuais próximos ao campo, aria-invalid/aria-describedby, e erro de
seleção associado ao fieldset. Não depender somente de botão desabilitado sem
explicação: submissão revela o erro e foca primeiro campo inválido. Erro foliar
cross-step leva ao input correspondente preservando seleção e valores.

Atualizar campo/seleção não deixa resultado antigo utilizável. Se response vira
inválida, resultados não são apresentados até corrigir. Engine não aceita strings;
adapter parseia, chama validação compartilhada e mapeia códigos para mensagens.
NUMERIC_ERROR informa valor fora da capacidade numérica e pede revisar entrada;
INVALID_SCHEDULE informa indisponibilidade do plano, sem inventar regra.

## Resultados e filtros

Plano e Receita compartilham estágio/semana; trocar estágio limita semana a
1..weekCount, reiniciando em 1 se inválida no destino. Selects com labels e opções
do schedule. Plano separa Dose oficial/L, Quantidade/preparo e Consumo semanal;
frequência FIXED diz prescrita, EVERY_FERTIGATION diz contagem configurada.

Plano desktop inclui comparação das semanas do estágio em tabela, com cada célula
identificando dose/L e consumo semanal; semana escolhida tem destaque com texto,
não só cor. Mobile usa cards da semana escolhida. Dois modos consomem as mesmas
entries. NOT_APPLICABLE pode aparecer como “—” com texto de motivo acessível;
NO_RULE aparece como “Regra não confirmada”, nunca “—” ambíguo.

Receita apresenta grupos por via: mobile sequenciais, desktop lado a lado.
Cada grupo identifica volume do preparo e somente entries ACTIVE da via; quantidade
é amountPerApplication. Frequência é informativa por linha; não prometer que regras
futuras terão a mesma frequência ou que produtos possam ser misturados. Grupo sem
ACTIVE e sem NO_RULE informa ausência de aplicação; com NO_RULE na semana, indicar
receita incompleta e não afirmar ausência confirmada para informação desconhecida.

Resumo mostra cada produto selecionado, byStage e ciclo com unidade. N/A ao estágio
tem texto acessível sem número. INCOMPLETE tem aviso textual e nenhum total definitivo
no escopo afetado; conhecido parcial, se mostrado, tem rótulo explícito de subtotal.
Plano atual não apresenta estado incompleto; cenário sintético testa o contrato.

## Acessibilidade e conteúdo

Foco no heading da nova etapa; submit inválido foca erro; ordem de tab segue DOM;
progresso com aria-current=step. Checkbox nativo, fieldset/legend, buttons com type,
labels reais; selects sem tabs complexas. Tabelas com caption, th scope e região
de overflow local com identificação e acesso por teclado. Não depender de hover.
Contraste verificado, foco visível, sem significado exclusivamente por cor.

RAIZORA é marca principal; “Plano nutricional por Plantas que Curam” identifica
o provider. Metadata usa a versão local auditada e distingue decisões do responsável.
Placeholders facilmente substituíveis, sem claims comerciais/agronômicos novos.
OQ-013 não bloqueia fluxo/cálculo. Sem formulário pessoal, storage, analytics invasivo
ou secrets. A aplicação não precisa fazer nenhuma requisição para calcular.
