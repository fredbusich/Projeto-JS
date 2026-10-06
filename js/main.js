// ===== main.js =====
// O "maestro": liga os eventos da página às regras (jogo.js) e ao ecrã (ui.js).

// No browser, o import precisa do "./" e da extensão ".js"
import { carregarFrases, buscarAutor } from "./api.js";
import { criarJogo } from "./jogo.js";
import { formatarNome, validarNome } from "./utils.js";
import { lerRecordes, guardarRecorde, lerPreferencias, guardarPreferencia } from "./storage.js";
import { criarTemporizador } from "./temporizador.js";
import { criarMusica } from "./musica.js";
import * as ui from "./ui.js";                       // * as ui = todas as funções exportadas, dentro de "ui"

const MAX_NOME = 15;
const TEMPO_RONDA = 15;                               // segundos por ronda
const TECLAS_RESPOSTA = ["1", "2", "3"];              // tecla 1 = 1.º botão, 2 = 2.º, 3 = 3.º

const musica = criarMusica("audio/tema.mp3");

// Estado do módulo. Num módulo, estas variáveis NÃO são globais: não existem em window.
let frases = [];
let jogo = null;

// Um só temporizador para o jogo todo: a cada segundo atualiza o ecrã; ao chegar a 0, o tempo esgota
const temporizador = criarTemporizador(TEMPO_RONDA, ui.mostrarTempo, tempoEsgotado);

// ----- arranque -----

async function iniciar() {
    // Repõe o que ficou guardado da última visita: modo escolhido, som e recordes desse modo
    const preferencias = lerPreferencias();
    ui.definirModo(preferencias.modo);
    ui.mostrarSom(preferencias.som);
    ui.mostrarVolume(preferencias.volume);
    musica.definirVolume(preferencias.volume);
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

    // Som ligado/desligado: inverte o booleano, guarda-o e toca ou pára a música
    document.getElementById("botao-som").addEventListener("click", () => {
        const preferencias = guardarPreferencia("som", !lerPreferencias().som);
        ui.mostrarSom(preferencias.som);

        if (preferencias.som) {
            musica.tocar();
        } else {
            musica.pausar();
        }
    });

    // Volume: "input" dispara enquanto se arrasta o slider, por isso o som muda em tempo real.
    // O valor do slider vem como texto ("45"): Number() converte-o em número.
    const slider = document.getElementById("volume");
    slider.addEventListener("input", () => {
        const volume = Number(slider.value);
        musica.definirVolume(volume);
        guardarPreferencia("volume", volume);
    });

    // Teclado: 1, 2 e 3 respondem, mas só no ecrã do jogo
    document.addEventListener("keydown", aoCarregarTecla);

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

    // O clique em "Jogar" é a primeira interação: a partir daqui o browser já deixa tocar som
    if (lerPreferencias().som) {
        musica.tocar();
    }

    comecarPartida(formatarNome(nome), modo);
}

function aoCarregarTecla(evento) {
    // Fora do jogo, ou com Ctrl/Alt (ex.: Ctrl+1 muda de separador no browser), as teclas não respondem
    if (jogo === null || jogo.terminou() || document.getElementById("ecra-jogo").hidden) {
        return;
    }
    if (evento.ctrlKey || evento.altKey || evento.metaKey) {
        return;
    }

    const posicao = TECLAS_RESPOSTA.indexOf(evento.key);   // "2" → 1; outra tecla → -1
    if (posicao === -1) {
        return;
    }

    const { opcoes, respondeu } = jogo.estado();
    if (!respondeu) {
        responder(opcoes[posicao].valor);
    }
}

function comecarPartida(nome, modo) {
    jogo = criarJogo(frases, modo, nome);
    ui.mostrarEcra("jogo");
    ui.mostrarRonda(jogo.estado(), responder);       // responder é passada como callback
    temporizador.iniciar();
}

async function responder(valor) {
    temporizador.parar();
    // Os segundos que sobram entram como bónus (só contam se a resposta estiver certa)
    const resposta = jogo.responder(valor, temporizador.segundos());
    if (resposta === null) {
        return;                                       // resposta repetida: o jogo ignorou
    }

    ui.mostrarResposta(resposta, valor, jogo.estado());
    ui.revelarAutor(resposta.frase);                  // nome, nota cómica e fonte: já, sem esperar

    // Pedido à Wikipédia (foto e link): o jogo NÃO espera por ele. Já se pode carregar em "Próxima".
    try {
        const wiki = await buscarAutor(resposta.frase.wiki);
        if (aindaNaMesmaRonda(resposta.frase.id)) {
            ui.completarAutor(resposta.frase, wiki);
        }
    } catch (erro) {
        // Sem Wikipédia, o crachá fica com a silhueta (ou a foto local) e sem link: o jogo continua
        console.warn("Wikipédia indisponível:", erro.message);
    }
}

// O temporizador chegou a 0: responder "nada" (null) conta como errada
function tempoEsgotado() {
    responder(null);
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
        temporizador.iniciar();                       // relógio novo para a ronda nova
    }
}

iniciar();
