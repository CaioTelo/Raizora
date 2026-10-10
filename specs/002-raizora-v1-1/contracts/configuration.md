# Contrato local — configuração e política de frequência

**Data**: 2026-10-08 · FR-001–003/013–019 · Complementa
[cálculo MVP](../../001-raizora-mvp/contracts/calculation.md), sem API remota.

## Campos e acessibilidade

Somente volume de fertirrigação e volume foliar, strings de draft em L/preparo.
Manter labels/IDs/unidades, inputMode decimal, ajuda sobre separador decimal,
aria-describedby com ajuda e erro, aria-invalid e foco no primeiro erro.
Ajuda do volume de fertirrigação inclui aproximadamente10% da capacidade do
vaso como referência opcional. Manter os exemplos de 10% como texto estático;
não há capacidade
numérica, preenchimento, cálculo, limite de validação ou ajuste de dose.

Remover input/label/ajuda/erro de frequência, prop stages e painel de duração da
Configuração. ConfigurationFields deve agrupar os dois campos explicitamente
por via; não conservar slice(0,2)/fields[2] do array antigo de três campos.

## Adaptação canônica

O adapter usa parser vigente nos volumes e sempre fornece
`fertigationApplicationsPerWeek = 1` ao motor da aplicação v1.1. A constante
pertence à feature; não ao FeedingSchedule, NutrientRule, Product ou motor.
O motor mantém campo obrigatório, validação de inteiro seguro>=1 e fórmulas.
Não obter frequência por string oculta ou deixar override em UPDATE_CONFIGURATION.

Sem ACTIVE/FOLIAR selecionado em qualquer semana, omitir foliarVolumeLiters
canônico, preservando draft local. Quando reativado, validar antes do Plano.
Não limitar essa checagem à semana ativa, pois consumo é de todo o ciclo.

## Gates e resultados

| Gate/ação | Resultado requerido |
| --- | --- |
| Configuração→Produtos | Volume de fertirrigação válido; foliar pode ficar pendente; nenhuma coleta/erro de count |
| Produtos→Plano | Seleção não vazia, configuração requerida válida e response SUCCESS |
| Alterar volume/seleção | Revalidar/derivar resultado atual; falha não expõe plano anterior |
| Voltar/remontar | Preservar sessão ao voltar; remontagem reinicia como no MVP |
| Navegar/imprimir | Não alterar input matemático, seleção ou resultado |

Plano, Receita, Resumo e impressão identificam frequência planejada a partir
da configuração do resultado. FrequencyLabel por ACTIVE mantém count efetivo,
EVERY_FERTIGATION como planejado e FIXED_PER_WEEK como prescrito.
Não atribuir frequência um à tabela oficial nem contar regas comuns.

## Aceite de compatibilidade

10 L e Joker vegetativo1: dose1g/L, preparo10g e semanal10g na aplicação.
Coringa vegetativo3 com2L: preparo10ml, frequência prescrita2 e semanal20ml.
Contrato genérico chamado com três mantém Joker10g/preparo e30g/semana; C-005
histórico continua780g/160ml/1596ml/32ml/300g. Validar V11-CICLO da spec com um.
Parser/validador genéricos de contagem e suas regressões não são removidos.
