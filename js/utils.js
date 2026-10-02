// ===== utils.js =====
// Funções utilitárias: pequenas, reaproveitáveis e "puras".
// Pura = recebe dados, devolve um resultado e não mexe em mais nada (nem no ecrã, nem no original).
// Por isso são fáceis de testar na consola e podem ser usadas em qualquer parte do jogo.

// Baralha uma lista SEM alterar a original (algoritmo de Fisher-Yates).
// Percorre a lista de trás para a frente e troca cada posição com outra ao acaso.
export function baralhar(lista) {
    const copia = [...lista];                           // spread: cópia nova; o original fica intacto

    for (let i = copia.length - 1; i > 0; i--) {        // for clássico, do último ao segundo
        const j = Math.floor(Math.random() * (i + 1));  // posição ao acaso entre 0 e i
        [copia[i], copia[j]] = [copia[j], copia[i]];    // troca os dois com destructuring
    }

    return copia;
}

// Limpa o nome escrito pelo jogador: tira espaços a mais e põe cada palavra com maiúscula.
// "  pam   beesly " → "Pam Beesly"
export function formatarNome(texto) {
    return texto
        .trim()                                         // tira os espaços do início e do fim
        .split(" ")                                     // parte nas palavras: ["pam", "", "", "beesly"]
        .filter((parte) => parte !== "")                // tira as "palavras" vazias dos espaços repetidos
        .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))   // "pam" → "Pam"
        .join(" ");                                     // volta a juntar com um só espaço
}

// Valida o nome e devolve um objeto: { valido: true/false, erro: "mensagem" }.
export function validarNome(texto) {
    const nome = texto.trim();

    if (nome === "") {
        return { valido: false, erro: "Escreve o teu nome para começar." };
    }
    if (nome.length < 2) {
        return { valido: false, erro: "O nome tem de ter pelo menos 2 letras." };
    }
    if (nome.length > 15) {
        return { valido: false, erro: "O nome pode ter no máximo 15 letras." };
    }

    return { valido: true, erro: "" };
}

// Segundos → "mm:ss". 15 → "00:15"; 75 → "01:15"
export function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;                        // % = resto da divisão

    // padStart(2, "0"): se o texto tiver menos de 2 caracteres, acrescenta zeros à esquerda
    return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

// Percentagem arredondada. 7 de 10 → 70
export function calcularPercentagem(parte, total) {
    if (total === 0) {
        return 0;                                       // evita dividir por zero (daria NaN)
    }
    return Math.round((parte / total) * 100);
}

// Data guardada (texto ISO) → data portuguesa. "2026-10-02T09:30:00.000Z" → "02/10/2026"
export function formatarData(dataISO) {
    return new Date(dataISO).toLocaleDateString("pt-PT");
}

// Corta um texto comprido sem partir palavras a meio e acrescenta "…".
// Vai ser usado no resumo da Wikipédia (Fase 2).
export function cortarTexto(texto, maximo) {
    if (texto.length <= maximo) {
        return texto;                                   // já é curto: fica igual
    }

    const cortado = texto.slice(0, maximo);
    const ultimoEspaco = cortado.lastIndexOf(" ");      // onde acaba a última palavra inteira

    // Ternário: se encontrou um espaço, corta aí; senão, corta no máximo
    const final = ultimoEspaco > 0 ? cortado.slice(0, ultimoEspaco) : cortado;
    return final + "…";
}
