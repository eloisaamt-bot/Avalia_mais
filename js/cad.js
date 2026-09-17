/*const formCadastro = document.getElementById("formCadastro");


formCadastro.addEventListener("submit", function (event) {

    event.preventDefault();


    const nome = document.getElementById("nome").value.trim();

    const email = document.getElementById("email").value.trim();

    const senha = document.getElementById("senha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;



    if (senha !== confirmarSenha) {

        alert("As senhas não são iguais.");

        return;
    }


    if (senha.length > 8) {

        alert("A senha deve possuir até 8 caracteres.");

        return;
    }


    if (senha.length < 8) {

        alert("A senha deve possuir pelo menos 8 caracteres.");

        return;
    }*/
const myForm = document.getElementById('formCadastro');

if (myForm != null) {

    myForm.addEventListener('submit', function (event) {

        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;


        if (nome === "") {
            alert("O nome é obrigatório.");
            return;
        }


        if (senha.length < 8) {

            alert("A senha deve ter no mínimo 8 caracteres.");

            return;
        }


        if (senha !== confirmarSenha) {

            alert("As senhas não são iguais.");

            return;
        }


        fetch('https://localhost:7254/usuario/', {

            method: 'POST',

            credentials: 'include',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                nome: nome,
                email: email,
                senha: senha

            })

        })

        .then(response => {

            if (!response.ok) {
                return response.text().then(mensagem => {
                    throw new Error(mensagem);
                });
            }

            // SEU BACKEND RETORNA TEXTO
            return response.text();

        })

        .then(data => {

            console.log(data);

            alert("Conta cadastrada com sucesso");

            window.location.href = "telaLog.html";

        })

        .catch(error => {

            console.log(error);

            alert("Erro ao cadastrar usuário: " + error.message);

        });

    });


    // BOTÃO ENTRAR

    document.getElementById("abaEntrar").addEventListener("click", function () {

        document.getElementById("abaEntrar").classList.add("ativa");

        document.getElementById("abaCadastrar").classList.remove("ativa");

        window.location.href = "telaLog.html";

    });


    // BOTÃO CADASTRAR

    document.getElementById("abaCadastrar").addEventListener("click", function () {

        document.getElementById("abaCadastrar").classList.add("ativa");

        document.getElementById("abaEntrar").classList.remove("ativa");

    });

}