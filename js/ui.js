// ===== ui.js =====
// Tudo o que mexe no ecrã. Recebe dados (do jogo.js) e mostra-os; não decide regras.

import { GRUPOS } from "./jogo.js";
import { calcularPercentagem, formatarData, formatarTempo } from "./utils.js";

const SEM_FOTO = "img/sem-foto.svg";

// Fotos guardadas no projeto, que substituem as da Wikipédia (que mostra o ator, não a personagem)
const FOTOS_LOCAIS = {
    "Dwight Schrute": "img/dwight.jpg",
};

// Os elementos da página, procurados UMA vez e guardados num objeto
const el = {
    ecras: {
        inicio: document.getElementById("ecra-inicio"),
        jogo: document.getElementById("ecra-jogo"),
        fim: document.getElementById("ecra-fim"),
    },
    botaoSom: document.getElementById("botao-som"),
    volume: document.getElementById("volume"),
    nome: document.getElementById("nome"),
    contadorNome: document.getElementById("contador-nome"),
    erroNome: document.getElementById("erro-nome"),
    botaoJogar: document.querySelector("#form-inicio button[type='submit']"),
    cartoesModo: document.querySelectorAll(".cartao-modo"),
    recordesModo: document.getElementById("recordes-modo"),
    listaRecordes: document.getElementById("lista-recordes"),
    ronda: document.getElementById("ronda"),
    pontos: document.getElementById("pontos"),
    tempo: document.getElementById("tempo"),
    memoPara: document.getElementById("memo-para"),
    textoFrase: document.getElementById("texto-frase"),
    opcoes: document.getElementById("opcoes"),
    feedback: document.getElementById("feedback"),
    cracha: document.getElementById("cartao-autor"),
    autorFoto: document.getElementById("autor-foto"),
    autorNome: document.getElementById("autor-nome"),
    autorNota: document.getElementById("autor-nota"),
    autorFonte: document.getElementById("autor-fonte"),
    autorLink: document.getElementById("autor-link"),
    botaoProxima: document.getElementById("botao-proxima"),
    fimNome: document.getElementById("fim-nome"),
    tituloFinal: document.getElementById("titulo-final"),
    resultado: document.getElementById("resultado"),
    acertosPersonagem: document.getElementById("acertos-personagem"),
    novoRecorde: document.getElementById("novo-recorde"),
};

// ----- navegação -----

// Mostra um ecrã e esconde os outros: "inicio", "jogo" ou "fim"
export function mostrarEcra(nome) {
    for (const chave in el.ecras) {
        el.ecras[chave].hidden = chave !== nome;      // true esconde, false mostra
    }
    window.scrollTo(0, 0);                            // cada ecrã começa no topo
}

// ----- ecrã de início -----

// Lê o nome escrito e o modo escolhido
export function lerFormulario() {
    return {
        nome: el.nome.value,
        modo: document.querySelector("input[name='modo']:checked").value,
    };
}

export function atualizarContador(tamanho, maximo) {
    el.contadorNome.textContent = `${tamanho}/${maximo}`;
}

export function mostrarErroNome(mensagem) {
    el.erroNome.textContent = mensagem;
}

// Pinta o cartão do modo escolhido com a classe .selecionado
export function marcarModo(modo) {
    el.cartoesModo.forEach((cartao) => {
        const escolhido = cartao.querySelector("input").value === modo;
        cartao.classList.toggle("selecionado", escolhido);   // toggle(classe, true/false): põe ou tira
    });
}

// Escolhe o modo no formulário (ex.: o último guardado nas preferências)
export function definirModo(modo) {
    const radio = document.querySelector(`input[name='modo'][value='${modo}']`);
    if (radio) {
        radio.checked = true;
        marcarModo(modo);
    }
}

// Lista do top 5 no post-it, ou a mensagem de "ainda não há recordes"
export function mostrarRecordes(recordes, modo) {
    el.recordesModo.textContent = modo === "dificil" ? "Modo difícil" : "Modo normal";
    el.listaRecordes.innerHTML = "";

    if (recordes.length === 0) {
        const vazio = document.createElement("li");
        vazio.className = "sem-recordes";
        vazio.textContent = "Ainda não há recordes. Sê o primeiro!";
        el.listaRecordes.appendChild(vazio);
        return;
    }

    recordes.forEach((recorde, indice) => {
        const li = document.createElement("li");

        const posicao = document.createElement("span");
        posicao.className = "recorde-posicao";
        posicao.textContent = `${indice + 1}.`;

        const nome = document.createElement("span");
        nome.textContent = recorde.nome;

        const pontos = document.createElement("span");
        pontos.className = "recorde-pontos";
        pontos.textContent = `${recorde.pontos} pts`;

        const data = document.createElement("span");
        data.className = "recorde-data";
        data.textContent = formatarData(recorde.data);

        li.append(posicao, nome, pontos, data);
        el.listaRecordes.appendChild(li);
    });
}

// Botão de som: o ícone e o aria-label dizem o que o clique vai fazer
export function mostrarSom(ligado) {
    el.botaoSom.textContent = ligado ? "🔊" : "🔇";
    el.botaoSom.setAttribute("aria-label", ligado ? "Desligar som" : "Ligar som");
    el.volume.disabled = !ligado;                     // som desligado: o volume não faz sentido
}

// Põe o slider na posição guardada (0 a 100)
export function mostrarVolume(valor) {
    el.volume.value = valor;
}

// Se as frases não carregarem, o jogo não pode começar
export function mostrarErroCarregamento(mensagem) {
    el.erroNome.textContent = mensagem;
    el.botaoJogar.disabled = true;
}

// ----- ecrã do jogo -----

// Desenha uma ronda nova. "aoResponder" é a função que o main.js quer chamar no clique.
export function mostrarRonda(estado, aoResponder) {
    el.ronda.textContent = `Ronda ${estado.ronda} de ${estado.total}`;
    el.pontos.textContent = estado.pontos;
    el.memoPara.textContent = estado.nome;
    el.textoFrase.textContent = `«${estado.frase.texto}»`;

    // Botões de resposta: apaga os da ronda anterior e cria os novos
    el.opcoes.innerHTML = "";
    estado.opcoes.forEach((opcao) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao";
        botao.textContent = opcao.texto;
        botao.dataset.valor = opcao.valor;            // data-valor="michael": para saber qual é depois
        botao.addEventListener("click", () => aoResponder(opcao.valor));
        el.opcoes.appendChild(botao);
    });

    el.feedback.textContent = "";
    el.feedback.className = "feedback";
    el.botaoProxima.hidden = true;
    esconderAutor();
}

// Mostra o resultado da resposta: cores nos botões, mensagem e botão "Próxima"
export function mostrarResposta(resposta, escolhido, estado) {
    el.opcoes.querySelectorAll(".opcao").forEach((botao) => {
        botao.disabled = true;                        // já não se pode clicar

        if (botao.dataset.valor === resposta.certa) {
            botao.classList.add("certa");
            botao.textContent = `✓ ${botao.textContent}`;
        } else if (botao.dataset.valor === escolhido) {
            botao.classList.add("errada");
            botao.textContent = `✗ ${botao.textContent}`;
        }
    });

    // Três mensagens possíveis: acertou, o tempo acabou (escolhido = null) ou errou
    if (resposta.acertou) {
        el.feedback.textContent = `Certo! Foi ${resposta.frase.autor}. +${resposta.ganhos} pontos`;
    } else if (escolhido === null) {
        el.feedback.textContent = `Tempo esgotado! Foi ${resposta.frase.autor}.`;
    } else {
        el.feedback.textContent = `Errado! Foi ${resposta.frase.autor}.`;
    }
    el.feedback.classList.add(resposta.acertou ? "certa" : "errada");   // ternário escolhe a classe

    el.pontos.textContent = estado.pontos;

    // Na última ronda, o botão leva ao resultado
    el.botaoProxima.textContent = estado.ronda === estado.total ? "Ver resultado →" : "Próxima →";
    el.botaoProxima.hidden = false;
    el.botaoProxima.focus();                          // quem joga com o teclado carrega logo em Enter
}

// Tempo na barra de estado: "00:12", a vermelho nos últimos 5 segundos
export function mostrarTempo(segundos) {
    el.tempo.textContent = formatarTempo(segundos);
    el.tempo.classList.toggle("urgente", segundos <= 5);
}

// O crachá tem 3 estados, cada um com a sua função:
// por revelar → revelado (dados do frases.json) → completo (foto e link da Wikipédia)

// 1) Antes de responder: silhueta e "Funcionário por identificar"
export function esconderAutor() {
    el.cracha.classList.add("por-revelar");
    el.autorFoto.src = SEM_FOTO;
    el.autorFoto.alt = "";
    el.autorNome.textContent = "Funcionário por identificar";
    el.autorNota.textContent = "Responde para descobrir.";
    el.autorFonte.textContent = "";
    el.autorLink.hidden = true;
}

// 2) Logo a seguir à resposta: tudo o que vem do frases.json aparece já (nome, nota cómica, fonte).
//    Se houver foto local, também; senão, a silhueta fica até a Wikipédia responder.
export function revelarAutor(frase) {
    el.cracha.classList.remove("por-revelar");
    el.autorNome.textContent = frase.autor;
    el.autorNota.textContent = frase.nota;
    el.autorFonte.textContent = `Fonte: ${frase.fonte}`;
    el.autorFoto.alt = frase.autor;

    const fotoLocal = FOTOS_LOCAIS[frase.autor];      // undefined se o autor não estiver no objeto
    if (fotoLocal) {
        el.autorFoto.src = fotoLocal;
    }
}

// 3) A Wikipédia respondeu: a foto (se não houver uma local) e o link
export function completarAutor(frase, wiki) {
    if (!FOTOS_LOCAIS[frase.autor]) {
        el.autorFoto.src = wiki.foto || SEM_FOTO;     // sem foto em lado nenhum: fica a silhueta
    }
    el.autorLink.href = wiki.link;
    el.autorLink.hidden = false;
}

// ----- ecrã final -----

// "posicao" = lugar conquistado no top 5 (1 a 5), ou 0 se não houve recorde
export function mostrarFim(resultado, posicao) {
    el.fimNome.textContent = resultado.nome;
    el.tituloFinal.textContent = resultado.titulo;
    el.resultado.textContent =
        `${resultado.acertos} de ${resultado.total} acertos · ${resultado.percentagem}% · ${resultado.pontos} pontos`;

    // Uma linha por grupo: nome, "3/4" e a barra
    el.acertosPersonagem.innerHTML = "";
    GRUPOS.forEach((grupo) => {
        const dados = resultado.porGrupo[grupo.valor];
        if (!dados) {
            return;                                   // este grupo não saiu nesta partida
        }

        const li = document.createElement("li");

        const nome = document.createElement("span");
        nome.textContent = grupo.texto;

        const contagem = document.createElement("span");
        contagem.textContent = `${dados.acertos}/${dados.total}`;

        const barra = document.createElement("div");
        barra.className = "barra";
        const preenchida = document.createElement("div");
        preenchida.className = "barra-preenchida";
        preenchida.style.width = `${calcularPercentagem(dados.acertos, dados.total)}%`;   // valor calculado: style

        barra.appendChild(preenchida);
        li.append(nome, contagem, barra);
        el.acertosPersonagem.appendChild(li);
    });

    el.novoRecorde.textContent = `Novo recorde! ${posicao}.º lugar`;
    el.novoRecorde.hidden = posicao === 0;
}
