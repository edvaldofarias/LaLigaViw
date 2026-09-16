# La Liga Viw

Central de acompanhamento em português, feita com HTML, CSS e JavaScript. O conteúdo publicável fica em `dist/`.

## Dados

Leitura dos endpoints públicos `matchs.json`, `teams.json` e `player.json` em `https://copafacil-web.firebaseio.com/events/-ciddy/`, a cada 10 minutos em dias com partidas no calendário de Brasília e a cada 12 horas nos demais dias, enquanto a página estiver visível. A consulta inicial e a atualização manual são imediatas. Ao retornar à página, só há nova consulta se o intervalo estiver vencido. A política é reavaliada à meia-noite de Brasília, sem esperar 12 horas para detectar um dia de jogos. As três respostas são trocadas em conjunto; falhas preservam os últimos dados e exibem sua data. `data.json` é uma cópia consultada em 16/09/2026 para abertura inicial e contingência, sempre identificada como tal.

Estatísticas de jogadores: `0` = gols, `2` = jogos, `14` = amarelos, conforme o dicionário fornecido. Os campos são separados por `#` e chave/valor por `=`. Jogadores sem `dt` mostram estatísticas indisponíveis. Os registros `SUSP` são identificados sem presumir suspensão vigente.

Na classificação, `col` define a ordem. As estatísticas de equipes foram conferidas com a classificação fornecida no diretório original: `0` pontos, `1` jogos, `2` vitórias, `3` empates, `4` derrotas, `5` gols pró, `6` gols contra, `7` saldo e `8` aproveitamento. As partidas encerradas permitem calcular estatísticas na ausência de um registro; a página não inventa uma classificação para fases sem dados de classificação.

Datas `d_i` são interpretadas como timestamps e apresentadas em `America/Sao_Paulo`, conforme solicitado. Fases e rodadas recebem números pela primeira partida no calendário; os nomes oficiais não estão nos endpoints. Q1 é apresentado como Quadra 1 e Q2 como Quadra 2, conforme confirmado pelo usuário. O código do local é preservado quando o nome do estabelecimento não está disponível. Gols individuais não são associados a partidas porque não há esse vínculo nos dados.

## Prévia

Sirva `dist/` por HTTP. Não há dependências nem etapa de compilação. O arquivo `.openai/hosting.json` associa este projeto à sua publicação Sites.

## Odds e simulação semanal

`dist/forecast.mjs` contém o mesmo modelo usado no navegador e na atualização semanal. Cada confronto da próxima rodada recebe 20.000 cenários de placares por distribuições de Poisson independentes. A força ofensiva da equipe é combinada à força defensiva adversária, usando os últimos oito jogos por equipe, com regularização equivalente a quatro jogos da média da competição. Equipes sem histórico usam a média; sem resultados da liga, não há odds. Não é aplicado bônus de mando. As médias esperadas são limitadas ao intervalo 0,05–15 gols para estabilidade diante de entradas extremas.

Probabilidades são frequências dos cenários; odds decimais são `1 / probabilidade`, sem margem. Cenários espelhados removem viés artificial de mando entre equipes com forças iguais. A semente combina versão do modelo, edição semanal, resultados e confronto, mantendo a reprodução dos números. O placar mais frequente é exibido com sua própria probabilidade, sem promessa de acerto. O modelo é exploratório, não calibrado nesta competição.

A edição muda na segunda-feira às 9h de Brasília. Só entram no treino partidas encerradas e registradas antes desse corte. Correções na base anterior ao corte podem mudar as projeções. O navegador recalcula com os dados recebidos e na virada semanal, inclusive se a atualização agendada não puder executar. Partidas sem equipes, iniciadas ou encerradas não recebem odds pré-jogo.

`node scripts/update-forecast.mjs` consulta as três fontes e salva uma cópia atualizada dos dados e a última edição em `dist/forecast.json`. Falhas de consulta não sobrescrevem os arquivos anteriores. Uma automação semanal nesta tarefa executa a atualização e republica pelo Sites, mantendo o acesso vigente. A atualização no navegador funciona independentemente dessa publicação semanal enquanto as fontes públicas estiverem acessíveis.

Validação: `node --test tests/forecast.test.mjs`. Os testes verificam o corte semanal, ausência de resultados futuros no treino, probabilidades normalizadas, odds recíprocas, reprodução, simetria e ausência de histórico. Referência da distribuição: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.poisson.html.
