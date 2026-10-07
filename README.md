# That's What Who Said?

Jogo web em que o jogador lê uma frase e adivinha quem a disse: **Michael Scott**, **Dwight Schrute** (da série *The Office*) ou **um filósofo**. A graça é que muitas frases do Michael e do Dwight parecem profundas, e muitas frases de filósofos parecem saídas de uma reunião na Dunder Mifflin.

Projeto prático da UFCD **Programação em JavaScript** (UPSKILL · IPCA), feito com HTML5, CSS3 e JavaScript moderno (ES6+), sem bibliotecas.

## 🎮 Jogar

**👉 [fredbusich.github.io/Projeto-JS](https://fredbusich.github.io/Projeto-JS/)**

1. Escreve o teu nome e escolhe o modo:
   - **Normal:** três botões, *Michael*, *Dwight* ou *Filósofo*.
   - **Difícil:** adivinha o nome exato entre três pessoas.
2. Tens **15 segundos** por frase e **10 rondas** por partida. Cada acerto vale 10 pontos mais os segundos que sobraram.
3. Depois de cada resposta, o crachá "Quem é?" revela o autor, com a foto, uma nota cómica e a fonte da frase (episódio ou obra).
4. No fim recebes um título da Dunder Mifflin, de *Estagiário* a *Melhor Chefe do Mundo ☕*. O resultado entra no top 5 de recordes se for bom o suficiente.

## ✨ Funcionalidades

- **36 frases verificadas**, com a fonte de cada uma (episódio da série ou obra do filósofo)
- **Dois modos de jogo** e **temporizador** com bónus pelo tempo que sobra
- **Foto e link de cada autor** vindos da **API da Wikipédia**, com cache e plano B (se a página portuguesa não tiver foto, usa a inglesa)
- **Recordes:** top 5 por modo, guardados no navegador
- **Lista de respostas** no fim da partida, com filtros *Todas / Certas / Erradas*
- **Português e inglês**: a língua muda nos ecrãs de início e de fim (em inglês, as falas da série são as originais)
- **Música de abertura**, com botão de som e controlo de volume
- **Responder com as teclas 1, 2 e 3** e botão para **sair a meio** da partida
- **Preferências guardadas:** língua, modo, som e volume ficam como os deixaste
- **Responsivo:** duas colunas no computador, uma no telemóvel
- **Acessível:** navegação por teclado, `aria-label`, `aria-live` nas mensagens, contrastes verificados (WCAG AA)

## 🛠️ Tecnologias

| | |
|---|---|
| **HTML5** | estrutura semântica, 3 ecrãs alternados com o atributo `hidden`; validado no W3C sem erros |
| **CSS3** | variáveis, Grid e Flexbox, efeito de vidro (`backdrop-filter`), media query para telemóvel |
| **JavaScript (ES6+)** | 9 módulos com `import`/`export`, `fetch` com `async/await`, closures, `localStorage` |

## 💻 Correr localmente

O jogo usa **módulos JavaScript** (`<script type="module">`) e carrega as frases com `fetch`. Por isso **não funciona abrindo o `index.html` com duplo clique** (`file://`): é preciso um servidor local.

1. Clonar o repositório:
   ```bash
   git clone https://github.com/fredbusich/Projeto-JS.git
   ```
2. Abrir a pasta no **VS Code**.
3. Clicar com o botão direito no `index.html` e escolher **Open with Live Server** (extensão *Live Server*).

O jogo abre em `http://127.0.0.1:5500`.

## 📁 Estrutura

```
Projeto-JS/
├── index.html           → os 3 ecrãs: início, jogo e fim
├── css/style.css        → todo o estilo (variáveis, vidro, Grid, telemóvel)
├── js/
│   ├── main.js          → arranque e eventos: liga tudo
│   ├── jogo.js          → regras da partida (closure criarJogo)
│   ├── ui.js            → tudo o que mexe no ecrã
│   ├── api.js           → fetch das frases e da Wikipédia (com cache)
│   ├── storage.js       → recordes e preferências no localStorage
│   ├── temporizador.js  → contagem decrescente (closure)
│   ├── musica.js        → música de fundo (closure)
│   ├── idioma.js        → textos em português e inglês
│   └── utils.js         → funções reaproveitáveis (baralhar, validar, formatar)
├── data/
│   ├── frases.pt.json   → as 36 frases em português
│   └── frases.en.json   → as mesmas 36 frases em inglês
├── img/                 → favicon, fundo, foto do Dwight, silhueta
├── audio/tema.mp3       → música de abertura
└── docs/planeamento.md  → planeamento e registo das decisões
```

## 📚 Os 8 tópicos do módulo

| # | Tópico | Exemplo no projeto |
|---|---|---|
| 1 | Lógica e controlo de fluxo | `switch` para gerar as opções de cada modo, `if/else` em cadeia para o título final, `for` clássico a baralhar as frases |
| 2 | Dados simples | validação do nome (`trim`, 2 a 15 letras), tempo com `padStart`, datas com `toLocaleDateString` |
| 3 | Dados complexos (imutáveis) | recordes com `filter` + `sort` numa cópia + `slice`, histórico com spread, acertos por personagem com `reduce` |
| 4 | DOM dinâmico | botões de resposta, recordes, barras e lista de respostas criados com `createElement` |
| 5 | Eventos | `submit`, `input`, `change`, `click`, `keydown` |
| 6 | Scope e closures | `criarJogo`, `criarTemporizador`, `criarMusica`, cache da Wikipédia e língua atual guardados em closures |
| 7 | Assincronismo | `fetch` das frases e da Wikipédia com `async/await`, `try/catch/finally`, `response.ok`; `audio.play()` também é uma Promise |
| 8 | Modularização | 9 módulos com uma responsabilidade cada |
| — | Persistência | `localStorage` com prefixo `twws-` (recordes e preferências) |

O detalhe de cada decisão está em [`docs/planeamento.md`](docs/planeamento.md).

## 🙏 Créditos

- **Fotos dos autores:** [Wikipédia](https://www.wikipedia.org/), através da API REST de resumos. As imagens pertencem aos respetivos autores e licenças indicadas na Wikipédia.
- ***The Office*** © NBC Universal. O tema de abertura, a foto do Dwight Schrute e a imagem de fundo do escritório são usados **apenas para fins educativos, sem fins lucrativos**.
- **Frases:** citações curtas da série e de obras dos filósofos, com a fonte indicada em cada uma.
- **Letra:** [Courier Prime](https://fonts.google.com/specimen/Courier+Prime) (Google Fonts, licença OFL).

## 👤 Autor

**Frederico Busich** · UPSKILL · IPCA · outubro de 2026
