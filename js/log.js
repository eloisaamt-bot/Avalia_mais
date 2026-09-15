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

        alert("Login realizado com sucesso!");

        window.location.href = "visaoGeral.html";

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