// ===== main.js =====
// O "maestro": liga os eventos da página às regras (jogo.js) e ao ecrã (ui.js).

// No browser, o import precisa do "./" e da extensão ".js"
import { carregarFrases, buscarAutor } from "./api.js";
import { criarJogo } from "./jogo.js";
import { formatarNome, validarNome } from "./utils.js";
import { lerRecordes, guardarRecorde, lerPreferencias, guardarPreferencia } from "./storage.js";
import * as ui from "./ui.js";                       // * as ui = todas as funções exportadas, dentro de "ui"

const MAX_NOME = 15;

// Estado do módulo. Num módulo, estas variáveis NÃO são globais: não existem em window.
let frases = [];
let jogo = null;

// ----- arranque -----

async function iniciar() {
    // Repõe o que ficou guardado da última visita: modo escolhido, som e recordes desse modo
    const preferencias = lerPreferencias();
    ui.definirModo(preferencias.modo);
    ui.mostrarSom(preferencias.som);
    ui.mostrarRecordes(lerRecordes(preferencias.modo), preferencias.modo);

    ligarEventos();
    try {
        frases = await carregarFrases();
    } catch (erro) {
        ui.mostrarErroCarregamento(erro.message);
    }
}

function ligarEventos() {
    const formulario = document.getElementById("form-inicio");
    const campoNome = document.getElementById("nome");

    formulario.addEventListener("submit", aoSubmeter);

    // "input" dispara a cada letra: contador em tempo real e o erro desaparece enquanto se escreve
    campoNome.addEventListener("input", () => {
        ui.atualizarContador(campoNome.value.length, MAX_NOME);
        ui.mostrarErroNome("");
    });

    // "change" dispara quando se escolhe outro modo: pinta o cartão, guarda a escolha e mostra os recordes desse modo
    document.querySelectorAll("input[name='modo']").forEach((radio) => {
        radio.addEventListener("change", () => {
            ui.marcarModo(radio.value);
            guardarPreferencia("modo", radio.value);
            ui.mostrarRecordes(lerRecordes(radio.value), radio.value);
        });
    });

    // Som ligado/desligado: inverte o booleano e guarda-o (a música chega na Fase 2)
    document.getElementById("botao-som").addEventListener("click", () => {
        const preferencias = guardarPreferencia("som", !lerPreferencias().som);
        ui.mostrarSom(preferencias.som);
    });

    document.getElementById("botao-proxima").addEventListener("click", proximaRonda);

    // Jogar de novo com o mesmo nome e modo (destructuring do estado)
    document.getElementById("botao-repetir").addEventListener("click", () => {
        const { nome, modo } = jogo.estado();
        comecarPartida(nome, modo);
    });

    // Voltar ao início: os recordes são atualizados (pode ter entrado um novo)
    document.getElementById("botao-voltar").addEventListener("click", () => {
        const { modo } = ui.lerFormulario();
        ui.mostrarRecordes(lerRecordes(modo), modo);
        ui.mostrarEcra("inicio");
    });
}

// ----- fluxo do jogo -----

function aoSubmeter(evento) {
    evento.preventDefault();                          // impede o formulário de recarregar a página

    const { nome, modo } = ui.lerFormulario();
    const validacao = validarNome(nome);

    if (!validacao.valido) {
        ui.mostrarErroNome(validacao.erro);
        return;
    }

    comecarPartida(formatarNome(nome), modo);
}

function comecarPartida(nome, modo) {
    jogo = criarJogo(frases, modo, nome);
    ui.mostrarEcra("jogo");
    ui.mostrarRonda(jogo.estado(), responder);       // responder é passada como callback
}

async function responder(valor) {
    const resposta = jogo.responder(valor);
    if (resposta === null) {
        return;                                       // resposta repetida: o jogo ignorou
    }

    ui.mostrarResposta(resposta, valor, jogo.estado());
    ui.revelarAutor(resposta.frase);                  // nome e fonte já; resumo "A carregar…"

    // Pedido à Wikipédia: o jogo NÃO espera por ele. Já se pode carregar em "Próxima".
    try {
        const wiki = await buscarAutor(resposta.frase.wiki);
        if (aindaNaMesmaRonda(resposta.frase.id)) {
            ui.completarAutor(wiki);
        }
    } catch (erro) {
        if (aindaNaMesmaRonda(resposta.frase.id)) {
            ui.autorIndisponivel();
        }
    }
}

// Enquanto a Wikipédia respondia, o jogador pode ter avançado. Nesse caso,
// a resposta que chega atrasada já não pertence ao crachá que está no ecrã: ignora-se.
function aindaNaMesmaRonda(idFrase) {
    if (jogo.terminou()) {
        return false;
    }
    const estado = jogo.estado();
    return estado.respondeu && estado.frase.id === idFrase;
}

function proximaRonda() {
    jogo.avancar();

    if (jogo.terminou()) {
        const resultado = jogo.resultado();
        const posicao = guardarRecorde(resultado);   // 1 a 5 se entrou no top, 0 se não
        ui.mostrarFim(resultado, posicao);
        ui.mostrarEcra("fim");
    } else {
        ui.mostrarRonda(jogo.estado(), responder);
    }
}

iniciar();
