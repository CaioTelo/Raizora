# RAIZORA v1.1 — execução e validação local planejadas

**Data**: 2026-10-08 · Guia para futura implementação/QA autorizados.
Nesta rodada documental os comandos e cenários abaixo não foram executados como
validação da v1.1. Código atual ainda implementa o MVP e contém três inputs/tabela desktop.

## Preparação

Usar Node.js24.x conforme `.nvmrc` e npm; preservar package-lock e dependências.
Sem chave, backend, banco ou serviço externo. Na raiz do projeto:

```bash
npm ci
npm run dev
```

`npm ci` só é necessário se dependências não estiverem instaladas. No sandbox,
usar cache gravável quando necessário, conforme orientação do repositório.
Abrir `http://localhost:3000/`, iniciar calculadora e seguir seis telas existentes.
Não esperar comportamento v1.1 antes de implementação autorizada.

## Checks automatizados depois da implementação

```bash
npm run test:unit
npm run test:ui
npm run lint
npm run typecheck
npm run build
```

`npm test` executa as duas suites em conjunto e pode substituir as duas primeiras
chamadas, evitando repetição sem necessidade. Scripts são os do package.json
existente, sem runner/dep novo. `typecheck` gera tipos Next antes de tsc; build
usa webpack conforme baseline. Para conferir build de produção, parar dev na
mesma porta e então executar `npm run start`.

## Cenário integrado — configuração e navegação

1. Conferir dois inputs: 10 L fertirrigação e2 L foliar. Ajuda de10% legível e
   associada ao campo, com os exemplos de 10% preservados como texto estático;
   sem capacidade de vaso, duração ou input/erro de frequência.
2. Manter cinco produtos e avançar. Plano mostra duração8+8=16 e uma fertirrigação
   planejada/semana; somente Vegetativo1 está detalhado em cada largura.
3. Verificar Joker1g/L,10g/preparo,10g/semana. Ir a Vegetativo3: Coringa5ml/L,
   10ml/preparo,2 aplicações prescritas e20ml/semana.
4. Navegar Vegetativo8→Floração1→Vegetativo8. Extremidades Vegetativo1/Floração8
   não circulam. Select direto de estágio em semana8 preserva8; selecionar
   Floração5 diretamente apresenta os valores correspondentes, sem percorrer intermediárias.
5. Confirmar que Anterior/Próxima não submetem form/avançam à Receita; teclado,
   foco/status da semana, rótulos e controles permanecem previsíveis.
6. Avançar a Receita, mudar semana, voltar ao Plano e conferir seleção compartilhada.
   Resumo: Joker260g, Coringa160ml, Plant Protein596ml, Terpeno32ml, Tricomax100g.
7. Voltar, editar volumes/seleção e reconferir resultados atuais. Volume inválido
   não deixa plano anterior utilizável. Seleção vazia bloqueia. Sem produtos
   ACTIVE/FOLIAR, volume foliar ausente não bloqueia; reativar foliar volta a exigir.

## Regressões por fronteira

| Área/suites existentes | Mudança/cobertura futura |
| --- | --- |
| `tests/unit/calculator-reducer.test.ts` | Draft de duas strings; transições atômicas e limites, sem resets de seleção |
| Nova suite unit de navegação | Helper puro:16 posições, ambos sentidos, contagens sintéticas, invalidade e nenhum wrap |
| `tests/ui/configuration.test.tsx`, `use-calculator.test.tsx` | Retirar coleta de count; input canônico1; volumes, gate foliar/foco, edição e invalidação |
| `tests/ui/plan.test.tsx` | Retirar expectativas de tabela comparativa; cards únicos, duração, fontes, controles e N/A/NO_RULE |
| `tests/ui/calculator-wizard.test.tsx`, `recipe.test.tsx`, `summary.test.tsx` | Integração com frequência um e filtro compartilhado; política planejada versus frequência prescrita |
| Nova suite UI de PrintPlan | Conteúdo16 semanas, fontes/totais/estados; frequência e valores canônicos; mock print, ausência de submit/reset |
| Suites unit de calculation/validate-input/feeding-schedule | Preservar referências genéricas count3, precisão/unidades, matriz oficial e contrato de incompletude |

Manter fixtures genéricas explícitas com3; criar/adaptar fixtures de aplicação com1
sem trocar todos valores indiscriminadamente. V11-01–06/V11-CICLO e REG-01–03
da [spec](spec.md) são oráculos. Não escrever testes que simplesmente espelham
o JSX/CSS; conferir resultados/efeitos de interação significativos.

## Responsividade e acessibilidade em browser real

Verificar360/768/1280px e intervalos640/1024, com janela estreita/reflow equivalente
a zoom200%. Somente semana ativa no Plano, sem overflow da página; desktop usa
largura para agrupar produtos da mesma semana. Confirmar Resumo/Receita intactos.
Tab/Shift+Tab/Enter/Espaço, disabled nas bordas, labels/help/errors, foco, status
curto da semana e ausência de conteúdo print oculto na árvore acessível de tela.
Browser smoke deve registrar versão, larguras, resultado e limitações reais.

## Prévia A4 e salvar PDF

1. Com configuração válida, escolher Floração4 e acionar Imprimir plano completo.
   Conferir que o diálogo nativo abre uma vez sem submissão da etapa.
2. Selecionar papel A4 retrato, escala100% e margens definidas pelo documento
   quando suportadas. Registrar se o navegador exigir configuração manual.
3. Salvar como PDF pelo destino nativo quando disponível; conferir todas páginas,
   não apenas primeira: Vegetativo1–8 e Floração1–8 em ordem, nenhuma duplicada/omitida.
4. Conferir colunas, unidades, volumes por preparo, frequências, preparo/semanal,
   N/A/não uso, identidade/fontes/versão, total16 e agregados V11-CICLO. Estágio e
   semana precisam permanecer identificáveis em continuações pelo thead contextual.
5. Confirmar ausência de controles/inputs e de corte, scroll ou sobreposição.
   Imprimir com fundos desativados e verificar que estados continuam legíveis.
6. Cancelar/concluir e conferir mesma etapa/semana/volumes/produtos. Repetir com
   outra semana ativa: o conteúdo completo não muda. Ctrl+P em PLAN válido usa
   a mesma representação; não é requisito imprimir Plano completo de outras etapas.
7. Repetir com subset de produtos, decimais/subcentésimos e fixture sintética de
   NO_RULE, incluindo textos/fontes longos para forçar continuação. Nenhum definitivo
   afetado no incompleto; subtotais somente quando identificados.

Fixture incompleta em browser deve ser montada em harness temporário de teste,
fora da aplicação pública, usando PrintPlan/motor existentes e fixture sintética.
Não alterar matriz oficial, criar rota de simulação entregue ou substituir fonte
nutricional. Esse harness é infraestrutura temporária de QA, não nova funcionalidade.
Não há comando pronto desse harness nesta rodada, pois implementação/testes ainda
não foram criados. Registrar como a evidência foi produzida quando executado.

Usar ao menos Chromium e conferir impressão em Firefox/WebKit/Safari da baseline
no ambiente disponível; cobertura indisponível deve ser declarada, sem alegar PASS.
Correção de paginação/A4 é gate de aceite; mock de window.print não a substitui.
Não há obrigação de número fixo de páginas, impressora física ou exportador PDF próprio.

## Evidências e continuidade

Após execução autorizada, registrar checks, versões de browser, capturas/PDF e
comparação de valores em documentos/evidências da v1.1, preservando os do MVP.
Fonte de verdade dos contratos: [configuração](contracts/configuration.md),
[navegação](contracts/navigation.md), [impressão](contracts/printing.md).
Este guia não autoriza tasks/implement; a próxima etapa depende de aprovação.
