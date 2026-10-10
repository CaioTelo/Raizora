# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE with explicit reference inputs.
  A single story is a demonstrable increment; RAIZORA's MVP requires all six stages
  and the acceptance criteria defined in the feature spec.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [capacidade pública, ex.: iniciar planejamento sem login]
- **FR-002**: System MUST [validação, ex.: rejeitar volume negativo]
- **FR-003**: Users MUST be able to [interação, ex.: selecionar produtos do plano]
- **FR-004**: System MUST [cálculo, ex.: multiplicar dose oficial pelo volume da via]
- **FR-005**: System MUST [resultado, ex.: somar consumo semanal por produto]

*Example of marking unclear requirements:*

- **FR-006**: System MUST resolve [política de frequência confirmada no clarify]
- **FR-007**: System MUST use [política de duração confirmada no clarify]

### Key Entities *(include if feature involves data)*

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Resultado verificável, ex.: 1 g/L × 10 L resulta em 10 g por aplicação]
- **SC-002**: [Resultado semanal verificável com dose, volume e contagem explícitos]
- **SC-003**: [Fluxo de seis etapas utilizável nas larguras de referência, sem login]
- **SC-004**: [Resumo por produto coincide com a soma das semanas aplicáveis]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Usuário utiliza navegador; explicitar limites da sessão transitória]
- [Mobile, tablet e desktop fazem parte do MVP]
- [Sem contas ou persistência de cultivos]
- [Dependência: arquivos oficiais e respostas às dúvidas de regra]

## Sources & Rule Provenance (RAIZORA)

Identificar fontes recebidas e ausentes, versão/referência e status de conferência.
Para cálculo: tabela oficial → confirmação explícita do responsável; PDF e layout
não definem matemática. Registrar dados transcritos separadamente de dados auditados.
Documentar dose, unidade, estágio, semana, via, frequência e estados de ausência.
Não inferir regras nutricionais para preencher lacunas.

## Open Questions & Divergences (RAIZORA)

Vincular registro com IDs, BLOCKER/IMPORTANT/OPTIONAL, impacto e responsável.
Não limitar ou responder automaticamente dúvidas de regra para satisfazer defaults.
Conferência das fontes e BLOCKERs resolvidos são gates para planejar o MVP.
Manter Draft quando pendências afetarem requisitos/aceite; não prometer readiness.
