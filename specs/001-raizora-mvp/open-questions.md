# RAIZORA MVP — Open Questions e decisões

Atualização: 2026-10-02, segunda rodada de `$speckit-clarify`, decisões explícitas SRC-007.
Responsável: usuário/responsável do projeto. SOURCE: PRODUCT DECISION para todas as
políticas novas desta rodada; fontes oficiais mantêm autoridade sobre doses/vias.
[Spec](spec.md) e [Decision Log](review.md).

**Resultado: READY FOR PLAN.** Não existem BLOCKERs funcionais/matemáticos restantes.
Todas as OQ-001–OQ-012 estão RESOLVED; OQ-013 permanece OPTIONAL/DEFERRED.
Não foram executados plan/tasks/implementação. Prioridades originais são histórico
de impacto, não indicação de perguntas ainda abertas.

## Quadro de status

| OQ | Prioridade original | Status vigente | Decisão e requisito |
| --- | --- | --- | --- |
| OQ-001 | BLOCKER | RESOLVED | Auditoria anterior preservada; fonte e cobertura confirmadas; FR-007/008/012/016 |
| OQ-002 | BLOCKER | RESOLVED | Remover tipo de cultivo e qualquer fator de dose; FR-005/015 |
| OQ-003 | BLOCKER | RESOLVED | Schedule atual fixo vegetativo 8 + floração 8; não universal; FR-005/017 |
| OQ-004 | BLOCKER | RESOLVED | Joker em cada fertirrigação, somente nas semanas com dose; FR-010/011 |
| OQ-005 | BLOCKER | RESOLVED | Vias da tabela auditadas por legenda; FR-009/012 |
| OQ-006 | BLOCKER | RESOLVED | Todas as regas corresponde à fertirrigação configurada; FR-011/013 |
| OQ-007 | BLOCKER | RESOLVED | Remover input foliar; frequência somente prescrita pela regra; FR-004/005/010 |
| OQ-008 | BLOCKER | RESOLVED | Contagem fertirrigação global no cultivo; dois modos por regra/semana; FR-004/010/011 |
| OQ-009 | IMPORTANT | RESOLVED | Volumes decimais >0; contagem inteira >=1; foliar condicional; FR-006 |
| OQ-010 | IMPORTANT | RESOLVED | Precisão interna, apresentação até 2 casas pt-BR, sem zeros finais; FR-013/018 |
| OQ-011 | IMPORTANT | RESOLVED | Cinco pré-selecionados, pode remover, vazio bloqueia; FR-007 |
| OQ-012 | IMPORTANT + cobertura BLOCKER | RESOLVED | Estados/aplicabilidade/completude confirmados; FR-013/014 |
| OQ-013 | OPTIONAL | DEFERRED | Copy/imagens finais podem ser provisórias; UX-007, sem alterar matemática |

## Resoluções

### OQ-001 — Auditoria das fontes
**Status: RESOLVED.** Fonte: SRC-001/002/003, lidas diretamente na rodada anterior.
Doses, unidades, vias, frequência foliar, nomes e diferenças de cobertura já foram
conferidos. Auditoria não foi repetida nesta rodada; hashes dos originais preservados.
As lacunas de classificação antes transferidas para OQ-012b foram encerradas pelo
responsável em SRC-007; auditoria e confirmação de aplicabilidade são fontes distintas.

PDF mantém apenas nomes/contexto: Joker/Joker All-in-One, Coringa Blend, Plant Protein,
Terpeno Plus, Tricomax e existência de Speed Vega. Este último não pertence ao schedule.
Impacto: matrizes, FR-007/008/012/016 e UX-007.

### OQ-002 — Tipo de cultivo e redução orgânica
**Status: RESOLVED. SOURCE: PRODUCT DECISION, SRC-007 seção 1.**
Remover o campo tipo de solo/cultivo e o efeito “Orgânico −60%”. Nenhuma dose é
alterada por inerte/orgânico nem por multiplicador automático; usar exatamente
as doses oficiais. Fator não validado não entra no MVP.

Isso não declara equivalência técnica entre substratos. A feature simplesmente
não possui dados oficiais suficientes para aplicar diferenças. Eventual retorno
do campo requer regra confirmada e especificação futura. FR-005/015; história 2.

### OQ-003 — Duração do ciclo
**Status: RESOLVED. SOURCE: PRODUCT DECISION, SRC-007 seção 2 + cobertura SRC-001.**
O MVP usa o FeedingSchedule atual: oito semanas vegetativas + oito de floração,
total dezesseis. Informar duração, sem input livre. Não permitir menos/mais semanas,
omissão de estágio, repetição, interpolação, compactação ou extrapolação.

Oito não é constante universal de RAIZORA: duração pertence ao Stage do schedule.
Cronogramas futuros podem ter outras durações/estágios. SRC-006, duração variável
pendente, está **SUPERSEDED** por esta decisão explícita mais recente.
FR-005/008/013/017; Stage/Week e histórias 2/4/6.

### OQ-004 — Frequência e alcance do Joker
**Status: RESOLVED.** Dose/via SRC-001; frequência SRC-006 preservada e SRC-007 seção 9.
Joker acompanha cada fertirrigação nas semanas com dose: vegetativo S1–S8,
floração S1–S5. S6–S8 de floração continuam sem uso conforme SRC-004.

Representar EVERY_FERTIGATION, usar contagem global configurada por semana,
sem atribuir esse texto de frequência ao JPEG. FR-010/011/013.

### OQ-005 — Vias
**Status: RESOLVED.** SRC-001, legenda lilás/verde, preservada.
Joker nos dois estágios e Plant Protein/Tricomax na floração: SOIL/FERTIGATION.
Coringa/Plant Protein/Terpeno no vegetativo: FOLIAR. Volume por preparo da via
correspondente; via pertence à regra, não ao Product. FR-009/012.

### OQ-006 — Todas as regas
**Status: RESOLVED.** Expressão SRC-001; vínculo SRC-006 preservado/SRC-007 seção 9.
Para Plant Protein floração S1–S8 e Tricomax S5–S8, usar eventos de fertirrigação
configurados: dose × volume fertirrigação por preparo × contagem global semanal.
Nenhum número fixo ou inclusão automática de regas comuns. FR-011/013.

### OQ-007 — Frequência foliar
**Status: RESOLVED. SOURCE: PRODUCT DECISION, SRC-007 seção 3; prescrição SRC-001.**
Remover o input aplicações foliares/semana; manter somente volume foliar por preparo.
A UI informa 1/2/3 prescritos na regra daquela semana, sem permitir substituição.
A decisão SRC-006 de manter input validado está **SUPERSEDED**, não permanece como
alternativa vigente. FR-004/005/010; histórias 2/4/5.

### OQ-008 — Granularidade e modos
**Status: RESOLVED. SOURCE: PRODUCT DECISION, SRC-007 seção 3.**
fertigationApplicationsPerWeek é um único inteiro global para o ciclo atual,
usado nas semanas dos dois estágios. Frequência prescrita permanece em NutrientRule
por estágio/semana, nunca uma propriedade única de Product.

Modos iniciais: FIXED_PER_WEEK, multiplicador prescribedApplicationsPerWeek;
EVERY_FERTIGATION, multiplicador fertigationApplicationsPerWeek da configuração.
Sem generalizar além desses modos no MVP; evoluções futuras são explícitas e neutras.
FR-004/010/011; NutrientRule e CultivationConfiguration.

### OQ-009 — Validação de entradas
**Status: RESOLVED. SOURCE: PRODUCT DECISION/UX, SRC-007 seção 6.**
Volume fertirrigação: obrigatório, finito decimal >0, em L.
Contagem fertirrigação: obrigatória, inteiro >=1 por semana.
Volume foliar: finito decimal >0 em L, obrigatório quando produto foliar estiver
selecionado; revalidar seleção. Sem foliares, sua ausência não impede cálculo.

Nenhum máximo agronômico definido/inventado. Parser decimal, proteção contra valores
extremos e mecanismo/precisão de entrada são decisões técnicas de plan, sem abrir
uma regra nutricional nova ou uma OQ de produto. FR-006; histórias 2/3.

### OQ-010 — Precisão e arredondamento
**Status: RESOLVED. SOURCE: PRODUCT DECISION, SRC-007 seção 7.**
Preservar precisão interna e não arredondar intermediários. Somar o ciclo pelos
valores internos. Arredondar somente apresentação: até duas casas, pt-BR, sem zeros
finais. Exemplos 20 g /10,5 ml /10,25 ml /0,75 g.

Mecanismo determinístico, empates e apresentação de subcentésimos ficam para plan
como detalhe técnico sob essas restrições, sem inventar precisão agronômica.
Não converter semântica de NOT_APPLICABLE/NO_RULE em zero por formatação.
FR-013/018, SC-006; não há blocker matemático de produto restante.

### OQ-011 — Seleção inicial/vazia
**Status: RESOLVED. SOURCE: PRODUCT DECISION, SRC-007 seção 8.**
Joker, Coringa Blend, Plant Protein, Terpeno Plus e Tricomax começam marcados na
primeira abertura. O usuário pode remover; navegação de retorno mantém seleção atual.
Se todos desmarcados, não avançar ao cálculo e mostrar pedido claro de pelo menos um.

Seleção é global ao ciclo; um produto pode estar NOT_APPLICABLE em certo estágio
sem ser removido globalmente. FR-007; história 3.

### OQ-012 — Estados, cobertura e resumo
**Status: RESOLVED**, incluindo:

- **OQ-012a RESOLVED**: distinguir não utilizado, NOT_APPLICABLE, NO_RULE, não
  confirmado, não selecionado e zero numérico. “—” pode representar não utilizado
  ou NOT_APPLICABLE, com descrição acessível que preserve significado.
- **OQ-012b RESOLVED — SOURCE: PRODUCT DECISION, SRC-007 seção 4**: Tricomax vegetativo,
  Coringa Blend e Terpeno Plus floração são NOT_APPLICABLE no schedule atual.
  Sem dose zero, evento, receita/consumo semanal ou total de estágio para essas
  combinações. A confirmação vem do responsável, não da ausência gráfica sozinha.
  Speed Vega está fora do schedule, não calculável.
- **OQ-012c RESOLVED — SOURCE: PRODUCT DECISION, SRC-007 seção 5**: schedule atual
  completo para os cinco produtos, resumo normal sobre regras confirmadas/aplicáveis.
  Ausências confirmadas não causam incompletude. NO_RULE esperado e não confirmado
  em outro schedule marca plano incompleto e impede total definitivo; eventual
  feature futura não bloqueia este MVP nem autoriza inventar valores.

Fonte: SRC-004/005 preservadas e SRC-007. Impacto FR-013/014, histórias 4/5/6 e
CalculationResult. Nenhuma lacuna atual de cobertura permanece BLOCKER.

### OQ-013 — Conteúdo final
**Status: DEFERRED/OPTIONAL.** Fonte: SRC-005 preservada/SRC-007 condição de saída.
Textos, descrições e imagens finais podem permanecer provisórios e não bloqueiam
cálculo. Retomar na revisão de conteúdo/UI antes de publicação.
Não publicar formulações, preços, registros ou claims do PDF como fatos atuais
sem validação específica; não adicionar funcionalidades comerciais. FR-002, UX-007.

## Continuidade e rastreabilidade

Sem perguntas novas ou decisões inventadas. SRC-007 é a confirmação explícita
mais recente e substitui somente políticas identificadas no histórico do review;
OQ-004/005/006 não foram reabertas. As novas decisões foram aplicadas aos requisitos,
categorias de domínio, cenários de aceite, fórmulas e exemplos da spec.

**READY FOR PLAN.** Próxima etapa recomendada: `$speckit-plan`, em rodada posterior.
Não criar plan.md, tasks.md ou código nesta sessão. OQ-013 não é blocker de plan.
