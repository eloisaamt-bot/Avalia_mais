const API_URL = "https://localhost:7254/Setor";

let setores = [];
let idSetorEditando = null;
let filtroAtual = "todos";


// =====================================================
// LISTAR SETORES
// =====================================================

function listarSetores() {

    fetch(API_URL, {
        method: "GET",
        credentials: "include"
    })

    .then(function (response) {

        if (!response.ok) {

            if (response.status === 401) {
                throw new Error("Não autorizado");
            }

            throw new Error("Erro ao buscar setores");
        }

        return response.json();
    })

    .then(function (data) {

        console.log("Setores recebidos:", data);

        setores = data;

        mostrarSetores();

        atualizarQuantidade();
    })

    .catch(function (error) {

        console.log(error);

        if (error.message === "Não autorizado") {

            alert("Faça o login antes de acessar os setores.");

            window.location.href = "login.html";

        } else {

            alert("Não foi possível carregar os setores.");
        }
    });
}


// =====================================================
// MOSTRAR SETORES
// =====================================================

function mostrarSetores() {

    const lista = document.getElementById("listaSetores");

    if (lista == null) {
        return;
    }

    lista.innerHTML = "";

    if (setores.length === 0) {

        lista.innerHTML = `
            <div class="sem-setores">
                <p>Nenhum setor cadastrado.</p>
            </div>
        `;

        return;
    }


    // FILTRO

    let setoresFiltrados = setores;


    if (filtroAtual === "ativos") {

        setoresFiltrados = setores.filter(function (setor) {

            return setor.ativo === true;

        });
    }


    if (filtroAtual === "inativos") {

        setoresFiltrados = setores.filter(function (setor) {

            return setor.ativo === false;

        });
    }


    // NENHUM SETOR ENCONTRADO NO FILTRO

    if (setoresFiltrados.length === 0) {

        lista.innerHTML = `
            <div class="sem-setores">
                <p>Nenhum setor encontrado.</p>
            </div>
        `;

        return;
    }


    // CRIAR CARDS

    setoresFiltrados.forEach(function (setor) {

        const card = document.createElement("div");

        card.classList.add("card-setor");


        // DEIXA O CARD DESATIVADO MAIS CLARO

        if (!setor.ativo) {

            card.classList.add("setor-desativado");
        }


        let status;
        let botaoStatus;


        // SETOR ATIVO

        if (setor.ativo) {

            status = `
                <span class="status-setor ativo">
                    ● Ativo
                </span>
            `;

            botaoStatus = `
                <button
                    class="acao"
                    type="button"
                    onclick="excluirSetor(${setor.id})">
                    Desativar
                </button>
            `;
        }


        // SETOR DESATIVADO

        else {

            status = `
                <span class="status-setor desativado">
                    ● Desativado
                </span>
            `;

            botaoStatus = `
                <button
                    class="acao"
                    type="button"
                    onclick="ativarSetor(${setor.id})">
                    Ativar
                </button>
            `;
        }


        card.innerHTML = `

            <div class="card-topo">

                <div class="icone-setor">
                    🏢
                </div>

                <div class="info-setor">

                    <h3>${setor.nome}</h3>

                    <p>${setor.pergunta}</p>

                    ${status}

                </div>

            </div>


            <div class="acoes">

                <button
                    class="acao"
                    type="button"
                    onclick="editarSetor(${setor.id})">
                    Editar
                </button>

                ${botaoStatus}

            </div>

        `;


        lista.appendChild(card);
    });
}


// =====================================================
// FILTRAR SETORES
// =====================================================

function filtrarSetores(filtro, botao) {

    filtroAtual = filtro;


    const botoes = document.querySelectorAll(".filtro");


    botoes.forEach(function (item) {

        item.classList.remove("ativo");

    });


    if (botao != null) {

        botao.classList.add("ativo");
    }


    mostrarSetores();
}


// =====================================================
// QUANTIDADE DE SETORES
// =====================================================

function atualizarQuantidade() {

    const quantidade = document.getElementById("quantidadeSetores");

    if (quantidade == null) {
        return;
    }


    if (setores.length === 0) {

        quantidade.textContent = "Nenhum setor cadastrado.";

        return;
    }


    if (setores.length === 1) {

        quantidade.textContent = "1 setor cadastrado.";

        return;
    }


    quantidade.textContent =
        `${setores.length} setores cadastrados.`;
}


// =====================================================
// ABRIR MODAL PARA NOVO SETOR
// =====================================================

function abrirModal() {

    idSetorEditando = null;


    const modal = document.getElementById("modal");

    const nome = document.getElementById("nomeSetor");

    const pergunta = document.getElementById("perguntaSetor");


    if (nome != null) {

        nome.value = "";
    }


    if (pergunta != null) {

        pergunta.value = "";
    }


    const titulo =
        document.querySelector(".modal-cabecalho h2");


    if (titulo != null) {

        titulo.textContent = "Novo Setor";
    }


    const descricao =
        document.querySelector(".modal-cabecalho p");


    if (descricao != null) {

        descricao.textContent =
            "Cadastre um novo setor para avaliação.";
    }


    const botao =
        document.querySelector(".botao-cadastrar");


    if (botao != null) {

        botao.textContent = "Cadastrar setor";
    }


    if (modal != null) {

        modal.classList.add("aberto");
    }
}


// =====================================================
// FECHAR MODAL
// =====================================================

function fecharModal() {

    const modal = document.getElementById("modal");


    if (modal != null) {

        modal.classList.remove("aberto");
    }


    idSetorEditando = null;
}


// =====================================================
// CADASTRAR SETOR
// =====================================================

function cadastrarSetor() {

    const nome =
        document.getElementById("nomeSetor").value.trim();


    const pergunta =
        document.getElementById("perguntaSetor").value.trim();


    if (nome === "") {

        alert("O nome do setor é obrigatório.");

        return;
    }


    if (pergunta === "") {

        alert("A pergunta do setor é obrigatória.");

        return;
    }


    if (nome.length > 100) {

        alert(
            "O nome do setor deve ter no máximo 100 caracteres."
        );

        return;
    }


    if (pergunta.length > 100) {

        alert(
            "A pergunta deve ter no máximo 100 caracteres."
        );

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

    .then(function (response) {

        if (!response.ok) {

            return response.text().then(function (mensagem) {

                throw new Error(mensagem);

            });
        }


        return response.json();
    })

    .then(function (data) {

        console.log("Setor cadastrado:", data);

        alert("Setor cadastrado com sucesso!");

        fecharModal();

        listarSetores();
    })

    .catch(function (error) {

        console.log(error);

        alert(
            error.message ||
            "Não foi possível cadastrar o setor."
        );
    });
}


// =====================================================
// EDITAR SETOR
// =====================================================

function editarSetor(id) {

    const setor = setores.find(function (s) {

        return s.id === id;

    });


    if (setor == null) {

        alert("Setor não encontrado.");

        return;
    }


    idSetorEditando = id;


    document.getElementById("nomeSetor").value =
        setor.nome;


    document.getElementById("perguntaSetor").value =
        setor.pergunta;


    const titulo =
        document.querySelector(".modal-cabecalho h2");


    if (titulo != null) {

        titulo.textContent = "Editar Setor";
    }


    const descricao =
        document.querySelector(".modal-cabecalho p");


    if (descricao != null) {

        descricao.textContent =
            "Altere os dados do setor.";
    }


    const botao =
        document.querySelector(".botao-cadastrar");


    if (botao != null) {

        botao.textContent = "Salvar alterações";
    }


    const modal =
        document.getElementById("modal");


    if (modal != null) {

        modal.classList.add("aberto");
    }
}


// =====================================================
// ATUALIZAR SETOR
// =====================================================

function atualizarSetor() {

    const id = idSetorEditando;


    if (id == null) {

        alert("Setor não selecionado.");

        return;
    }


    const nome =
        document.getElementById("nomeSetor").value.trim();


    const pergunta =
        document.getElementById("perguntaSetor").value.trim();


    if (nome === "") {

        alert("O nome do setor é obrigatório.");

        return;
    }


    if (pergunta === "") {

        alert("A pergunta do setor é obrigatória.");

        return;
    }


    if (nome.length > 100) {

        alert(
            "O nome do setor deve ter no máximo 100 caracteres."
        );

        return;
    }


    if (pergunta.length > 100) {

        alert(
            "A pergunta deve ter no máximo 100 caracteres."
        );

        return;
    }


    const setor = setores.find(function (s) {

        return s.id === id;

    });


    let ativo = true;


    if (setor != null) {

        ativo = setor.ativo;
    }


    fetch(`${API_URL}/${id}`, {

        method: "PUT",

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            nome: nome,

            pergunta: pergunta,

            ativo: ativo

        })
    })

    .then(function (response) {

        if (!response.ok) {

            return response.text().then(function (mensagem) {

                throw new Error(mensagem);

            });
        }


        return response.text();
    })

    .then(function (data) {

        console.log("Setor atualizado:", data);

        alert("Setor atualizado com sucesso!");

        fecharModal();

        listarSetores();
    })

    .catch(function (error) {

        console.log(error);

        alert(
            error.message ||
            "Não foi possível atualizar o setor."
        );
    });
}


// =====================================================
// DESATIVAR SETOR
// =====================================================

function excluirSetor(id) {

    const setor = setores.find(function (s) {

        return s.id === id;

    });


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

    .then(function (response) {

        if (!response.ok) {

            return response.text().then(function (mensagem) {

                throw new Error(mensagem);

            });
        }


        return response.text();
    })

    .then(function (data) {

        console.log("Setor desativado:", data);

        alert("Setor desativado com sucesso!");

        listarSetores();
    })

    .catch(function (error) {

        console.log(error);

        alert(
            error.message ||
            "Não foi possível desativar o setor."
        );
    });
}


// =====================================================
// ATIVAR SETOR
// =====================================================

function ativarSetor(id) {

    const setor = setores.find(function (s) {

        return s.id === id;

    });


    if (setor == null) {

        alert("Setor não encontrado.");

        return;
    }


    fetch(`${API_URL}/${id}`, {

        method: "PUT",

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            nome: setor.nome,

            pergunta: setor.pergunta,

            ativo: true

        })
    })

    .then(function (response) {

        if (!response.ok) {

            return response.text().then(function (mensagem) {

                throw new Error(mensagem);

            });
        }


        return response.text();
    })

    .then(function (data) {

        console.log("Setor ativado:", data);

        alert("Setor ativado com sucesso!");

        listarSetores();
    })

    .catch(function (error) {

        console.log(error);

        alert(
            error.message ||
            "Não foi possível ativar o setor."
        );
    });
}


// =====================================================
// FORMULÁRIO
// =====================================================

const formSetor =
    document.getElementById("formSetor");


if (formSetor != null) {

    formSetor.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (idSetorEditando == null) {

                cadastrarSetor();

            } else {

                atualizarSetor();
            }
        }
    );
}


// =====================================================
// FECHAR MODAL CLICANDO FORA
// =====================================================

const modal =
    document.getElementById("modal");


if (modal != null) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                fecharModal();
            }
        }
    );
}


// =====================================================
// SAIR
// =====================================================

function sair() {

    window.location.href = "login.html";
}


// =====================================================
// INICIAL
// =====================================================

listarSetores();