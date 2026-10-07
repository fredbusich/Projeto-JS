// ===== musica.js =====
// Música de fundo do jogo. Como o temporizador, não sabe nada do jogo: só toca e pára.

export function criarMusica(caminho) {
    // Estado privado (closure): o elemento de áudio só é controlado por estas funções
    const audio = new Audio(caminho);
    audio.loop = true;                                // quando acaba, recomeça
    audio.volume = 0.3;                               // 30%: música de fundo, não pode tapar o jogo
    audio.preload = "none";                           // só descarrega o ficheiro (755 KB) quando tocar pela 1.ª vez

    // play() devolve uma Promise: é rejeitada se o browser bloquear o som
    // (nenhum site pode tocar som antes de o utilizador clicar em alguma coisa)
    // ou se o ficheiro não existir. Em qualquer dos casos, o jogo continua sem música.
    async function tocar() {
        try {
            await audio.play();
        } catch (erro) {
            console.warn("A música não tocou:", erro.message);
        }
    }

    function pausar() {
        audio.pause();
    }

    // Volume de 0 a 100 (como no slider); o áudio usa 0 a 1
    function definirVolume(percentagem) {
        const limitado = Math.min(100, Math.max(0, percentagem));   // nunca abaixo de 0 nem acima de 100
        audio.volume = limitado / 100;
    }

    return { tocar, pausar, definirVolume };
}
