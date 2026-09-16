# La Liga Viw

Central de acompanhamento em português, feita com HTML, CSS e JavaScript. O conteúdo publicável fica em `dist/`.

## Dados

Leitura dos endpoints públicos `matchs.json`, `teams.json` e `player.json` em `https://copafacil-web.firebaseio.com/events/-ciddy/`, a cada 60 segundos enquanto a página estiver visível. Atualização manual e atualização ao retornar à página também disponíveis. As três respostas são trocadas em conjunto; falhas preservam os últimos dados e exibem sua data. `data.json` é uma cópia consultada em 16/09/2026 para abertura inicial e contingência, sempre identificada como tal.

Estatísticas de jogadores: `0` = gols, `2` = jogos, `14` = amarelos, conforme o dicionário fornecido. Os campos são separados por `#` e chave/valor por `=`. Jogadores sem `dt` mostram estatísticas indisponíveis. Os registros `SUSP` são identificados sem presumir suspensão vigente.

Na classificação, `col` define a ordem. As estatísticas de equipes foram conferidas com a classificação fornecida no diretório original: `0` pontos, `1` jogos, `2` vitórias, `3` empates, `4` derrotas, `5` gols pró, `6` gols contra, `7` saldo e `8` aproveitamento. As partidas encerradas permitem calcular estatísticas na ausência de um registro; a página não inventa uma classificação para fases sem dados de classificação.

Datas `d_i` são interpretadas como timestamps e apresentadas em `America/Sao_Paulo`, conforme solicitado. Fases e rodadas recebem números pela primeira partida no calendário; os nomes oficiais não estão nos endpoints. Códigos de local e identificação são mantidos sem atribuir significado não confirmado. Gols individuais não são associados a partidas porque não há esse vínculo nos dados.

## Prévia

Sirva `dist/` por HTTP. Não há dependências nem etapa de compilação. O arquivo `.openai/hosting.json` associa este projeto à sua publicação Sites.
