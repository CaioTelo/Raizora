# RAIZORA MVP — quickstart de desenvolvimento e validação

Atualizado: 2026-10-07. **MVP COMPLETE — 84/84 tasks**. Os comandos e cenários
abaixo correspondem à aplicação implementada. Evidências executadas em
[implementation-review](implementation-review.md) e [browser-smoke](evidence/browser-smoke.json).

## Pré-requisitos

Node.js 24.x e npm; checkout do repositório com package.json e package-lock.json.
Dependências efetivas estão fixadas no lockfile e seguem as famílias do [plan](plan.md). Nenhuma chave, .env, conta, banco ou API é necessária.
Antes de alterar código, ler [spec](spec.md), [modelo](data-model.md) e
[contratos](contracts/calculation.md). Fontes oficiais são referência documental,
não entrada runtime do cálculo. Preservar AGENTS/specs ao preparar aplicação.

## Instalação e desenvolvimento

Na raiz do checkout:

```bash
npm ci
npm run dev
```

npm ci utiliza o lockfile existente; nenhuma configuração de serviço é necessária.
Dev abre normalmente http://localhost:3000; usar endereço exibido pelo terminal se
a porta estiver ocupada. `/` mostra landing; CTA leva a `/calculadora`.
Inputs numéricos começam vazios; todos os cinco produtos estão selecionados.
Não há login nem restauração de cultivo após refresh.

## Checks e testes

Executar independentemente na raiz:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:ui
```

lint usa ESLint CLI (sem next lint); typecheck gera tipos de rota via next typegen
e depois tsc --noEmit, para funcionar em checkout limpo sem dev/build anteriores.
Unit é Vitest projeto unit/Node; UI é Vitest projeto ui/jsdom, não testes de viewport
real. Todos juntos: `npm test`; iteração local: `npm run test:watch`.
Falhas de referência matemática, tipagem, validação ou integração impedem entrega.

## Build e preview de produção

```bash
npm run build
npm run start
```

Build Next convencional, não output export. Executar start com servidor dev parado
para liberar a porta. Verificar `/` e acesso direto `/calculadora` no preview.
Fontes locais, dataset estático, sem env/secrets necessários. O build convencional é compatível com Vercel/equivalente. Publicação exige
uma rodada autorizada própria.

## Cenário principal — C-005

1. Abrir `/`, verificar RAIZORA independente/parceiro identificado e iniciar.
2. Informar fertirrigação 10 L/preparo, 3/semana, foliar 2 L/preparo. Pode usar
   `10,5` para verificar parser decimal em cenário separado; não confundir com C-005.
3. Em Produtos, verificar os cinco defaults e ausência de Speed Vega calculável.
4. Em Plano, vegetativo S1 Joker: dose1 g/L, quantidade10 g/preparo e consumo30 g/semana
   com rótulos distintos. Vegetativo S3 Coringa:5 ml/L,10 ml/preparo,20 ml/semana,
   frequência prescrita2. Terpeno S7:6 ml/semana.
5. Em Receita vegetativo S4: grupo fertirrigação 10 L com Joker20 g; grupo foliar
   2 L com Coringa10 ml, Protein6 ml e Terpeno2 ml. Frequências são informativas;
   receita não mostra60 g como quantidade do preparo de Joker.
6. Em floração S4 conferir Joker90 g/semana; S5 Protein240 ml/semana e Tricomax30 g/semana.
7. Em Resumo, confirmar os números abaixo e ausência de incompletude.

| Produto | Vegetativo | Floração | Ciclo |
| --- | --- | --- | --- |
| Joker | 420 g | 360 g | 780 g |
| Coringa Blend | 160 ml | N/A, sem número | 160 ml |
| Plant Protein | 96 ml | 1.500 ml | 1.596 ml |
| Terpeno Plus | 32 ml | N/A, sem número | 32 ml |
| Tricomax | N/A, sem número | 300 g | 300 g |

Rótulos “—” precisam de motivo acessível, não zero. Valores do exemplo não são
defaults agronômicos. Resultado completo e fontes/versionamento identificáveis.

## Cenários de validação/estado

- Campos fertirrigação vazios,0,negativo,texto e contagem1,5 bloqueiam; mensagem
  associada ao campo e foco correto. Volumes0,75/10.25 válidos, contagem1 válida.
  Expoente,hexadecimal e separador de milhar misto são inválidos conforme parser.
- Foliar vazio deve permitir chegar a Produtos. Manter foliares bloqueia Plano e
  oferece voltar ao input; retornar preserva seleção. Deixar só Joker/Tricomax
  permite cálculo sem foliar. Reativar foliar exige volume válido outra vez.
- Desmarcar tudo bloqueia avanço com erro textual; voltar não reaplica defaults.
- Voltar aos campos e alterar volume/count/seleção atualiza resultados; sem consumo
  de desmarcados, sem redistribuição ou resultado anterior. Novos defaults só em nova montagem.
- Trocar filtro estágio/semana funciona e receita agrupa somente ACTIVE/via. N/A ao
  estágio e não uso semanal não criam linhas de receita ou consumo zero.
- Refresh em qualquer etapa reinicia Configuração. URL direta/compartilhada não
  contém cultivo; Back do navegador segue rotas. Voltar interno mantém dados.
- Erros numéricos/NO_RULE são verificados por fixtures de unit/UI; não criar
  editor de schedule ou manipulação de dados na interface para testá-los.

## Responsividade e acessibilidade — browser real obrigatório

Em360,768,1280 px e larguras intermediárias (ex.:640/1024), repetir jornada.
Mobile: cards/coluna e controles legíveis. Tablet: grids úteis. Desktop: comparação
semanal tabular, receita lado a lado e resumo com largura aproveitada. Sem corte,
sobreposição ou overflow horizontal da página; somente tabela com scroll local
nomeado e acesso por teclado. Verificar zoom200%, nomes/unidades longos e erros.

Usar somente teclado para checkbox, inputs, selects, Voltar/Avançar; verificar
foco visível e heading após mudança de etapa. Conferir labels, legend, mensagens,
caption/th scope, contraste e semântica de “—” com leitor de tela disponível.
Repetir jornada no build de produção para rotas/refresh/hidratação; ausência de
erros no console e de pedidos remotos para obter regras. jsdom não substitui isso.

Browser/versão, viewports, cenários e resultados estão registrados na revisão de
implementação e no JSON de evidência. O smoke foi executado no build convencional.
Nenhuma suíte Playwright ou configuração de hosting é exigida pelo plano inicial.

## Gates da entrega

lint/typecheck/unit/ui/build passam; cenários acima verificados no browser;
SC-001–SC-007 atendidos, todos14 princípios e arquivos alterados revisados.
OQ-013 só exige revisão de copy/assets antes da publicação, sem bloquear cálculo.
Entrega: lint/typecheck/test:unit/test:ui/npm test/build PASS; 294 testes GREEN.
Browser: Chrome 155, cinco larguras e reflow equivalente a zoom 200%; leitor de
tela não instalado (árvore acessível verificada). 84/84 tasks concluídas, sem deploy.
OQ-013 continua diferida e nenhum trabalho de V2 foi iniciado.
