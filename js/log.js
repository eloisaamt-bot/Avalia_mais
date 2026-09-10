const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;


    // LOGIN DE DEMONSTRAÇÃO
    if (
        email === "gestor@empresa.com" &&
        senha === "123456"
    ) {

        alert("Login realizado com sucesso!");

        // Futuramente levará para o dashboard
        window.location.href = "dashboard.html";

    } else {

        alert("E-mail ou senha incorretos.");

    }

});


// BOTÃO ENTRAR
document.getElementById("abaEntrar").addEventListener("click", function () {

    document.getElementById("abaEntrar").classList.add("ativa");

    document.getElementById("abaCadastrar").classList.remove("ativa");

});


// BOTÃO CADASTRAR
document.getElementById("abaCadastrar").addEventListener("click", function () {

    document.getElementById("abaCadastrar").classList.add("ativa");

    document.getElementById("abaEntrar").classList.remove("ativa");

    alert("A tela de cadastro será implementada.");

});