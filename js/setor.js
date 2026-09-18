const setores = [

    {
        id: 1,
        nome: "Atendimento",
        descricao: "Qualidade do atendimento ao cliente",
        icone: "👋",
        avaliacoes: 12,
        media: 3.7
    },

    {
        id: 2,
        nome: "Limpeza",
        descricao: "Limpeza e higiene das instalações",
        icone: "✨",
        avaliacoes: 12,
        media: 4.3
    },

    {
        id: 3,
        nome: "Produtos",
        descricao: "Qualidade e variedade dos produtos",
        icone: "📦",
        avaliacoes: 12,
        media: 3.7
    },

    {
        id: 4,
        nome: "Agilidade",
        descricao: "Velocidade e eficiência no atendimento",
        icone: "⚡",
        avaliacoes: 12,
        media: 3.7
    }

];


// =========================
// MOSTRAR SETORES
// =========================

function mostrarSetores() {

    const lista = document.getElementById("listaSetores");

    lista.innerHTML = "";

    setores.forEach(function (setor) {

        const card = document.createElement("div");

        card.classList.add("card-setor");

        card.innerHTML = `

            <div class="card-topo">

                <div class="icone-setor">
                    ${setor.icone}
                </div>

                <div class="info-setor">

                    <h3>
                        ${setor.nome}
                    </h3>

                    <p>
                        ${setor.descricao}
                    </p>

                </div>

            </div>


            <div class="estatisticas">

                <div class="estatistica">

                    <strong>1</strong>

                    <span>
                        pergunta
                    </span>

                </div>


                <div class="estatistica">

                    <strong>
                        ${setor.avaliacoes}
                    </strong>

                    <span>
                        avaliações
                    </span>

                </div>


                <div class="estatistica media">

                    <strong>
                        ${setor.media.toFixed(1)}
                    </strong>

                    <span>
                        média
                    </span>

                </div>

            </div>


            <div class="acoes">

                <button
                    class="acao"
                    onclick="verPergunta(${setor.id})">
                    📝 Pergunta
                </button>

                <button
                    class="acao"
                    onclick="verAnalise(${setor.id})">
                    📊 Análise
                </button>

                <button
                    class="icone-acao editar"
                    onclick="editarSetor(${setor.id})">
                    ✏️
                </button>

                <button
                    class="icone-acao excluir"
                    onclick="excluirSetor(${setor.id})">
                    🗑️
                </button>

            </div>

        `;

        lista.appendChild(card);

    });


    document.getElementById("quantidadeSetores").textContent =
        `${setores.length} setores cadastrados`;

}


// =========================
// MODAL
// =========================

function abrirModal() {

    document
        .getElementById("modal")
        .classList.add("aberto");

}


function fecharModal() {

    document
        .getElementById("modal")
        .classList.remove("aberto");

    document
        .getElementById("formSetor")
        .reset();

}


// =========================
// CADASTRAR SETOR
// =========================

document
    .getElementById("formSetor")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const nome =
            document.getElementById("nomeSetor").value.trim();

        const pergunta =
            document.getElementById("perguntaSetor").value.trim();


        if (nome === "" || pergunta === "") {

            alert("Preencha todos os campos.");

            return;
        }


        const novoSetor = {

            id: Date.now(),

            nome: nome,

            descricao: pergunta,

            icone: "🏢",

            avaliacoes: 0,

            media: 0

        };


        setores.push(novoSetor);

        mostrarSetores();

        fecharModal();

        alert("Setor cadastrado com sucesso!");

    });


// =========================
// PERGUNTA
// =========================

function verPergunta(id) {

    const setor =
        setores.find(s => s.id === id);

    if (!setor) return;

    alert(
        "Pergunta do setor " +
        setor.nome +
        ":\n\n" +
        setor.descricao
    );

}


// =========================
// ANÁLISE
// =========================

function verAnalise(id) {

    const setor =
        setores.find(s => s.id === id);

    if (!setor) return;

    alert(
        "Análise do setor: " +
        setor.nome +
        "\n\n" +
        "Avaliações: " +
        setor.avaliacoes +
        "\n" +
        "Média: " +
        setor.media.toFixed(1)
    );

}


// =========================
// EDITAR
// =========================

function editarSetor(id) {

    const setor =
        setores.find(s => s.id === id);

    if (!setor) return;

    alert(
        "A edição do setor será implementada depois."
    );

}


// =========================
// EXCLUIR
// =========================

function excluirSetor(id) {

    const indice =
        setores.findIndex(s => s.id === id);

    if (indice === -1) return;


    const confirmar =
        confirm(
            "Deseja realmente excluir o setor " +
            setores[indice].nome +
            "?"
        );


    if (!confirmar) return;


    setores.splice(indice, 1);

    mostrarSetores();

}


// =========================
// SAIR
// =========================

function sair() {

    const confirmar =
        confirm("Deseja sair do sistema?");

    if (confirmar) {

        window.location.href = "telaLog.html";

    }

}


// =========================
// INICIAR
// =========================

mostrarSetores();