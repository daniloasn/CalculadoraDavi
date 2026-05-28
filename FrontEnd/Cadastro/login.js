async function login() {
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value

    const res = await fetch("http://localhost:3000/login", { //envia pro back
        method: "POST", //método post
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ email, senha}) //envia como json
    })

    const data = await res.json() //espera resposta

    console.log(data)

    if (data.ok){
        alert("login realizado com sucesso") //se deu certo vai salvar o id do usuario no navegador enquanto esta logado
        localStorage.setItem("usuario_id", data.usuario_id)
        window.location.href = "../Calculadora/index.html" //e redirecionar para a calculadora
    }
}