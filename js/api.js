// ===== api.js =====
// Tudo o que vem de fora do jogo: os ficheiros das frases e a Wikipédia.
// Este módulo não mexe no ecrã: só vai buscar dados e devolve-os a quem pediu.

// Há um ficheiro de frases por língua: data/frases.pt.json e data/frases.en.json.
// O caminho é relativo à PÁGINA (index.html), não a este ficheiro:
// o fetch é feito a partir do documento que está aberto no browser.
function urlFrases(idioma) {
    return `data/frases.${idioma}.json`;
}

// Carrega as frases da língua pedida e devolve um array de objetos
// { id, texto, nota, autor, pessoa, grupo, wiki, fonte }.
// "async" = a função devolve sempre uma Promise; lá dentro podemos usar "await".
export async function carregarFrases(idioma) {
    try {
        // await = espera pela resposta do servidor sem bloquear a página
        const resposta = await fetch(urlFrases(idioma));

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

        // Para quem joga: lança outra vez. Quem traduz e mostra a mensagem no ecrã é o main.js.
        throw erro;
    }
}

// ----- Wikipédia -----

// API de resumos da Wikipédia: não precisa de chave e aceita pedidos do GitHub Pages.
// O jogo usa-a para a FOTO de cada autor e para o link "Ler mais na Wikipédia".
// A língua muda o endereço: pt.wikipedia.org ou en.wikipedia.org
function urlWikipedia(idioma, titulo) {
    // encodeURIComponent: prepara o título para ir num endereço ("Sócrates" → "S%C3%B3crates")
    return `https://${idioma}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`;
}

// Plano B: se a página portuguesa não tiver foto, tenta a da página inglesa (caso do Michael).
// Devolve o endereço da foto, ou null se também não houver. Nunca lança erro:
// uma foto em falta não pode estragar o crachá, que já tem o link e os dados das frases.
async function buscarFotoEmIngles(titulo) {
    try {
        const resposta = await fetch(urlWikipedia("en", titulo));
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
// A cache é um objeto { "pt:Dwight_Schrute": { foto, link }, "en:Socrates": … } que só a função devolvida vê.
// A chave inclui a língua, porque o mesmo título tem links diferentes em pt e em en.
// Assim, se o Dwight aparecer 3 vezes na partida, a Wikipédia só é chamada na primeira.
function criarBuscaComCache() {
    const cache = {};

    return async function buscar(titulo, idioma) {
        const chave = `${idioma}:${titulo}`;
        if (cache[chave]) {
            return cache[chave];                      // já cá estava: responde logo, sem fetch
        }

        const resposta = await fetch(urlWikipedia(idioma, titulo));

        if (!resposta.ok) {
            throw new Error(`A Wikipédia respondeu ${resposta.status}`);
        }

        const dados = await resposta.json();

        // Validar o conteúdo, como nas frases: tem de ser uma página normal (não "desambiguação" nem erro)
        if (dados.type !== "standard") {
            throw new Error(`A página "${titulo}" não é uma página normal (${dados.type})`);
        }

        // Foto: a da página na língua escolhida; se não existir e estivermos em português,
        // o plano B em inglês (só nesse caso há 2.º pedido)
        let foto = dados.thumbnail ? dados.thumbnail.source : null;
        if (foto === null && idioma !== "en") {
            foto = await buscarFotoEmIngles(titulo);
        }

        // Fica só com o que o crachá precisa
        const autor = {
            foto,                                     // atalho para foto: foto
            link: dados.content_urls ? dados.content_urls.desktop.page : `https://${idioma}.wikipedia.org/wiki/${titulo}`,
        };

        cache[chave] = autor;                         // guarda para a próxima vez
        return autor;
    };
}

// A função que os outros módulos usam: buscarAutor("Dwight_Schrute", "pt")
export const buscarAutor = criarBuscaComCache();
