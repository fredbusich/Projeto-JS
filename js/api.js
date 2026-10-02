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
