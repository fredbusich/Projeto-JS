// ===== api.js =====
// Tudo o que vem de fora do jogo: o ficheiro das frases (e, na Fase 2, a Wikipédia).
// Este módulo não mexe no ecrã: só vai buscar dados e devolve-os a quem pediu.

// O caminho é relativo à PÁGINA (index.html), não a este ficheiro:
// o fetch é feito a partir do documento que está aberto no browser.
const URL_FRASES = "data/frases.json";

// Carrega as frases e devolve um array de objetos { id, texto, autor, grupo, wiki, fonte }.
// "async" = a função devolve sempre uma Promise; lá dentro podemos usar "await".
export async function carregarFrases() {
    try {
        // await = espera pela resposta do servidor sem bloquear a página
        const resposta = await fetch(URL_FRASES);

        // O fetch só falha sozinho se não houver rede.
        // Um 404 (ficheiro não encontrado) chega como resposta "normal": temos de verificar nós.
        if (!resposta.ok) {
            throw new Error(`O servidor respondeu ${resposta.status}`);
        }

        // .json() também devolve uma Promise: converte o texto JSON num array de objetos
        const frases = await resposta.json();

        // Validar o CONTEÚDO, não só o status: um 200 pode trazer dados errados
        if (!Array.isArray(frases) || frases.length === 0) {
            throw new Error("O ficheiro das frases está vazio ou mal formatado");
        }

        return frases;
    } catch (erro) {
        // Para quem programa: o erro técnico completo na consola
        console.error("Erro ao carregar as frases:", erro);

        // Para quem joga: uma mensagem simples. Quem a mostra no ecrã é o main.js.
        throw new Error("Não foi possível carregar as frases. Tenta recarregar a página.");
    }
}

// ----- Wikipédia -----

// API de resumos da Wikipédia em português: não precisa de chave e aceita pedidos do GitHub Pages
const URL_WIKIPEDIA = "https://pt.wikipedia.org/api/rest_v1/page/summary/";
// A mesma API em inglês: só usada como plano B para a foto
const URL_WIKIPEDIA_EN = "https://en.wikipedia.org/api/rest_v1/page/summary/";

// Plano B: se a página portuguesa não tiver foto, tenta a da página inglesa (caso do Michael).
// Devolve o endereço da foto, ou null se também não houver. Nunca lança erro:
// uma foto em falta não pode estragar o crachá, que já tem o resumo em português.
async function buscarFotoEmIngles(titulo) {
    try {
        const resposta = await fetch(URL_WIKIPEDIA_EN + encodeURIComponent(titulo));
        if (!resposta.ok) {
            return null;
        }
        const dados = await resposta.json();
        return dados.thumbnail ? dados.thumbnail.source : null;
    } catch (erro) {
        return null;
    }
}

// Cria a função de busca com uma CACHE privada (closure).
// A cache é um objeto { "Dwight_Schrute": { foto, resumo, link }, … } que só a função devolvida vê.
// Assim, se o Dwight aparecer 3 vezes na partida, a Wikipédia só é chamada na primeira.
function criarBuscaComCache() {
    const cache = {};

    return async function buscar(titulo) {
        if (cache[titulo]) {
            return cache[titulo];                     // já cá estava: responde logo, sem fetch
        }

        // encodeURIComponent: prepara o título para ir num endereço ("Sócrates" → "S%C3%B3crates")
        const resposta = await fetch(URL_WIKIPEDIA + encodeURIComponent(titulo));

        if (!resposta.ok) {
            throw new Error(`A Wikipédia respondeu ${resposta.status}`);
        }

        const dados = await resposta.json();

        // Validar o conteúdo, como nas frases: sem resumo, não há nada para mostrar
        if (!dados.extract) {
            throw new Error(`A página "${titulo}" não tem resumo`);
        }

        // Foto: a da página portuguesa; se não existir, o plano B em inglês (só nesse caso há 2.º pedido)
        const foto = dados.thumbnail ? dados.thumbnail.source : await buscarFotoEmIngles(titulo);

        // Fica só com o que o crachá precisa
        const autor = {
            foto,                                     // atalho para foto: foto
            resumo: dados.extract,
            link: dados.content_urls ? dados.content_urls.desktop.page : `https://pt.wikipedia.org/wiki/${titulo}`,
        };

        cache[titulo] = autor;                        // guarda para a próxima vez
        return autor;
    };
}

// A função que os outros módulos usam: buscarAutor("Dwight_Schrute")
export const buscarAutor = criarBuscaComCache();
