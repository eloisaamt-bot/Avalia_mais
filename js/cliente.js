const API_URL = "https://localhost:7254/Avaliacao";

let setores = [];
let setoresAvaliados = [];
let setorSelecionado = null;
let notaSetorSelecionada = null;
let notaGeralSelecionada = null;
let motivosSetorSelecionados = [];
let requisicaoMotivos = 0;


// ==========================================
// ELEMENTOS DA TELA
// ==========================================


const listaSetores = document.getElementById("listaSetores");
const contadorSetores = document.getElementById("contadorSetores");

const areaPergunta = document.getElementById("areaPergunta");
const nomeSetor = document.getElementById("nomeSetor");
const perguntaSetor = document.getElementById("perguntaSetor");
const notasSetor = document.getElementById("notasSetor");

const areaMotivos = document.createElement("div");

areaMotivos.id = "areaMotivos";
areaMotivos.className = "area-motivos";
areaMotivos.style.marginTop = "20px";

notasSetor.insertAdjacentElement("afterend", areaMotivos);

const btnProximo = document.getElementById("btnProximo");
const btnFinalizar = document.getElementById("btnFinalizar");

const etapaSetor = document.getElementById("etapaSetor");
const etapaGeral = document.getElementById("etapaGeral");

const notasGeral = document.getElementById("notasGeral");
const comentario = document.getElementById("comentario");

const btnEnviar = document.getElementById("btnEnviar");

const mensagemFinal = document.getElementById("mensagemFinal");


// ==========================================
// BUSCAR SETORES
// ==========================================

function carregarSetores() {

    fetch(`${API_URL}/setores`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Não foi possível carregar os setores.");
            }

            return response.json();
        })
        .then(data => {

            setores = data;

            mostrarSetores();

        })
        .catch(error => {

            console.error(error);

            alert("Erro ao carregar os setores.");

        });
}


// ==========================================
// MOSTRAR SETORES
// ==========================================

function mostrarSetores() {

    listaSetores.innerHTML = "";

    contadorSetores.textContent =
        `Setores avaliados: ${setoresAvaliados.length} de ${setores.length}`;

    setores.forEach(setor => {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "botao-setor";


        // ==========================================
        // ÍCONE DO SETOR
        // ==========================================

        const icone = document.createElement("div");

        icone.className = "icone-setor";

        icone.innerHTML = obterIconeSetor(setor.nome);


        // ==========================================
        // CONTEÚDO DO SETOR
        // ==========================================

        const conteudo = document.createElement("div");

        conteudo.className = "conteudo-setor";


        const nome = document.createElement("div");

        nome.className = "nome-setor";

        nome.textContent = setor.nome;


        const descricao = document.createElement("div");

        descricao.className = "descricao-setor";

        descricao.textContent = setor.pergunta;


        conteudo.appendChild(nome);
        conteudo.appendChild(descricao);


        botao.appendChild(icone);
        botao.appendChild(conteudo);


        // ==========================================
        // VERIFICAR SE JÁ FOI AVALIADO
        // ==========================================

        const jaAvaliou = setoresAvaliados.some(
            item => item.idSetor === setor.id
        );


        if (jaAvaliou) {

            botao.disabled = true;

            descricao.textContent = "Setor já avaliado.";

        }
        else {

            botao.addEventListener("click", function () {

                selecionarSetor(setor);

            });

        }


        listaSetores.appendChild(botao);

    });
}


// ==========================================
// ÍCONE DO SETOR
// ==========================================

function obterIconeSetor(nomeSetor) {

    const nome = nomeSetor.toLowerCase();

    if (nome.includes("atendimento")) {
        return '<i class="fa-solid fa-handshake"></i>';
    }

    if (nome.includes("caixa")) {
        return '<i class="fa-solid fa-cash-register"></i>';
    }

    if (nome.includes("ambiente")) {
        return '<i class="fa-solid fa-store"></i>';
    }

    if (nome.includes("limpeza")) {
        return '<i class="fa-solid fa-broom"></i>';
    }

    if (nome.includes("produto")) {
        return '<i class="fa-solid fa-box"></i>';
    }

    if (nome.includes("entrega")) {
        return '<i class="fa-solid fa-truck"></i>';
    }

    if (nome.includes("agilidade")) {
        return '<i class="fa-solid fa-bolt"></i>';
    }

    return '<i class="fa-solid fa-star"></i>';
}

// ==========================================
// SELECIONAR SETOR
// ==========================================

function selecionarSetor(setor) {

    setorSelecionado = setor;

    notaSetorSelecionada = null;

    motivosSetorSelecionados = [];

    areaMotivos.innerHTML = "";
    areaMotivos.style.display = "none";


    nomeSetor.textContent = setor.nome;

    perguntaSetor.textContent = setor.pergunta;


    criarNotasSetor();


    areaPergunta.classList.remove("oculto");


    areaPergunta.scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// CRIAR NOTAS DE 1 A 5
// ==========================================

function criarNotasSetor() {

    notasSetor.innerHTML = "";


    for (let nota = 1; nota <= 5; nota++) {

        const botao = document.createElement("button");

        botao.type = "button";

        botao.className = "botao-nota";

        botao.textContent = nota;


        botao.addEventListener("click", function () {

            notaSetorSelecionada = nota;

            document
                .querySelectorAll("#notasSetor .botao-nota")
                .forEach(item => {
                    item.classList.remove("selecionado");
                });

            botao.classList.add("selecionado");

            buscarMotivos(setorSelecionado.id, nota);

        });


        notasSetor.appendChild(botao);

    }
}

// ==========================================
// BUSCAR MOTIVOS DA AVALIAÇÃO
// ==========================================

function buscarMotivos(setorId, nota) {

    const requisicaoAtual = ++requisicaoMotivos;

    motivosSetorSelecionados = [];

    areaMotivos.innerHTML = "<p>Carregando motivos...</p>";

    areaMotivos.style.display = "block";

    fetch(`${API_URL}/motivos?setorId=${setorId}&nota=${nota}`)
        .then(response => {

            if (!response.ok) {
                throw new Error("Não foi possível buscar os motivos.");
            }

            return response.json();

        })
        .then(motivos => {

            // Evita mostrar resposta de uma nota anterior
            if (requisicaoAtual !== requisicaoMotivos) {
                return;
            }

            areaMotivos.innerHTML = "";

            const titulo = document.createElement("h3");

            titulo.textContent = "Selecione os motivos:";

            areaMotivos.appendChild(titulo);

            if (motivos.length === 0) {

                areaMotivos.innerHTML =
                    "<p>Não há motivos cadastrados para esta nota.</p>";

                return;
            }

            motivos.forEach(motivo => {

                const label = document.createElement("label");

                const checkbox = document.createElement("input");

                checkbox.type = "checkbox";
                checkbox.value = motivo.id;

                checkbox.addEventListener("change", function () {

                    const idMotivo = Number(motivo.id);

                    if (this.checked) {

                        motivosSetorSelecionados.push(idMotivo);

                    } else {

                        motivosSetorSelecionados =
                            motivosSetorSelecionados.filter(
                                id => id !== idMotivo
                            );

                    }

                });

                const texto = document.createElement("span");

                texto.textContent = motivo.descricao;

                label.appendChild(checkbox);
                label.appendChild(texto);

                label.style.display = "block";
                label.style.marginBottom = "10px";

                areaMotivos.appendChild(label);

            });

        })
        .catch(error => {

            if (requisicaoAtual !== requisicaoMotivos) {
                return;
            }

            console.error(error);

            areaMotivos.innerHTML =
                "<p>Erro ao carregar os motivos. Tente novamente.</p>";

        });
}

// ==========================================
// SALVAR AVALIAÇÃO DO SETOR
// ==========================================

function salvarAvaliacaoSetor() {

    if (setorSelecionado == null) {

        alert("Selecione um setor.");

        return false;
    }


    if (notaSetorSelecionada == null) {

        alert("Selecione uma nota de 1 a 5.");

        return false;
    }


    setoresAvaliados.push({

        idSetor: setorSelecionado.id,

        nota: notaSetorSelecionada,

        motivos: [...motivosSetorSelecionados]

    });


    setorSelecionado = null;

    notaSetorSelecionada = null;


    areaPergunta.classList.add("oculto");


    mostrarSetores();


    return true;
}


// ==========================================
// AVALIAR OUTRO SETOR
// ==========================================

btnProximo.addEventListener("click", function () {

    salvarAvaliacaoSetor();

});


// ==========================================
// FINALIZAR PESQUISA
// ==========================================

btnFinalizar.addEventListener("click", function () {

    const salvou = salvarAvaliacaoSetor();


    if (!salvou) {
        return;
    }


    if (setoresAvaliados.length === 0) {

        alert("Avalie pelo menos um setor.");

        return;
    }


    etapaSetor.classList.add("oculto");


    etapaGeral.classList.remove("oculto");


    criarNotasGerais();


    etapaGeral.scrollIntoView({
        behavior: "smooth"
    });

});


// ==========================================
// CRIAR NOTAS GERAIS DE 1 A 10
// ==========================================

function criarNotasGerais() {

    notasGeral.innerHTML = "";


    for (let nota = 1; nota <= 10; nota++) {

        const botao = document.createElement("button");

        botao.type = "button";

        botao.className = "botao-nota";

        botao.textContent = nota;


        botao.addEventListener("click", function () {

            notaGeralSelecionada = nota;


            document
                .querySelectorAll("#notasGeral .botao-nota")
                .forEach(item => {

                    item.classList.remove("selecionado");

                });


            botao.classList.add("selecionado");

        });


        notasGeral.appendChild(botao);

    }
}


// ==========================================
// ENVIAR PESQUISA
// ==========================================

btnEnviar.addEventListener("click", function () {

    // Verifica nota geral

    if (notaGeralSelecionada == null) {

        alert("Selecione uma nota geral de 1 a 10.");

        return;
    }


    // Verifica se existe pelo menos um setor

    if (setoresAvaliados.length === 0) {

        alert("Avalie pelo menos um setor.");

        return;
    }


    // ==========================================
    // MONTA OS DADOS DA PESQUISA
    // ==========================================

    const dadosPesquisa = {

        nota: notaGeralSelecionada,

        comentario: comentario.value.trim(),

        setores: setoresAvaliados

    };


    console.log("Dados enviados:");

    console.log(dadosPesquisa);


    // Desabilita botão para evitar envio duplicado

    btnEnviar.disabled = true;


    // ==========================================
    // ENVIA PARA A API
    // ==========================================

    fetch(API_URL, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(dadosPesquisa)

    })


        .then(response => {

            if (!response.ok) {

                return response.text().then(mensagem => {

                    throw new Error(mensagem);

                });

            }


            return response.json();

        })


        .then(data => {

            console.log("Resposta da API:");

            console.log(data);


            // Esconde avaliação geral

            etapaGeral.classList.add("oculto");


            // Mostra mensagem final

            mensagemFinal.classList.remove("oculto");


            mensagemFinal.scrollIntoView({

                behavior: "smooth"

            });

        })


        .catch(error => {

            console.error("Erro ao enviar avaliação:");

            console.error(error);


            alert(
                "Não foi possível enviar a avaliação.\n\n" +
                error.message
            );


            btnEnviar.disabled = false;

        });

});


// ==========================================
// INICIAR A PÁGINA
// ==========================================

carregarSetores();