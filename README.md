# RAIZORA

Plataforma independente para planejamento de nutrição e regas de cultivo.

## Estado do projeto

**MVP COMPLETE** — 84/84 tarefas concluídas. Fluxo público funcional:
Landing → Configuração → Produtos → Plano → Receita → Resumo.

`/calculadora` preserva inputs, seleção e filtros durante a navegação. Refresh
reinicia o estado. Plano diferencia dose oficial, preparo e consumo semanal;
Receita separa fertirrigação/foliar com quantidade de um preparo; Resumo apresenta
totais por produto/estágio/ciclo, preservando unidades e completude canônicas.

A feature [001-raizora-mvp](specs/001-raizora-mvp/spec.md) segue os artefatos
aprovados, sem reabrir decisões. Evidências executáveis em
[implementation-review.md](specs/001-raizora-mvp/implementation-review.md).
As fontes foram auditadas e OQ-001–OQ-012 resolvidas; OQ-013 segue opcional/diferida.

A feature [002-raizora-v1-1](specs/002-raizora-v1-1/spec.md) foi aprovada funcionalmente
e teve o planejamento técnico consolidado; a próxima etapa tasks aguarda autorização.
O [plano](specs/002-raizora-v1-1/plan.md) segue a constituição 2.0.0; decisões, limites
e validação documental estão em [planning-review.md](specs/002-raizora-v1-1/planning-review.md).
A v1.1 ainda não foi implementada.

## Desenvolvimento e validação

Requer Node.js 24.x e npm. Nenhuma chave ou serviço externo é necessário.

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test:unit
npm run test:ui
npm test
npm run build
npm run start
```

`dev` e `build` usam o compilador Webpack do Next.js; `typecheck` gera tipos de
rota antes do TypeScript strict. `start` serve o build convencional. Pare `dev`
antes de iniciar `start` na mesma porta. Versões efetivas estão fixadas no lockfile.
Vitest separa unit/Node e UI/jsdom: 294 testes passam (226 unit + 68 UI).
Lint, typecheck, testes e build PASS. Smoke do build de produção no Chrome 155:
jornada completa em 360/640/768/1024/1280 px, teclado, edição, refresh/Back,
contraste e reflow equivalente a zoom 200%. Sem overflow da página ou erros de
console/hidratação. Leitor de tela não instalado; árvore acessível inspecionada.
Relatório em [implementation-review](specs/001-raizora-mvp/implementation-review.md).
Capturas, PDFs e resultados JSON em `specs/*/evidence/` são arquivos locais
ignorados pelo Git; os scripts de validação e relatórios Markdown são versionados.

## Artefatos aprovados

- [Plano técnico](specs/001-raizora-mvp/plan.md)
- [Decisões técnicas](specs/001-raizora-mvp/research.md)
- [Modelo de domínio](specs/001-raizora-mvp/data-model.md)
- [Quickstart do MVP](specs/001-raizora-mvp/quickstart.md)
- [Contrato de cálculo](specs/001-raizora-mvp/contracts/calculation.md)
- [Contrato do wizard](specs/001-raizora-mvp/contracts/wizard.md)

- [Constitution v2.0.0](.specify/memory/constitution.md)
- [Dúvidas classificadas](specs/001-raizora-mvp/open-questions.md)
- [Revisão multi-agent e fontes](specs/001-raizora-mvp/review.md)
- [Checklist de requisitos](specs/001-raizora-mvp/checklists/requirements.md)

## Spec-Kit

Inicializado com o CLI do ambiente, **0.11.10.dev0**, integração Codex por skills e
scripts Bash. Templates são assets locais dessa versão.
Comando: `specify init --here --force --integration codex --script sh`.
`--force` foi usado após inspeção do diretório vazio de arquivos de projeto.
Esse setup inicial do Spec-Kit não instalou dependências da aplicação.

Feature criada pelo script oficial `create-new-feature.sh`, com número 1 e short name
`raizora-mvp`. Nesta versão, o diretório é independente da branch Git:
`.specify/feature.json` identifica a feature; a branch real permanece `master`.
Não foram criados commits. `BRANCH_NAME` no JSON do script não comprova checkout.

A implementação autorizada do MVP foi concluída. Não iniciar V2 ou publicar
automaticamente. Spec/open-questions/review/checklist preservam snapshots de
planejamento; o estado executável atual está em tasks.md e implementation-review.md.
OQ-013 continua opcional/diferida: copy/assets são provisórios e precisam de revisão
antes de publicação, sem impedir a conclusão funcional do MVP.

Fontes de referência auditadas: `Layout_celular.jpeg`, `tabela_nutricional.jpeg`
e `base_conhecimento_plantas_que_curam_ia.pdf` (seis páginas). Os originais são
mantidos apenas localmente e ignorados pelo Git; não são necessários para executar
a aplicação ou seus testes. Links para esses arquivos nas specs exigem uma cópia
local. A spec identifica fontes e SHA-256; a revisão registra evidências e
divergências. Dados oficiais, decisões do responsável e propostas permanecem separados.

## Direção técnica

Next.js, TypeScript e Tailwind CSS; motor determinístico separado da UI, regras em
dados por marca/cronograma e estado transitório. Sem backend, banco, autenticação ou
persistência. Escolhas no plano: Next16/App Router, React19, TS5 strict, Tailwind4; duas rotas,
useReducer local, engine pura e Vitest/Testing Library.

## MVP confirmado

Inputs: volume por preparo de fertirrigação (L, >0, decimal), fertirrigações por
semana (global, inteiro >=1) e volume por preparo foliar (L, >0, decimal, obrigatório
com produtos foliares selecionados). Cinco produtos pré-selecionados; vazio bloqueia.

Schedule atual: vegetativo 8 + floração 8, sem edição. Sem tipo de cultivo/fator
orgânico ou input de frequência foliar. FIXED_PER_WEEK vem da regra semanal;
EVERY_FERTIGATION usa a contagem configurada. Plano mostra dose/L, receita mostra
um preparo por via, resumo soma consumo do ciclo sem arredondar intermediários.
Esses limites pertencem à versão atual da feature/schedule, preservando multi-marca.

## Estrutura essencial

- `src/app/`: Landing, composição da calculadora e estilos responsivos.
- `src/domain/`: contratos, validação e motor puro de cálculo.
- `src/data/brands/plantas-que-curam/`: catálogo e schedule auditado de 80 posições.
- `src/features/calculator/`: reducer/controller, apresentação, componentes e views.
- `tests/unit/` e `tests/ui/`: referências matemáticas e integração do fluxo.
- `specs/001-raizora-mvp/`: baseline aprovado, tasks e evidências de entrega.
