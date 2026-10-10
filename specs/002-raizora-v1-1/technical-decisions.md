# RAIZORA v1.1 — resumo documental das decisões confirmadas

**Feature**: [002-raizora-v1-1](spec.md) · **Data**: 2026-10-08

**Natureza**: resumo posterior criado na etapa clarify, conforme instrução do
responsável. Não é o relatório técnico original, nova pesquisa ou plano de implementação.

## Situação do relatório original

O responsável informou a revisão/aprovação de um relatório técnico dos cinco
refinamentos. A busca local não encontrou um arquivo original correspondente.

Foram usados `rg --files --hidden` para inventário e `rg -n -i --hidden` para
buscar relatório/relatorio, análise técnica/analise tecnica, cinco refinamentos,
refinamentos e v1.1/v1-1. O inventário considerou arquivos do projeto e ocultos;
dependências, build e metadados Git foram excluídos. A busca de conteúdo
desconsiderou também infraestrutura de skills/agente e lockfile. Fontes binárias
conhecidas são a tabela, layout e PDF institucional do MVP, não identificadas
como relatório da v1.1. Não foi executada OCR ou auditoria binária nesta rodada.

Os resultados textuais referentes ao relatório estavam em spec, open-questions
e checklist da própria v1.1. Os reviews/research do diretório MVP tratam sua
baseline; não foram apresentados como relatório dos cinco refinamentos.
Não foram consultados serviços externos, arquivos pessoais fora do repositório
ou históricos de conversas como se fossem arquivos persistidos.

A conclusão é **original não localizado na busca documental local**, sem inventar
caminho, autor, data de emissão, conteúdo ou evidência de aprovação. A aprovação
funcional dos cinco refinamentos é a instrução explícita do responsável na sessão;
não é atribuída a um arquivo encontrado. OQ-V11-002 está resolvida pelo encaminhamento
alternativo autorizado: ausência registrada e este resumo criado.

## Base confirmada

- Solicitação de specify: identificador `002-raizora-v1-1`, R1–R5 e restrições.
- Solicitação de clarify/consolidação: aprovação funcional, ajuste pontual de IX,
  resumo documental na ausência do original e preservação de todos os invariantes.
- [Contrato de cálculo](../001-raizora-mvp/contracts/calculation.md),
  [wizard](../001-raizora-mvp/contracts/wizard.md),
  [modelo](../001-raizora-mvp/data-model.md) e fontes rastreadas na [spec do MVP](../001-raizora-mvp/spec.md).
- [Constituição 2.0.0](../../.specify/memory/constitution.md) e decisão GOV-V11-001
  em [review.md](review.md).

## Decisões consolidadas

| Decisão | Conteúdo já confirmado | Limite e referência |
| --- | --- | --- |
| R1 — orientação de volume | Ajuda aproximada de 10% da capacidade do vaso, opcional | Somente texto; sem input de capacidade, preenchimento, fórmula ou validação automática; FR-001/002 |
| R2 — duração no Plano | Retirar duração da Configuração e apresentá-la no Plano, derivada do schedule atual 8+8=16 | Não editável, não universal e sem mudar cobertura; FR-003 |
| R3 — consulta semanal | Uma semana selecionada por vez em desktop/mobile, anterior/próxima e seletores diretos | Todas as 16 acessíveis; Vegetativo 8 ↔ Floração 1 contínuo; extremos não circulares; filtro compartilhado com Receita; FR-004–007 |
| R4 — impressão completa | Recursos nativos do navegador, A4, todas as 16 semanas e informações de produtos/doses/preparo/consumo/vias/estados | Independente da seleção de semana, múltiplas páginas possíveis, produtos selecionados, contexto/totais existentes e sessão preservada; FR-008–012 |
| R5 — frequência planejada | Aplicação v1.1 fornece internamente uma fertirrigação por semana e remove input | Mantém campo/validação genéricos do motor e frequências foliares prescritas; uma não é prescrição nova do fabricante; FR-013–016 |
| Preservação transversal | Matriz, doses, fontes, fórmulas, vias, unidades, precisão e estados existentes | ACTIVE/NOT_APPLICABLE/NO_RULE e motivos; ausência não é zero, incompletude não é total definitivo; FR-017–020 |
| Governança IX | Substituir comparação simultânea por consulta semanal selecionada e preservar impressão completa | Constituição 1.0.1 → 2.0.0; demais princípios intactos; autorização explícita, não alteração silenciosa |

## Contratos e observações verificáveis

O [tipo da configuração](../../src/domain/calculation/types.ts) mantém
`fertigationApplicationsPerWeek`; o [motor existente](../../src/domain/calculation/calculate-plan.ts)
usa essa entrada para EVERY_FERTIGATION e a frequência da regra para FIXED_PER_WEEK.
Isso sustenta a distinção já aprovada entre política da aplicação e contrato genérico;
não define onde ou como implementar a política futura.

O [schedule existente](../../src/data/brands/plantas-que-curam/schedule.ts) contém
8+8 semanas, doses e foliares 1/1/2/2/2/2/3/3 no vegetativo. Ele foi consultado,
sem alteração ou nova auditoria da fonte binária. Casos V11-CICLO e REG da
[spec](spec.md) distinguem a entrada um da referência histórica com três.

Não foram escolhidos componentes, estratégia de impressão, estilos, estrutura de
arquivos futuros, bibliotecas, migração de estado ou estratégia nova de testes.
Essas decisões pertencem ao planejamento, quando autorizado, dentro dos critérios
já aprovados. Não há novo requisito funcional, código, tasks ou evidência de software v1.1.
