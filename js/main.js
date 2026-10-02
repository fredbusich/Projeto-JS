// ===== main.js =====
// O "maestro": importa as funções dos outros módulos e liga-as aos eventos da página.

// No browser, o import precisa do "./" e da extensão ".js"
import { carregarFrases } from "./api.js";

// Arranque do jogo
async function iniciar() {
    try {
        const frases = await carregarFrases();
        console.log(`${frases.length} frases carregadas`, frases);
    } catch (erro) {
        console.log(erro.message);
    }
}

iniciar();
