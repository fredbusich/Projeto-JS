// ===== temporizador.js =====
// Contagem decrescente de cada ronda. Não sabe nada do jogo nem do ecrã:
// recebe duas funções (callbacks) e chama-as quando é preciso.

// segundosIniciais: de quanto começa a contagem (ex.: 15)
// aCadaSegundo(restantes): chamada a cada segundo, para o ecrã mostrar o tempo
// aoTerminar(): chamada quando chega a 0
export function criarTemporizador(segundosIniciais, aCadaSegundo, aoTerminar) {
    // Estado privado (closure): ninguém de fora mexe no tempo nem no intervalo
    let restantes = segundosIniciais;
    let intervalo = null;                             // o "id" que o setInterval devolve, para o poder parar

    // Põe o relógio a andar a partir dos segundos que restam
    function correr() {
        parar();                                      // garante que nunca há dois relógios a correr ao mesmo tempo
        aCadaSegundo(restantes);                      // mostra logo o tempo, sem esperar 1 segundo

        // setInterval: repete a função a cada 1000 ms (1 segundo) até ser parado
        intervalo = setInterval(() => {
            restantes--;
            aCadaSegundo(restantes);

            if (restantes <= 0) {
                parar();
                aoTerminar();
            }
        }, 1000);
    }

    // Começa a contagem do início (ronda nova)
    function iniciar() {
        restantes = segundosIniciais;
        correr();
    }

    // Continua de onde parou (ex.: o jogador desistiu de sair a meio)
    function retomar() {
        correr();
    }

    function parar() {
        clearInterval(intervalo);                     // desliga o relógio
        intervalo = null;
    }

    // Quantos segundos sobram (para o bónus de pontos)
    function segundos() {
        return restantes;
    }

    return { iniciar, retomar, parar, segundos };
}
