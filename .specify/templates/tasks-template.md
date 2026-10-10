---
description: "Template de tarefas RAIZORA; preencher somente após clarify e plan"
---

# Tasks: [FEATURE NAME]

**Input**: documentos da feature em `/specs/[###-feature-name]/`

**Prerequisites**: plan.md, spec.md e decisões de negócio validadas; pesquisa,
modelo e contratos locais do motor quando aplicáveis. BLOCKERs devem estar resolvidos.

**Tests**: testes unitários de regras e motor são OBRIGATÓRIOS: dose × volume,
frequência, agregação antes de arredondamento, unidades, seleção e estados de ausência.
Outros testes correspondem a riscos reais e critérios de aceite.

**Organization**: tarefas rastreáveis às histórias e requisitos da spec.
Todos os itens abaixo são placeholders do template, não tarefas desta rodada.

## Format: `[ID] [P?] [Story] Description`

- `[P]`: paralelizável só com arquivos/objetivos independentes.
- `[Story]`: identificador da história correspondente.
- Indicar caminho concreto apenas com a estrutura decidida no plano.

## Path Conventions

Aplicação web única. Separar apresentação, domínio/cálculo, dados de cronograma e testes.
Contratos são entradas/saídas do motor; não pressupõem API nem endpoints remotos.
Não criar backend, banco, autenticação, persistência ou integração de outra marca no MVP.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar apenas o necessário ao plano validado.

- [ ] T001 [Configurar estrutura e ferramentas aprovadas no plano]

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: garantir unidades, fontes e motor testável independentemente da UI.

- [ ] T002 [Validar dados e proveniência contra a tabela oficial e decisões do clarify]
- [ ] T003 [Definir unidades e aplicações neutras, sem condicionais de fabricante]
- [ ] T004 [Adicionar casos unitários matemáticos de referência e estados de ausência]

## Phase 3: User Story 1 - [Title] (Priority: [Priority])

**Goal**: [Objetivo da história]

**Independent Test**: [Verificação isolada com entradas explícitas]

### Tests

- [ ] T005 [US1] [Testes pertinentes; obrigatório para regra ou cálculo]

### Implementation

- [ ] T006 [US1] [Comportamento aprovado e arquivos do plano]

**Checkpoint**: incremento demonstrável; não equivale ao MVP completo.

[Repetir blocos para todas as histórias da spec, preservando dependências reais]

## Phase N: Polish & Cross-Cutting Concerns

- [ ] TXXX [Validar responsividade mobile/tablet/desktop, acessibilidade e navegação]
- [ ] TXXX [Conferir totais, unidades, incompletude e rastreabilidade das regras]
- [ ] TXXX [Revisar escopo, documentação e todos os critérios de aceite]

## Dependencies & Execution Order

Setup → fundamentos → histórias conforme dependências → validação integrada.
Testes do motor não exigem UI; configurar regras depende de fontes e clarify.
Orchestrator integra; workers recebem limites e não editam arquivos compartilhados
simultaneamente. Explorer, researcher e architect são advisory.

## Implementation Strategy

Implementar em incrementos verificáveis. Um incremento ou a landing isolada não é
MVP concluído: as seis etapas e todos os critérios do MVP definido pela spec devem
estar atendidos. Não publicar nem iniciar uma nova fase automaticamente.
Architect revisa mudanças substanciais e conclusão; principal valida aceite,
regressões, testes e arquivos alterados.

## Notes

Nenhuma tarefa pode resolver política nutricional por guess. Regras pendentes
exigem retorno ao clarify. Não conservar placeholders em um tasks.md gerado.
