// ===== storage.js =====
// O que fica guardado no navegador entre visitas: recordes e preferências (localStorage).
// As chaves têm o prefixo "twws-" porque o CV e o jogo partilham a origem fredbusich.github.io.

const CHAVE_RECORDES = "twws-recordes";
const CHAVE_PREFERENCIAS = "twws-preferencias";
const MAX_RECORDES = 5;                               // top 5 de cada modo
const PREFERENCIAS_PADRAO = { som: true, modo: "normal" };

// ----- leitura e escrita genéricas -----
// O localStorage só guarda TEXTO: JSON.stringify ao gravar, JSON.parse ao ler.

function ler(chave, valorPadrao) {
    try {
        const texto = localStorage.getItem(chave);
        return texto === null ? valorPadrao : JSON.parse(texto);   // null = nunca foi gravado
    } catch (erro) {
        // JSON estragado ou localStorage bloqueado (ex.: navegação privada): começa do zero
        console.warn(`Não foi possível ler "${chave}":`, erro);
        return valorPadrao;
    }
}

function gravar(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
        console.warn(`Não foi possível gravar "${chave}":`, erro);   // o jogo continua sem guardar
    }
}

// ----- recordes -----

function lerTodosRecordes() {
    const recordes = ler(CHAVE_RECORDES, []);
    return Array.isArray(recordes) ? recordes : [];   // se não for um array, ignora o que lá estava
}

// Os recordes de um modo, já ordenados do maior para o menor
export function lerRecordes(modo) {
    return lerTodosRecordes().filter((recorde) => recorde.modo === modo);
}

// Tenta pôr o resultado no top 5 do seu modo.
// Devolve a posição conquistada (1 a 5) ou 0 se não entrou.
export function guardarRecorde(resultado) {
    if (resultado.pontos === 0) {
        return 0;                                     // 0 pontos não é recorde
    }

    const novo = {
        nome: resultado.nome,
        pontos: resultado.pontos,
        acertos: resultado.acertos,
        modo: resultado.modo,
        data: new Date().toISOString(),               // formato universal; só é "traduzido" ao mostrar
    };

    const todos = lerTodosRecordes();
    const doModo = todos.filter((recorde) => recorde.modo === novo.modo);
    const outrosModos = todos.filter((recorde) => recorde.modo !== novo.modo);

    // Array NOVO com o recorde acrescentado, ordenado por pontos e cortado aos 5 primeiros.
    // O sort é feito na cópia criada pelo spread, nunca no array lido.
    // Em caso de empate, o sort mantém a ordem: quem chegou primeiro fica à frente.
    const top = [...doModo, novo]
        .sort((a, b) => b.pontos - a.pontos)
        .slice(0, MAX_RECORDES);

    gravar(CHAVE_RECORDES, [...outrosModos, ...top]);

    return top.indexOf(novo) + 1;                     // indexOf dá -1 se ficou de fora: -1 + 1 = 0
}

// ----- preferências -----

// Junta os valores por defeito com os guardados: o que estiver guardado ganha
export function lerPreferencias() {
    return { ...PREFERENCIAS_PADRAO, ...ler(CHAVE_PREFERENCIAS, {}) };
}

// Muda UMA preferência sem alterar o objeto original: cria um objeto novo com spread
export function guardarPreferencia(chave, valor) {
    const novas = { ...lerPreferencias(), [chave]: valor };
    gravar(CHAVE_PREFERENCIAS, novas);
    return novas;
}
