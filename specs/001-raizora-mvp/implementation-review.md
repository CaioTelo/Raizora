# Implementation Review — RAIZORA MVP

**Status atual: MVP COMPLETE — 84/84 tasks, 294 testes, quality checks e browser PASS.**
Detalhes atuais na seção “Entrega final”; blocos anteriores são evidências históricas.

## Block 1 — checkpoint histórico

Data: 2026-10-07. **BLOCK 1 COMPLETE**. Rodada explicitamente autorizada para
FOUNDATION + DOMAIN + STATIC DATA + CALCULATION ENGINE + UNIT TESTS.
T001–T033 concluídas (33/84); T034–T084 abertas (51/84).

## Escopo e prechecks

Artefatos consultados: constitution 1.0.1, spec, open-questions, plan, research,
data-model, contracts/calculation, contracts/wizard, tasks e quickstart.
OQ-001–012 resolvidas; OQ-013 optional/deferred. Nenhuma decisão reaberta.
Prerequisites oficial resolveu a feature e todos os documentos requeridos.

Checklist histórico de requirements: 23 itens, 22 marcados e 1 aberto
(`Resultados funcionais testados`, não aplicável à rodada documental original).
Esse snapshot foi preservado. A autorização atual atende o aceite executável
apenas deste bloco; não equivale à jornada completa do MVP.

Hooks before_implement/after_implement ausentes em `.specify/extensions.yml`;
nenhum dispatch pendente. Revisão multi-agent completa/architect desta rodada
não executada, conforme pedido explícito. O principal revisou os contratos,
implementação e gates; um único worker implementou foundation e auditou os dados.
Nenhum terceiro fluxo ou nova arquitetura foi criado.

## Foundation — T001–T007

Next App Router com shells síncronos `/` e `/calculadora`, layout pt-BR,
metadata, tipografia do sistema, base clara/verde, foco visível e Tailwind 4.
Nenhum wizard funcional, Plano, Receita ou Resumo implementado.
TypeScript strict, alias @/ → src, ESLint flat/zero warnings, PostCSS e scripts
aprovados. Vitest projects: unit/Node e UI/jsdom; React plugin somente UI;
jest-dom e cleanup explícitos. `src/features/calculator` reservado por .gitkeep.

Toolchain efetiva (lockfile): Node 24.16.0/npm 11.16.0; Next 16.4.0;
React/react-dom 19.3.0; TypeScript 5.9.3; Tailwind/@tailwindcss/postcss 4.3.3;
Vitest 4.1.11; Vite 8.3.3/plugin-react 6.1.2; jsdom 29.1.1;
ESLint 9.39.5/eslint-config-next 16.4.0. Demais dependências são as do plan.

Context7 resolve→query consultado para Next, Tailwind e Vitest antes do setup.
Instalação usou cache `/tmp/raizora-npm-cache` por limites de escrita no ambiente.
Dev/build usam `--webpack` (compilador suportado pelo Next) porque Turbopack/PostCSS
falhou ao abrir socket interno com EPERM. Build convencional, sem output export.
`agentRules: false` evita geração automática de instruções pelo Next dev;
AGENTS.md original permanece preservado. Typecheck usa `next typegen && tsc --noEmit`.

Worker executou dev e confirmou HTTP 200 para ambas as rotas com headings corretos.
Não alegamos validação visual de wizard, viewports ou acessibilidade integrada.

## Domain e static data — T008–T020

Brand/Product/FeedingSchedule separados; tipos readonly e uniões discriminadas
para Dose/Quantity/Frequency/NutrientRule/respostas/agregados. Configuração contém
somente volumes por preparo e contagem global de fertirrigações; seleção é separada.
Dose, via, frequência e duração não pertencem ao Product.

validateSchedule verifica IDs, referências, duplicatas, duração/semana, números,
unidades, provenance, modos/vias, estados e consistência de N/A de estágio.
Gap → MISSING e NO_RULE explícito → diagnóstico com razão preservada; não são
dados malformados. Gap em estágio com posições N/A também continua desconhecido.
Dado malformado é rejeitado mesmo quando produto não selecionado.

Parceiro Plantas que Curam; catálogo ordenado Joker, Coringa Blend, Plant Protein,
Terpeno Plus, Tricomax (Speed Vega ausente). Schedule 8+8 possui todas as 80
posições explícitas em tuplas de oito células expandidas em slots tipados:
49 ACTIVE, 24 STAGE_NOT_APPLICABLE e 7 WEEK_NOT_USED; 24 FIXED/25 EVERY; zero NO_RULE.
Duração vem dos estágios, sem constante universal no engine.

Versão local `raizora-transcription-1`, versão do fabricante null, auditedAt
2026-10-02. SRC-001 oficial; SRC-004/006/007 decisões do responsável. Provenance
por aspecto: dose/via/foliar SRC-001; frequência Joker SRC-006/007; vínculo de todas
as regas Protein/Tricomax SRC-001/006/007; não uso SRC-004; N/A SRC-007.
PDF/layout não são autoridade matemática nem arquivos runtime.

**Auditoria independente T020 PASS:** worker inspecionou o JPEG original, spec e
data-model e conferiu todas as 80 posições, doses/vias/frequências/razões/fontes.
SHA-256 SRC-001: `0dc9128d6c48ce7d492058449ee99336bbdd413763df1bad46d35d25609793a7`.
Oráculo de teste independente, sem valores esperados obtidos do dataset: 82/82 GREEN.
Nenhuma discrepância material encontrada.

## Engine — T021–T033

Operação pública síncrona `calculateNutritionPlan(input)` e validador compartilhável
`validateCalculationInput(input)`. Helpers privados no mesmo módulo calculam
preparo/semana e agregam por produto/estágio/ciclo. Validação de schedule precede
validação de input. Seleção é normalizada pela ordem do catálogo.

Fórmulas brutas: dose×volume da via; preparo×frequência prescrita FIXED ou contagem
global EVERY. FIXED também suporta fertirrigação sem multiplicar pelo count global.
Somente ACTIVE gera quantidades. N/A é cobertura sem evento/zero; desmarcado é
omitido. NO_RULE selecionado incompleta semana/plano/agregados afetados, sem total
definitivo; knownSubtotal aparece apenas quando há consumo conhecido. NO_RULE
não selecionado não incompleta resultados. Escopo inteiramente N/A não tem amount.

Number sem arredondamento intermediário. Multiplicações positivas→zero retornam
UNDERFLOW; multiplicações/somas não finitas retornam OVERFLOW. Erros retornam
NUMERIC_ERROR sem result. INVALID_INPUT/INVALID_SCHEDULE também não carregam result.
Entradas não são alteradas; saída copia configuração/dose/frequência/chaves.

Revisão de fronteiras pelo principal: domain importa somente domain; nenhum
React/Next/DOM/browser/I/O/clock/estado global/dataset de parceiro no engine.
Tipos de via/modo/unidade/status controlam o cálculo; nomes de produto/marca e
semana não definem branches. Índices locais e duração menor funcionam em fixture neutra.

## Evidência de testes

TDD: testes estruturais/transcrição RED esperado (107 falhas/1 pass antes de
validator/dados), input RED (19 falhas/2 pass), engine RED (37 falhas/1 pass) antes
de composição pública. Falhas eram de comportamento ausente, não imports/configuração.
Todas fechadas no gate final.

| Arquivo | Testes GREEN |
| --- | ---: |
| foundation unit | 2 |
| validate-schedule | 39 |
| feeding-schedule | 82 |
| validate-input | 21 |
| calculation-reference | 7 |
| calculation-weeks | 11 |
| calculation-totals | 10 |
| calculation-contract | 11 |
| foundation UI | 2 |
| **Total** | **185 (183 unit + 2 UI)** |

| Referências aprovadas | Evidência |
| --- | --- |
| U-01–06/C-001–003 | Sete referências exatas (preparo e semana), incluindo Joker veg S4 |
| U-07/08/11/13 | Cobertura sem números, deseleção, volume por via, FIXED/EVERY, gaps e NO_RULE |
| U-09/C-005 | Estágio/ciclo: Joker 420/360/780 g; Coringa 160/N/A/160 ml; Protein 96/1500/1596 ml; Terpeno 32/N/A/32 ml; Tricomax N/A/300/300 g |
| U-10 | Joker 0.004 L×3: preparo 0.004, semana 0.012, veg 0.168, flora 0.144, ciclo 0.312 g |
| C-004/U-17 | Fixture neutra 2 semanas: 10+20=30 ml; IDs e rótulos independentes |
| U-12/U-14 | Todas 80 posições/provenance; estrutura inválida/inputs/seleção/falhas sem result |
| U-15 | Repeat, ordem de seleção, deepFreeze e isolamento do snapshot |
| U-16 (parte do engine) | Finitude/count seguro, overflow preparo/semanal/estágio/ciclo e underflow; parser/formatter previstos somente T034 em diante |

Inteiros por igualdade exata; caso decimal com tolerância explícita absoluta 1e-12
ou relativa 1e-12. Nenhum formatter/parser/UI funcional foi antecipado.

## Quality checks finais

| Comando | Resultado |
| --- | --- |
| npm run lint | PASS — zero warnings |
| npm run typecheck | PASS — route typegen + TypeScript strict |
| npm run test:unit | PASS — 183 testes, 8 arquivos |
| npm run test:ui | PASS — 2 smoke tests (também no npm test final) |
| npm test | PASS — 185 testes, 9 arquivos, zero falhas |
| npm run build | PASS — webpack, rotas / e /calculadora pré-renderizadas |

Sem perda de fontes ou alteração de decisões/spec/plan/data-model/contracts.
Build executado com autorização de sandbox para subprocessos do Next.
Nenhum deploy, backend, banco, auth ou persistência criado.

## Limites e continuidade

O wizard e a validação visual/browser da jornada completa permanecem futuros.
MVP completo não foi declarado pronto. T034–T084 não executadas nem marcadas.
T084 permanece aberta: README atualiza somente estado/comandos deste incremento,
sem declarar sincronização e QA do MVP final concluídos.

Instalação identificou avisos npm audit no tooling ESLint derivados de braces3.0.3.
Não há correção compatível publicada nessa cadeia; npm audit fix --force propõe
Next14, fora do plan. Nenhum force/downgrade foi aplicado. Isso não é falha dos
checks ou blocker matemático deste bloco; reavaliar a dependência no próximo setup.

## Block 2 — execução autorizada em 2026-10-07

**BLOCK 2 COMPLETE.** T034–T057 e T074–T076 concluídas nesta rodada (27).
Total atual: 60/84 concluídas, 24 abertas. Orchestrator como único executor;
nenhuma delegação ou revisão multi-agent completa, conforme pedido explícito.
Artefatos/requisitos/aceites revistos pelo principal. Não iniciar Block 3 automaticamente.

Prechecks: script oficial resolveu a feature; constitution/spec/OQs/plan/research/
data-model/contracts/quickstart/tasks consultados. Checklist histórico permanece
22/23: o item aberto de resultados funcionais pertence ao MVP completo, sem gate
novo para a autorização explícita deste incremento. Não alterar esse snapshot.
Hooks before_implement/after_implement ausentes; nenhum dispatch pendente.
Context7 resolve→query consultado para React e Next antes da integração.

### Calculator core/state/validation/presentation — T034–T046

Reducer local e props, sem Context/store/persistência. Drafts string vazios;
catálogo pré-selecionado somente na inicialização, etapa CONFIGURATION, primeiro
estágio/semana 1. UPDATE_CONFIGURATION, TOGGLE_PRODUCT, NEXT/BACK/SUBMIT,
retorno ao foliar e filtros com limites derivados do schedule. Seleção vazia e
filtros preservados ao voltar; montagem nova reinicia. Nenhum reset adicional na UI.

Parser com gramática completa R-006; vírgula/ponto decimal, trim, sem truncamento,
expoente/hex/milhar misto; conversão não finita ou positivo→zero recusada.
Controller adapta o draft, reutiliza validateCalculationInput e deriva uma única
CalculationResponse atual com calculateNutritionPlan. Nenhum resultado duplicado
no reducer/Effect, cálculo nos componentes ou import do parceiro em features.
Erros INVALID_INPUT/INVALID_SCHEDULE/NUMERIC_ERROR não liberam resultados antigos.

Gate Configuração→Produtos exige somente fert volume/count válidos. Gate seguinte
exige seleção/configuração completa: necessidade foliar descoberta por regras
ACTIVE/FOLIAR dos IDs selecionados em qualquer semana do ciclo. Sem foliares,
omite volume no input canônico, inclusive draft irrelevante inválido; reativação
revalida. Mensagens pt-BR centralizadas, sem máximo agronômico inventado.

Formatter Intl pt-BR, máximo 2 casas, sem zeros finais, empate halfExpand padrão.
Positivo subcentésimo distingue-se de zero por “< 0,01” e descrição acessível.
N/A/NO_RULE permanecem sem número. Selectors apenas filtram/projetam semanas,
via e totais canônicos, preservando valores/referências e diagnóstico de semana
desconhecida. Helpers não implementam telas de Plano/Receita/Resumo.

### Landing, Configuração e Produtos — T047–T057, T074–T076

Landing estática `/`: RAIZORA principal, propósito curto, CTA Link “Começar agora”
para `/calculadora`, Plantas que Curam identificado como parceiro secundário.
Copy provisória em content.ts, sem claims comerciais ou assets externos;
OQ-013 permanece deferred. Layout claro/verde/cards conforme direção aprovada.

Página `/calculadora` injeta Brand/schedule na raiz client. Somente etapas internas,
progresso 2/6 e 3/6, sem links que pulam gates. Configuração possui exatamente três
inputs text/inputMode, labels, unidades visíveis, ajuda/erro via aria-describedby e
aria-invalid. Duração informativa lida dos estágios (8+8 neste schedule).
Submit por botão/Enter, foco no primeiro erro e heading ao mudar de etapa.

Produtos: cinco checkbox nativos, fieldset/legend/erro associado, cards responsivos,
defaults preservados sem reinitialização ao voltar. Seleção vazia bloqueia; foliar
inválido oferece retorno focalizado ao mesmo campo sem perder escolhas.
Tricomax globalmente selecionável; Speed Vega ausente. Somente SUCCESS permite
entrar no placeholder estrutural PLAN, sem exibir cálculo e sem avanço para
Receita/Resumo. T058–T073 não foram executadas.

### Evidência local de testes e responsividade

82 testes adicionados (43 unit + 39 UI), sem snapshots principais. Foundation UI
teve somente o nome do CTA atualizado; seus dois testes permanecem. Suítes novas:

| Suíte | Testes GREEN |
| --- | ---: |
| Parser / formatter / reducer / selectors | 27 / 7 / 6 / 3 |
| Controller / landing / configuração / produtos | 21 / 2 / 11 / 5 |
| **Total atual** | **267 (226 unit + 41 UI), 17 arquivos** |

Cobertura: vazios/zero/negativos, decimais/count seguro/extremos, seleção/defaults/
toggle/next/back/remontagem, omissão foliar/revalidação, cálculo atualizado,
exclusão sem redistribuir quantidades, IDs neutros, falhas numéricas/estruturais,
labels/descriptions/erros/foco repetido/Enter/Espaço/retorno ao campo.
RED→GREEN observado no parser/formatter/reducer, selectors, controller, landing e
produtos. Falha intermediária de timing do foco corrigida no commit de DOM do React.

Smoke de implementação em Chrome for Testing 155.0.8059.39, build local em
127.0.0.1:3100, via DevTools com script Node temporário (sem runner/dependência nova).
Browser/bibliotecas extraídos somente em /tmp; sockets exigiram execução fora do
sandbox. Capturas/medidas temporárias em /tmp/raizora-*.png e
/tmp/raizora-browser-evidence.json; resultados observados registrados abaixo.

| Largura | Landing | Configuração | Produtos |
| --- | --- | --- | --- |
| 360 px | Centralizada, legível | Cards verticais | Uma coluna |
| 768 px | Identidade/copy em duas colunas | Duas seções lado a lado | Duas colunas |
| 1280 px | Composição central ampla | Duas seções lado a lado | Três colunas |

As nove combinações não têm overflow horizontal. Capturas inspecionadas pelo
principal; sobreposição dos rótulos de progresso mobile identificada e corrigida,
depois smoke repetido com verificação dos limites de cada rótulo. CTA, três campos,
cinco defaults, foco/erro, retorno ao foliar e draft preservado conferidos nas três
larguras. Sem exceções de runtime observadas. Isso é checkpoint local das telas,
não QA final: T077–T084, jornada completa, zoom/leitor de tela e audit integrado
permanecem pendentes.

### Quality checks e integridade

| Check | Resultado |
| --- | --- |
| npm run lint | PASS, zero warnings |
| npm run typecheck | PASS, typegen + strict |
| npm test | PASS, 267 testes |
| npm run build | PASS, `/` e `/calculadora` estáticas |

SHA-256 antes/depois conferido: domínio, engine, validators, catálogo/schedule e
testes matemáticos do bloco 1 preservados. Seus 185 testes continuam GREEN.
package.json/lockfile/dependências/spec/plan/model/contracts não alterados.
Sem backend/banco/auth/persistência, regra nova, reauditoria de JPEG/PDF ou deploy.
README/tasks refletem somente este incremento; T084 não está concluída.

Restam 24 tarefas: Plano 7 (T058–T064), Receita 5 (T065–T069), Resumo 4
(T070–T073), checkpoint integrado da Landing 1 (T077), QA/produção/docs finais 7
(T078–T084). Nenhum blocker real dentro do escopo autorizado do Block 2.

## Entrega final — Block 3 / 2026-10-07

**MVP COMPLETE — PASS.** Concluídas nesta rodada T058–T073 e T077–T084 (24).
Total: **84/84 concluídas, zero abertas**. Este é o estado atual; as seções
anteriores registram os checkpoints históricos dos blocos 1 e 2.
Orchestrator executou implementação, integração, validação e revisão final enxuta.
Sem delegação: a instrução explícita desta rodada substituiu a revisão advisory
por architect prevista no texto original de T083. Nenhum achado material exigiu
reviewer adicional. Nenhuma V2/deploy foi iniciado.

### Plano — T058–T064

WeekStageFilter usa selects nativos com opções/duração do schedule e ações do
reducer aprovado. Estágio/semana persistem entre Plano/Receita/Resumo e retornos.
Cards mobile; grid tablet; tabela comparativa desktop com caption/th scope,
semana selecionada textual e scroll local nomeado/focável por teclado.

RuleDetails apresenta dose oficial/L, amountPerApplication/preparo, weeklyAmount/
semana, via e frequência prescrita/configurada. NOT_APPLICABLE/não uso têm “—”
com motivo acessível; NO_RULE tem texto e aviso de incompletude canônica.
Metadata distingue versão local auditada da versão do fabricante não informada;
fontes oficiais e decisões do responsável ficam identificáveis em details.
Produtos globalmente desmarcados não aparecem em cards/tabela.

### Receita — T065–T069

Grupos de fertirrigação e pulverização foliar; filtro nativo de via local à view,
ambas inicialmente visíveis. Somente ACTIVE da semana/via e seleção canônicas.
Volumes vêm de result.configuration; quantidade vem de amountPerApplication.
RuleDetails em modo receita omite consumo semanal. Frequência individual é
informativa, prescrita sem edição; não há promessa de compatibilidade de mistura.
Via vazia confirmada informa ausência de aplicação. Semana INCOMPLETE sem ACTIVE
informa receita incompleta, sem inventar ausência, zero ou quantidade de NO_RULE.

Referência vegetativo S4, 10 L/3/2 L: Joker **20 g** por preparo e frequência3;
Coringa/Protein/Terpeno **10/6/2 ml**, frequência prescrita2. Os **60 g** semanais
do Joker pertencem ao Plano, jamais à Receita. Teste específico impede essa regressão.

### Resumo — T070–T073

ProductTotals projeta byStage/cycle do engine; nenhuma soma na UI. Cards mobile/
tablet e tabela semântica desktop. Produtos desmarcados omitidos, g/ml preservados,
N/A com motivo e sem quantidade. INCOMPLETE não exibe amount definitivo; subtotal
conhecido tem rótulo explícito “Subtotal conhecido (parcial)”.
C-005 confirmado: Joker420/360/780 g; Coringa160/N/A/160 ml;
Protein96/1500/1596 ml; Terpeno32/N/A/32 ml; TricomaxN/A/300/300 g.
Fixture NO_RULE do Joker S4 retorna ciclo INCOMPLETE e subtotal720 g rotulado parcial.

### Wizard / Landing — T077–T078

Landing preservada, RAIZORA principal e parceiro separado, CTA real /calculadora.
Todas etapas internas com Voltar/Avançar, gates do controller, foco no heading,
seleção/draft/filtros preservados. Editar configuração/seleção atualiza todas views.
useMemo simples mantém a derivação canônica enquanto somente etapa/filtros mudam;
draft/seleção/schedule invalidam. Não há cache externo ou segunda engine.

Teste integrado inclui Landing/CTA e raiz real do wizard; a fronteira de rota é
modelada no teste, enquanto navegação Next real é validada no browser. 20 L iniciais
produzem Joker1560 g no resumo. Vazio bloqueia; foliar reativado exige correção
focalizada; remontagem reinicia; NUMERIC_ERROR/INVALID_SCHEDULE não liberam plano
antigo; fixture NO_RULE permanece incompleta em todas as apresentações.

### Testes e checks — T081

TDD das views: Plano6/Receita5/Resumo8 RED com scaffold mínimo antes de implementação,
GREEN após integração. Falha intermediária na fixture NO_RULE foi corrigida retirando
campos ACTIVE indevidos da fixture; validator/engine aprovados permaneceram intactos.
Fluxo completo7 e estabilidade da resposta canônica1 adicionados. Teste existente de
Produtos atualizado somente para substituir a expectativa do placeholder pela view real.

| Suíte | Adicionados nesta rodada |
| --- | ---: |
| Plano | 6 |
| Receita | 5 |
| Resumo | 8 |
| Wizard completo | 7 |
| Controller (resposta preservada sem recalcular navegação/filtros) | 1 |
| **Total novo** | **27** |

| Quality check | Resultado final |
| --- | --- |
| npm run lint | PASS — zero warnings |
| npm run typecheck | PASS — typegen/TypeScript strict |
| npm run test:unit | PASS — 226 testes / 12 arquivos |
| npm run test:ui | PASS — 68 testes / 9 arquivos |
| npm test | PASS — 294 testes / 21 arquivos, zero falhas |
| npm run build | PASS — webpack, / e /calculadora estáticas |
| npm run start / browser smoke | PASS — produção local |

Node24.16.0; Next16.4.0; React19.3.0; TypeScript5.9.3; Vitest4.1.11.
Sem dependências novas, runner E2E ou instalação de browser nesta rodada.

### Responsividade / browser — T079/T082

Chrome for Testing **155.0.8059.39** (headless real), DevTools via script Node temporário,
build convencional servido em 127.0.0.1. 33 capturas: seis telas nas cinco larguras,
mais Plano/Receita/Resumo com reflow equivalente a zoom200% (1280 físicos/640 CSS,
deviceScaleFactor2). É uma simulação de viewport ampliado, não acionamento do menu
de zoom do Chrome. Evidência estruturada em [browser-smoke.json](evidence/browser-smoke.json).
Nove capturas principais foram mantidas em `evidence/`; demais capturas temporárias
ficam em `/tmp/raizora-final-*.png`. Capturas principais inspecionadas pelo principal.

| Largura | Plano | Receita | Resumo | Página |
| --- | --- | --- | --- | --- |
| 360 | Cards em coluna | Vias verticais | Cards em coluna | Sem overflow |
| 640 | Cards em duas colunas | Vias verticais | Cards em duas colunas | Sem overflow |
| 768 | Cards em duas colunas | Painéis lado a lado | Cards em duas colunas | Sem overflow |
| 1024 | Tabela semanal | Painéis lado a lado | Tabela de totais | Sem overflow |
| 1280 | Tabela semanal | Painéis lado a lado | Tabela de totais | Sem overflow |

Em todas: CTA, inputs, erros/foco, cinco defaults, teclado do checkbox, filtros
estágio/semana/via, S4 por preparo, C-005, voltar, editar10→20 L, refresh, Back real,
URL direta/compartilhada nova e storage vazio verificados. Sem exceções de runtime,
erros de console/hidratação ou requisições remotas para regras/cultivo. Scroll da
tabela responde à seta direita com foco. Stress de nomes longos nos cards/seleção
sem overflow; motivos/erros possuem quebra de texto. As falhas iniciais da automação
foram ajustes de CDP (Enter/Shift/serialização), sem falha funcional da aplicação.

### Acessibilidade — T080

Headings e main, labels/selects, fieldset/legend, checkbox nativos, buttons com type,
aria-current=step, aria-describedby/aria-invalid e mensagens associados conferidos.
Tab/Shift+Tab/Enter/Espaço e foco no primeiro erro/heading funcionam sem armadilha.
Foco visível3px. Caption/th scope e região de scroll focalizável conferidos. Árvore
acessível do Chrome confirma tabela responsiva oculta ausente em mobile/tablet e
presente no desktop; estados não dependem só de cor. N/A inclui motivo e NO_RULE
texto de incompletude, sem zero. Contraste da paleta verificado: texto mínimo5,59:1,
bordas de inputs mínimo3,44:1, botão primário7,36:1, foco6,65:1.

Limite explícito: **leitor de tela não instalado no ambiente**; não alegamos teste
com NVDA/VoiceOver/Orca. HTML semântico/testes e árvore acessível foram verificados.
Smoke em Chrome somente; não alegamos execução em Safari/Firefox. O aceite da task
prevê registrar indisponibilidade do leitor, e isso não bloqueia o MVP.

### Integridade, escopo e revisão final — T083/T084

Hashes do bloco1 conferidos antes/depois: domínio, engine, validators, catálogo,
schedule e testes matemáticos intactos. Oráculo/validator existente garante80 slots:
49 ACTIVE,24 STAGE_NOT_APPLICABLE e7 WEEK_NOT_USED, zero NO_RULE normal.
Sem reauditoria de JPEG/PDF ou alteração de constitution/spec/OQs/matriz/contracts.
Reducer/parser/formatters/selectors aprovados preservados. Controller recebeu
somente memoização da derivação para integração, com teste de invalidação.

| Critérios revisados pelo principal | Evidência / parecer |
| --- | --- |
| FR-001–007 / UX-001 / SC-001,007 | Fluxo público, inputs/gates/defaults/state; integração + browser — PASS |
| FR-008–012 / UX-002–004 / SC-002,003 | Canonical engine→views, dose/preparo/semana, via/frequência/fontes — PASS |
| FR-013–016 / SC-004,006 | C-005, unidades, N/A/NO_RULE, formatter e metadata — PASS |
| FR-017–018 / U-01–17 / C-001–005 | Domínio neutro e referências/branches unitárias existentes GREEN — PASS |
| UX-005–007 / SC-005 | Cinco larguras/teclado/reflow/contraste/identidade; limitações acima — PASS |
| Constitution I–V, XII–XIV | Independência, separação Brand/Product/Schedule e fontes, dados íntegros — PASS |
| Constitution VI–VIII | Motor puro/determinístico, precisão/unidades e testes — PASS |
| Constitution IX–XI | Layout adaptado e infraestrutura proporcional — PASS |
| Tasks | 84 IDs únicos contínuos, 84 concluídas, zero abertas — PASS |

Ausentes: backend dedicado, banco, auth, store externo, persistência, analytics,
chatbot/RAG/marketplace/outra marca, Speed Vega calculável, fator−60%, tipo de
cultivo, duração ou frequência foliar editável. Sem fórmula nutricional, toFixed
ou branches por produto/marca nas views. URLs não contêm configuração de cultivo.
README/AGENTS/quickstart/tasks sincronizados com o estado executável.
Hooks before_implement/after_implement ausentes; nenhum dispatch pendente.
OQ-013 permanece OPTIONAL/DEFERRED: copy/assets provisórios para revisar antes
publicação, sem blocker funcional. Revisão final enxuta do principal: **PASS**.
