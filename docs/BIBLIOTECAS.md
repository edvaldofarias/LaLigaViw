# Bibliotecas da La Liga VIW

Angular Material e CDK são dependências npm com versão fixada no lockfile. As demais distribuições têm versão fixa em `dist/vendor`, servidas pelo próprio site. Não alterar os arquivos das bibliotecas. Integrações e regras próprias ficam em módulos separados.

| Biblioteca | Versão | Responsabilidade | Integração |
|---|---|---|---|
| Angular Material + CDK | 22 (package-lock) | Componentes Angular, acessibilidade, overlays, tabelas e navegação | src/app/shared/material.ts, src/theme.scss |
| Chart.js | 4.5.1 | Gráficos, tooltip, escala e redimensionamento | src/app/shared/chart.component.ts |
| PhotoSwipe | 5.4.4 | Zoom das seleções, panfletos e melhor em campo | gallery-ui.mjs (carregamento ao abrir) |
| Fuse.js | 7.1.0 | Busca aproximada e sem distinção de acentos | src/app/shared/grid.component.ts |
| Day.js | 1.11.13 | Datas/horários; plugins UTC e Timezone; locale pt-br | date-utils.mjs |
| Hls.js | 1.6.13 | Reprodução das câmeras HLS | live-court.mjs |

## Organização

- `dist/evolution.mjs`: histórico e séries; o componente Angular desenha os gráficos via Chart.js.
- `src/app/shared/chart.component.ts`: componente standalone; instancia e destrói Chart.js ao trocar conteúdo ou fechar perfil.
- `gallery-ui.mjs`: PhotoSwipe apenas para artes; mantém links de download.
- `date-utils.mjs`: representação de datas no fuso America/Sao_Paulo.
- `src/app/app.component.ts`: toolbar e menu lateral Material responsivo.
- `src/app/shared/grid.component.ts`: MatTable + MatSort + MatPaginator + Fuse; células Angular e busca aproximada.
- `player-score.mjs`, `cartola.mjs`, `forecast.mjs`: regras específicas e cálculos da competição.

As bibliotecas de interface não mudam os pesos do MVP, escolhas manuais, simulações, dados do contador ou acesso do site. O gráfico oferece também valores textuais para consulta acessível.

## Atualização

Distribuições novas: CDN oficial npm via jsDelivr, com versão explícita. Conferir documentação oficial, preservar licenças, executar testes/sintaxe/build e validar busca, menu, gráficos, perfil e zoom no celular e desktop antes de publicar. Não usar URLs `latest` em produção.
