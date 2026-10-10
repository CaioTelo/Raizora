# Implementação v1.1 — revisão integrada final

Escopo atual autorizado: exclusivamente T052–T062. Blocos1–3 são checkpoints históricos preservados nas seções seguintes. **READY FOR RELEASE — 62/62 tarefas concluídas**, após gates finais e revisão independente PASS. Sem commit, deploy, publicação ou nova versão.

As evidências novas e a rastreabilidade atual constam em “Bloco 4” ao fim deste documento. Status de checkpoints anteriores não descrevem a continuidade atual.

## Correções documentais

- A-001 resolvida no plan e T022/T023: validation-messages.ts, NUMERIC_ERROR apenas volumes e integração extrema com mensagem/foco/invalidação.
- A-002 resolvida na convenção e T009/T025/T027/T039: testes antecipados permitidos, import não resolvido não é RED válido; stubs mínimos antes da execução quando necessários, GREEN obrigatório. Somente stub de T009 autorizado neste bloco.
- Auditoria: 62 IDs, dependências e 15 marcadores [P] preservados; nenhum achado impeditivo conhecido. Architect prévio: sem impedimento; testar foco e mensagem real do overflow e preservar mapper genérico.

## Setup

T001: baseline SHA-256 de 111 arquivos em evidence/baseline.json, incluindo produção/testes/domínio/dados/fontes/lockfile/docs históricos. Repositório já apresenta arquivos não rastreados; não os remover nem atribuir a esta rodada.
T002: ambiente e scripts registrados em evidence/environment.md. Checklist requirements.md 25/25 PASS; hooks before/after_implement ausentes.

## Checkpoints parciais

- T003–T004: fixture applicationResultFor count1 com volumes/subset/incompleto; resultFor histórico count3 intacto. Referências unit 14/14 GREEN (V11-01–06/CICLO + genéricos).
- T005 RED: 1 assertion da descrição opcional falhou pelo texto ausente, 11 testes existentes passaram. T006/T007 GREEN: configuração 12/12; orientação não oficial, manual, decimal, exemplos/ajuda/erro vinculados e sem limite de vaso. Logs RED em evidence/us1-red.log.

- T008/T009 RED: 4 falhas comportamentais (configuração ainda tinha duração, Plano/stub não a exibiam), 17 existentes GREEN; imports resolvidos pelo stub tipado. T010–T012 GREEN: 21/21 nas três suites; prop/callsite stages removidos da Configuração; 8+8=16 invariável sob filtros/subset e 3+5=8 sintético. React Context7 (/reactjs/react.dev): derivar dados de props na renderização, sem estado/Effect.

- T013–T018 RED: 22 falhas comportamentais e 45 passes, sem falha de import; ausência do campo, gate sem contagem, rótulo planejado e contexto canônico exigidos antes da implementação. T019–T022 GREEN: 67/67 em sete suites. Draft só dois volumes, grupos por via explícitos, constante 1 somente adapter, foliar/seleção/validação e contrato genérico preservados; rótulos EVERY planejado/FIXED prescrito e NUMERIC_ERROR corrigidos.

## T023/T024 e validação final

- T023: Produtos/Wizard 12/12 GREEN; fluxo de seis etapas, edição/retorno, seleção vazia, ausência/reativação foliar, foco e resultados atuais count1. Volume 10^307 causa overflow real, pede revisão dos volumes e mantém foco no erro, sem resultados anteriores.
- T024: npm test **309/309, 22 suites** (unit, componentes e integração); lint **PASS**, typecheck **PASS**, build **PASS**. Logs em evidence/tests.log, lint.log, typecheck.log e build.log.
- Build inicial falhou no sandbox ao capturar tsc --showConfig: subprocesso Node retorna EPERM e stdout vazio. Saída direta tsc válida; build fora do sandbox autorizado pela revisão automática passou com config/dependências originais (Next16.4.0, webpack, tipos e rotas estáticas). Não houve ajuste de infraestrutura no repo.
- Busca de usos: draft/UI sem count/input oculto, sem parse count no adapter; frequência 1 só no adapter de produção. Parser count/validador/mapper genéricos e fixtures count3 preservados.
- Auditoria SHA-256 final: 39 arquivos protegidos intactos (domínio, dados, MVP histórico, constituição, fontes, package/lock), sem arquivo novo nesses escopos. IDs/dependências/[P] preservados; exatamente T001–T024 marcadas, T025–T062 pendentes. Hooks before/after_implement não registrados; nenhum hook executado.
- Architect revisou código/tests/docs e hashes: sem achado impeditivo no Bloco 1; solicitou atualizar cabeçalho/checks, agora registrados. Esta revisão de incremento não executa T060.

## Comparação matemática — ciclo completo 10 L / 2 L

| Produto | Histórico count3: veg / flora / ciclo | Aplicação count1: veg / flora / ciclo |
| --- | --- | --- |
| Joker | 420 g / 360 g / 780 g | 140 g / 120 g / 260 g |
| Coringa Blend | 160 ml / N/A / 160 ml | 160 ml / N/A / 160 ml |
| Plant Protein | 96 ml / 1.500 ml / 1.596 ml | 96 ml / 500 ml / 596 ml |
| Terpeno Plus | 32 ml / N/A / 32 ml | 32 ml / N/A / 32 ml |
| Tricomax | N/A / 300 g / 300 g | N/A / 100 g / 100 g |

Verificado por V11-01–06/V11-CICLO e C-001/C-005 executáveis. Frequência foliar prescrita 1/2/3 e suas 16 aplicações permanecem; somente consumo de fertirrigação muda com a entrada. Joker S1 mantém dose 1 g/L e preparo 10 g; semanal 30→10 g. Coringa S3 mantém 10 ml/preparo e 20 ml/semana; Terpeno S7 2 ml/preparo e 6 ml/semana; Plant Protein F5 80 ml/preparo e 240→80 ml/semana. Dose, volume/preparo e estados não mudam.

## Status e limites

**BLOCO 1 COMPLETE**: 24/62 tarefas; 38 restantes. Sem problemas impeditivos conhecidos. R1/R2/R5 validados no escopo do bloco. Navegação semanal e impressão/QA visual seguem pendentes nos próximos blocos; não há alegação de v1.1 inteira ou browser/PDF validado. Comparação desktop do MVP permanece conforme sequência de tasks. Sem commits. Pronto para T025+, aguardando autorização explícita. Inventário completo em evidence/changed-files.json.


## Bloco 2 — T025–T037 (2026-10-10)

**BLOCO 2 COMPLETE**: 37/62 tarefas concluídas; 25 restantes (T038–T062). Escopo exclusivo de consulta semanal; nenhuma impressão, commit ou publicação. Bloco 3 aguarda autorização explícita. Esta revisão do incremento não executa T054/T060 nem outras tarefas posteriores.

### Implementação e aceite

- T025–T028: RED comportamental com módulos tipados mínimos resolvidos, sem erro de import. **48 falhas / 29 passes**: movimento ausente, controles ausentes e tabela ainda presente. Evidência [red.log](evidence/block2/red.log). GREEN posterior **77/77** nas quatro suites, [green.log](evidence/block2/green.log).
- T029/T030: `getAdjacentWeek` usa ordem/contagens fornecidas, sem nomes de fases/fabricante ou constantes 8/16; MOVE_WEEK único altera os dois campos do reducer. Extremos/posição inválida devolvem o mesmo estado; draft e produtos mantêm referências. Testes cobrem 16 posições nos dois sentidos e três estágios sintéticos 2+1+3.
- T031: botões nativos Anterior/Próxima type=button e disabled pelo mesmo helper; contexto textual curto role=status/aria-live=polite/aria-atomic. Foco permanece no botão durante navegação comum; ao alcançar extremo, passa ao controle adjacente habilitado antes do commit. Não há estado visual paralelo ou foco no heading da etapa por semana.
- T032/T033: PlanView usa selectWeek e NutritionWeekCards existentes em todas as larguras, com selects nativos controlados. Dados/estados ACTIVE, STAGE_NOT_APPLICABLE, WEEK_NOT_USED e NO_RULE mantidos, sem novas quantidades/fórmulas. Receita mantém tipo/callbacks originais; somente Plano recebe onMoveWeek.
- T034/T035: cards visíveis em desktop, grid 1/2/3 colunas com minmax(0,1fr), valores podem quebrar linha; comparação removida após busca de zero consumidores. NutritionTable e estilos exclusivos removidos; estilos genéricos de tabela, .table-scroll e breakpoints de totais preservados. selectStageWeeks preservado porque seus testes genéricos continuam consumidores.
- T036/T037: percurso completo ida/volta, fronteiras em uma ação, Floração 5 direta, SET_STAGE preservando semana 8, Receita alterando seleção compartilhada e retorno por Resumo; volumes/produtos/totais preservados. Spy real no motor confirma zero novas chamadas por navegação/filtros, com response e entradas referencialmente iguais. **372/372 testes, 24 suites**, incluindo regressões matemáticas do Bloco 1 e históricas count3.

### Gates e navegador real

- Testes, lint, typecheck e build **PASS**. Logs e comandos em [checks.md](evidence/block2/checks.md); build fora do sandbox pelo EPERM conhecido do Bloco 1, sem ajuste de projeto/dependências.
- Chromium **156.0.8078.4**, headless sobre build de produção local: **PASS** em **360/640/768/1024/1280 px** e reflow equivalente a 200% (1280→640 e 640→320 CSS px, deviceScaleFactor 2). Todas as 16 posições nos dois sentidos em cada cenário, seletores de teclado/diretos, fronteiras, limites, ausência de submit, aria-live e type=button conferidos. Nenhum erro de console/página, overflow horizontal ou controle/valor recortado detectado. [browser-smoke.json](evidence/block2/browser-smoke.json), [harness](evidence/block2/browser-check.mjs) e sete capturas em evidence/block2; inspeção visual adicional de 360 e 1024 px.
- Enter/Espaço nas duas bordas passam foco ao botão habilitado, com outline solid 3px; Tab/Shift+Tab seguem ordem previsível. Receita/Resumo conferidos em cada cenário: dose/preparo e totais atuais, cards de Resumo até 768/reflow, tabela de Resumo desde 1024, sem alterar seus componentes.
- Harness inicial abriu o menu nativo do select com Enter antes de Shift+Tab, consumindo a tecla no popup; corrigido no harness usando Escape antes de testar a ordem de foco. Sem correção de aplicação decorrente. Primeira tentativa registrada separadamente em browser-harness-first.log; o smoke final completo passou.
- Limitações: somente Chromium disponível/exercitado; Firefox/WebKit/Safari e leitor de tela não verificados. Reflow é equivalente a zoom 200%, sem alegação de zoom pela interface do navegador. Impressão/PDF e conteúdo adverso de impressão não pertencem ao bloco e não foram implementados/validados. Browser real é evidência deste incremento, sem marcar T054 antecipadamente.

### Integridade e fronteiras

[baseline.json](evidence/block2/baseline.json) registra o estado anterior a este bloco; [integrity.json](evidence/block2/integrity.json) e [changed-files.json](evidence/block2/changed-files.json) conferem alterações e escopos protegidos. Domínio/engine/contrato genérico, dados/matriz/fontes, frequências foliares, constituição, dependências/lockfile e documentos históricos preservados por SHA-256. Fixtures matemáticas e suites de cálculo do Bloco 1 intactas. Reconstrução de tasks.md revertendo exclusivamente status/cabeçalhos de continuidade produz SHA-256 idêntico à baseline; IDs, critérios, dependências e marcadores preservados. O ciclo continua 8+8=16, com oráculos count1 Joker260 g/Coringa160 ml/Plant Protein596 ml/Terpeno32 ml/Tricomax100 g e count3 históricos aprovados por regressão. Apenas projeção/navegação/layout mudaram.

Revisão advisory prévia do architect: sem impedimento; recomendações de foco nas bordas, tipo compartilhado com Receita, referências/memoização, seletores diretos e isolamento do CSS incorporadas. Revisão final do incremento: **PASS, sem achados impeditivos ou regressões relevantes**. Architect conferiu código/tests/docs, evidências, capturas360/1024, contagem37/25 e ausência de consumidores de comparação; recalculou independentemente os54 hashes protegidos, todos iguais. Parecer estático e das evidências, sem reexecução independente de testes/browser. Limitações de Chromium/headless/reflow explicitamente confirmadas. T025–T037 podem permanecer concluídas; encerrar e aguardar autorização para T038+. Esta revisão não executa T060.


## Bloco 3 — T038–T051 (2026-10-10)

**BLOCO 3 COMPLETE**: T038–T051 validadas; **51/62 concluídas, 11 pendentes (T052–T062)**. Escopo exclusivo de impressão completa; T052–T062 não iniciadas. Nenhum commit, publicação, nova dependência de aplicação ou rota de impressão.

### Implementação e RED/GREEN

- T038–T041: módulos mínimos tipados antes de executar os testes antecipados. RED comportamental **20 falhas / 13 passes** nas três suites; nenhuma falha de importação. [red.log](evidence/block3/red.log). T038 também preserva os comportamentos existentes que já estavam GREEN.
- T042: DoseValue e RuleStateValue extraídos e usados por RuleDetails/PrintPlan. QuantityValue, AggregateValue, IncompleteNotice, frequencyLabel e formatos existentes preservados. N/A mantém os dois motivos; NO_RULE não vira zero ou ausência confirmada. Completude sem subtotal também coberta.
- T043–T045: PrintPlan recebe apenas result/schedule/brand. Cabeçalho RAIZORA/parceiro/cronograma/id/versão/auditoria, duração reutilizada, volumes/política/selecionados; 16 tabelas de seis colunas em ordem canônica, ACTIVE com dose/via/frequência/volume/preparo/semanal e N/A/NO_RULE com motivos; totais próprios por produto/estágio/ciclo e fontes/referências/datas/notas. Sem cálculo, soma de quantidades, clone/DTO de resultado ou dependência da semana ativa.
- T046–T048: documento irmão da interface, fora do form, somente PLAN/SUCCESS, inclusive INCOMPLETE; CSS display:none em tela remove árvore acessível e overflow, sem aria-hidden permanente. Botão type=button chama window.print no evento client sem dispatch/estado/Effect/listeners. A4 retrato, margem12mm, largura de página, fontes10pt/9pt nas notas, preto sobre branco, table-layout fixed, thead contextual repetido e fluxo vertical sem impedir continuação da semana inteira. Referências curtas mantidas juntas para evitar notas isoladas. As duas instâncias de ScheduleDuration usam useId para manter IDs únicos.
- T049/T050: suites afetadas GREEN e regressão completa **398/398, 26 suites**; testes de resultado congelado,16/80, oráculos V11-CICLO, subset, unidades/precisão, motivos, global/semana/totais incompletos, elegibilidade e invalidação real, clique único sem submit/cálculo, referência original e preservação de sessão/filtros/navegação. Prova DOM é distinta de PDF.
- Achado P2 da revisão independente: formatNumber(0.001) exibia0L. Corrigido somente no renderer de litros do PrintPlan, delegando ao formatNumber e usando **<0,01L** com texto acessível quando positivo arredondaria a0. Não altera números canônicos, formatadores de quantidades ou Receita/Resumo. Teste cobre contexto e preparo de fertirrigação/foliar; fixture/PDF subcent regenerados. Revisão inicial restante sem achados impeditivos; reconfirmação final **PASS**, P2 resolvido.

### Gates e evidências reais

Testes, lint, typecheck e build **PASS** nos logs de evidence/block3. Build fora do sandbox pelo erro conhecido de captura TypeScript --showConfig; sem mudança de configuração/dependências. Ferramentas de QA (Playwright/Chromium já disponíveis; esbuild/PDF.js/canvas temporários) ficam em /tmp, sem pacote PDF na aplicação.

Chromium156.0.8078.4 no build de produção local: mídia print e seis PDFs A4 reais gerados pelo renderer nativo com escala1/fundos desativados; documento completo nas semanas Vegetativo1 e Floração4, subset Joker10,25L/sem foliar, INCOMPLETE sintético,20 produtos sintéticos com nomes/fontes longos e subcentésimos nas duas vias. Cada caso contém as16 semanas em ordem. PDF.js verifica todas as páginas: A4, limites de texto pela métrica real de fonte, contagem de linhas de produtos, sequência e ausência de controles; conteúdo textual e pixels dos PDFs das duas semanas ativas são idênticos. Capturas de todas as páginas/contact sheets preservadas. Cabeçalhos de continuação e fontes conferidos visualmente pelo principal e architect; detalhes em [pdf-inspection.json](evidence/block3/pdf-inspection.json).

Prévia nativa **com janela** aberta pelo botão, papel ISO_A4, fundos e cabeçalhos/rodapés do navegador desativados, cancelada pelo próprio botão Cancel: mesma Floração4, HTML do documento,10L/2L e cinco selecionados após retorno. [native-preview.json](evidence/block3/native-preview.json), [captura](evidence/block3/native-preview.png). Smoke também confirma navegação Vegetativo8↔Floração1, Receita/Resumo e edição posterior sem alteração indevida. Geração headless de PDF e retorno de window.print não são apresentados como conclusão via destino Salvar.

Correções do harness de QA: limpeza via loadingTask.destroy na API PDF.js; limites verticais calculados com ascent/descent em vez de subtrair a altura inteira da linha; observar alvo chrome://print concorrentemente com clique bloqueado e acessar o alvo interno por CDP; reiniciar produção após builds para não usar módulos/manifests antigos. Nenhuma dessas falhas de infraestrutura foi considerada RED comportamental ou falha do produto.

### Integridade, limites e continuidade

A baseline anterior deste bloco está em [baseline.json](evidence/block3/baseline.json); auditoria SHA-256 e inventário em integrity.json/changed-files.json. Domínio/motor/contrato genérico, matriz/dados/fontes/frequências foliares, cronograma8+8, constituição, dependências/lockfile e documentos históricos preservados. Oráculos count1 e genéricos count3 continuam GREEN; campos e valores impressos vêm do CalculationResult atual. Nenhum cálculo nutricional é refeito na apresentação.

Limitações: somente Chromium156 exercitado; Firefox/WebKit/Safari, impressora física, leitor de tela, Ctrl+P e conclusão pelo destino Salvar do diálogo não validados nesta rodada. Ctrl+P tem a mesma montagem/CSS pré-renderizada, mas a interação nativa por atalho permanece pendente de T056. A cobertura transversal e os cenários completos de T052–T062 continuam pendentes, inclusive a cobertura de outros browsers disponível no próximo bloco. Evidências deste incremento não marcam T054–T057/T060 antecipadamente.


### Revisão final e encerramento em T051

Architect reconfirmou **PASS — sem achados impeditivos** após a correção P2: renderer de litros e teste das duas vias, dez páginas do PDF subcent final, logs398/26 e checks, relatório/limitações conferidos. Recalculou independentemente os54 hashes protegidos: todos intactos. Inspeção das evidências/estática, sem alegação de reexecução independente dos testes. Parecer registrado em [architect-review.md](evidence/block3/architect-review.md).

T051 conclui a revisão de fonte única e isolamento: PrintPlan consome o mesmo CalculationResult, sem cálculo nutricional, soma, cópia de resultado, semana ativa ou estado paralelo; chamada nativa apenas pelo botão type=button, sem submissão ou modificação de sessão. Contagem final **51/62**, T052–T062 pendentes; definições/IDs/dependências preservados. Seis PDFs finais totalizam105 páginas A4 verificadas; completo10 páginas em qualquer semana ativa, incompleto11, subset5, extenso59 e subcent10. Evidências/inventário atualizados conforme execuções reais.

**Pronto para autorização do Bloco 4. Execução encerrada em T051, sem commit/deploy e sem iniciar T052 ou posteriores.** Aceite transversal futuro permanece conforme tasks/quickstart; Ctrl+P, Salvar pelo diálogo e outros browsers explicitamente pendentes.


## Bloco 4 — T052–T062 (2026-10-10)

**READY FOR RELEASE — 62/62 tarefas concluídas, gates finais e architect PASS.** Execução exclusiva de regressão e encerramento, sem alteração de código de produção, testes existentes, engine, matriz, doses, fontes, contratos ou dependências. Fonte de verdade: tasks.md; indisponibilidades adicionais conforme instrução expressa do responsável, sem apresentá-las como execução aprovada.

### T052 — Matemática

Execução nova de272 testes unitários em13 suites, mais oráculo independente de80 entradas/16 semanas em [mathematical-oracles.json](evidence/block4/mathematical-oracles.json). V11-01–06, V11-CICLO e REG-01/02/03 PASS. Fertirrigação1 na aplicação; contrato genérico count3 preservado. Foliares1/1/2/2/2/2/3/3 e16 aplicações prescritas, independentes do count global. Doses, via, quantidade/preparo, consumo semanal, unidades e agregados conferidos; ACTIVE/N/A/NO_RULE preservados. Testes numéricos de overflow/underflow, subnormais, decimais e soma antes de arredondar passam.

| Produto | Vegetativo | Floração | Ciclo v1.1 | Ciclo genérico count3 |
| --- | --- | --- | --- | --- |
| Joker | 140g | 120g | 260g | 780g |
| Coringa Blend | 160ml | N/A | 160ml | 160ml |
| Plant Protein | 96ml | 500ml | 596ml | 1.596ml |
| Terpeno Plus | 32ml | N/A | 32ml | 32ml |
| Tricomax | N/A | 100g | 100g | 300g |

REG-03: Joker/Vegetativo4 NO_RULE produz subtotal parcial120g/240g sem amount definitivo; retirar Joker restaura COMPLETE. Não se atribuiu zero a ausências. Esses objetos são fixtures sintéticas externas, sem nova interpretação das fontes oficiais. Todos os arquivos de domínio/dataset e fixtures genéricas preservados por hash.

### T053/T054 — Integração, navegação e acessibilidade

Execução nova de126 testes UI em13 suites: componentes/integração/regressão. Total398/398 em26 suites. Jornada Landing→Configuração→Produtos→Plano→Receita→Resumo com todos os produtos e seleção parcial em360/640/768/1024/1280px. Wizard incompleto real em360/1280 no harness temporário; não é rota entregue. [integrated-browser.json](evidence/block4/integrated-browser.json): sete fluxos PASS e41 auditorias axe-core WCAG2/2.1A/AA com0 violações. [browser-smoke.json](evidence/browser-smoke.json): cinco larguras e dois reflows equivalentes200% PASS.

Todas16 posições acessíveis nos dois sentidos, Vegetativo8↔Floração1 em uma ação, extremos disabled, seletores diretos sincronizados. Tab/Shift+Tab/Enter/Espaço, ausência de submit acidental, foco visível solid3px e transferência para controle habilitado nas bordas; aria-live=polite. Labels, ajuda vinculada/10% opcional, erros/primeiro foco, nomes acessíveis e avisos conferidos. Cards de Plano/Receita, cards/tabela do Resumo legíveis, sem overflow horizontal/corte; capturas novas em block4.

Edição de10→20L dobra Joker260→520g; semana3 preservada passa20→40g por preparo/semana. Reativar Plant Protein com3L foliares na mesma semana produz9ml/preparo e18ml/semana. Seleção vazia e volume inválido bloqueiam; não deixam PrintPlan/plano anterior. Foliar desnecessário é omitido do canônico preservando draft; reativação reexige o volume. Receita compartilha par de filtros e prepara quantidade sem multiplicação semanal. Response referencialmente igual para navegação/impressão e nova para volumes/seleção nos testes do controller. As quatro apresentações recebem o mesmo CalculationResult.

Axe tem checks incompletos de color-contrast/aria-prohibited-attr em alguns nós; zero violações não é certificação WCAG nem substitui leitor de tela. Inspeção visual/teclado confirma legibilidade e foco. Reflow1280→640 e640→320 CSS px/deviceScaleFactor2 é equivalente200%, sem alegação de zoom pela interface do navegador.

### T055–T057 — Impressão

[Harness e reprodução](evidence/print-harness.md), [revisão visual/PDF](evidence/print-review.md). Seis PDFs novos totalizam105 páginas A4: completos10+10, subset5, incompleto11, extenso59, subcent10. PDF.js inspecionou todas páginas/dimensões/margens/sequência/contagens. Principal inspecionou todas contact sheets, inclusive59 páginas extensas. Cabeçalhos contextuais nas continuações,16 semanas em ordem, vias/unidades/doses/preparo/semanal, totais e fontes sem corte/sobreposição/controles. Fundos desligados, escala100%, margens12mm. Nenhum número fixo de páginas exigido.

Todos os campos/células das80 linhas semanais e cinco totais coincidem com CalculationResult completo e incompleto. Texto e raster de todas páginas completas são iguais para Vegetativo1 e Floração4 ativas. Incompleto mantém aviso/sem definitivo/subtotais; N/A e não uso distinguíveis; subset exclui desmarcados; subcent mantém valores positivos e volumes `<0,01L`.

Prévia nativa em Chromium com janela abriu dez páginas do documento, cancelamento preservou etapa/semana4/conteúdo e sessão. [native-app.json](evidence/block4/native-app.json) é a execução de controle sem ajustes internos; a execução nativa final e as verificações adicionais estão em [native-preview.json](evidence/block4/native-preview.json). Ctrl+P real e conclusão pelo Salvar não obtiveram execução concluída: evento sintético não aciona o accelerator do navegador e o harness não conseguiu localizar uma janela X11 mapeada para receber teclado/operar nome de arquivo. Não há PDF alegadamente salvo pelo diálogo. A comparação visual da primeira página nativa com PDF foi feita; comparação integral de PDF salvo pelo diálogo permanece indisponível. Tentativas estão em native-attempts.json/log e x11-save.py, sem confundi-las com PASS. A seleção A4 foi solicitada, mas o readback do diálogo manteve Letter; não se declara A4 nativo consolidado. A4 e conteúdo integral são comprovados pelos PDFs reais; cobertura nativa é reportada separadamente. A instrução atual “se o ambiente permitir” autoriza registrar essas subverificações indisponíveis sem alterar a descrição histórica de T056.

Firefox/WebKit não instalados/executáveis ausentes; Safari indisponível no Linux, conforme [browser-availability.json](evidence/block4/browser-availability.json). Nenhum PASS alegado para esses browsers, impressora física ou leitor de tela. Sem dependência nova de produção, alteração de fontes ou rota sintética entregue.

### T058/T059 — Gates e integridade

[checks.md](evidence/checks.md) registra comandos/resultados reais. Unit272/272 eUI126/126; lint/typecheck/build PASS sem warnings. Primeiro build falhou no subprocesso TypeScript restrito pelo sandbox; build fora do sandbox passou, como nos blocos anteriores. Servidor final `npm run start -- --hostname 127.0.0.1 --port 3110` reiniciado sobre build aprovado; smoke novo percorreu configuração→Plano→Receita→Resumo/print, edição/subset e os seis casos, sem erro de console/página.

[Auditoria](evidence/block4/integrity.json):54 hashes protegidos intactos; todos arquivos de produção/tests, MVP histórico, evidências anteriores, fontes/package/lockfile e contratos preservados; detecta também novos/removidos nos escopos protegidos. Mudanças desta rodada: tasks.md, implementation-review.md, runbook .claude/napkin.md; novas evidências/harnesses em evidence/block4 e quatro documentos/índice em evidence/. [Inventário](evidence/block4/changed-files.json). Repositório já tinha arquivos não rastreados; diff SHA-256 contra baseline capturada é o inventário desta rodada. Nenhum commit/deploy/nova versão.

### Rastreabilidade final — 20 FR

| FR | Evidência nova / resultado |
| --- | --- |
| FR-001 | configuration/configuration-error capturas e41axe; ajuda/descrição10% PASS |
| FR-002 | suites configuration/controller; dois volumes manuais, nenhum cálculo de vaso PASS |
| FR-003 | plan capturas/duration e unit/UI;8+8=16 somente Plano PASS |
| FR-004 | browser-smoke sete configurações; uma semana por posição PASS |
| FR-005 | browser-smoke ida/volta/limites/teclado16 posições PASS |
| FR-006 | browser-smoke seletores nativos/diretos sincronizados PASS |
| FR-007 | unit reducer/controller e integrated-browser edição/retorno PASS |
| FR-008 | browser-print handler/print media e native-app abertura PASS |
| FR-009 | PDFs105páginas/pdf-inspection + comparação célula a célula PASS |
| FR-010 | PDFs/headings/fontes/contexto/agregados canônicos PASS |
| FR-011 | A4/margens/raster e inspeção visual de todas sheets PASS |
| FR-012 | native-app cancelamento/sessão e PDF invariável PASS; Ctrl+P/Salvar indisponíveis |
| FR-013 | controller unit/UI input count1, sem input oculto PASS |
| FR-014 | contextos Plano/Receita/Resumo/PrintPlan nos fluxos/PDF PASS |
| FR-015 | unit/oracles REG-01/02 count3 + hashes engine PASS |
| FR-016 | oracles80entries e foliar1/2/3/16 aplicações PASS |
| FR-017 | hashes/critérios source, gates vazia/foliar e jornada PASS |
| FR-018 | REG-03 selecionado/desmarcado, Wizard/PDF incompleto/subtotais PASS |
| FR-019 | unidade/precisão unit, fonte única/controller/células print/PDF PASS |
| FR-020 | browser teclado/foco/labels/status/overflow/41axe PASS no ambiente testado |

### Rastreabilidade final — nove SC

| SC | Evidência nova / resultado |
| --- | --- |
| SC-001 | configuration360/768/1280 e intervalos; ajuda opcional/manuais PASS |
| SC-002 | unit/UI + capturas configuração/Plano: dois campos, duração8+8 PASS |
| SC-003 | browser-smoke:16 semanas/sequencial/direta/semana única em sete cenários PASS |
| SC-004 | fronteira atômica, Enter/Espaço, disabled/foco/status PASS |
| SC-005 | seis PDFs105páginas/16semanas/continuações/sem controles, independente semana PASS |
| SC-006 |80linhas+5totais/células, PDF igual entre semanas, cancelar preserva sessão PASS; conclusão pelo Salvar indisponível |
| SC-007 | V11-01–06/V11-CICLO/80entradas/preparo versus semanal PASS |
| SC-008 | REG-01/02 count3; foliar1/2/3 preservado PASS |
| SC-009 | ausência sem zero; REG-03 selecionado/desmarcado e nenhum definitivo afetado PASS |

### Achados e limites restantes

Nenhum defeito de produção identificado. Falhas iniciais foram do harness: contagem de tabelas ocultas, expectativas incorretas para semana preservada, busca de nome em referências oficiais, configurações internas de preview sem metadata adequada e limitações de accelerator/foco X11. Apenas QA ajustado; gates afetados reexecutados. Casos inválidos e tentativas nativas não viraram alegação de PASS.

Limitações residuais: somente Chromium; reflow equivalente sem zoom nativo; sem leitor de tela/impressora física; Ctrl+P, conclusão Salvar e comparação integral com PDF salvo nativamente não concluídos. Não há achado de legibilidade ou fórmula pendente. Parecer independente T060 PASS e ausência de achados em T061 registrados abaixo.


### T060–T062 — Parecer e encerramento

Architect: **PASS — sem achados impeditivos; READY FOR RELEASE**. [Parecer independente](evidence/block4/architect-review.md). Recalculou54hashes e inspecionou independentemente os seis PDFs/105páginas com PDF.js, mais capturas e evidências. Conferiu arquitetura/fonte única,20FR/noveSC, estados/precisão, contratos e limites do pedido. Não reexecutou suites/browser nem mutou arquivos. As verificações adicionais indisponíveis são permitidas pela cláusula expressa “se o ambiente permitir”, com limites mantidos e sem dispensar falha de produto.

T061 confirma ausência de achados a corrigir. Nenhuma correção na aplicação foi necessária. T062 atualiza tasks/contagem/inventário e encerra exclusivamente esta execução: **62/62 tarefas,11/11 deste bloco**,20FR/noveSC rastreados com limitações específicas. A suite conjunta de fechamento `npm test` confirmou novamente398/398/26suites em [tests-final.log](evidence/block4/tests-final.log), após estabilizar o QA; não é somada aos398 testes das suites separadas. Gates lint/typecheck/build e smoke final PASS.

Arquivos modificados nesta rodada: `specs/002-raizora-v1-1/tasks.md`, `specs/002-raizora-v1-1/implementation-review.md`, `.claude/napkin.md`. Novos documentos/índice: evidence/checks.md, print-harness.md, print-review.md, browser-smoke.json; demais scripts/logs/JSON/PDF/PNG/inventário/review em evidence/block4. Produção, testes, regras, fontes, lockfile, contratos e documentos/evidências históricos intactos. Inventário SHA-256 final é a referência exata de mudanças.

Riscos residuais são exclusivamente limites de cobertura declarados: nenhum browser além de Chromium, sem zoom pela interface/leitor de tela/impressora física; Ctrl+P, Salvar pelo diálogo, consolidação A4 nativa e comparação integral do PDF salvo nativamente permanecem não validados. Os seis PDFs reaisA4 e seu conteúdo integral passam. Nenhuma promessa de certificação WCAG ou teste em Safari/Firefox/WebKit.

**Status final: READY FOR RELEASE. Execução encerrada em T062. Sem commit, deploy, publicação ou início de nova versão.**
