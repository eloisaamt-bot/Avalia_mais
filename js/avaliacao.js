// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API = "https://localhost:7254/Avaliacao/Avaliacoes";

let avaliacoes = [];

let ordemAtual = "data";


// ==========================================
// INICIAR
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    carregarAvaliacoes();

    document
        .getElementById("filtroSetor")
        .addEventListener("change", aplicarFiltros);

    document
        .getElementById("filtroNota")
        .addEventListener("change", aplicarFiltros);


    document
        .getElementById("ordenarData")
        .addEventListener("click", function () {

            ordemAtual = "data";

            atualizarBotoesOrdem();

            aplicarFiltros();
        });


    document
        .getElementById("ordenarNota")
        .addEventListener("click", function () {

            ordemAtual = "nota";

            atualizarBotoesOrdem();

            aplicarFiltros();
        });

});


// ==========================================
// BUSCAR AVALIAÇÕES
// ==========================================

async function carregarAvaliacoes() {

    try {

        const resposta = await fetch(
            `${API}/Avaliacao/lista`
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar avaliações."
            );
        }


        avaliacoes = await resposta.json();


        carregarFiltroSetores();

        atualizarContador(
            avaliacoes.length
        );

        aplicarFiltros();


    } catch (erro) {

        console.error(erro);

        document.getElementById(
            "listaAvaliacoes"
        ).innerHTML = `

            <div class="sem-avaliacoes">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <p>
                    Não foi possível carregar as avaliações.
                </p>

            </div>

        `;
    }
}


// ==========================================
// FILTRO DE SETORES
// ==========================================

function carregarFiltroSetores() {

    const select =
        document.getElementById("filtroSetor");


    const setores = [];


    avaliacoes.forEach(function (avaliacao) {

        if (!setores.includes(avaliacao.setor)) {

            setores.push(
                avaliacao.setor
            );
        }

    });


    setores.sort();


    setores.forEach(function (setor) {

        const option =
            document.createElement("option");

        option.value = setor;

        option.textContent = setor;

        select.appendChild(option);

    });

}


// ==========================================
// APLICAR FILTROS
// ==========================================

function aplicarFiltros() {

    const setorSelecionado =
        document.getElementById(
            "filtroSetor"
        ).value;


    const notaSelecionada =
        document.getElementById(
            "filtroNota"
        ).value;


    let resultado =
        [...avaliacoes];


    // FILTRO SETOR

    if (setorSelecionado !== "todos") {

        resultado =
            resultado.filter(function (avaliacao) {

                return avaliacao.setor ===
                    setorSelecionado;

            });

    }


    // FILTRO NOTA

    if (notaSelecionada !== "todas") {

        const nota =
            Number(notaSelecionada);


        resultado =
            resultado.filter(function (avaliacao) {

                return avaliacao.notaSetor === nota;

            });

    }


    // ORDENAÇÃO

    if (ordemAtual === "data") {

        resultado.sort(function (a, b) {

            return new Date(b.dataHora)
                - new Date(a.dataHora);

        });

    }


    if (ordemAtual === "nota") {

        resultado.sort(function (a, b) {

            return b.notaSetor
                - a.notaSetor;

        });

    }


    atualizarContador(
        resultado.length
    );


    mostrarAvaliacoes(resultado);
}


// ==========================================
// MOSTRAR AVALIAÇÕES
// ==========================================

function mostrarAvaliacoes(lista) {

    const container =
        document.getElementById(
            "listaAvaliacoes"
        );


    container.innerHTML = "";


    if (lista.length === 0) {

        container.innerHTML = `

            <div class="sem-avaliacoes">

                <i class="fa-regular fa-face-frown"></i>

                <p>
                    Nenhuma avaliação encontrada.
                </p>

            </div>

        `;

        return;
    }


    lista.forEach(function (avaliacao) {

        const card =
            document.createElement("div");


        card.classList.add(
            "card-avaliacao"
        );


        const classificacao =
            obterClassificacao(
                avaliacao.notaSetor
            );


        const estrelas =
            criarEstrelas(
                avaliacao.notaSetor
            );


        const data =
            formatarData(
                avaliacao.dataHora
            );


        const comentario =
            avaliacao.comentario &&
            avaliacao.comentario.trim() !== ""
                ? `"${avaliacao.comentario}"`
                : "Sem comentário";


        card.innerHTML = `

            <div class="icone-avaliacao">

                <i class="fa-solid fa-building"></i>

            </div>


            <div class="info-avaliacao">

                <div class="linha-superior">

                    <span class="nome-setor">

                        ${avaliacao.setor}

                    </span>

                    <span class="estrelas">

                        ${estrelas}

                    </span>

                </div>


                <p class="comentario">

                    ${comentario}

                </p>

            </div>


            <div class="lado-direito">

                <span
                    class="classificacao ${classificacao.classe}"
                >

                    ${classificacao.nome}

                </span>


                <span class="data-avaliacao">

                    ${data}

                </span>

            </div>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// ESTRELAS
// ==========================================

function criarEstrelas(nota) {

    let resultado = "";


    for (let i = 1; i <= 5; i++) {

        if (i <= nota) {

            resultado += `
                <i class="fa-solid fa-star estrela-cheia"></i>
            `;

        } else {

            resultado += `
                <i class="fa-regular fa-star estrela-vazia"></i>
            `;

        }

    }


    return resultado;
}


// ==========================================
// CLASSIFICAÇÃO
// ==========================================

function obterClassificacao(nota) {

    if (nota === 5) {

        return {
            nome: "Excelente",
            classe: "excelente"
        };

    }


    if (nota >= 4) {

        return {
            nome: "Bom",
            classe: "bom"
        };

    }


    if (nota === 3) {

        return {
            nome: "Regular",
            classe: "regular"
        };

    }


    return {

        nome: "Ruim",

        classe: "ruim"

    };

}


// ==========================================
// DATA
// ==========================================

function formatarData(data) {

    if (!data) {

        return "";

    }


    const dataObj =
        new Date(data);


    return dataObj.toLocaleDateString(
        "pt-BR"
    );

}


// ==========================================
// CONTADOR
// ==========================================

function atualizarContador(quantidade) {

    const contador =
        document.getElementById(
            "contadorAvaliacoes"
        );


    contador.textContent =
        `${quantidade} ${quantidade === 1
            ? "avaliação"
            : "avaliações"
        }`;

}


// ==========================================
// BOTÕES DE ORDENAÇÃO
// ==========================================

function atualizarBotoesOrdem() {

    const botaoData =
        document.getElementById(
            "ordenarData"
        );


    const botaoNota =
        document.getElementById(
            "ordenarNota"
        );


    botaoData.classList.remove("ativo");

    botaoNota.classList.remove("ativo");


    if (ordemAtual === "data") {

        botaoData.classList.add("ativo");

    } else {

        botaoNota.classList.add("ativo");

    }

}


// ==========================================
// SAIR
// ==========================================

function sair() {

    window.location.href =
        "telaLog.html";

}