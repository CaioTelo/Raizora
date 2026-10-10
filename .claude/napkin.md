# Napkin Runbook

## Curation Rules
- Priorizar orientações recorrentes em cada leitura; remover duplicatas e itens obsoletos.
- Máximo de 10 itens por categoria; cada item contém data e ação explícita.

## Execution & Validation (Highest Priority)
1. **[2026-10-02] Respeitar gates SDD e o escopo da rodada.**
   Do instead: consultar constitution/spec/dúvidas e confirmar BLOCKERs resolvidos antes de
   plan; seguir a fase autorizada. MVP 001 completo: não iniciar V2/deploy automaticamente.
2. **[2026-10-02] Identificar feature independentemente da branch.**
   Do instead: usar `.specify/feature.json`; o Spec-Kit pode retornar `BRANCH_NAME`
   sem criar branch Git. Conferir a branch real antes de relatá-la.
3. **[2026-10-04] Distinguir snapshots SDD de continuidade atual.**
   Do instead: preservar spec/OQs/reviews históricos; consultar tasks/README/AGENTS
   para a etapa atual, sem reabrir decisões por um status antigo. Em TDD paralelo,
   verificar suites concluídas no gate local e exigir tudo GREEN no join final.
4. **[2026-10-07] Gate foliar depende da seleção do ciclo.**
   Do instead: permitir foliar pendente em Configuração→Produtos; exigir no gate
   Produtos→Plano se houver regra ACTIVE/FOLIAR selecionada em qualquer semana.
   Sem foliares, omitir volume canônico e preservar somente o draft local.

## Domain Behavior Guardrails
1. **[2026-10-02] Separar parceiro, contexto e autoridade matemática.**
   Do instead: modelar RAIZORA independente, regras por cronograma e doses somente
   da tabela oficial/confirmação explícita; PDF/layout não prescrevem doses.
2. **[2026-10-02] Não completar lacunas nutricionais.**
   Do instead: respeitar SRC-007: duração8+8 do schedule, frequência foliar prescrita e sem
   fator orgânico; distinguir NO_RULE, N/A confirmado, não uso semanal e deseleção.

5. **[2026-10-10] Validar elementos de tela separadamente da impressão oculta.**
   Do instead: em harnesses browser, contar tabelas/cards dentro de `.calculator-screen`;
   conferir PrintPlan pelo modo print e comparar produtos nas linhas, não nas fontes.

## Shell & Command Reliability
1. **[2026-10-07] Cache npm precisa estar na área gravável.**
   Do instead: em instalações no sandbox, usar `--cache /tmp/raizora-npm-cache`;
   não alterar permissões do cache pessoal.
2. **[2026-10-07] Next pode gerar instruções de agente automaticamente.**
   Do instead: preservar `agentRules: false` no next.config e usar os artefatos
   aprovados/Context7; não deixar o dev substituir instruções do projeto.
3. **[2026-10-02] Integração Codex em pasta protegida.**
   Do instead: não contornar proteções de `.agents`; usar escalada específica para
   setup autorizado. Templates compartilhados e specs ficam na área gravável.
