# Planeamento — That's What Who Said?

Registo das decisões do projeto prático do módulo de JavaScript: o que foi planeado antes de escrever o código, e o que mudou durante o desenvolvimento (secção 12).

- **Entrega:** 14/10/2026 até às 23:59
- **Apresentação:** 16/10/2026, a partir do site publicado no GitHub Pages
- **Site:** https://fredbusich.github.io/Projeto-JS/

## 1. A ideia

Um jogo de adivinhar quem disse cada frase: **Michael Scott**, **Dwight Schrute** (The Office) ou **um filósofo**.

A graça está em que muitas frases do Michael e do Dwight parecem profundas, e muitas frases de filósofos parecem saídas de uma reunião na Dunder Mifflin (empresa na qual se passa a série).

A ideia nasceu de um video que vi no instagram e resolvi tornar isso em um mini jogo interativo. Aqui cresce para um projeto completo, com modos de jogo, pontuação, recordes, duas línguas e informação sobre cada autor vinda da Wikipédia.

## 2. Regras

### Modos de jogo

| Modo | Opções em cada ronda | Resposta certa |
|---|---|---|
| **Normal** | 3 botões fixos: *Michael* · *Dwight* · *Filósofo* | o grupo do autor |
| **Difícil** | 3 nomes baralhados: o autor certo + 2 outros ao acaso (ex.: *Dwight · Nietzsche · Sócrates*) | a pessoa exata |

### Partida

- Cada partida tem **10 rondas**, e a mesma frase não se repete dentro da partida.
- Há **15 segundos** por resposta. Se o tempo acabar, a ronda conta como errada.
- Responde-se com o rato ou com as **teclas 1, 2 e 3**.
- Depois de responder, os botões ficam bloqueados. Isto evita duplo clique e respostas repetidas.
- Aparece o feedback (certo ou errado, com a resposta certa) e o crachá **"Quem é?"** revela o autor: foto, nome, uma **nota cómica** que compara a frase com as personagens, e a fonte.
- O botão **Próxima** avança para a ronda seguinte. Na última ronda passa a **Ver resultado**.
- O botão **Sair** abandona a partida a meio (pede confirmação e pára o tempo enquanto se decide). Uma partida abandonada não conta para os recordes.

### Pontuação

- Cada acerto vale **10 pontos + os segundos que sobraram** (no máximo 25 por ronda, 250 por partida).
- Um erro, ou o tempo esgotado, vale **0 pontos**.
- Os recordes são separados por modo: um top 5 no normal e outro no difícil. Uma partida com 0 pontos não é recorde.

### Título no fim da partida

| Acertos | Título (pt) | Título (en) |
|---|---|---|
| 0 – 3 | Estagiário | Intern |
| 4 – 5 | Vendedor | Salesman |
| 6 – 7 | Assistente do Gerente Regional | Assistant to the Regional Manager |
| 8 – 9 | Gerente Regional | Regional Manager |
| 10 | Melhor Chefe do Mundo ☕ | World's Best Boss ☕ |

## 3. Personagens

| Personagem | `pessoa` | Grupo | Wikipédia (pt) | Wikipédia (en) | Foto |
|---|---|---|---|---|---|
| Michael Scott | `michael` | `michael` | `Michael_Scott_(The_Office)` | `Michael_Scott_(The_Office)` | da página **inglesa** (a portuguesa não tem) |
| Dwight Schrute | `dwight` | `dwight` | `Dwight_Schrute` | `Dwight_Schrute` | **local** (`img/dwight.jpg`): a Wikipédia mostra o ator, não a personagem |
| Friedrich Nietzsche | `nietzsche` | `filosofo` | `Friedrich_Nietzsche` | `Friedrich_Nietzsche` | Wikipédia |
| Sócrates | `socrates` | `filosofo` | `Sócrates` | `Socrates` | Wikipédia |
| Confúcio | `confucio` | `filosofo` | `Confúcio` | `Confucius` | Wikipédia |
| Marco Aurélio | `marco-aurelio` | `filosofo` | `Marco_Aurélio` | `Marcus_Aurelius` | Wikipédia |
| Sun Tzu | `sun-tzu` | `filosofo` | `Sun_Tzu` | `Sun_Tzu` | Wikipédia |

Todas as páginas foram verificadas na API da Wikipédia. Uma nota: `Michael_Scott` sozinho leva a uma página de desambiguação; o título certo inclui `(The_Office)`.

### Frases

- **36 frases:** 11 do Michael, 10 do Dwight e 3 de cada filósofo.
- **Todas verificadas:** as da série no episódio exato (IMDb, OfficeQuotes.net, The Office Wiki); as dos filósofos na obra e passagem.
- **O Sócrates não deixou nada escrito.** As frases dele vêm de Platão, e é isso que fica no campo `fonte`.
- **Em inglês**, as falas da série são as **originais**; as dos filósofos vêm de traduções inglesas clássicas.

## 4. Ecrãs

Os três ecrãs são três `section` no mesmo `index.html`, e só um está visível de cada vez (atributo `hidden`). A página nunca recarrega, por isso o estado da partida mantém-se em memória.

### Início

- Título do jogo e uma frase curta a explicar as regras
- Campo **nome do jogador**, com validação e contador de letras (7/15)
- Escolha do **modo**: normal ou difícil
- Botão **Jogar** (fica desativado até as frases chegarem), que também inicia a música
- **Recordes:** top 5 do modo escolhido, num post-it
- No cabeçalho: língua **PT/EN**, volume e som 🔊/🔇

### Jogo

- Barra de estado: **ronda** (ex.: 3 de 10), **pontos**, **tempo** (a vermelho nos últimos 5 s) e **Sair**
- A frase, apresentada como um **memorando** de escritório
- Os **botões de resposta**, criados pelo JavaScript em cada ronda
- O crachá **"Quem é?"**, sempre visível na coluna da direita: antes da resposta mostra uma silhueta e "Funcionário por identificar"
- Depois de responder:
  - o feedback: botão certo a verde, errado a vermelho
  - o crachá revela o autor: nome, nota cómica e fonte logo; a foto e o link "Ler mais na Wikipédia" quando a Wikipédia responder
  - o botão **Próxima** / **Ver resultado**

### Fim

- **Título** conforme os acertos, num certificado da Dunder Mifflin
- Acertos, percentagem e pontos
- **Acertos por personagem**, com barras
- Aviso de **novo recorde** (com o lugar), se for o caso
- Botões **Jogar de novo**, **Ver as respostas** e **Início**
- **Lista de respostas** (abre e fecha): cada frase com o autor, a resposta dada e se acertou; filtros *Todas / Certas / Erradas*

### Esboços

Feitos no Google Stitch, primeiro para computador e depois adaptados para telemóvel. Serviram só de referência visual: o código foi escrito à parte, para ter a estrutura planeada e ser explicável.

## 5. Funcionalidades

| Essencial (planeado) | Estado | Extra (planeado) | Estado |
|---|---|---|---|
| Ecrã inicial com nome validado e escolha de modo | ✅ | Temporizador de 15 s com bónus de pontos | ✅ |
| 10 rondas com frases aleatórias, sem repetir | ✅ | Modo difícil | ✅ |
| Feedback de certo ou errado | ✅ | Música com botão de som | ✅ (com volume) |
| Cartão "Quem é?" com a Wikipédia | ✅ | Responder com as teclas 1, 2 e 3 | ✅ |
| Ecrã final com acertos, título e acertos por personagem | ✅ | Retomar a partida a meio (`sessionStorage`) | ❌ trocado por "Sair" |
| Top 5 de recordes no `localStorage` | ✅ | Tema claro/escuro | ❌ |
| Frases carregadas com `fetch` | ✅ | Animações | ❌ |
| Versão para telemóvel (media query) | ✅ | | |

**Acrescentado durante o desenvolvimento** (não estava no plano): notas cómicas no crachá, lista de respostas com filtros, botão "Sair", duas línguas, efeito de vidro com fundo do escritório, controlo de volume, preferências guardadas.

## 6. Dados

### `data/frases.pt.json` e `data/frases.en.json`

Um ficheiro por língua, com os **mesmos `id`**. Cada um é um array de objetos, um por frase:

```json
{
  "id": 13,
  "texto": "Através da concentração, consigo subir e baixar o meu colesterol à vontade.",
  "nota": "Medicamente impossível. Espiritualmente, muito Dwight.",
  "autor": "Dwight Schrute",
  "pessoa": "dwight",
  "grupo": "dwight",
  "wiki": "Dwight_Schrute",
  "fonte": "The Office · T1 · Health Care"
}
```

| Campo | Para quê |
|---|---|
| `id` | identificar a frase; igual nas duas línguas (histórico e lista de respostas) |
| `texto` | a frase mostrada no ecrã |
| `nota` | o comentário cómico do crachá |
| `autor` | o nome mostrado (muda com a língua: *Confúcio* / *Confucius*) |
| `pessoa` | identificador da pessoa, **igual nas duas línguas**: resposta certa no modo difícil |
| `grupo` | resposta certa no modo normal: `michael`, `dwight` ou `filosofo` |
| `wiki` | título exato da página na Wikipédia dessa língua |
| `fonte` | de onde vem a frase (episódio ou obra) |

### Wikipédia

```
https://pt.wikipedia.org/api/rest_v1/page/summary/<wiki>
https://en.wikipedia.org/api/rest_v1/page/summary/<wiki>
```

- Não precisa de chave e aceita pedidos vindos do GitHub Pages (CORS).
- O jogo usa a **foto** (`thumbnail`) e o **link** da página. O resumo (`extract`) foi usado numa primeira versão e depois substituído pelas notas cómicas.
- Valida que a página é `type: "standard"` (não desambiguação).
- **Cache** numa closure: cada autor só é pedido uma vez por língua.
- **Plano B:** sem foto na página portuguesa, tenta a inglesa.
- Se o pedido falhar, o jogo **continua** e o crachá fica com a silhueta (ou a foto local), sem link.

### O que fica guardado no navegador

| Onde | Chave | O quê |
|---|---|---|
| `localStorage` | `twws-recordes` | array de `{ nome, pontos, acertos, modo, data }` (top 5 de cada modo) |
| `localStorage` | `twws-preferencias` | `{ som, modo, volume, idioma }`: tudo volta como estava |

O prefixo `twws-` evita conflitos: o `localStorage` é partilhado por todos os sites da mesma origem, e o CV e este jogo estão os dois em `fredbusich.github.io`.

## 7. Os 8 tópicos do professor

| # | Tópico | Onde aparece no jogo | Ficheiro |
|---|---|---|---|
| 1 | Lógica e controlo de fluxo | `if/else` para certo ou errado; `switch` no modo para gerar as opções; `switch` nos filtros da lista; `if/else` em cadeia para o título final; ternários nas classes e mensagens; **`for` clássico** a baralhar as frases (Fisher-Yates); `map`, `filter`, `reduce`, `find` nos dados | `jogo.js`, `ui.js`, `utils.js` |
| 2 | Dados simples | **strings:** nome com `trim`, `split`/`filter`/`map`/`join` e entre 2 e 15 caracteres; **números:** percentagem arredondada, tempo em `00:15` com `padStart`, volume com `Number()` e limitado com `Math.min/max`; **booleanos:** `som`, `respondeu`, `aCarregarFrases`; **datas:** `toLocaleDateString` no formato da língua | `utils.js`, `jogo.js`, `main.js` |
| 3 | Dados complexos (imutáveis) | **arrays de objetos:** baralhar numa **cópia**, opções do modo difícil com `filter`, histórico com spread, acertos por personagem com `reduce`, recordes com `filter` + `sort` numa cópia + `slice(0, 5)`, filtros da lista de respostas; **objetos:** preferências alteradas sem mexer no original (`{ ...preferencias, som: false }`), `estado()` e `resultado()` devolvem cópias | `jogo.js`, `storage.js` |
| 4 | DOM dinâmico | botões de resposta, lista de recordes, barras de acertos e lista de respostas criados com `createElement`/`append`; textos traduzidos com `querySelectorAll("[data-texto]")` | `ui.js` |
| 5 | Reatividade e eventos | `submit` (com `preventDefault`); `input` no nome (contador e erro em tempo real) e no volume; `change` no modo; `click`; `keydown` (teclas 1-2-3); estados com `classList`: `.certa`/`.errada`, `.selecionado`, `.por-revelar`, `.urgente`, `.ativo` | `main.js`, `ui.js` |
| 6 | Scope e closures | `criarJogo()` (pontos, ronda e histórico privados: nada de fora, nem a consola, os altera); `criarTemporizador()`; `criarMusica()`; cache da Wikipédia; língua atual em `criarIdioma()`; variáveis de módulo que não são globais | `jogo.js`, `temporizador.js`, `musica.js`, `api.js`, `idioma.js` |
| 7 | Assincronismo | `fetch` das frases e da Wikipédia com `async/await`, `try/catch/finally`; verificar `response.ok` **e** o conteúdo; plano B com um 2.º `fetch`; resposta atrasada ignorada (*race condition*); `audio.play()` também devolve uma Promise | `api.js`, `main.js`, `musica.js` |
| 8 | Modularização | 9 ficheiros com `import` / `export`, cada um com uma responsabilidade | `js/` |
| — | Persistência | recordes e preferências (som, modo, volume, língua) no `localStorage` | `storage.js` |

### Outros requisitos do enunciado

| Requisito | Como fica cumprido |
|---|---|
| Aplicação **responsiva** | pensada para computador, com media query para telemóvel: as duas colunas passam a uma |
| Repositório público no GitHub | `fredbusich/Projeto-JS` (público) |
| Publicada e funcional no GitHub Pages | https://fredbusich.github.io/Projeto-JS/ |
| `README.md` | descrição, link para o site, como correr localmente (Live Server), funcionalidades e créditos |

## 8. Visual

Ambiente de **escritório da Dunder Mifflin**, caricatural: a foto do escritório desfocada ao fundo, cartões em **vidro** (*liquid glass*), azul de empresa, a frase num memorando escrito à máquina e o crachá de funcionário.

### Paleta

| Nome | Cor | Uso |
|---|---|---|
| Papel | `#f4efe1` | cor de fundo se a foto não carregar |
| Memorando | `#fffdf7` | base do vidro (a 70%) |
| Tinta | `#1e2733` | texto principal |
| Cinza | `#3b434e` | texto secundário (era `#5b6470`; escurecido por causa do vidro) |
| Azul | `#1f4e8c` | cabeçalho, botões |
| Azul escuro | `#173b6b` | links e etiquetas pequenas sobre o vidro; `:hover` dos botões |
| Post-it | `#f7d774` | recordes, novo recorde |
| Verde / Vermelho | `#276b2b` / `#b3261e` | fundo dos botões certo / errado |
| Verde / Vermelho de texto | `#1a4a1e` / `#7f1a14` | "Certo!" / "Errado!" escritos sobre o vidro |

### Efeito de vidro

- **Fundo:** foto do escritório, desfocada e comprimida (84 KB), com um véu escuro (`--veu`).
- **Cartões:** `rgba(255, 253, 247, 0.7)` + brilho em gradiente + `backdrop-filter: blur(20px) saturate(160%)` + linha de luz no topo (`box-shadow: inset`).
- **O post-it e o cabeçalho ficam sólidos**, para contrastar com o vidro.

### Contrastes medidos (WCAG)

Mínimo para texto normal: **4,5 : 1**. Com o vidro, o fundo atrás do texto varia com a foto. Por isso o contraste foi calculado no **pior caso**: o texto por cima da zona mais escura da foto, já desfocada.

| Par | Rácio (pior caso) |
|---|---|
| tinta sobre vidro | 7,4 : 1 |
| cinza sobre vidro | 4,9 : 1 |
| verde de texto sobre vidro | 5,0 : 1 |
| vermelho de texto sobre vidro | 5,0 : 1 |
| azul escuro sobre vidro | 5,5 : 1 |
| tinta sobre post-it | 10,7 : 1 |
| cinza sobre post-it | 7,1 : 1 |
| branco sobre azul (botões) | 8,3 : 1 |
| branco sobre verde / vermelho | 6,5 : 1 |

Com o vidro a 50–60%, o cinzento, o verde e o vermelho caíam para cerca de 2 : 1. Foi por isso que se fixou o vidro em 70% e se escureceram as cores de texto.

### Letras

- **Courier Prime** (Google Fonts), letra de máquina de escrever: título do jogo, frase, memorando, crachá. Foi escolhida em vez da Special Elite porque tem negrito e itálico.
- **Letra do sistema** (`system-ui, sans-serif`): botões, formulário e resto do ecrã, para ficar legível.

## 9. Estrutura de ficheiros

```
Projeto-JS/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js          → arranque e eventos: liga tudo
│   ├── jogo.js          → regras da partida (closure criarJogo)
│   ├── ui.js            → cria e atualiza os elementos no ecrã
│   ├── api.js           → fetch das frases e da Wikipédia (com cache)
│   ├── storage.js       → recordes e preferências no localStorage
│   ├── temporizador.js  → contagem decrescente (closure criarTemporizador)
│   ├── musica.js        → música de fundo (closure criarMusica)
│   ├── idioma.js        → dicionário pt/en e a função t()
│   └── utils.js         → baralhar, validar e formatar (funções puras)
├── data/
│   ├── frases.pt.json
│   └── frases.en.json
├── img/                 → favicon.svg, escritorio.jpg, dwight.jpg, sem-foto.svg
├── audio/               → tema.mp3
├── docs/                → este planeamento
└── README.md
```

O `main.js` é carregado com `<script type="module">`. Por isso o projeto tem de correr com o **Live Server** (localmente) ou no GitHub Pages: com `file://` (duplo clique no `index.html`), nem o `import` nem o `fetch` das frases funcionam.

## 10. Calendário

Cada fase foi feita num ramo próprio e entrou na `main` por pull request, como no CV.

| Fase | O quê | PR |
|---|---|---|---|---|
| 0. Preparação | planeamento; HTML dos 3 ecrãs; CSS e telemóvel; GitHub Pages | #1, #2, #3 |
| 1. Jogo base | 36 frases verificadas; `api.js`, `utils.js`, `jogo.js`, `ui.js`, `main.js`, `storage.js` | #4, #5 |
| 2. Wikipédia e extras | crachá com a Wikipédia; temporizador; música, volume e teclas | #6, #7, #8 |
| 3. Acabamento | vidro e fundo; notas cómicas; lista de respostas; "Sair"; duas línguas; correções; README | `acabamento` |
| Entrega | 14/10 |

## 11. Riscos

| Risco | Como ficou resolvido |
|---|---|
| A Wikipédia falha ou está lenta | `try/catch`; o crachá já mostra nome, nota e fonte (vêm das frases), só falta a foto e o link; respostas atrasadas são ignoradas |
| As frases demoram a chegar (rede lenta) | "Jogar" fica desativado até chegarem; segunda proteção no código |
| Página sem foto (Michael) | plano B na Wikipédia inglesa; se também falhar, `sem-foto.svg` |
| Citações falsas | cada frase verificada no episódio ou obra; uma frase sem fonte foi retirada |
| Browser bloqueia o som | a música só começa no primeiro clique; `play()` dentro de `try/catch` |
| Música pesada a atrasar a abertura | `preload = "none"`: só descarrega quando toca |
| Texto ilegível sobre a foto | contrastes calculados no pior caso; vidro a 70% e cores de texto escurecidas |
| Direitos de autor (tema, fotos e fundo da série) | decisão minha de os usar; créditos e "fins educativos, sem fins lucrativos" no README |
| Falta de tempo | a coluna "essencial" foi feita primeiro; os extras só depois |

## 12. O que mudou durante o desenvolvimento

| Plano inicial | Ficou assim | Porquê |
|---|---|---|
| Resumo da Wikipédia no crachá | **Nota cómica** escrita para cada frase | o resumo era informativo mas "frio"; as notas mantêm o tom do jogo |
| Foto do Dwight da Wikipédia | **Foto local** da personagem | a Wikipédia mostra o ator (Rainn Wilson), não o Dwight |
| Fundo cor de papel | **Foto do escritório** com cartões em **vidro** | o ecrã ficava "liso"; o vidro dá ambiente sem perder legibilidade |
| Retomar a partida a meio (`sessionStorage`) | **Botão "Sair"** | mais útil para quem começou por engano; o `sessionStorage` ficou de fora |
| Só português | **Português e inglês** | as falas originais da série são em inglês; mais um exemplo de closure e de `fetch` |
| Piano com licença livre | **Tema original** de The Office | decisão minha, com crédito e nota de uso educativo no README |
| `frases.json` | `frases.pt.json` + `frases.en.json` com campo `pessoa` | um ficheiro por língua; `pessoa` liga as respostas entre línguas |
| 6 módulos JS | **9 módulos** (+ `temporizador.js`, `musica.js`, `idioma.js`) | cada funcionalidade nova ficou no seu módulo, com uma responsabilidade |
| Fim só com o resultado | + **lista de respostas** com filtros | o jogador quer saber em que frases errou |
