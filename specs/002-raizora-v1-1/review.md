# RAIZORA v1.1 — revisão de clarify e consolidação

**Data**: 2026-10-08 · **Feature**: [spec.md](spec.md)

**Resultado**: revisão documental consolidada — **READY FOR PLAN**. Aprovação
funcional recebida do responsável; nenhuma execução de plan está autorizada.
Este registro não comprova implementação ou testes de software da v1.1.

## Escopo e autoria das decisões

O responsável aprovou funcionalmente os cinco refinamentos e determinou nesta
sessão o ajuste pontual de IX, a busca/resumo do relatório e a consolidação.
O principal integra os documentos e verifica evidências; architect atua somente
como revisor advisory. Nenhuma pergunta adicional foi necessária: **zero perguntas**,
três consolidações de decisões fornecidas registradas em Clarifications da spec.

## GOV-V11-001 — alteração constitucional autorizada

**Origem**: instrução explícita do responsável, seção “Princípio IX da constituição”
da solicitação de clarify/consolidação de 2026-10-08. Resolve OQ-V11-001.

**Antes (1.0.1, IX)**: telas amplas deveriam aproveitar largura para comparação
semanal e agrupamento. Isso conflita com R3, que limita detalhamento a uma semana.

**Depois (2.0.0, IX)**: semana selecionada por vez; navegação desktop/mobile;
acesso a todas as semanas, atualmente 16 (8+8); transição Vegetativo 8 ↔ Floração 1
contínua nos dois sentidos; impressão do ciclo inteiro independente da semana
ativa; matriz e engine preservadas. Permanecem uso da largura, agrupamento,
legibilidade, teclado e rótulos que não dependem apenas de cor.

**Justificativa de versão**: **MAJOR, 1.0.1 → 2.0.0**, conforme Governance, por
substituição incompatível de orientação normativa: o comportamento desktop antes
obrigatório deixa de ser permitido na consulta semanal v1.1. Não é PATCH de texto
nem apenas expansão MINOR. Versão constitucional não é versão do produto v1.1.

**Datas**: ratificação original 2026-10-02 preservada; última alteração 2026-10-08.
**Limite**: somente IX, comentário Sync Impact Report e metadados de versão/data
alterados na constituição. I–VIII, X–XIV e demais seções permanecem idênticos.

**Propagação**: spec, OQs, checklist e README sincronizados; resumo e este review
criados. Templates spec/plan/tasks foram lidos: nenhum exige comparação simultânea
ou nova seção, portanto não precisam de alteração. Diretório
`.specify/templates/commands/` não existe. AGENTS.md descreve a baseline executável
do MVP e não precisa ser reescrito. Nenhum documento de `001-raizora-mvp` foi alterado.

O plano/reviews históricos seguem sua baseline constitucional 1.0.1; não são
alegados como aprovação ou conformidade da implementação futura da v1.1.

## OQ-V11-002 — relatório técnico e resumo substitutivo

Original não localizado em inventário e busca textual local. Método, limites e
decisões já confirmadas estão em [technical-decisions.md](technical-decisions.md).
O resumo foi criado nesta rodada conforme alternativa expressamente autorizada;
não recupera o original nem inventa aprovação, caminho, autoria ou evidência.
A ausência original permanece registrada como limitação histórica, sem pendência
documental impeditiva para plan.

## Cobertura dos 20 requisitos e cinco histórias

Os corpos dos 20 FR, cinco histórias, casos de referência e nove SC foram
preservados integralmente nesta consolidação. Apenas status, esclarecimentos,
fontes e encaminhamento de governança foram atualizados na spec.

| Requisito | História/cenários de aceite existentes | Critério/fixture |
| --- | --- | --- |
| FR-001 | H1.1 | SC-001 |
| FR-002 | H1.2 | SC-001 |
| FR-003 | H1.3; H3.1–2 | SC-002 |
| FR-004 | H2.1–2 | SC-003 |
| FR-005 | H2.3–4 | SC-004 |
| FR-006 | H2.5–6 | SC-003/004 |
| FR-007 | H2.6–7 | H5.1; V11-CICLO |
| FR-008 | H4.1 | SC-005 |
| FR-009 | H4.1–2/4/6 | SC-005/006 |
| FR-010 | H4.3/5 | SC-005/006 |
| FR-011 | H4.7 | SC-005 |
| FR-012 | H4.8–9 | SC-006 |
| FR-013 | H1.3–4/6/8 | V11-01/02/05/06; SC-007 |
| FR-014 | H1.4; H4.3 | SC-005/006 |
| FR-015 | H5.2 | REG-01/02; SC-008 |
| FR-016 | H1.5 | V11-03/04; SC-008 |
| FR-017 | H1.6–8; H3.1; H5.1–2 | V11-CICLO; REG-01/02 |
| FR-018 | H4.4–6; H5.3 | REG-03; SC-009 |
| FR-019 | H1.4–5; H4.2–3; H5.1 | V11-01–06; V11-CICLO; SC-006/007 |
| FR-020 | H1.1/6; H2.2/8; Edge Cases | SC-001/003/004 |

H1–H5 correspondem às cinco User Stories, e Hn.m ao cenário numerado nessa história.
Não foram introduzidos requisitos funcionais nem histórias, novas prescrições,
alterações de fórmulas ou decisões antecipadas de implementação.

## Varredura de ambiguidades e conflitos

| Categoria do clarify | Situação | Evidência/limite |
| --- | --- | --- |
| Escopo e comportamento | Clear | R1–R5, 20 FR, limites e aprovação funcional explícitos |
| Domínio e dados | Clear | Contratos existentes, duração 8+8, frequência um só na aplicação, foliares e estados preservados |
| Interação e UX | Clear | Semana única, seletores, extremos, transição entre estágios, Receita compartilhada, erros e teclado |
| Atributos de qualidade | Clear no escopo | Responsividade, legibilidade A4, precisão e determinismo; sem novos SLAs ou serviços |
| Integrações e dependências | Resolved | Recursos nativos de impressão; relatório ausente/resumo autorizado; sem integração externa nova |
| Casos de borda e falhas | Clear | Cancelamento, invalidez, NO_RULE, ausência confirmada, seleção, arredondamento e fronteiras |
| Restrições e escolhas | Resolved | IX ajustado com governança; contratos preservados e escopo só documental |
| Terminologia e consistência | Clear | Dose/L, preparo, consumo semanal/ciclo; ACTIVE/NOT_APPLICABLE/NO_RULE |
| Sinais de conclusão | Resolved | Aceite rastreável, aprovação recebida e OQs resolvidas; início de plan ainda depende de autorização |
| Placeholders e pendências | Resolved | Sem marcadores de esclarecimento ou decisões funcionais pendentes |

Detalhes de solução pertencem à futura etapa plan; sua ausência agora não é
ambiguidade funcional nem autorização para antecipá-los. Não restaram questões
críticas, requisitos sem aceite ou conflitos vigentes no conjunto da v1.1.

## Validação documental e preservação

- Estrutura Markdown, links locais, IDs/contagens e rastreabilidade de FR/SC/histórias.
- Comparação de conteúdo com a baseline desta rodada: demais princípios/seções
  da constituição, 20 FR, cinco histórias e nove SC preservados.
- Conferência aritmética documental V11-CICLO: Joker 260 g; Coringa 160 ml;
  Plant Protein 596 ml; Terpeno 32 ml; Tricomax 100 g. Foliares seguem 16 aplicações.
- Integridade por SHA-256: PASS. Baseline de 133 arquivos, cinco documentos
  existentes alterados e outros 128 intactos; dois documentos da v1.1 criados.
  Código, testes, fontes, contratos e documentos históricos do MVP preservados.
- Checklist reavaliado: **23/25 → 25/25**; dois gates passaram, zero regressões,
  nenhum item ainda aberto. Aprovação de plan não integra essa contagem.
- Hooks before/after_clarify e before/after_constitution não existem em
  `.specify/extensions.yml`; nenhuma fase posterior ou hook opcional foi iniciado.
- Não foram executados testes de software, build, plan, tasks, implement ou commits.

Revisão final advisory do architect: **PASS — sem achados que exijam correção**.
Confirmados independentemente versão/rastreabilidade constitucional, preservação
dos demais princípios e dos corpos de FR/histórias/SC, resolução das OQs,
checklist, links e integridade da baseline. Revisão somente leitura, sem
interpretação de READY FOR PLAN como autorização para executar a próxima fase.

## Continuidade

**Pendências resolvidas**: OQ-V11-001 e OQ-V11-002; aprovação funcional registrada.
**Pendências restantes da v1.1**: nenhuma impeditiva. A ausência do relatório
original permanece declarada, com encaminhamento autorizado concluído. OQ-013 do
MVP continua opcional/diferida para copy/assets antes de publicação, fora desta rodada.

**READY FOR PLAN**, aguardando autorização explícita para `$speckit-plan`.
Nenhum arquivo de planejamento técnico ou tasks de desenvolvimento foi criado.
