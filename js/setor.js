const API_URL = "https://localhost:7254/Setor";

let setores = [];

let idSetorEditando = null;


// ======================================================
// LISTAR SETORES
// ======================================================

function listarSetores() {

    fetch(API_URL, {

        method: "GET",

        credentials: "include"

    })

    .then(response => {

        if (!response.ok) {

            if (response.status === 401) {
                throw new Error("Não autorizado");
            }

            throw new Error("Erro ao buscar setores");
        }

        return response.json();

    })

    .then(data => {

        console.log("Setores recebidos:", data);

        setores = data;

        mostrarSetores();

    })

    .catch(error => {

        console.log(error);

        if (error.message === "Não autorizado") {

            alert("Faça o login antes de acessar os setores.");

            window.location.href = "login.html";

        } else {

            alert("Não foi possível carregar os setores.");

        }

    });
}


// ======================================================
// MOSTRAR SETORES
// ======================================================

function mostrarSetores() {

    const lista = document.getElementById("listaSetores");

    if (lista == null) {
        return;
    }

    lista.innerHTML = "";


    if (setores.length === 0) {

        lista.innerHTML = `
            <p>Nenhum setor cadastrado.</p>
        `;

        return;
    }


    setores.forEach(setor => {

        const card = document.createElement("div");

        card.classList.add("card-setor");


        card.innerHTML = `

            <div class="icone-setor">
                🏢
            </div>

            <div class="informacoes-setor">

                <h3>${setor.nome}</h3>

                <p>${setor.pergunta}</p>

            </div>

            <div class="acoes-setor">

                <button
                    type="button"
                    onclick="editarSetor(${setor.id})">
                    Editar
                </button>

                <button
                    type="button"
                    onclick="excluirSetor(${setor.id})">
                    Desativar
                </button>

            </div>

        `;


        lista.appendChild(card);

    });
}


// ======================================================
// ABRIR MODAL PARA NOVO SETOR
// ======================================================

function abrirModal() {

    idSetorEditando = null;


    const nome = document.getElementById("nomeSetor");

    const pergunta = document.getElementById("perguntaSetor");

    const titulo = document.getElementById("tituloModal");

    const modal = document.getElementById("modalSetor");


    if (nome != null) {
        nome.value = "";
    }

    if (pergunta != null) {
        pergunta.value = "";
    }

    if (titulo != null) {
        titulo.textContent = "Novo Setor";
    }

    if (modal != null) {
        modal.style.display = "flex";
    }

}


// ======================================================
// FECHAR MODAL
// ======================================================

function fecharModal() {

    const modal = document.getElementById("modalSetor");

    if (modal != null) {
        modal.style.display = "none";
    }

}


// ======================================================
// CADASTRAR SETOR
// ======================================================

function cadastrarSetor() {

    const nome = document.getElementById("nomeSetor").value.trim();

    const pergunta = document.getElementById("perguntaSetor").value.trim();


    if (nome === "" || pergunta === "") {

        alert("Preencha todos os campos.");

        return;
    }


    fetch(API_URL, {

        method: "POST",

        credentials: "include",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            nome: nome,

            pergunta: pergunta

        })

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

        console.log("Setor cadastrado:", data);

        alert("Setor cadastrado com sucesso!");

        fecharModal();

        listarSetores();

    })

    .catch(error => {

        console.log(error);

        alert(
            error.message ||
            "Não foi possível cadastrar o setor."
        );

    });

}


// ======================================================
// EDITAR SETOR
// ======================================================

function editarSetor(id) {

    const setor = setores.find(s => s.id === id);


    if (setor == null) {

        alert("Setor não encontrado.");

        return;
    }


    idSetorEditando = id;


    document.getElementById("nomeSetor").value = setor.nome;

    document.getElementById("perguntaSetor").value = setor.pergunta;


    const titulo = document.getElementById("tituloModal");

    if (titulo != null) {

        titulo.textContent = "Editar Setor";

    }


    const modal = document.getElementById("modalSetor");

    if (modal != null) {

        modal.style.display = "flex";

    }

}


// ======================================================
// ATUALIZAR SETOR
// ======================================================

function atualizarSetor() {

    const id = idSetorEditando;

    const nome = document.getElementById("nomeSetor").value.trim();

    const pergunta = document.getElementById("perguntaSetor").value.trim();


    if (id == null) {

        alert("Setor não selecionado.");

        return;
    }


    if (nome === "" || pergunta === "") {

        alert("Preencha todos os campos.");

        return;
    }


    fetch(`${API_URL}/${id}`, {

        method: "PUT",

        credentials: "include",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            nome: nome,

            pergunta: pergunta

        })

    })

    .then(response => {

        if (!response.ok) {

            return response.text().then(mensagem => {

                throw new Error(mensagem);

            });

        }

        return response.text();

    })

    .then(data => {

        console.log("Setor atualizado:", data);

        alert("Setor atualizado com sucesso!");

        fecharModal();

        listarSetores();

    })

    .catch(error => {

        console.log(error);

        alert(
            error.message ||
            "Não foi possível atualizar o setor."
        );

    });

}


// ======================================================
// DESATIVAR SETOR
// ======================================================

function excluirSetor(id) {

    const setor = setores.find(s => s.id === id);


    if (setor == null) {

        alert("Setor não encontrado.");

        return;
    }


    const confirmar = confirm(
        `Deseja desativar o setor "${setor.nome}"?`
    );


    if (!confirmar) {

        return;

    }


    fetch(`${API_URL}/${id}`, {

        method: "DELETE",

        credentials: "include"

    })

    .then(response => {

        if (!response.ok) {

            return response.text().then(mensagem => {

                throw new Error(mensagem);

            });

        }

        return response.text();

    })

    .then(data => {

        console.log("Setor desativado:", data);

        alert("Setor desativado com sucesso!");

        listarSetores();

    })

    .catch(error => {

        console.log(error);

        alert(
            error.message ||
            "Não foi possível desativar o setor."
        );

    });

}


// ======================================================
// FORMULÁRIO DO SETOR
// ======================================================

const formSetor = document.getElementById("formSetor");


if (formSetor != null) {

    formSetor.addEventListener("submit", function (event) {

        event.preventDefault();


        if (idSetorEditando == null) {

            cadastrarSetor();

        } else {

            atualizarSetor();

        }

    });

}


// ======================================================
// BOTÃO SAIR
// ======================================================

function sair() {

    window.location.href = "login.html";

}


// ======================================================
// CARREGAR SETORES QUANDO ABRIR A PÁGINA
// ======================================================

listarSetores();