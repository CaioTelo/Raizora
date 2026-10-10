<!--
Sync Impact Report — 2026-10-08
Version: 1.0.1 → 2.0.0 (MAJOR: redefinição incompatível de orientação do princípio IX).
Motivação: decisão explícita do responsável na rodada clarify/consolidação da
feature 002-raizora-v1-1 substitui comparação semanal simultânea por semana selecionada.
Princípio modificado: IX. Mobile-first e responsividade real (título preservado).
Princípios I–VIII e X–XIV, demais seções e ratificação original: preservados.
Seções/princípios adicionados ou removidos: nenhum.
Impacto: consulta semanal, navegação contínua e impressão do ciclo; não altera
matriz, prescrição ou engine. As 16 semanas pertencem ao schedule atual, não à plataforma.
✅ specs/002-raizora-v1-1/spec.md, open-questions.md e checklists/requirements.md: sincronizados.
✅ specs/002-raizora-v1-1/technical-decisions.md e review.md: decisões e rastreabilidade.
✅ README.md: referência à constituição vigente e estado documental da v1.1.
✅ .specify/templates/spec-template.md, plan-template.md e tasks-template.md:
   revisados, sem cláusula de comparação simultânea ou alteração necessária.
✅ AGENTS.md: revisado; descreve baseline executável do MVP, sem atualização necessária.
.specify/templates/commands/: inexistente; nenhum comando desse diretório para sincronizar.
Documentos históricos specs/001-raizora-mvp/ preservados como baseline da constituição 1.0.1.
Sem placeholders ou pendências de sincronização. Plan/tasks/implement não executados.
Rastreabilidade: specs/002-raizora-v1-1/review.md, decisão GOV-V11-001 e OQ-V11-001.
-->
# RAIZORA Constitution

## Core Principles

### I. Independência de fabricante
RAIZORA DEVE ser apresentado e modelado como plataforma independente.
Plantas que Curam é o primeiro parceiro de fertilizantes, não o proprietário do RAIZORA.
Identidade, navegação e conceitos centrais NÃO DEVEM atribuir a plataforma ao parceiro.

### II. Multi-marca por arquitetura
Marca, produto e cronograma DEVEM possuir identidades separadas. O domínio central
DEVE operar sobre contratos neutros de regras, sem nomes ou estruturas exclusivas
de fabricante. Extensibilidade NÃO exige integrar outras marcas neste MVP.

### III. Regras nutricionais como dados
Dose, unidade, estágio, semana, via e frequência DEVEM ser dados do cronograma.
A UI NÃO DEVE espalhar condicionais de produto ou marca para calcular dosagens.
Via e frequência pertencem à regra, pois podem variar por estágio.

### IV. Fonte oficial como autoridade matemática
Dosagens DEVEM ser rastreáveis ao cronograma oficial e à sua versão/referência.
Para o primeiro parceiro, a autoridade primária é `tabela_nutricional.jpeg`; regras
explicitamente confirmadas pelo responsável vêm em seguida. Divergências DEVEM
ser registradas e resolvidas pelo responsável antes de uso. Uma transcrição ainda
não conferida NÃO DEVE ser rotulada como fonte auditada.

### V. Proibição de inventar regras
É proibido preencher lacunas por analogia, inferir dosagens, repetir semanas,
interpolar doses ou aplicar ajustes do mockup sem validação. Ausência de informação,
não utilização explícita e produto não selecionado DEVEM ser estados distintos.
Speed Vega fica fora do cálculo inicial por falta de regra.

### VI. Motor independente da UI
O motor DEVE receber configuração, seleção e regras validadas, e devolver resultados
sem depender de componentes, navegação, estado visual ou serviços de fabricante.
Deve ser possível executar cálculos e testes sem renderizar a interface.

### VII. Determinismo e testes matemáticos
Entradas e regras iguais DEVEM produzir resultados iguais. A implementação futura
DEVE ter testes unitários de dose × volume, frequência e soma do ciclo, incluindo
os dois casos de referência fornecidos. Precisão e arredondamento DEVEM ser definidos
antes da implementação correspondente; totais NÃO DEVEM somar valores já arredondados
para exibição. Nesta rodada há critérios documentais, sem código ou testes executáveis.

### VIII. Tipagem forte de unidades e aplicações
Unidades de dose (`g/L`, `ml/L`), quantidade (`g`, `ml`), volume (`L`) e tipos de
aplicação DEVEM ser explícitos e incompatibilidades detectáveis. Massa e volume NÃO
DEVEM ser somados ou convertidos sem regra oficial. Frequência prescrita, informada
e “todas as regas” NÃO DEVEM ser confundidas; vias desconhecidas não recebem volume
por inferência.

### IX. Mobile-first e responsividade real
O fluxo DEVE funcionar em mobile, tablet e desktop. Em telas amplas, a composição
DEVE aproveitar largura para agrupamento e leitura das informações da semana selecionada.
Não basta esticar o mockup mobile. Conteúdo, unidades, controles e navegação DEVEM
permanecer legíveis e acessíveis por teclado; rótulos não dependem apenas de cor.

O Plano de Nutrição DEVE exibir uma semana selecionada por vez, com navegação em
desktop e mobile que permita acessar todas as semanas do FeedingSchedule. No
cronograma atual da feature `002-raizora-v1-1`, são 16 semanas: oito vegetativas e
oito de floração; a navegação entre Vegetativo 8 e Floração 1 DEVE ser contínua
nos dois sentidos. A impressão DEVE contemplar o ciclo completo, independentemente
da semana selecionada. Essa alteração de apresentação e navegação NÃO DEVE modificar
a matriz de regras, doses, fontes, frequências prescritas ou o motor de cálculo.

### X. Simplicidade e limites do MVP
O MVP DEVE ser uma calculadora pública sem autenticação, contas, histórico,
persistência de cultivos, administração, pagamentos, chatbot, RAG, marketplace,
compras automáticas ou integração de outras marcas. Novos recursos exigem nova
especificação e autorização de escopo, sem inclusão automática por extensibilidade.

### XI. Infraestrutura proporcional
Não há requisito que justifique backend, banco ou serviço externo de cálculo neste
MVP. A direção técnica é Next.js, TypeScript e Tailwind CSS, com cálculo separado da
UI e estado transitório. Renderização no servidor não implica API nem persistência.
Versões, bibliotecas e limites de renderização serão avaliados no planejamento.

### XII. Contexto institucional separado da matemática
`base_conhecimento_plantas_que_curam_ia.pdf` serve para nomes, linguagem e contexto;
NÃO pode definir ou substituir doses, frequência, via ou fatores matemáticos.
A hierarquia de conteúdo é PDF, material institucional validado e futuras fichas/
rótulos oficiais. O layout é referência de experiência, não de prescrição.

### XIII. Evolução de parceiros sem reescrita do núcleo
Adicionar um parceiro e cronograma compatíveis com os tipos de regra existentes
DEVE exigir dados e validação, sem reescrever o cálculo nem introduzir condicionais
de fabricante. Novos tipos reais de regra exigem extensão explícita do contrato e
testes; não se promete suportar qualquer regra futura sem evolução do domínio.

### XIV. Ambiguidades resolvidas antes da implementação
Dúvidas DEVEM ter identificador, prioridade, impacto e responsável. Nenhuma regra
ambígua pode virar comportamento por default do agente. O responsável valida os
BLOCKERs no clarify antes do plano do MVP. Total incompleto NÃO DEVE aparecer como
consumo completo; até a resolução, a especificação permanece Draft.

## Restrições do MVP

Fluxo: Landing → Configuração → Produtos → Plano → Receita da rega → Resumo do ciclo.
Catálogo inicial: Joker, Coringa Blend, Plant Protein, Terpeno Plus e Tricomax.
O MVP utiliza o FeedingSchedule atual: oito semanas vegetativas e oito de floração,
sem edição da duração, conforme decisão explícita do responsável na spec. Essa
cobertura pertence ao schedule, não é constante universal do RAIZORA. Futuros
cronogramas podem ter outros estágios e durações. Tipo de cultivo e frequência
foliar não são inputs; frequências prescritas continuam dados das regras.
“Orgânico −60%” NÃO é regra aprovada. Não criar seletor multi-marca nem cadastro remoto.

## Workflow e quality gates

1. Inspecionar repositório e fontes; distinguir arquivo observado de descrição recebida.
2. Constitution e specify: documentar histórias, aceite, regras e perguntas.
3. Conferir fontes e executar clarify; registrar decisões com autoria e referência.
4. Somente após BLOCKERs resolvidos: plan, pesquisa e modelagem técnica.
5. Tasks e analyze vêm depois do plano; implementação depende dessa preparação e
   do escopo autorizado. Não executar o workflow completo automaticamente.
6. Orchestrator integra e valida. Explorer/researcher/architect são advisory;
   apenas orchestrator e workers modificam o repositório. Dependências são sequenciais.
   Architect revisa decisões substanciais e a entrega final.

Antes de concluir, revisar aceite, documentos, arquivos alterados, regressões e
testes pertinentes. Em rodadas documentais, verificar fontes, decisões e referências
aritméticas; se alguma fonte estiver indisponível, registrar a limitação e não
declarar sua auditoria concluída. A feature atual já tem fontes auditadas.

## Governance

Esta constitution rege specs, planos, tarefas e revisões dentro do escopo autorizado.
Instruções explícitas do responsável prevalecem sobre templates e defaults.
Mudanças DEVEM registrar motivação, princípios afetados, impacto e atualização dos
artefatos dependentes. Alterações de regras exigem fonte ou confirmação explícita
do responsável, sem resolver conflitos silenciosamente.
Versionamento: MAJOR para remoções/redefinições incompatíveis; MINOR para princípio
ou orientação material nova; PATCH para esclarecimentos sem mudança de comportamento.
Toda revisão substancial DEVE avaliar independência, fontes, precisão, separação
de cálculo/UI, escopo e responsividade. Exceções técnicas DEVEM ser justificadas
e não autorizam inventar prescrição.

**Version**: 2.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-08
