const API_URL = "https://localhost:7254/Avaliacao";


// ==========================================
// ELEMENTOS
// ==========================================

const totalAvaliacoes =
    document.getElementById("totalAvaliacoes");

const mediaGeral =
    document.getElementById("mediaGeral");

const setoresAvaliados =
    document.getElementById("setoresAvaliados");

const totalComentarios =
    document.getElementById("totalComentarios");

const listaDesempenho =
    document.getElementById("listaDesempenho");

const listaAvaliacoes =
    document.getElementById("listaAvaliacoes");

const periodo =
    document.getElementById("periodo");

const btnSair =
    document.getElementById("btnSair");


// ==========================================
// CARREGAR RESUMO
// ==========================================

function carregarResumo() {

    fetch(`${API_URL}/resumo`)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar o resumo."
                );
            }

            return response.json();
        })
        .then(data => {

            totalAvaliacoes.textContent =
                data.totalAvaliacoes;

            mediaGeral.textContent =
                data.mediaGeral.toFixed(1);

            setoresAvaliados.textContent =
                data.setoresAvaliados;

            totalComentarios.textContent =
                data.totalComentarios;
        })
        .catch(error => {

            console.error(error);

            totalAvaliacoes.textContent = "--";
            mediaGeral.textContent = "--";
            setoresAvaliados.textContent = "--";
            totalComentarios.textContent = "--";
        });
}


// ==========================================
// CARREGAR DESEMPENHO DOS SETORES
// ==========================================

function carregarDesempenho() {

    fetch(`${API_URL}/desempenho-setores`)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar os setores."
                );
            }

            return response.json();
        })
        .then(data => {

            listaDesempenho.innerHTML = "";

            if (data.length === 0) {

                listaDesempenho.innerHTML = `
                    <p class="mensagem-vazia">
                        Nenhum setor cadastrado.
                    </p>
                `;

                return;
            }


            data.forEach(setor => {

                const percentual =
                    (setor.media / 5) * 100;


                const item =
                    document.createElement("div");

                item.className =
                    "item-desempenho";


                item.innerHTML = `

                    <div class="informacoes-setor">

                        <div>

                            <strong>
                                ${setor.nome}
                            </strong>

                            <span>
                                ${setor.quantidadeAvaliacoes}
                                avaliação(ões)
                            </span>

                        </div>

                        <strong class="media-setor">
                            ${setor.media.toFixed(1)}
                        </strong>

                    </div>

                    <div class="barra">

                        <div
                            class="progresso"
                            style="width: ${percentual}%">
                        </div>

                    </div>

                `;


                listaDesempenho.appendChild(item);
            });
        })
        .catch(error => {

            console.error(error);

            listaDesempenho.innerHTML = `
                <p class="mensagem-erro">
                    Não foi possível carregar o desempenho.
                </p>
            `;
        });
}


// ==========================================
// CARREGAR AVALIAÇÕES RECENTES
// ==========================================

function carregarAvaliacoesRecentes() {

    fetch(`${API_URL}/recentes`)
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Não foi possível carregar as avaliações."
                );
            }

            return response.json();
        })
        .then(data => {

            listaAvaliacoes.innerHTML = "";


            if (data.length === 0) {

                listaAvaliacoes.innerHTML = `
                    <p class="mensagem-vazia">
                        Nenhuma avaliação registrada.
                    </p>
                `;

                return;
            }


            data.forEach(avaliacao => {

                const item =
                    document.createElement("div");

                item.className =
                    "item-avaliacao";


                const dataFormatada =
                    formatarData(avaliacao.data_Hora);


                item.innerHTML = `

                    <div class="nota-avaliacao">

                        <span>
                            Nota geral
                        </span>

                        <strong>
                            ${avaliacao.nota}
                        </strong>

                    </div>


                    <div class="dados-avaliacao">

                        <strong>
                            Avaliação #${avaliacao.id}
                        </strong>

                        <span>
                            ${dataFormatada}
                        </span>

                    </div>


                    <div class="comentario-avaliacao">

                        ${
                            avaliacao.comentario
                                ? `"${avaliacao.comentario}"`
                                : "Sem comentário."
                        }

                    </div>

                `;


                listaAvaliacoes.appendChild(item);
            });
        })
        .catch(error => {

            console.error(error);

            listaAvaliacoes.innerHTML = `
                <p class="mensagem-erro">
                    Não foi possível carregar as avaliações.
                </p>
            `;
        });
}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {
        return "";
    }


    const dataObjeto =
        new Date(data);


    return dataObjeto.toLocaleString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// FILTRO DE PERÍODO
// ==========================================

periodo.addEventListener(
    "change",
    function () {

        console.log(
            "Período selecionado:",
            periodo.value
        );

        /*
         * O filtro será conectado ao backend
         * na próxima etapa.
         */

        carregarResumo();
        carregarDesempenho();
        carregarAvaliacoesRecentes();
    }
);


// =====================================================
// SAIR
// =====================================================

function sair() {

    window.location.href = "telaLog.html";
}


// ==========================================
// CARREGAR DASHBOARD
// ==========================================

function carregarDashboard() {

    carregarResumo();

    carregarDesempenho();

    carregarAvaliacoesRecentes();
}


carregarDashboard();