# Contrato local — semana única e navegação

**Data**: 2026-10-08 · FR-003–007/020 ·
[Modelo delta](../data-model.md), [wizard histórico](../../001-raizora-mvp/contracts/wizard.md).

## Estado e seleção direta

viewedStageId/viewedWeekNumber do reducer continuam a seleção única para Plano
e Receita. Inicial: primeiro estágio/semana1. Todos controles são controlados
por esses campos; não usar useState paralelo na tela nem persistência/URL.
WeekStageFilter mantém selects nativos com labels Estágio/Semana e opções do
schedule. SET_STAGE preserva semana válida, senão1; SET_WEEK valida o limite.

## Movimento sequencial atômico

MOVE_WEEK recebe direction -1 ou1; usa getAdjacentWeek da feature, o mesmo
helper que calcula indisponibilidade de botões. A ação devolve o estado com
os dois campos atualizados de uma vez, sem dispatch encadeado por fase/semana.

| Origem/ação | Destino |
| --- | --- |
| Vegetativo1 + Anterior | Sem mudança; indisponível |
| Vegetativo1 + Próxima | Vegetativo2 |
| Vegetativo8 + Próxima | Floração1 |
| Floração1 + Anterior | Vegetativo8 |
| Floração8 + Próxima | Sem mudança; indisponível |
| Vegetativo8 + seleção direta de Floração | Floração8, semana ainda válida |
| Posição/estágio desconhecido | No-op, sem semana inventada |

Helper usa ordem/contagens dos estágios, não condicionais por marca ou nomes.
Fixtures sintéticas com contagens diferentes conferem ausência de hardcode;
não são novo schedule entregue nem extensão de domínio.

## Renderização, foco e eventos

PlanView renderiza só selectWeek/WeekCalculation ativa em NutritionWeekCards,
com todos os produtos selecionados e estados. Remover NutritionTable do Plano;
não manter tabela escondida como alternativa desktop. Cards podem usar grid
responsivo de produtos da mesma semana, com minmax(0,1fr), nomes/unidades legíveis.
Retirar CSS que esconde .plan-cards em desktop sem mudar tabelas de Resumo.

WeekNavigation possui botões nativos type=button, nomes Anterior/Próxima,
disabled nos extremos e contexto textual estágio/semana atual. Como o wizard
envolve Plano em form, essas ações não disparam SUBMIT/NEXT nem avançam à Receita.
Uso de teclado mantém foco no controle; disponibilizar um status textual curto
da posição ativa (aria-live polite) sem anunciar todo o resultado a cada mudança.
Ao atingir limite, foco visível deve permanecer previsível; verificar browser
e não trocar foco para heading da etapa inteira a cada semana.

ScheduleDuration informa stages/weekCount e total do schedule; não é input nem
depende de produto/semana. Navegar não altera draft, seleção, quantidades ou totais.
Avançar a Receita, mudar seu filtro e retornar preserva o mesmo par de seleção.

## Aceite

Todas16 semanas alcançáveis por anterior/próxima e seletores nas larguras
360/768/1280 e intervalos, sem overflow da página, comparação simultânea ou
duplicação na árvore acessível. Verificar ida/volta na fronteira e ausência de
submit. Receita e Resumo continuam consumindo mesmo resultado, com dose/preparo/
consumo distintos. Impressão ignora posição ativa conforme [contrato](printing.md).
