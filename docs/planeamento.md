# Planeamento — That's What Who Said?

Registo das decisões tomadas antes de escrever o código do projeto prático do módulo de JavaScript.

- **Entrega:** 14/10/2026 até às 23:59
- **Apresentação:** 16/10/2026, a partir do site publicado no GitHub Pages

## 1. A ideia

Um jogo de adivinhar quem disse cada frase: **Michael Scott**, **Dwight Schrute** (The Office) ou **um filósofo**.

A graça está em que muitas frases do Michael e do Dwight parecem profundas, e muitas frases de filósofos parecem saídas de uma reunião na Dunder Mifflin (empresa na qual se passa a série).

A ideia nasceu de um video que vi no instagram e resolvi tornar isso em um mini jogo interativo. Aqui cresce para um projeto completo, com modos de jogo, pontuação, recordes e informação sobre cada autor vinda da Wikipédia.

**Restrição que me impus** (a mesma do CV): **só técnicas que consiga explicar**. Tudo o que está no código tem de corresponder a matéria dada no módulo ou a algo que consiga justificar na apresentação.

## 2. Regras

### Modos de jogo

| Modo | Opções em cada ronda | Resposta certa |
|---|---|---|
| **Normal** | 3 botões fixos: *Michael* · *Dwight* · *Filósofo* | o grupo do autor |
| **Difícil** | 3 nomes baralhados: o autor certo + 2 outros ao acaso (ex.: *Dwight · Nietzsche · Sócrates*) | o autor exato |

### Partida

- Cada partida tem **10 rondas**, e a mesma frase não se repete dentro da partida.
- Há **15 segundos** por resposta. Se o tempo acabar, a ronda conta como errada.
- Depois de responder, os botões ficam bloqueados. Isto evita duplo clique e respostas repetidas.
- Aparece o feedback (certo ou errado, com a resposta certa) e o cartão **"Quem é?"** com o autor da frase e de onde ela foi retirada ou uma pequena frase de efeito para manter a forma caricata..
- O botão **Próxima** avança para a ronda seguinte. Na última ronda passa a **Ver resultado**.

### Pontuação

- Cada acerto vale **10 pontos + os segundos que sobraram** (no máximo 25 por ronda, 250 por partida).
- Um erro, ou o tempo esgotado, vale **0 pontos**.
- Os recordes são separados por modo: um top 5 no normal e outro no difícil.

### Título no fim da partida

| Acertos | Título |
|---|---|
| 0 – 3 | Estagiário |
| 4 – 5 | Vendedor |
| 6 – 7 | Assistente do Gerente Regional |
| 8 – 9 | Gerente Regional |
| 10 | Melhor Chefe do Mundo ☕ |

## 3. Personagens

| Personagem | Grupo | Página na Wikipédia (pt) | Foto na Wikipédia |
|---|---|---|---|
| Michael Scott | `michael` | `Michael_Scott_(The_Office)` | ❌ usar imagem alternativa |
| Dwight Schrute | `dwight` | `Dwight_Schrute` | ✅ |
| Friedrich Nietzsche | `filosofo` | `Friedrich_Nietzsche` | ✅ |
| Sócrates | `filosofo` | `Sócrates` | ✅ |
| Confúcio | `filosofo` | `Confúcio` | ✅ |
| Marco Aurélio | `filosofo` | `Marco_Aurélio` | ✅ |
| Sun Tzu | `filosofo` | `Sun_Tzu` | ✅ |

Estas páginas foram verificadas na API da Wikipédia. Uma nota: `Michael_Scott` sozinho leva a uma página de desambiguação; o título certo inclui `(The_Office)`.

### Frases

- **Mínimo de 30 frases:** cerca de 10 do Michael, 10 do Dwight e 2 de cada filósofo. Assim as partidas variam e, no modo normal, cada grupo sai com probabilidade parecida.
- **Todas em português**, traduzidas por mim.
- **Todas verificadas** no Wikiquote ou na obra/episódio original. Circulam muitas citações falsas atribuídas a filósofos.
- **O Sócrates não deixou nada escrito.** As frases dele vêm de Platão ou Xenofonte, e é isso que fica no campo `fonte`.

## 4. Ecrãs

Os três ecrãs são três `section` no mesmo `index.html`, e só um está visível de cada vez (atributo `hidden`). A página nunca recarrega, por isso o estado da partida mantém-se em memória.

### Início

- Título do jogo e uma frase curta a explicar as regras
- Campo **nome do jogador**, com validação
- Escolha do **modo**: normal ou difícil
- Botão **Jogar**, que também inicia a música
- **Recordes:** top 5 do modo escolhido
- Botão de som 🔊/🔇

### Jogo

- Barra de estado: **ronda** (ex.: 3/10), **pontos** e **tempo**
- A frase, apresentada como um **memorando** de escritório
- Os **botões de resposta**, criados pelo JavaScript em cada ronda
- O crachá **"Quem é?"**, sempre visível na coluna da direita: antes da resposta mostra uma silhueta e "Funcionário por identificar"
- Depois de responder:
  - o feedback: botão certo a verde, errado a vermelho
  - o crachá revela o autor: foto, nome, resumo curto e link "Ler mais na Wikipédia"
  - o botão **Próxima** / **Ver resultado**

### Fim

- Pontos, acertos (ex.: 7/10).
- **Título** conforme os acertos (ver tabela acima)
- **Acertos por personagem**, por exemplo: "Dwight: 3/4 · Michael: 2/3 · Filósofos: 2/3"
- Aviso de **novo recorde**, se for o caso
- Botões **Jogar de novo** e **Início**

### Esboços

A fazer, pensados primeiro para computador e depois adaptado para telemovel.

- `esboco-inicio.png`
- `esboco-jogo.png`
- `esboco-fim.png`

## 5. Funcionalidades

A coluna **essencial** tem de estar pronta a 14/10 e já cobre os 8 tópicos e a persistência. Os **extras** só entram se sobrar tempo.

| Essencial | Extra |
|---|---|
| Ecrã inicial com nome validado e escolha de modo | Temporizador de 15 s com bónus de pontos |
| 10 rondas com frases aleatórias, sem repetir | Modo difícil |
| Feedback de certo ou errado | Música com botão de som |
| Cartão "Quem é?" com a Wikipédia | Retomar a partida a meio (`sessionStorage`) |
| Ecrã final com numero de acertos total, título e acertos por personagem | Tema claro/escuro |
| Top 5 de recordes no `localStorage` | Responder com as teclas 1, 2 e 3 ou clicando |
| Frases carregadas do `frases.json` com `fetch` | Animações |
| Versão para telemóvel (media query) | |

**Enquanto não houver temporizador**, cada acerto vale 10 pontos. **Enquanto não houver modo difícil**, os recordes são só do modo normal. A estrutura dos dados já fica preparada para os dois.

## 6. Dados

### `data/frases.json`

Um array de objetos, um por frase:

```json
{
  "id": 1,
  "texto": "…",
  "autor": "Dwight Schrute",
  "grupo": "dwight",
  "wiki": "Dwight_Schrute",
  "fonte": "The Office, T3E5"
}
```

| Campo | Para quê |
|---|---|
| `id` | identificar a frase (histórico da partida, sem repetições) |
| `texto` | a frase mostrada no ecrã |
| `autor` | resposta certa no modo difícil |
| `grupo` | resposta certa no modo normal: `michael`, `dwight` ou `filosofo` |
| `wiki` | título exato da página na Wikipédia, usado no cartão "Quem é?" |
| `fonte` | de onde vem a frase (episódio ou obra) |

### Wikipédia

```
https://pt.wikipedia.org/api/rest_v1/page/summary/<wiki>
```

- Não precisa de chave e aceita pedidos vindos do GitHub Pages (CORS).
- Devolve o título, o resumo (`extract`) e a foto (`thumbnail`), quando existe.
- Se o pedido falhar, o jogo **continua** e o cartão mostra só o nome e a fonte.
- Se não houver foto (caso do Michael), usa-se `img/sem-foto.svg`.

### O que fica guardado no navegador

| Onde | Chave | O quê |
|---|---|---|
| `localStorage` | `twws-recordes` | array de `{ nome, pontos, acertos, modo, data }` (top 5 de cada modo) |
| `localStorage` | `twws-preferencias` | `{ som, modo }`: a última escolha fica selecionada |
| `sessionStorage` | `twws-partida` | a partida a meio (extra) |

O prefixo `twws-` evita conflitos: o `localStorage` é partilhado por todos os sites da mesma origem, e o CV e este jogo estão os dois em `fredbusich.github.io`.

## 7. Os 8 tópicos do professor

| # | Tópico | Onde aparece no jogo | Ficheiro |
|---|---|---|---|
| 1 | Lógica e controlo de fluxo | `if/else` para certo ou errado; `switch` no modo para gerar as opções; `if/else` em cadeia para o título final; ternário na classe do feedback; **`for` clássico** a baralhar as frases (algoritmo de Fisher-Yates); `map`, `filter` e `reduce` nos dados | `jogo.js`, `ui.js`, `utils.js` |
| 2 | Dados simples | **strings:** nome com `trim` e entre 2 e 15 caracteres, resumo da Wikipédia cortado ao fim de uma palavra; **números:** percentagem arredondada, tempo em `00:15` com `padStart`; **booleanos:** `som` (ligado/desligado) e `respondeu` (impede responder duas vezes na mesma ronda); **datas:** data do recorde com `toLocaleDateString("pt-PT")` | `utils.js`, `jogo.js` |
| 3 | Dados complexos (imutáveis) | **arrays de objetos:** baralhar as frases numa **cópia** (`[...frases]`), gerar opções do modo difícil com `filter`, histórico com spread (`[...historico, resposta]`), acertos por personagem com `reduce`, recordes com `filter` por modo, `sort` numa cópia e `slice(0, 5)`; **objetos:** preferências alteradas sem mexer no original (`{ ...preferencias, som: false }`) | `jogo.js`, `storage.js` |
| 4 | DOM dinâmico | botões de resposta, lista de recordes e acertos por personagem criados com `createElement` e `appendChild`; crachá "Quem é?" e barra de estado atualizados com `textContent` | `ui.js` |
| 5 | Reatividade e eventos | `submit` do formulário; **`input` no nome** (contador "7/15" e o erro desaparece enquanto se escreve); `click` nas respostas; `change` no modo (atualiza os recordes mostrados); estados visuais ligados com `classList`: `.certa` / `.errada` nos botões e crachá `.por-revelar` → revelado | `main.js`, `ui.js` |
| 6 | Scope e closures | `criarJogo()` guarda pontos, ronda e histórico em variáveis privadas: nada de fora (nem a consola) os altera; cache dos resumos da Wikipédia para não pedir o mesmo autor duas vezes | `jogo.js`, `api.js` |
| 7 | Assincronismo | `fetch` do `frases.json` e da Wikipédia com `async/await` e `try/catch`; verificar `response.ok`; estado "A carregar…"; `audio.play()` também devolve uma Promise | `api.js` |
| 8 | Modularização | 6 ficheiros com `import` / `export`, cada um com uma responsabilidade | `js/` |
| — | Persistência | recordes e preferências no `localStorage`; partida a meio no `sessionStorage` | `storage.js` |

### Outros requisitos do enunciado

| Requisito | Como fica cumprido |
|---|---|
| Aplicação **responsiva** | pensada para computador, com media query para telemóvel: as duas colunas passam a uma |
| Repositório público no GitHub | `fredbusich/Projeto-JS` (público) |
| Publicada e funcional no GitHub Pages | ativado depois do merge do HTML; a apresentação é feita a partir do site publicado |
| `README.md` | descrição do projeto, link para o GitHub Pages e como correr localmente (Live Server) |

## 8. Visual

Ambiente de **escritório da Dunder Mifflin**, caricatural: fundo cor de papel, azul de empresa, a frase num memorando escrito à máquina e o feedback em post-it.

### Paleta

| Nome | Cor | Uso |
|---|---|---|
| Papel | `#f4efe1` | fundo da página |
| Memorando | `#fffdf7` | cartão da frase |
| Tinta | `#1e2733` | texto principal |
| Cinza | `#5b6470` | texto secundário |
| Azul | `#1f4e8c` | cabeçalho, botões, links |
| Post-it | `#f7d774` | destaques (novo recorde, título final) |
| Verde | `#276b2b` | resposta certa |
| Vermelho | `#b3261e` | resposta errada |

### Contrastes medidos (WCAG)

Mínimo exigido para texto normal: **4,5 : 1**. Todos os pares usados passam.

| Par | Rácio |
|---|---|
| tinta sobre papel | 13,1 : 1 |
| tinta sobre memorando | 14,8 : 1 |
| cinza sobre papel | 5,2 : 1 |
| branco sobre azul (botões) | 8,3 : 1 |
| azul sobre papel (links) | 7,2 : 1 |
| tinta sobre post-it | 10,7 : 1 |
| branco sobre verde | 6,5 : 1 |
| verde sobre papel | 5,7 : 1 |
| branco sobre vermelho | 6,5 : 1 |
| vermelho sobre papel | 5,7 : 1 |

O verde inicial (`#2e7d32`) dava **4,46 : 1** sobre o papel, abaixo do mínimo. Foi escurecido para `#276b2b`.

### Letras

- **Courier Prime** (Google Fonts), letra de máquina de escrever: título do jogo e texto da frase. Foi escolhida em vez da Special Elite porque tem negrito e itálico (a Special Elite só tem um estilo).
- **Letra do sistema** (`system-ui, sans-serif`): botões, formulário e resto do ecrã, para ficar legível.

## 9. Estrutura de ficheiros

```
Projeto-JS/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js      → arranque: carrega as frases e liga os eventos
│   ├── jogo.js      → regras da partida (closure criarJogo)
│   ├── ui.js        → cria e atualiza os elementos no ecrã
│   ├── api.js       → fetch do frases.json e da Wikipédia
│   ├── storage.js   → localStorage e sessionStorage
│   └── utils.js     → baralhar, formatar tempo e datas, validar o nome
├── data/
│   └── frases.json
├── img/             → favicon, sem-foto.svg
├── audio/           → música (licença livre)
├── docs/            → planeamento, esboços, capturas
└── README.md
```

O `main.js` é carregado com `<script type="module">`. Por isso o projeto tem de correr com o **Live Server** (localmente) ou no GitHub Pages: com `file://` (duplo clique no `index.html`), nem o `import` nem o `fetch` do `frases.json` funcionam.

## 10. Calendário

Cada fase é feita num ramo próprio e entra na `main` por pull request, como no CV.

| Fase | Datas | O quê | Ramos |
|---|---|---|---|
| 0. Preparação | 30/09 – 01/10 | planeamento; HTML dos 3 ecrãs; CSS base; GitHub Pages ativo | `planeamento`, `html`, `css` |
| 1. Jogo base | 02/10 – 06/10 | 30 frases no `frases.json`; partida no modo normal; ecrã final; recordes | `frases`, `jogo-base`, `recordes` |
| 2. Wikipédia e extras | 07/10 – 11/10 | cartão "Quem é?"; depois, por ordem: temporizador, modo difícil, música, retomar partida | um ramo por funcionalidade |
| 3. Acabamento | 12/10 – 13/10 | testes no telemóvel e sem internet; validação W3C; README final | `acabamento` |
| Entrega | 14/10 | fica 1 dia de margem | — |

## 11. Riscos

| Risco | Como fica resolvido |
|---|---|
| A Wikipédia falha ou está lenta | `try/catch` e o jogo continua sem o cartão; estado "A carregar…" |
| Página sem foto (Michael) | imagem alternativa `sem-foto.svg` |
| Citações falsas | verificar cada frase no Wikiquote ou na fonte original; campo `fonte` |
| Browser bloqueia o som | a música só começa no primeiro clique; `play()` dentro de `try/catch` |
| Falta de tempo | fazer primeiro a coluna "essencial"; os extras só depois |
| Direitos de autor da música de abertura | não usar o tema original; usar piano com licença livre, com crédito no README |
