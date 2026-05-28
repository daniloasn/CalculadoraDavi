async function cadastrar() {
    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value

    const res = await fetch("http://localhost:3000/register", { //requisição http, envia pro back
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nome,email,senha}) //envia os dados em JSON ex {"nome": "Arthur","email": "a@a.com",}
    })

    const data = await res.json() //aguarda back responder

    console.log(data)

    if(data.ok) { //se deu certo deu certo
        alert("Conta criada com sucesso")
    }else { //se deu errado deu errado
        alert("erro ao criar conta")
    }

}