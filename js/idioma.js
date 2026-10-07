// ===== idioma.js =====
// Todos os textos do jogo, em português e em inglês, e a língua escolhida.
// Os outros módulos nunca escrevem texto "à mão": pedem-no com t("chave").

// Dicionário: a mesma chave nas duas línguas. {nome} marca um valor que é preenchido na hora.
const TEXTOS = {
    pt: {
        // língua da página e formato das datas
        lang: "pt-PT",
        locale: "pt-PT",
        botaoIdioma: "EN",
        botaoIdiomaAria: "Switch to English",     // em inglês de propósito: é para quem procura o inglês

        // cabeçalho e rodapé
        volume: "Volume da música",
        desligarSom: "Desligar som",
        ligarSom: "Ligar som",
        rodape1: "Projeto prático · JavaScript · Frederico Busich",
        rodape2: "Fotos dos autores: Wikipédia",

        // ecrã de início
        comoSeJoga: "Como se joga",
        regras1: "Lê a frase e adivinha quem a disse: o Michael, o Dwight ou um filósofo?",
        regras2: "Filósofos em jogo: Sócrates, Nietzsche, Confúcio, Marco Aurélio e Sun Tzu.",
        oTeuNome: "O teu nome",
        exemploNome: "Ex: Pam Beesly",
        modo: "Modo",
        modoNormal: "Normal",
        modoNormalDescricao: "Michael, Dwight ou Filósofo",
        modoDificil: "Difícil",
        modoDificilDescricao: "Adivinha o nome exato",
        jogar: "Jogar",
        recordes: "Recordes",
        recordesNormal: "Modo normal",
        recordesDificil: "Modo difícil",
        semRecordes: "Ainda não há recordes. Sê o primeiro!",

        // validação do nome
        nomeVazio: "Escreve o teu nome para começar.",
        nomeCurto: "O nome tem de ter pelo menos 2 letras.",
        nomeLongo: "O nome pode ter no máximo 15 letras.",
        erroFrases: "Não foi possível carregar as frases. Tenta recarregar a página.",

        // ecrã do jogo
        ronda: "Ronda {ronda} de {total}",
        pontos: "Pontos:",
        tempo: "Tempo:",
        sair: "Sair",
        confirmarSair: "Queres mesmo sair? A partida em curso não fica guardada.",
        memorando: "Memorando",
        para: "Para:",
        assunto: "Assunto:",
        quemDisseIsto: "Quem disse isto?",
        aspaAbre: "«",
        aspaFecha: "»",
        dicaTeclas: "Dica: também podes responder com as teclas 1, 2 e 3.",
        certo: "Certo! Foi {autor}. +{pontos} pontos",
        errado: "Errado! Foi {autor}.",
        tempoEsgotado: "Tempo esgotado! Foi {autor}.",
        proxima: "Próxima →",
        verResultado: "Ver resultado →",
        quemE: "Quem é?",
        porIdentificar: "Funcionário por identificar",
        respondeParaDescobrir: "Responde para descobrir.",
        fonte: "Fonte: {fonte}",
        lerMais: "Ler mais na Wikipédia",
        grupo_michael: "Michael",
        grupo_dwight: "Dwight",
        grupo_filosofo: "Filósofo",

        // ecrã final
        fimDaPartida: "Fim da partida",
        empresa: "Dunder Mifflin · Sucursal de Scranton",
        certificaQue: "Certifica-se que",
        cumpriuRequisitos: "cumpriu os requisitos do cargo de:",
        resultado: "{acertos} de {total} acertos · {percentagem}% · {pontos} pontos",
        acertosPorPersonagem: "Acertos por personagem",
        novoRecorde: "Novo recorde! {posicao}.º lugar",
        jogarDeNovo: "Jogar de novo",
        inicio: "Início",
        titulo_estagiario: "Estagiário",
        titulo_vendedor: "Vendedor",
        titulo_assistente: "Assistente do Gerente Regional",
        titulo_gerente: "Gerente Regional",
        titulo_melhorChefe: "Melhor Chefe do Mundo ☕",

        // lista de respostas
        verRespostas: "Ver as respostas",
        esconderRespostas: "Esconder as respostas",
        asTuasRespostas: "As tuas respostas",
        filtrarRespostas: "Filtrar respostas",
        filtro_todas: "Todas ({n})",
        filtro_certas: "Certas ({n})",
        filtro_erradas: "Erradas ({n})",
        semRespostasNoFiltro: "Nenhuma resposta neste filtro.",
        acertaste: "✓ Acertaste",
        erraste: "✗ Erraste",
        detalheResposta: " · Foi {autor} · Respondeste: {resposta}",
        respostaTempoEsgotado: "nada (tempo esgotado)",
    },

    en: {
        lang: "en",
        locale: "en-US",
        botaoIdioma: "PT",
        botaoIdiomaAria: "Mudar para português",

        volume: "Music volume",
        desligarSom: "Turn sound off",
        ligarSom: "Turn sound on",
        rodape1: "Practical project · JavaScript · Frederico Busich",
        rodape2: "Author photos: Wikipedia",

        comoSeJoga: "How to play",
        regras1: "Read the quote and guess who said it: Michael, Dwight or a philosopher?",
        regras2: "Philosophers in play: Socrates, Nietzsche, Confucius, Marcus Aurelius and Sun Tzu.",
        oTeuNome: "Your name",
        exemploNome: "e.g. Pam Beesly",
        modo: "Mode",
        modoNormal: "Normal",
        modoNormalDescricao: "Michael, Dwight or Philosopher",
        modoDificil: "Hard",
        modoDificilDescricao: "Guess the exact name",
        jogar: "Play",
        recordes: "High scores",
        recordesNormal: "Normal mode",
        recordesDificil: "Hard mode",
        semRecordes: "No high scores yet. Be the first!",

        nomeVazio: "Type your name to start.",
        nomeCurto: "Your name needs at least 2 letters.",
        nomeLongo: "Your name can have at most 15 letters.",
        erroFrases: "Couldn't load the quotes. Try reloading the page.",

        ronda: "Round {ronda} of {total}",
        pontos: "Points:",
        tempo: "Time:",
        sair: "Quit",
        confirmarSair: "Do you really want to quit? This game won't be saved.",
        memorando: "Memo",
        para: "To:",
        assunto: "Subject:",
        quemDisseIsto: "Who said this?",
        aspaAbre: "“",
        aspaFecha: "”",
        dicaTeclas: "Tip: you can also answer with the 1, 2 and 3 keys.",
        certo: "Correct! It was {autor}. +{pontos} points",
        errado: "Wrong! It was {autor}.",
        tempoEsgotado: "Time's up! It was {autor}.",
        proxima: "Next →",
        verResultado: "See results →",
        quemE: "Who is it?",
        porIdentificar: "Unidentified employee",
        respondeParaDescobrir: "Answer to find out.",
        fonte: "Source: {fonte}",
        lerMais: "Read more on Wikipedia",
        grupo_michael: "Michael",
        grupo_dwight: "Dwight",
        grupo_filosofo: "Philosopher",

        fimDaPartida: "Game over",
        empresa: "Dunder Mifflin · Scranton Branch",
        certificaQue: "This certifies that",
        cumpriuRequisitos: "has met the requirements for the position of:",
        resultado: "{acertos} of {total} correct · {percentagem}% · {pontos} points",
        acertosPorPersonagem: "Score by character",
        novoRecorde: "New high score! #{posicao}",
        jogarDeNovo: "Play again",
        inicio: "Home",
        titulo_estagiario: "Intern",
        titulo_vendedor: "Salesman",
        titulo_assistente: "Assistant to the Regional Manager",
        titulo_gerente: "Regional Manager",
        titulo_melhorChefe: "World's Best Boss ☕",

        verRespostas: "See your answers",
        esconderRespostas: "Hide your answers",
        asTuasRespostas: "Your answers",
        filtrarRespostas: "Filter answers",
        filtro_todas: "All ({n})",
        filtro_certas: "Correct ({n})",
        filtro_erradas: "Wrong ({n})",
        semRespostasNoFiltro: "No answers in this filter.",
        acertaste: "✓ Correct",
        erraste: "✗ Wrong",
        detalheResposta: " · It was {autor} · You answered: {resposta}",
        respostaTempoEsgotado: "nothing (time's up)",
    },
};

export const IDIOMAS = Object.keys(TEXTOS);           // ["pt", "en"]

// A língua atual fica PRIVADA numa closure: só muda através de definir()
function criarIdioma() {
    let atual = "pt";

    function definir(novo) {
        if (IDIOMAS.includes(novo)) {                 // ignora valores estranhos (ex.: "fr" no localStorage)
            atual = novo;
        }
    }

    function obter() {
        return atual;
    }

    // t("certo", { autor: "Dwight", pontos: 22 }) → "Certo! Foi Dwight. +22 pontos"
    function t(chave, valores = {}) {
        const modelo = TEXTOS[atual][chave] || TEXTOS.pt[chave] || chave;   // se faltar a tradução, usa o português

        // Troca cada {nome} pelo valor correspondente. reduce: começa no modelo e substitui um valor de cada vez.
        return Object.entries(valores).reduce(
            (texto, [nome, valor]) => texto.replaceAll(`{${nome}}`, valor),
            modelo
        );
    }

    return { definir, obter, t };
}

const idioma = criarIdioma();

// Exportamos as três funções soltas: os outros módulos escrevem só t("chave")
export const definirIdioma = idioma.definir;
export const idiomaAtual = idioma.obter;
export const t = idioma.t;
