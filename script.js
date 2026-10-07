/* ================================================= */
/* ELEMENTOS DA PARTIDA */
/* ================================================= */

const letras =
    document.querySelectorAll('.anel-alfabeto span');

const botaoCentral =
    document.querySelector('.imgBotao');

const botaoStart =
    document.querySelector('.botaoStart img');

const tempoElemento =
    document.querySelector('#tempo');



/* ================================================= */
/* ELEMENTOS DOS SONS */
/* ================================================= */

const botaoSom =
    document.querySelector('#botaoSom');

const cartasSom =
    document.querySelector('#cartasSom');

const musicaFundo =
    document.querySelector('#musicaFundo');

const perdeuSom =
    document.querySelector('#perdeuSom');

const timerSom =
    document.querySelector('#timerSom');



/* ================================================= */
/* ESTADO DA PARTIDA */
/* ================================================= */

musicaFundo.loop = true;

musicaFundo.play();

let partidaComecou = false;

let letraEscolhida = false;

let tempo = 10;

let intervalo;



/* ================================================= */
/* JOGADORES */
/* ================================================= */

const listaJogadores =
    document.querySelector('#listaJogadores');

const inputJogador =
    document.querySelector('#nomeJogador');

const botaoAdicionar =
    document.querySelector('#botaoAdicionar');


/*
    Guarda todos os jogadores.

    Cada jogador terá:

    nome
    pontos
    elemento
    pontosElemento
*/

let jogadores = [];


/*
    Índice do jogador que está jogando.

    0 = primeiro jogador
    1 = segundo jogador
    2 = terceiro jogador
*/

let jogadorAtual = 0;



/* ================================================= */
/* ADICIONAR JOGADOR */
/* ================================================= */
function adicionarJogador() {

    const nome =
        inputJogador.value.trim();


    /* Não permite nome vazio */

    if (nome === '') {

        return;

    }


    /* Cria o elemento do jogador */

    const elemento =
        document.createElement('div');

    elemento.classList.add('jogador');


    /* Conteúdo do jogador */

    elemento.innerHTML = `

        <div class="infoJogador">

            <div class="nomePlayer">
                ${nome}
            </div>

            <div class="suaVez">
                SUA VEZ
            </div>

        </div>


        <img
            src="img/estrela.png"
            alt="Pontos"
            class="estrela"
        >


        <span class="pontosPlayer">
            0
        </span>

    `;


    /* Elemento que mostra os pontos */

    const pontosElemento =
        elemento.querySelector('.pontosPlayer');


    /* Cria objeto do jogador */

    const jogador = {

        nome: nome,

        pontos: 0,

        elemento: elemento,

        pontosElemento: pontosElemento

    };


    /* Clicar no jogador exclui ele */

    elemento.addEventListener('click', () => {

        excluirJogador(jogador);

    });


    /* Adiciona no array */

    jogadores.push(jogador);


    /* Coloca na tela */

    listaJogadores.appendChild(
        elemento
    );


    /* Limpa input */

    inputJogador.value = '';

    inputJogador.focus();


    /* Atualiza jogador amarelo */

    atualizarJogadorAtual();

}

/* ================================================= */
/* BOTÃO ADICIONAR */
/* ================================================= */

botaoAdicionar.addEventListener(
    'click',
    adicionarJogador
);



/* ================================================= */
/* ENTER TAMBÉM ADICIONA */
/* ================================================= */

inputJogador.addEventListener(
    'keydown',
    (event) => {

        if (event.key === 'Enter') {

            adicionarJogador();

        }

    }
);



/* ================================================= */
/* ATUALIZAR JOGADOR DA VEZ */
/* ================================================= */

function atualizarJogadorAtual() {

    jogadores.forEach(
        (jogador, indice) => {

            if (indice === jogadorAtual) {

                jogador.elemento.classList.add(
                    'ativo'
                );

            }

            else {

                jogador.elemento.classList.remove(
                    'ativo'
                );

            }

        }
    );

}



/* ================================================= */
/* PRÓXIMO JOGADOR */
/* ================================================= */

function proximoJogador() {

    if (jogadores.length === 0) {

        return;

    }


    jogadorAtual++;


    /*
       Se passou do último jogador,
       volta para o primeiro.
    */

    if (
        jogadorAtual >= jogadores.length
    ) {

        jogadorAtual = 0;

    }


    atualizarJogadorAtual();

}



/* ================================================= */
/* DAR PONTO AO JOGADOR ANTERIOR */
/* ================================================= */

function darPontoAoAnterior() {


    /*
       Precisa ter pelo menos
       dois jogadores.
    */

    if (jogadores.length < 2) {

        return;

    }


    /*
       Jogador anterior ao jogador
       que perdeu.
    */

    let anterior =
        jogadorAtual - 1;


    /*
       Se o primeiro jogador perdeu,
       o anterior é o último jogador.
    */

    if (anterior < 0) {

        anterior =
            jogadores.length - 1;

    }


    /* +1 ponto */

    jogadores[anterior].pontos++;


    /* Atualiza na tela */

    jogadores[
        anterior
    ].pontosElemento.textContent =
        jogadores[anterior].pontos;

}



/* ================================================= */
/* ESTADO INICIAL */
/* ================================================= */

botaoCentral.classList.add(
    'desativado'
);


/* ================================================= */
/* EXCLUIR JOGADOR */
/* ================================================= */

function excluirJogador(jogador) {

    // Descobre a posição do jogador no array
    const indice = jogadores.indexOf(jogador);

    // Segurança
    if (indice === -1) {
        return;
    }


    // Não permite excluir durante uma rodada
    if (partidaComecou) {
        return;
    }


    // Remove o jogador da tela
    jogador.elemento.remove();


    // Remove o jogador do array
    jogadores.splice(indice, 1);


    /* ================================================= */
    /* CORRIGE O JOGADOR ATUAL */
    /* ================================================= */

    // Se não sobrou ninguém
    if (jogadores.length === 0) {

        jogadorAtual = 0;
        return;

    }


    // Se apagou alguém antes do jogador atual,
    // o índice precisa voltar uma posição
    if (indice < jogadorAtual) {

        jogadorAtual--;

    }


    // Se apagou o próprio jogador atual
    // e ele era o último da lista,
    // volta para o primeiro
    if (jogadorAtual >= jogadores.length) {

        jogadorAtual = 0;

    }


    // Atualiza quem está amarelo
    atualizarJogadorAtual();

}




/* ================================================= */
/* START */
/* ================================================= */

botaoStart.addEventListener('click', () => {


    /*
       Impede iniciar outra rodada
       enquanto uma estiver acontecendo.
    */

    if (partidaComecou) {

        return;

    }


    /*
       Precisa ter pelo menos
       dois jogadores.
    */

    if (jogadores.length < 2) {

        return;

    }


    /* Som */

    botaoSom.currentTime = 0;

    botaoSom.play();


    /* Inicia partida */

    partidaComecou = true;


    /* Esconde START */

    botaoStart.style.display =
        'none';


    /* Mostra cronômetro */

    tempoElemento.style.display =
        'block';


    /* Reseta letras */

    letras.forEach(letra => {

        letra.style.opacity = '1';

        letra.style.pointerEvents = 'auto';

    });


    /* Nenhuma letra escolhida */

    letraEscolhida = false;


    /* Botão central bloqueado */

    botaoCentral.classList.add(
        'desativado'
    );


    /*
       Mantém amarelo o jogador
       que deve começar.
    */

    atualizarJogadorAtual();


    /* Começa cronômetro */

    iniciarCronometro();

});



/* ================================================= */
/* ESCOLHER LETRA */
/* ================================================= */

letras.forEach(letra => {

    letra.addEventListener('click', () => {


        /*
           Não permite escolher letra
           antes do START.
        */

        if (!partidaComecou) {

            return;

        }


        /*
           O jogador só pode escolher
           uma letra por vez.
        */

        if (letraEscolhida) {

            return;

        }


        /* Faz a letra desaparecer */

        letra.style.opacity = '0';

        letra.style.pointerEvents =
            'none';


        /* Letra escolhida */

        letraEscolhida = true;


        /* Libera botão central */

        botaoCentral.classList.remove(
            'desativado'
        );

    });

});



/* ================================================= */
/* BOTÃO CENTRAL */
/* ================================================= */

botaoCentral.addEventListener('click', () => {


    /* Partida não começou */

    if (!partidaComecou) {

        return;

    }


    /*
       Não passa a vez sem
       escolher uma letra.
    */

    if (!letraEscolhida) {

        return;

    }


    /* Som */

    botaoSom.currentTime = 0;

    botaoSom.play();


    /* ================================================= */
    /* PASSA PARA O PRÓXIMO JOGADOR */
    /* ================================================= */

    proximoJogador();


    /*
       O próximo jogador ainda
       não escolheu uma letra.
    */

    letraEscolhida = false;


    /* Bloqueia botão central */

    botaoCentral.classList.add(
        'desativado'
    );


    /* Reinicia os 10 segundos */

    iniciarCronometro();

});



/* ================================================= */
/* CRONÔMETRO */
/* ================================================= */

function iniciarCronometro() {


    /* Cancela cronômetro anterior */

    clearInterval(intervalo);


    /* Reinicia som */

    timerSom.pause();

    timerSom.currentTime = 0;

    timerSom.play();


    /* Começa em 10 */

    tempo = 10;

    tempoElemento.textContent =
        tempo;


    /* Contagem */

    intervalo = setInterval(() => {

        tempo--;

        tempoElemento.textContent =
            tempo;


        /*
           Tempo acabou.
        */

        if (tempo <= 0) {

            finalizarPartida();

        }

    }, 1000);

}



/* ================================================= */
/* TEMPO ESGOTADO */
/* ================================================= */

function finalizarPartida() {


    /* Para cronômetro */

    clearInterval(intervalo);


    /* Som de perdeu */

    perdeuSom.currentTime = 0;

    perdeuSom.play();


    /* Para som do timer */

    timerSom.pause();

    timerSom.currentTime = 0;



    /* ================================================= */
    /* PONTO PARA O JOGADOR ANTERIOR */
    /* ================================================= */

    darPontoAoAnterior();



    /*
       NÃO alteramos jogadorAtual.

       Portanto, quem perdeu continua
       amarelo e começa a próxima rodada.
    */



    /* Finaliza rodada */

    partidaComecou = false;

    letraEscolhida = false;


    /* Bloqueia botão central */

    botaoCentral.classList.add(
        'desativado'
    );



    /* ================================================= */
    /* TODAS AS LETRAS VOLTAM */
    /* ================================================= */

    letras.forEach(letra => {

        letra.style.opacity = '1';

        letra.style.pointerEvents =
            'auto';

    });



    /*
       Mantém quem perdeu amarelo.
    */

    atualizarJogadorAtual();



    /* Cronômetro fica em zero */

    tempoElemento.textContent = '0';



    /* Depois volta o START */

    setTimeout(() => {

        tempoElemento.style.display =
            'none';

        botaoStart.style.display =
            'block';

    }, 1000);

}



/* ================================================= */
/* CARTAS */
/* ================================================= */

const botaoCartas =
    document.querySelector('.botaoCartas');

const cartaTirada =
    document.querySelector('.cartaTirada');

const categoriaCarta =
    document.querySelector('.categoriaCarta');



/* ================================================= */
/* CATEGORIAS */
/* ================================================= */

const categorias = [

    "MOVIES",

    "VIDEO GAMES",

    "FOOD",

    "ANIMALS",

    "COUNTRIES",

    "SCHOOL",

    "SPORTS",

    "MUSIC",

    "FAMOUS PEOPLE",

    "FANTASY",

    "VEHICLES",

    "JOBS",

    "THINGS AT HOME",

    "NATURE",

    "BOOKS"

];



/* ================================================= */
/* ESCOLHER CATEGORIA */
/* ================================================= */

function escolherCategoria() {

    const indiceAleatorio =
        Math.floor(
            Math.random() *
            categorias.length
        );

    return categorias[
        indiceAleatorio
    ];

}



/* ================================================= */
/* DEVOLVER CARTA */
/* ================================================= */

function devolverCarta() {


    /*
       Já está sendo devolvida.
    */

    if (
        cartaTirada.classList.contains(
            'devolver'
        )
    ) {

        return;

    }


    /*
       Não existe carta aberta.
    */

    if (
        !cartaTirada.classList.contains(
            'mostrar'
        )
    ) {

        return;

    }


    /* Som */

    cartasSom.currentTime = 0;

    cartasSom.play();


    /* Carta na frente */

    cartaTirada.style.zIndex = '2';


    /* Animação */

    cartaTirada.classList.add(
        'devolver'
    );


    /*
       Coloca atrás da pilha
       durante a animação.
    */

    setTimeout(() => {

        cartaTirada.style.zIndex = '0';

    }, 350);

}



/* ================================================= */
/* CLICAR NA PILHA */
/* ================================================= */

botaoCartas.addEventListener('click', () => {


    /*
       Está devolvendo.
    */

    if (
        cartaTirada.classList.contains(
            'devolver'
        )
    ) {

        return;

    }


    /*
       Se já existe carta,
       devolve.
    */

    if (
        cartaTirada.classList.contains(
            'mostrar'
        )
    ) {

        devolverCarta();

        return;

    }


    /* Som */

    cartasSom.currentTime = 0;

    cartasSom.play();


    /* Categoria */

    const categoria =
        escolherCategoria();


    categoriaCarta.textContent =
        categoria;


    /* Carta na frente */

    cartaTirada.style.zIndex = '2';


    /* Remove animação anterior */

    cartaTirada.classList.remove(
        'devolver'
    );


    /* Reinicia animação */

    void cartaTirada.offsetWidth;


    /* Mostra carta */

    cartaTirada.classList.add(
        'mostrar'
    );

});



/* ================================================= */
/* CLICAR NA PRÓPRIA CARTA */
/* ================================================= */

cartaTirada.addEventListener(
    'click',
    () => {

        devolverCarta();

    }
);



/* ================================================= */
/* FINAL DA ANIMAÇÃO DA CARTA */
/* ================================================= */

cartaTirada.addEventListener(
    'animationend',
    (event) => {


        if (
            event.animationName ===
            'devolverCarta'
        ) {


            cartaTirada.classList.remove(
                'devolver'
            );


            cartaTirada.classList.remove(
                'mostrar'
            );


            cartaTirada.style.zIndex =
                '2';

        }

    }
);