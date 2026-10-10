# Ambiente do Bloco 1

Node v24.16.0; npm 11.16.0; .nvmrc 24. Dependências instaladas, sem npm ci ou mudanças de versões/lockfile.
Scripts existentes: test:unit, test:ui, test (ambas suites), lint, typecheck (next typegen + tsc), build (Next webpack). Vitest unit/node e ui/jsdom.
.gitignore cobre node_modules/.next/coverage/logs/tsbuildinfo/env; eslint globalIgnores cobre artefatos existentes. Pacote private, sem publicação/npmignore necessária. Sem Docker/Terraform/Helm/Prettier.
