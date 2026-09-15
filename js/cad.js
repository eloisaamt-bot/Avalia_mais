const formCadastro = document.getElementById("formCadastro");


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


    if (senha.length > 8 ) {

        alert("A senha deve possuir até 8 caracteres.");

        return;
    }

    
    if (senha.length < 8 ) {

        alert("A senha deve possuir pelo menos 8 caracteres.");

        return;
    }



    //CADASTRO

    alert("Cadastro realizado com sucesso, " + nome + "!");

    window.location.href = "telaLog.html";

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