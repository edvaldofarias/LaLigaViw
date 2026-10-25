# La Liga VIW — Angular

Aplicação de acompanhamento da La Liga VIW em **Angular 22.2.3**, TypeScript 6.0.3, componentes standalone, Signals e Angular Router. Mantém os resultados, estatísticas, MVP, CARTOLA, seleções, técnicos, artes e câmeras ao vivo.

A interface utiliza **Angular Material + CDK 22**: toolbar, navegação lateral, cartões, filtros, botões, tabelas com MatSort/MatPaginator, painéis e MatDialog. Bootstrap, DataTables e jQuery foram removidos da interface.

## Executar

```sh
nvm install
nvm use
npm ci
npm start
```

Node.js 24.15.0 está fixado em `.nvmrc` e nas dependências de desenvolvimento. `npm start` abre o servidor Angular em `http://127.0.0.1:4200`. O contador depende do Worker e do vínculo D1; no servidor Angular isolado, sua indisponibilidade é esperada.

## Validar e compilar

```sh
npm test
npm run build
npm run test:e2e
```

Os testes de navegador usam Playwright com Google Chrome instalado, nos tamanhos móvel e desktop. Para usar Chromium: `npx playwright install chromium` e `PLAYWRIGHT_CHANNEL=chromium npm run test:e2e`.

`npm run build` compila Angular, compila o Worker com Vite e prepara `dist/client`. O manifesto `.openai/hosting.json` preserva o site existente e o vínculo `DB` do contador. Não apague ou recrie o banco para publicar uma versão.

## Organização

- `src/app/core/competition.service.ts`: estado com Signals, consultas com HttpClient/RxJS, atualização e seleção dos detalhes.
- `src/app/core/models.ts`: contratos de dados e nomes oficiais das fases.
- `src/app/pages/`: templates Angular das 11 áreas; carregamento por rota.
- `src/app/shared/`: componentes de entidades, partidas, Angular Material, Chart.js e detalhes.
- `src/main.ts`: inicialização standalone, modo zoneless e Router.
- `dist/*.mjs`: módulos de domínio reutilizados e testados: pontuação, simulações, histórico, técnicos, seleções, artes e reprodução HLS.
- `dist/vendor/`: bibliotecas com versões fixadas e licenças; não editar seus arquivos.
- `dist/images/` e `assets/`: fotos, escudos, logo e imagens das seleções.
- `server/`: Worker do contador e versão da aplicação.
- `scripts/update-forecast.mjs`: consulta pública e atualização das simulações após rodadas completas.
- `tests/`: regressões de domínio e integrações; `tests/e2e/`: testes reais da interface Angular.

A aplicação publicada é compilada a partir de `src/`; os módulos em `dist/` contêm apenas regras de domínio e integrações ainda reutilizadas pelo Angular.

## Dados e regras preservadas

Fonte pública: `https://copafacil-web.firebaseio.com/events/-ciddy/`, endpoints `matchs.json`, `teams.json`, `player.json` e súmulas `details/{id}.json`.

- Horários de Brasília. Consultas completas a cada 10 minutos em dia de jogo e a cada 12 horas nos demais dias. Consultas de placares/equipes a cada 15 segundos durante jogos e sua janela de início; aba oculta suspende consultas.
- `st=1` confirma partida em andamento; gols omitidos equivalem a zero somente nesse contexto. Placares do vídeo podem ter atraso em relação às câmeras. Classificação provisória identifica pontos previstos sem alterar a oficial.
- Reservas representam ausências: não entram em jogos disputados nem recebem pontos coletivos.
- MVP: presença confirmada +2; gol +7; amarelo −1; vermelho −5; vitória +5; empate +2; derrota 0; craque +4; seleção +6; sem sofrer gols +7 ao goleiro ou +3 à linha; cada gol sofrido −1 por relacionado presente.
- CARTOLA: um goleiro e seis de linha nas listas por rodada. Sugestões futuras usam desempenho histórico e confronto, sem confirmação de presença.
- Atletas com suspensão ativa não entram nas sugestões nem na relação da rodada em que cumprem a suspensão.
- No ranking do bolão, o nome abre os palpites de partidas encerradas, seus resultados e a indicação de acerto ou erro; jogos ainda não realizados permanecem ocultos.
- Os detalhes das partidas das rodadas 1 a 5 exibem os 25 replays da playlist oficial do YouTube, vinculados individualmente por ID da partida.
- Odds: 20.000 simulações por partida. G4/G8: 20.000 cenários da Primeira Fase. Base somente de rodadas completamente encerradas, sem mudar o modelo estatístico.
- Apenas a Primeira Fase tem classificação: 1º–4º quartas; 5º–8º repescagem com empate; 9º–12º repescagem sem empate.
- Técnicos, prêmios e seleções são escolhas manuais preservadas por IDs. João foi substituto de Ênio apenas na quarta rodada.
- Craques informados da 6ª rodada: Nanddo (Getafe), Edvaldo (Barcelona), Igor (Real Sociedad), Reinaldo (Rayo Vallecano) e Igor (Athletico Bilbao). O bônus de MVP considera apenas partidas encerradas.
- Panfletos apenas para a próxima rodada. Local fixo: Pro Beach — Av. Cézar Magnani, nº 840, Paulicéia, São Bernardo do Campo — SP, 09694-000.
- Fotos originais preservadas; ausência/erro usa iniciais no Placehold.co. Downloads PNG e zoom das artes continuam disponíveis.

## Publicação e GitHub

Publicar usando o mesmo `project_id` de `.openai/hosting.json`, após testes/build. O resultado contém `dist/server` e `dist/client`; preservar D1. O GitHub é um segundo repositório do código e não substitui o vínculo de publicação do Sites.

Ver [docs/BIBLIOTECAS.md](docs/BIBLIOTECAS.md).
