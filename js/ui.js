// ===== ui.js =====
// Tudo o que mexe no ecrã. Recebe dados (do jogo.js) e mostra-os; não decide regras.
// Nenhum texto está escrito aqui: vem todo do dicionário, com t("chave").

import { GRUPOS, textoDaResposta } from "./jogo.js";
import { calcularPercentagem, formatarData, formatarTempo } from "./utils.js";
import { t } from "./idioma.js";

const SEM_FOTO = "img/sem-foto.svg";

// Fotos guardadas no projeto, que substituem as da Wikipédia (que mostra o ator, não a personagem).
// A chave é a "pessoa", que é igual nas duas línguas.
const FOTOS_LOCAIS = {
    dwight: "img/dwight.jpg",
};

// Os elementos da página, procurados UMA vez e guardados num objeto
const el = {
    ecras: {
        inicio: document.getElementById("ecra-inicio"),
        jogo: document.getElementById("ecra-jogo"),
        fim: document.getElementById("ecra-fim"),
    },
    botaoIdioma: document.getElementById("botao-idioma"),
    botaoSom: document.getElementById("botao-som"),
    volume: document.getElementById("volume"),
    nome: document.getElementById("nome"),
    contadorNome: document.getElementById("contador-nome"),
    erroNome: document.getElementById("erro-nome"),
    botaoJogar: document.querySelector("#form-inicio button[type='submit']"),
    botaoRepetir: document.getElementById("botao-repetir"),
    frase: document.getElementById("frase"),
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
    botaoVerRespostas: document.getElementById("botao-ver-respostas"),
    listaRespostas: document.getElementById("lista-respostas"),
    respostas: document.getElementById("respostas"),
    filtros: document.querySelectorAll(".filtro"),
};

// ----- língua -----

// Põe na página os textos fixos da língua atual.
// Procura os elementos marcados no HTML com data-texto, data-texto-placeholder e data-texto-aria.
export function aplicarTextos() {
    document.documentElement.lang = t("lang");       // <html lang="en">: os leitores de ecrã mudam a pronúncia

    document.querySelectorAll("[data-texto]").forEach((elemento) => {
        elemento.textContent = t(elemento.dataset.texto);
    });
    document.querySelectorAll("[data-texto-placeholder]").forEach((elemento) => {
        elemento.placeholder = t(elemento.dataset.textoPlaceholder);   // data-texto-placeholder → dataset.textoPlaceholder
    });
    document.querySelectorAll("[data-texto-aria]").forEach((elemento) => {
        elemento.setAttribute("aria-label", t(elemento.dataset.textoAria));
    });
}

// ----- navegação -----

// Mostra um ecrã e esconde os outros: "inicio", "jogo" ou "fim"
export function mostrarEcra(nome) {
    for (const chave in el.ecras) {
        el.ecras[chave].hidden = chave !== nome;      // true esconde, false mostra
    }
    el.botaoIdioma.disabled = nome === "jogo";        // a língua não muda a meio de uma partida
    window.scrollTo(0, 0);                            // cada ecrã começa no topo
}

export function ecraAtual() {
    for (const chave in el.ecras) {
        if (!el.ecras[chave].hidden) {
            return chave;
        }
    }
    return "inicio";
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

// Recebe a CHAVE do erro (ex.: "nomeCurto") e mostra o texto na língua atual; "" apaga o erro
export function mostrarErroNome(chave) {
    el.erroNome.textContent = chave ? t(chave) : "";
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
    el.recordesModo.textContent = modo === "dificil" ? t("recordesDificil") : t("recordesNormal");
    el.listaRecordes.innerHTML = "";

    if (recordes.length === 0) {
        const vazio = document.createElement("li");
        vazio.className = "sem-recordes";
        vazio.textContent = t("semRecordes");
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
        data.textContent = formatarData(recorde.data, t("locale"));

        li.append(posicao, nome, pontos, data);
        el.listaRecordes.appendChild(li);
    });
}

// Botão de som: o ícone e o aria-label dizem o que o clique vai fazer
export function mostrarSom(ligado) {
    el.botaoSom.textContent = ligado ? "🔊" : "🔇";
    el.botaoSom.setAttribute("aria-label", ligado ? t("desligarSom") : t("ligarSom"));
    el.volume.disabled = !ligado;                     // som desligado: o volume não faz sentido
}

// Põe o slider na posição guardada (0 a 100)
export function mostrarVolume(valor) {
    el.volume.value = valor;
}

// Enquanto as frases estão a chegar, nada que comece uma partida (ou mude a língua) pode ser clicado.
// Sem isto, numa rede lenta, "Jogar" arrancava com zero frases ("Ronda 1 de 0").
export function bloquearEnquantoCarrega(aCarregar) {
    el.botaoJogar.disabled = aCarregar;
    el.botaoRepetir.disabled = aCarregar;
    el.botaoIdioma.disabled = aCarregar;
}

// Se as frases não carregarem, o jogo não pode começar: os botões ficam bloqueados e aparece o aviso
export function mostrarErroCarregamento() {
    el.erroNome.textContent = t("erroFrases");
    el.botaoJogar.disabled = true;
    el.botaoRepetir.disabled = true;
    el.botaoIdioma.disabled = false;                  // a outra língua pode carregar: deixa tentar
}

// ----- ecrã do jogo -----

// Desenha uma ronda nova. "aoResponder" é a função que o main.js quer chamar no clique.
export function mostrarRonda(estado, aoResponder) {
    el.ronda.textContent = t("ronda", { ronda: estado.ronda, total: estado.total });
    el.pontos.textContent = estado.pontos;
    el.memoPara.textContent = estado.nome;
    el.textoFrase.textContent = `${t("aspaAbre")}${estado.frase.texto}${t("aspaFecha")}`;   // «…» ou “…”

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

    // O botão "Próxima" que tinha o foco acabou de desaparecer: sem isto, o foco "caía" no <body>.
    // Pô-lo na frase faz o leitor de ecrã lê-la; com o teclado, o Tab segue logo para as respostas.
    // preventScroll: não faz a página saltar (no telemóvel, a frase pode já estar fora do ecrã).
    el.frase.focus({ preventScroll: true });
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
    const autor = resposta.frase.autor;
    if (resposta.acertou) {
        el.feedback.textContent = t("certo", { autor, pontos: resposta.ganhos });
    } else if (escolhido === null) {
        el.feedback.textContent = t("tempoEsgotado", { autor });
    } else {
        el.feedback.textContent = t("errado", { autor });
    }
    el.feedback.classList.add(resposta.acertou ? "certa" : "errada");   // ternário escolhe a classe

    el.pontos.textContent = estado.pontos;

    // Na última ronda, o botão leva ao resultado
    el.botaoProxima.textContent = estado.ronda === estado.total ? t("verResultado") : t("proxima");
    el.botaoProxima.hidden = false;
    el.botaoProxima.focus();                          // quem joga com o teclado carrega logo em Enter
}

// Tempo na barra de estado: "00:12", a vermelho nos últimos 5 segundos
export function mostrarTempo(segundos) {
    el.tempo.textContent = formatarTempo(segundos);
    el.tempo.classList.toggle("urgente", segundos <= 5);
}

// O crachá tem 3 estados, cada um com a sua função:
// por revelar → revelado (dados das frases) → completo (foto e link da Wikipédia)

// 1) Antes de responder: silhueta e "Funcionário por identificar"
export function esconderAutor() {
    el.cracha.classList.add("por-revelar");
    el.autorFoto.src = SEM_FOTO;
    el.autorFoto.alt = "";
    el.autorNome.textContent = t("porIdentificar");
    el.autorNota.textContent = t("respondeParaDescobrir");
    el.autorFonte.textContent = "";
    el.autorLink.hidden = true;
}

// 2) Logo a seguir à resposta: tudo o que vem das frases aparece já (nome, nota cómica, fonte).
//    Se houver foto local, também; senão, a silhueta fica até a Wikipédia responder.
export function revelarAutor(frase) {
    el.cracha.classList.remove("por-revelar");
    el.autorNome.textContent = frase.autor;
    el.autorNota.textContent = frase.nota;
    el.autorFonte.textContent = t("fonte", { fonte: frase.fonte });
    el.autorFoto.alt = frase.autor;

    const fotoLocal = FOTOS_LOCAIS[frase.pessoa];     // undefined se a pessoa não estiver no objeto
    if (fotoLocal) {
        el.autorFoto.src = fotoLocal;
    }
}

// 3) A Wikipédia respondeu: a foto (se não houver uma local) e o link
export function completarAutor(frase, wiki) {
    if (!FOTOS_LOCAIS[frase.pessoa]) {
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
    el.resultado.textContent = t("resultado", {
        acertos: resultado.acertos,
        total: resultado.total,
        percentagem: resultado.percentagem,
        pontos: resultado.pontos,
    });

    // Uma linha por grupo: nome, "3/4" e a barra
    el.acertosPersonagem.innerHTML = "";
    GRUPOS.forEach((grupo) => {
        const dados = resultado.porGrupo[grupo];
        if (!dados) {
            return;                                   // este grupo não saiu nesta partida
        }

        const li = document.createElement("li");

        const nome = document.createElement("span");
        nome.textContent = t(`grupo_${grupo}`);

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

    el.novoRecorde.textContent = t("novoRecorde", { posicao });
    el.novoRecorde.hidden = posicao === 0;
}

// ----- lista de respostas (ecrã final) -----

// Abre ou fecha a lista. aria-expanded diz aos leitores de ecrã se está aberta.
export function alternarRespostas(mostrar) {
    el.listaRespostas.hidden = !mostrar;
    el.botaoVerRespostas.textContent = mostrar ? t("esconderRespostas") : t("verRespostas");
    el.botaoVerRespostas.setAttribute("aria-expanded", mostrar);
}

export function respostasVisiveis() {
    return !el.listaRespostas.hidden;
}

// Pinta o filtro escolhido e escreve quantas respostas há em cada um: "Certas (7)"
export function marcarFiltro(filtro, respostas) {
    const certas = respostas.filter((resposta) => resposta.acertou).length;
    const contagens = { todas: respostas.length, certas, erradas: respostas.length - certas };

    el.filtros.forEach((botao) => {
        const chave = botao.dataset.filtro;
        botao.textContent = t(`filtro_${chave}`, { n: contagens[chave] });
        botao.classList.toggle("ativo", chave === filtro);
        botao.setAttribute("aria-pressed", chave === filtro);   // "true" só no filtro escolhido
    });
}

// Qual é o filtro que está ativo agora ("todas", "certas" ou "erradas")
export function filtroAtivo() {
    const ativo = document.querySelector(".filtro.ativo");
    return ativo ? ativo.dataset.filtro : "todas";
}

// Uma linha por resposta: a frase, quem a disse, o que o jogador escolheu e se acertou.
// O texto e o nome vêm das frases carregadas (procuradas pelo id), por isso aparecem na língua atual.
export function mostrarRespostas(respostas, frases, modo) {
    el.respostas.innerHTML = "";

    if (respostas.length === 0) {
        const vazio = document.createElement("li");
        vazio.textContent = t("semRespostasNoFiltro");
        el.respostas.appendChild(vazio);
        return;
    }

    respostas.forEach((resposta) => {
        const dadosFrase = frases.find((frase) => frase.id === resposta.id);

        const li = document.createElement("li");
        li.className = resposta.acertou ? "certa" : "errada";

        const frase = document.createElement("p");
        frase.className = "resposta-frase";
        frase.textContent = `${t("aspaAbre")}${dadosFrase.texto}${t("aspaFecha")}`;

        const detalhe = document.createElement("p");
        detalhe.className = "resposta-detalhe";

        const estado = document.createElement("strong");
        estado.className = resposta.acertou ? "certa" : "errada";
        estado.textContent = resposta.acertou ? t("acertaste") : t("erraste");

        // O resto é texto simples: append aceita elementos e texto misturados
        detalhe.append(estado, t("detalheResposta", {
            autor: dadosFrase.autor,
            resposta: textoDaResposta(resposta.resposta, frases, modo),
        }));

        li.append(frase, detalhe);
        el.respostas.appendChild(li);
    });
}
