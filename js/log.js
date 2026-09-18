const formLogin = document.getElementById("formLogin");

if (formLogin != null) {

    formLogin.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        if (email === "" || senha === "") {
            alert("Preencha todos os campos.");
            return;
        }

        fetch("https://localhost:7254/usuario/login", {

            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                senha: senha
            })

        })

        .then(response => {

            if (!response.ok) {
                throw new Error("Login inválido");
            }

            return response.json();

        })

        .then(data => {

            console.log("Usuário recebido:", data);

            alert("Logado com sucesso!");

            window.location.href = "visaoGeral.html";

        })

        .catch(error => {

            console.log(error);

            alert("Email ou senha incorretos!");

        });

    });
}


// BOTÃO ENTRAR

document.getElementById("abaEntrar").addEventListener("click", function () {

    document.getElementById("abaEntrar").classList.add("ativa");

    document.getElementById("abaCadastrar").classList.remove("ativa");

});


// BOTÃO CADASTRAR

document.getElementById("abaCadastrar").addEventListener("click", function () {

    document.getElementById("abaCadastrar").classList.add("ativa");

    document.getElementById("abaEntrar").classList.remove("ativa");

    window.location.href = "telaCad.html";

});