# Revisão de impressão — T056/T057

Execução nova em2026-10-10, Chromium156.0.8078.4 sobre build de produção aprovado. PDFs reais por Chromium `Page.printToPDF`, escala1/100%, A4 retrato pelo `@page`, margens12mm, fundos e cabeçalhos do browser desativados. Saídas em `block4/`, reexecutadas depois do build final; os PDFs dos blocos anteriores não substituem este gate.

| Caso | Páginas A4 | Linhas de produtos, incluindo totais | Resultado |
| --- | ---: | ---: | --- |
| Completo, Vegetativo1 ativa | 10 | 85 | PASS |
| Completo, Floração4 ativa | 10 | 85 | PASS |
| Joker10,25L, sem foliar | 5 | 17 | PASS |
| NO_RULE Joker/Vegetativo4 | 11 | 85 | PASS |
| 20 produtos sintéticos/textos longos | 59 | 340 | PASS |
| Cinco produtos,0,001L por via | 10 | 85 | PASS |

PDF.js conferiu105 páginas: dimensões A4, limites de texto dentro das margens, cronologia16 semanas, contagens sem omissões/duplicações, referências e ausência de controles. Texto e hashes dos pixels de todas as páginas completas são iguais nas duas semanas ativas. `pdf-inspection.json`, páginas individuais em `block4/pages/`, arquivos.txt e contact sheets são evidência revisável.

Principal inspecionou todas as contact sheets dos casos completo, subset, incompleto, subcent e as oito sheets das59 páginas extensas. Cabeçalhos de estágio/semana se repetem nas continuações; totais possuem cabeçalho próprio. Não foram encontrados cortes, sobreposição, unidades perdidas ou dependência de cor. Conferidas doses, vias, frequências, volumes, preparo, consumo, estado e totais; a comparação célula a célula com CalculationResult em `integrated-browser.json` passou nas80 linhas semanais e cinco totais, tanto completas quanto incompletas. As referências finais extensas chegam ao marcador FIM-REFERENCIA-SRC-007.

Totais completos: Joker140+120=260g; Coringa160ml/N/A; Plant Protein96+500=596ml; Terpeno32ml/N/A; TricomaxN/A/100g. Incompleto: Joker sem total definitivo, subtotais parciais120g/240g; avisos explícitos. Subcent: quantidades e volumes positivos rotulados `<0,01`, nunca0L inventado. Subset não reinclui produtos desmarcados; fontes preservam suas referências mesmo quando mencionam produto não selecionado.

Prévia nativa e verificações adicionais são registradas separadamente em `block4/native-app.json/png`, `native-preview.json/log` e relatório final. Abrir o diálogo não substitui PDF/A4 validado, e uma tentativa de Ctrl+P/Salvar não será declarada PASS se não concluída. O teste mínimo `native-minimal` isola comportamento do ambiente sem código RAIZORA. Ajustes internos inválidos do harness geraram uma prévia com erro em tentativas descartadas; a execução válida sem esses ajustes carregou10 páginas e permitiu cancelar preservando a sessão.

Firefox/WebKit não estão instalados no ambiente Playwright nem há executáveis locais; Safari não está disponível no Linux. `browser-availability.json` registra os caminhos verificados. Nenhum desses navegadores recebeu PASS. Impressora física e destinos externos não foram exercitados. Não há número de páginas fixo exigido entre browsers.

Resultado nativo final: native-preview.json PASS para abertura/carregamento de10 páginas, fundos/headers desligados e cancelamento com sessão preservada. Pedido de A4 foi enviado com metadados completos, porém o readback mediaSize do diálogo manteve Letter; não se declara configuração A4 nativa consolidada. A4 físico foi medido somente nos PDFs printToPDF. Ctrl+P não concluiu porque o harness não localizou janela X11 mapeada/foco; destino Salvar pelo diálogo e comparação integral do PDF nativo não executados. Comparação visual da primeira página carregada confirma o mesmo conteúdo (não é comparação integral ou prova de dimensões). Essas verificações adicionais seguem a cláusula “se o ambiente permitir” do pedido atual. Sem alegação de PASS para etapas indisponíveis.
