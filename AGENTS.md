# Instruções do projeto RAIZORA

## Context7

Use Context7 MCP para documentação atual de bibliotecas, frameworks, SDKs, APIs,
CLIs e serviços cloud, inclusive sintaxe, configuração, migração e setup.
Sempre começar com `resolve-library-id` usando nome e pergunta completa, salvo ID
exato `/org/project` informado pelo usuário. Selecionar por nome, relevância,
snippets, reputação e benchmark; usar versão específica quando aplicável.
Depois executar `query-docs` com a pergunta completa. Preferir fontes oficiais.
Não usar para refatoração, scripts próprios, lógica de negócio, revisão de código
ou conceitos gerais de programação.

## Multi-agent

Orchestrator responde por estratégia, implementação, integração, validação e entrega.
Manter trabalho curto/sequencial no principal. Só principal e worker podem mutar
o repositório; explorer, researcher e architect retornam pareceres advisory.
Sandbox efetivo da sessão prevalece sobre defaults dos papéis.

Usar architect antes de plano substancial, após recorrência do mesmo fracasso depois
de tentativa de correção e antes de declarar trabalho substancial completo. Inclui
arquitetura, mudanças entre camadas, migrações, autenticação, segurança, integrações,
refatorações amplas, concorrência, transações e mudanças difíceis de reverter.
Solicitar achados concretos; principal decide e implementa.

Explorer: descoberta e rastreamento. Researcher: documentação e referências.
Worker: implementação/testes delimitados, com objetivo, escopo, arquivos prováveis,
aceite e exclusões. Paralelizar apenas investigações independentes; workers não
editam os mesmos arquivos simultaneamente. Integrar e validar no principal.

Ler specs e planos existentes quando relevantes. Antes de concluir, verificar
aceite, tarefas, regressões, testes e arquivos alterados; incluir documentos
pertinentes na revisão final do architect.

## Autoridade e escopo

Ler `.specify/memory/constitution.md`, `specs/001-raizora-mvp/spec.md` e
`specs/001-raizora-mvp/open-questions.md` antes de trabalho relacionado ao MVP.
RAIZORA é independente; Plantas que Curam é parceiro. Regras oficiais são dados,
sem condicionais de fabricante na UI/núcleo. Tabela define cálculo, PDF define
contexto e layout define referência visual. Não inventar regra, extrapolar duração
ou aplicar “orgânico −60%”. Speed Vega fica fora do motor inicial.
Não criar backend, banco ou autenticação.

Estado atual: **MVP COMPLETE**, feature `001-raizora-mvp` com 84/84 tarefas
concluídas. Domínio/schedule/engine e reducer/validação aprovados preservados.
Landing → Configuração → Produtos → Plano → Receita → Resumo implementados;
294 testes passam e lint/typecheck/build/browser smoke PASS. Evidências em
`specs/001-raizora-mvp/implementation-review.md` e `evidence/browser-smoke.json`.
OQ-001–OQ-012 resolvidas; OQ-013 opcional/diferida (copy/assets antes de publicação).
Specs/reviews de planejamento são snapshots históricos. Não iniciar V2, deploy
ou outra rodada automaticamente. Respeitar o escopo explicitamente autorizado.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/002-raizora-v1-1/plan.md
<!-- SPECKIT END -->

## Decisões vigentes do MVP

SRC-007 substitui duração variável e input foliar editável anteriores. Não reabrir
essas decisões sem contradição objetiva. Duração8+8 pertence ao FeedingSchedule
atual; Product não tem frequência global. Configuração possui somente volumes
por preparo e fertigationApplicationsPerWeek global. Frequência foliar vem da regra.
NOT_APPLICABLE confirmado não gera evento/zero ou incompletude; NO_RULE esperado
e desconhecido impede total definitivo. Receita é por preparo, separada por via.
