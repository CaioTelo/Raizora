# RAIZORA MVP — decisões de planejamento

Data: 2026-10-03. Escopo: planejamento sem aplicação, instalação ou tasks.
Autoridade funcional: [spec](spec.md), SRC-007 e constitution1.0.1.
Pesquisa técnica via Context7, resolve-library-id→query-docs e fontes oficiais; ECMAScript consultado diretamente.
Famílias de versões abaixo são escolhas, não alegação de patch “latest”. Patches estáveis/compatíveis/atualizados
serão fixados no package-lock.json na implementação. Este documento reflete as decisões finais do plan.

## R-001 — Stack e fronteira de renderização

**Decision:** Next.js16.x App Router, React19.x compatível, TypeScript5.x strict, TailwindCSS4.x;
Node24.x como toolchain e npm. Duas rotas: `/` landing estática; `/calculadora` com raiz client CalculatorWizard
para cinco etapas internas. Layout, metadata e páginas de composição síncronos/pré-renderizáveis.
Build CONVENCIONAL Next, sem output export; preview next start. Não criar Route Handlers/Server Actions/proxy.

**Rationale:** stack preferida, fronteira interativa pequena, apresentação pública leve e estado só no wizard.
Node24 satisfaz mínimo Next16 (20.9) e permite alinhar ferramentas de teste. Build convencional é compatível com
Vercel/equivalente sem hosting especializado; não cria backend dedicado ou serviço de cálculo.

**Alternatives Considered:** SPA Vite; Pages Router; export estático com output export; cálculo remoto.

**Why Rejected:** Vite não resolve lacuna da preferência; Pages Router sem requisito próprio; export exige
regras extras de imagens/preview sem necessidade de hosting exclusivamente estático; cálculo remoto adiciona
infraestrutura e latência. Não usar serve nem scripts de preview de out neste plano.

Fontes: [instalação Next](https://nextjs.org/docs/app/getting-started/installation),
[Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components),
[upgrade16](https://nextjs.org/docs/app/guides/upgrading/version-16),
[static exports — alternativa avaliada](https://nextjs.org/docs/app/guides/static-exports).

## R-002 — Estado e navegação

**Decision:** useReducer na raiz de /calculadora, props para views/componentes.
Estado: strings de rascunho, seleção, etapa e estágio/semana visualizados, interação dos erros.
Validação/resultado derivados sincronamente, sem cópia do resultado no reducer ou Effect de sincronização.
Sem Context, store externo, URL state ou History API por etapa. Landing fora da raiz client.

**Rationale:** poucas transições relacionadas ficam atômicas/testáveis. Voltar interno mantém dados enquanto
wizard montado. Refresh/sair da rota reinicia Configuração; compartilhar URL abre wizard novo sem dados.
Back do navegador segue rotas, não etapas. Não há requisito de persistência/deep-link de cultivo.

**Alternatives Considered:** vários useState; reducer+Context; Redux/Zustand; rota por etapa;
landing como slot do controlador interativo; estado em querystring/storage.

**Why Rejected:** estados separados ampliam coordenação; Context/store sem necessidade na árvore curta;
URLs exigem serialização/restauração; landing no wizard amplia client boundary. useMemo não é requisito de
correção/otimização inicial para80 slots; não adicionar cache.

Fontes: [useReducer](https://react.dev/reference/react/useReducer),
[estado derivado](https://react.dev/learn/you-might-not-need-an-effect).

## R-003 — Dados, estágios e cobertura

**Decision:** FeedingSchedule com catálogo, StageDefinition ordenadas e array plano de slots produto/estágio/semana.
StageDefinition é valor embutido com id/type/label/weekCount. StageType inicial VEGETATIVE/FLOWERING, sem OTHER.
WeekNumber é inteiro validado localmente, sem entidade persistida. RuleStatus ACTIVE/NOT_APPLICABLE/NO_RULE
com payload discriminado; NOT_APPLICABLE tem reason STAGE_NOT_APPLICABLE ou WEEK_NOT_USED.

**Rationale:**80 slots permitem conferir cobertura integral. Fixture:49 ACTIVE,24 N/A de estágio,7 não usos
semanais; sem NO_RULE. Reason preserva diferença FR-014; falta de slot não é N/A e deve produzir NO_RULE/MISSING.
ACTIVE implica confirmação/provenance; não confirmado vira NO_RULE/UNCONFIRMED sem dose calculável.

**Alternatives Considered:** somente regras ativas; ranges no runtime; hierarquia muito aninhada;
classes Stage/Week; quarto status NOT_USED; frequência global no produto.

**Why Rejected:** omitir posições esconde desconhecidos; ranges exigem resolver expansão/sobreposição;
aninhamento/classes não economizam para dataset pequeno; reason evita outro ramo matemático; frequência
em Product viola a spec. Transcrever ranges da spec em slots é permitido; extrapolar novas semanas não é.

## R-004 — Unidades e validação de domínio

**Decision:** literal unions e objetos discriminados Dose/Quantity. DosageUnit GRAM_PER_LITER/MILLILITER_PER_LITER
corresponde a QuantityUnit GRAM/MILLILITER; Product.quantityUnit deve ser compatível. Volume number nomeado em L.
Validator puro retorna issues tipadas e é compartilhado com UI/engine. Sem Zod/classes/branded types inicialmente.

**Rationale:** tipagem impede campos numéricos em N/A/NO_RULE e protege somas por unidade; validator cobre relações
IDs/catalog/dose/via/frequência/fontes. Não há payload remoto e schema library não elimina validação relacional.

**Alternatives Considered:** Zod; branded numeric types em todas operações; strings livres; validator por tela.

**Why Rejected:** custo/dependência sem schema externo; casts/aritmética ampliados; strings não protegem unidades;
duplicar validação cria divergência. Dose/unidade/via/frequência são dados, não condicionais de fabricante.

## R-005 — Number, limites e formatação

**Decision:** JavaScript Number sem biblioteca decimal. Operações/somas brutas, ordem stage→week→product.
Entradas finitas; contagem inteiro seguro. Multiplicação/soma não finita → NUMERIC_ERROR/OVERFLOW;
multiplicação de positivos que vira zero → UNDERFLOW; conversão textual a0/Infinity rejeitada como entrada inválida.
Sem limite arbitrário1e9, máximo agronômico, NUMERIC_RANGE ou arredondamento intermediário.

**Rationale:**49 regras ativas, cálculos positivos pequenos e exibição até2 casas não exigem precisão decimal
arbitrária. Number é aproximação binária: não prometer aceitar qualquer magnitude/algarismos sem perda.
Guards impedem resultados Infinity/zero falso. Decimais de teste usam tolerância explícita, não mutação da fórmula.

**Alternatives Considered:** decimal.js; escala fixa; racional BigInt; arredondar por regra; EPSILON universal.

**Why Rejected:** sem necessidade de decimal exato demonstrada; escala limita decimais; racional amplia contratos;
arredondar viola FR-013; EPSILON universal não resolve precisão dependente da magnitude.

Formatter separado usa Intl.NumberFormat pt-BR, minimumFractionDigits0, maximumFractionDigits2, halfExpand.
Somente apresentação; não alimentar engine com strings ou toFixed. Positivo que formataria zero aparece como
`< 0,01 g`/`< 0,01 ml`, com texto acessível de quantidade positiva; mantém valor bruto. N/A/NO_RULE nunca viram zero.
Exemplos:20→20,10.5→10,5,10.25→10,25,0.75→0,75,1.125→1,13,0.004→<0,01.
Empates seguem representação Number recebida por Intl, sem alegação de aritmética decimal exata.

Fontes: [Number](https://tc39.es/ecma262/#sec-ecmascript-language-types-number-type),
[Intl.NumberFormat](https://tc39.es/ecma402/#numberformat-objects).

## R-006 — Parser e gates de formulário

**Decision:** inputs text com inputMode decimal/numeric, labels/unidade, draft string.
Trim externo; volumes aceitam gramática `[0-9]+([.,][0-9]+)?`, contagem só `[0-9]+`.
Uma vírgula é normalizada a ponto; não truncar parseFloat/parseInt. Sem milhar/expoente/hex/sinal+.

| Texto | Volume | Contagem |
| --- | --- | --- |
| 0,75 /0.75 | Válido positivo | Inválido, contagem só dígitos |
| 1 /01 | Válido | Válido inteiro1 |
| 1,0 /1.0 | Válido volume1 | Inválido pela sintaxe de contagem |
| 1.000 | Decimal1, nunca milhar | Inválido pela sintaxe |
| .5 /,5 /1. /1, /+1 | Inválido, pedir0,5 ou1 | Inválido |
| 1.234,5 /1e3 /0x10 /texto | Inválido | Inválido |
| Espaços externos | Removidos por trim | Removidos por trim |
| Espaços internos | Inválido | Inválido |
| Vazio/0/negativo/não finito | Inválido se necessário | Inválido |

**Rationale:** entrada pt-BR previsível sem diferenças de input number entre browsers, sem limitar número
aprovado de casas. Mensagem informa que não se usam separadores de milhar. Inteiro seguro é limite técnico.
Configuração→Produtos valida só fert volume/count, permite foliar pendente. Produtos→Plano valida tudo conforme
seleção final. ACTIVE FOLIAR selecionado exige volume válido e retorno focalizado ao campo se ausente.
Sem foliar selecionado, adapter omite foliarVolumeLiters do input canônico e preserva/ignora draft irrelevante;
domínio valida qualquer opcional efetivamente recebido. Reativar foliar revalida antes do cálculo.

**Alternatives Considered:** bloquear Configuração com foliar vazio; segundo campo em Produtos;
HTML number como parser único; aceitar formatos locais ambíguos.

**Why Rejected:** bloqueio impede desmarcar foliares; duplicar campo duplica estado; HTML number é locale/browser
dependente; ambiguidade pode mudar volume. [Contrato](contracts/calculation.md) define codes; UI mapeia mensagens.

## R-007 — Testes, scripts e checks

**Decision:** Vitest4 projects unit/Node e ui/jsdom. UI com React Testing Library/DOM/user-event/jest-dom.
Vite/plugin React apenas no runner; alias @/ explícito para src, sem pacote extra de tsconfig paths.
Sem Playwright/V8 coverage inicialmente. Gates são ramos/casos obrigatórios do plan, sem percentuais arbitrários.
Browser manual obrigatório completa layout/rota real/contraste; não é substituído por jsdom.

**Rationale:** motor independente de React, integração do wizard barata e testável, poucos estados.
Componentes síncronos não esbarram na limitação de Vitest para async Server Components.
Scripts definidos em plan/quickstart: dev next dev; lint ESLint CLI; typecheck next typegen && tsc --noEmit;
test/test:unit/test:ui/test:watch Vitest; build next build; start next start.
Typegen gera next-env/tipos de rota em checkout limpo sem exigir dev/build anterior.

**Alternatives Considered:** Jest; Playwright para toda regra; zero integração UI; snapshots amplos;
threshold100%/95% ou ferramentas adicionais como gates iniciais.

**Why Rejected:** Jest duplica opção equivalente; browser completo custa instalação/CI sem requisito;
sem integração transições ficariam descobertas; snapshots não provam matemática/semântica; porcentagem não
substitui testes das referências/status/erros. Automação browser reavaliável apenas com lacuna concreta futura.

Fontes: [Next+Vitest](https://nextjs.org/docs/app/guides/testing/vitest),
[projetos Vitest](https://vitest.dev/guide/projects),
[environments](https://vitest.dev/guide/environment),
[Testing Library](https://testing-library.com/docs/react-testing-library/intro/),
[Next CLI typegen](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options).

## R-008 — Responsividade, conteúdo, privacidade e deploy

**Decision:** Tailwind4 mobile-first, breakpoints padrão sm40rem/md48rem/lg64rem/xl80rem/2xl96rem;
base16px corresponde a640/768/1024/1280/1536px. Sem biblioteca UI, fontes remotas obrigatórias ou redesign.
SRC-003 orienta fundo claro/verde/cards; RAIZORA principal, parceiro provider. Placeholders/content separados,
sem claims comerciais/nutricionais novos. Build convencional Next, não configurar hosting nesta rodada.

**Rationale:** conserva referência e OQ-013 deferred. Tailwind4 requer browsers modernos
Safari16.4+,Chrome111+,Firefox128+ conforme docs. Fontes locais não exigem rede no build.
Deploy Vercel/equivalente não precisa serviço stateful. Sem dados pessoais, storage, analytics invasivo ou secrets.

**Alternatives Considered:** design system externo; pacote ícones/fontes; breakpoints customizados;
static export/hosting exclusivo.

**Why Rejected:** não trazem ganho demonstrado neste fluxo pequeno; tokens CSS/componentes semânticos bastam;
defaults atendem aceite; export não é requisito e complicaria preview/imagens. Sem serve/out no modo escolhido.

Fontes: [Tailwind+Next](https://tailwindcss.com/docs/installation/framework-guides/nextjs),
[responsive](https://tailwindcss.com/docs/responsive-design),
[compatibilidadev4](https://tailwindcss.com/docs/upgrade-guide).

## Resultado da pesquisa

Todas as escolhas técnicas fechadas para futura geração de tasks. Sem NEEDS CLARIFICATION matemático/funcional.
Revalidar patches/peers durante instalação futura é controle normal, não OQ de produto. OQ-013 é conteúdo opcional.
Nenhuma fonte nutricional reinterpretada; matriz vigente é a spec aprovada. Nomes/tipos/scripts seguem plan/model/contracts.
