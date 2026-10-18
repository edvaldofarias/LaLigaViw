# Migração para Angular 22.2.3

## Resultado

Interface reimplementada em templates Angular compilados, com verificação estrita de templates. Não é um iframe nem um componente que injeta a aplicação anterior com innerHTML.

- Inicialização standalone e zoneless.
- Angular Router com rotas carregadas sob demanda.
- URLs antigas `#matches` são convertidas para `#/matches`, incluindo URLs do PWA e links já compartilhados.
- Serviço central de competição: Signals/computed para dados, listas, ranking, classificação, projeções e detalhes.
- Angular HttpClient com RxJS: limite de tempo, atualização atômica das três fontes, preservação de dados em falhas, súmulas concorrentes e coleta incremental.
- Componentes reutilizáveis para cards, entidades, tabelas Material, Chart.js e modal de detalhes.
- Templates e bindings substituem strings de HTML e eventos globais de navegação da aplicação anterior.
- MatTable renderiza as células Angular, com MatSort e MatPaginator; não há renderização de células por HTML concatenado.
- Chart.js criado e destruído no ciclo de vida Angular; callbacks de imagens verificam se o gráfico continua montado.
- Adaptadores de PhotoSwipe, instalação PWA e câmeras preservados como módulos especializados, carregados após a interface ou sob demanda.

## Reaproveitamento

Regras de pontuação, cálculos de probabilidade, goleiros, prêmios, técnicos, seleções, histórico e geração de PNG continuam nos módulos de domínio. Reutilizar essas regras evita uma segunda implementação que poderia divergir dos resultados já validados.

O Worker e o banco D1 não foram migrados nem recriados. Identidade do site, permissões, contador e arquivos de imagem são preservados.

## Verificação

- Compilação Angular de produção e templates estritos.
- Testes de domínio anteriores mantidos.
- Playwright: 11 abas, links antigos, responsividade, busca aproximada, seleção de rodada, jogador e gráficos, técnico/equipes, jornal da partida, galeria e placar/projeção ao vivo.
- Validação dos arquivos de publicação, da identidade do site e do vínculo D1.

## Manutenção

Alterações de interface: `src/`. Cálculos e cadastros manuais: módulos correspondentes em `dist/`. Assets: `dist/images/` e `assets/`. Não editar `.angular-output/`, `dist/client/` ou `dist/server/`, pois são gerados pelo build.

## Interface Material

A camada visual usa Angular Material/CDK. `GridComponent` renderiza células Angular, ordena por valores numéricos ou textuais e oferece busca Fuse e paginação Material. `DetailComponent` usa MatDialog com foco, Escape e retorno ao elemento de origem. `SystemDialogsComponent` integra instalação PWA e aviso de versão. Menu móvel usa MatSidenav; filtros usam MatSelect e MatFormField. As tabelas mantêm todas as colunas em uma região rolável local, sem transbordar a página. Chart.js e PhotoSwipe permanecem para gráficos e ampliação de imagens. A transmissão mantém o elemento de vídeo e a API nativa de tela cheia, necessários à compatibilidade móvel.
