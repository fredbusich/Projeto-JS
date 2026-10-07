// ===== jogo.js =====
// As regras da partida. Não mexe no ecrã: só guarda o estado e decide o que acontece.
// O estado (ronda, pontos, histórico) fica PRIVADO dentro da closure criarJogo().

import { baralhar, calcularPercentagem } from "./utils.js";
import { t } from "./idioma.js";

export const RONDAS = 10;          // rondas por partida
const PONTOS_ACERTO = 10;          // pontos base por cada acerto

// Os três grupos do modo normal. O texto de cada botão vem do dicionário: t("grupo_michael")
export const GRUPOS = ["michael", "dwight", "filosofo"];

// Título conforme o número de acertos: if/else em cadeia, do maior para o menor
export function tituloFinal(acertos) {
    if (acertos === 10) {
        return t("titulo_melhorChefe");
    } else if (acertos >= 8) {
        return t("titulo_gerente");
    } else if (acertos >= 6) {
        return t("titulo_assistente");
    } else if (acertos >= 4) {
        return t("titulo_vendedor");
    } else {
        return t("titulo_estagiario");
    }
}

// Nome de uma pessoa na língua das frases carregadas: "confucio" → "Confúcio" ou "Confucius"
export function nomeDaPessoa(frases, pessoa) {
    const frase = frases.find((f) => f.pessoa === pessoa);
    return frase ? frase.autor : pessoa;
}

// Filtra a lista de respostas do fim: "todas", "certas" ou "erradas".
// Devolve sempre um array NOVO; o original não é alterado.
export function filtrarRespostas(respostas, filtro) {
    switch (filtro) {
        case "certas":
            return respostas.filter((resposta) => resposta.acertou);
        case "erradas":
            return respostas.filter((resposta) => !resposta.acertou);
        case "todas":
        default:
            return [...respostas];
    }
}

// Texto da resposta escolhida, para mostrar ao jogador, na língua atual.
// Normal: guarda-se o grupo ("dwight"); difícil: a pessoa ("confucio"); null = tempo esgotado.
// O modo é preciso porque "michael" e "dwight" existem como grupo E como pessoa.
export function textoDaResposta(valor, frases, modo) {
    if (valor === null) {
        return t("respostaTempoEsgotado");
    }
    return modo === "dificil" ? nomeDaPessoa(frases, valor) : t(`grupo_${valor}`);
}

// Cria uma partida nova. Devolve um objeto só com FUNÇÕES: é a única forma de mexer no estado.
export function criarJogo(frases, modo, nome) {
    // ----- estado privado: só as funções aqui dentro lhe chegam -----
    const partida = baralhar(frases).slice(0, RONDAS);  // 10 frases ao acaso, sem repetir
    let ronda = 0;                                      // índice da ronda atual (0 a 9)
    let pontos = 0;
    let historico = [];                                 // uma entrada por resposta
    let respondeu = false;                              // booleano: impede responder duas vezes
    let opcoesAtuais = gerarOpcoes();                   // os botões da ronda atual

    // ----- funções internas -----

    function fraseAtual() {
        return partida[ronda];
    }

    // A resposta certa depende do modo: o grupo (normal) ou a pessoa (difícil).
    // "pessoa" é igual nas duas línguas ("confucio"); só o nome mostrado muda.
    function respostaCerta() {
        return modo === "dificil" ? fraseAtual().pessoa : fraseAtual().grupo;
    }

    // Gera os botões da ronda. switch: cada modo tem a sua regra.
    function gerarOpcoes() {
        switch (modo) {
            case "dificil": {
                const certa = partida[ronda].pessoa;

                // Todas as pessoas, sem repetidas: fica só a primeira vez que cada uma aparece
                const pessoas = frases
                    .map((frase) => frase.pessoa)
                    .filter((pessoa, posicao, lista) => lista.indexOf(pessoa) === posicao);

                // 2 pessoas erradas ao acaso + a certa, tudo baralhado
                const erradas = baralhar(pessoas.filter((pessoa) => pessoa !== certa)).slice(0, 2);
                return baralhar([certa, ...erradas]).map((pessoa) => ({
                    valor: pessoa,
                    texto: nomeDaPessoa(frases, pessoa),
                }));
            }
            case "normal":
            default:
                return GRUPOS.map((grupo) => ({ valor: grupo, texto: t(`grupo_${grupo}`) }));
        }
    }

    // ----- funções públicas (as que saem no return) -----

    // Fotografia do estado para o ecrã. Devolve CÓPIAS: quem a recebe não consegue mudar o original.
    function estado() {
        return {
            nome,
            modo,
            ronda: ronda + 1,                           // para o ecrã: "Ronda 1", não "Ronda 0"
            total: partida.length,
            pontos,
            respondeu,
            frase: { ...fraseAtual() },
            opcoes: [...opcoesAtuais],
        };
    }

    // Regista a resposta. "segundos" é o tempo que sobrou (fica a 0 até haver temporizador).
    // Responder null = o tempo acabou: conta como errada.
    function responder(valor, segundos = 0) {
        if (respondeu || terminou()) {
            return null;                                // já respondeu nesta ronda: ignora
        }
        respondeu = true;

        const frase = fraseAtual();
        const certa = respostaCerta();
        const acertou = valor === certa;
        const ganhos = acertou ? PONTOS_ACERTO + segundos : 0;

        pontos += ganhos;
        // Histórico sem push: um array NOVO com a resposta acrescentada no fim
        // Guarda o que o jogador escolheu, para a lista do fim. Só identificadores (id, grupo, pessoa):
        // o texto e o nome são procurados na hora, na língua que estiver escolhida nesse momento.
        historico = [
            ...historico,
            { id: frase.id, grupo: frase.grupo, pessoa: frase.pessoa, resposta: valor, acertou },
        ];

        return { acertou, certa, ganhos, frase: { ...frase } };
    }

    // Passa à ronda seguinte. Só funciona depois de responder.
    function avancar() {
        if (!respondeu) {
            return false;
        }
        ronda++;
        respondeu = false;
        if (!terminou()) {
            opcoesAtuais = gerarOpcoes();
        }
        return true;
    }

    function terminou() {
        return ronda >= partida.length;
    }

    // Resumo final: acertos, percentagem, título e acertos por grupo
    function resultado() {
        const acertos = historico.filter((resposta) => resposta.acertou).length;

        // reduce: percorre o histórico e vai construindo { michael: {acertos, total}, dwight: …, filosofo: … }
        const porGrupo = historico.reduce((contagem, resposta) => {
            const atual = contagem[resposta.grupo] || { acertos: 0, total: 0 };
            return {
                ...contagem,                            // objeto novo a cada passo, sem alterar o anterior
                [resposta.grupo]: {                     // [ ] = o nome da propriedade vem da variável
                    acertos: atual.acertos + (resposta.acertou ? 1 : 0),
                    total: atual.total + 1,
                },
            };
        }, {});

        return {
            nome,
            modo,
            pontos,
            acertos,
            total: historico.length,
            percentagem: calcularPercentagem(acertos, historico.length),
            titulo: tituloFinal(acertos),
            porGrupo,
            respostas: historico.map((resposta) => ({ ...resposta })),   // cópias: o histórico original fica protegido
        };
    }

    // Só isto sai da closure. ronda, pontos e historico continuam escondidos.
    return { estado, responder, avancar, terminou, resultado };
}
