# Bibliotecas da La Liga VIW

Distribuições com versão fixa em `dist/vendor`, servidas pelo próprio site. Não alterar os arquivos das bibliotecas. Integrações e regras próprias ficam em módulos separados.

| Biblioteca | Versão | Responsabilidade | Integração |
|---|---|---|---|
| Bootstrap | 5.3.8 | Estilos e Collapse da navbar | index.html, navigation.mjs, bootstrap-theme.css |
| DataTables / Responsive | 2.3.4 / 3.0.7 | Ordenação, paginação, tabelas responsivas | table-ui.mjs |
| jQuery | 3.7.0 | Dependência do pacote DataTables | pacote DataTables |
| Chart.js | 4.5.1 | Gráficos, tooltip, escala e redimensionamento | charts-ui.mjs |
| PhotoSwipe | 5.4.4 | Zoom das seleções, panfletos e melhor em campo | gallery-ui.mjs (carregamento ao abrir) |
| Fuse.js | 7.1.0 | Busca aproximada e sem distinção de acentos | table-ui.mjs |
| Day.js | 1.11.13 | Datas/horários; plugins UTC e Timezone; locale pt-br | date-utils.mjs |
| Hls.js | 1.6.13 | Reprodução das câmeras HLS | live-court.mjs |

## Organização

- `evolution.mjs`: histórico e séries; não desenha gráficos.
- `charts-ui.mjs`: instancia e destrói Chart.js ao trocar conteúdo ou fechar perfil.
- `gallery-ui.mjs`: PhotoSwipe apenas para artes; mantém links de download.
- `date-utils.mjs`: representação de datas no fuso America/Sao_Paulo.
- `navigation.mjs`: estado do link ativo e integração com Collapse do Bootstrap.
- `table-ui.mjs`: DataTables + Fuse; pesquisa preserva ordenação escolhida.
- `player-score.mjs`, `cartola.mjs`, `forecast.mjs`: regras específicas e cálculos da competição.

As bibliotecas de interface não mudam os pesos do MVP, escolhas manuais, simulações, dados do contador ou acesso do site. O gráfico oferece também valores textuais para consulta acessível.

## Atualização

Distribuições novas: CDN oficial npm via jsDelivr, com versão explícita. Conferir documentação oficial, preservar licenças, executar testes/sintaxe/build e validar busca, menu, gráficos, perfil e zoom no celular e desktop antes de publicar. Não usar URLs `latest` em produção.
