async function cadastrar() {
    const nome        = document.getElementById("nome").value.trim()
    const email       = document.getElementById("email").value.trim()
    const senha       = document.getElementById("senha").value
    const instituicao = document.getElementById("instituicao").value.trim()
    const escolaridade= document.getElementById("escolaridade").value
    const endereco    = document.getElementById("endereco").value.trim()
    const tipo        = document.querySelector('input[name="tipo"]:checked').value

    const msg = document.getElementById("mensagem")

    if (!nome || !email || !senha) {
        msg.textContent = "Preencha nome, email e senha."
        msg.className = "mensagem erro"
        return
    }

    try {
        const resposta = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, tipo, instituicao, escolaridade, endereco })
        })

        const dados = await resposta.json()

        if (dados.erro) {
            msg.textContent = dados.erro
            msg.className = "mensagem erro"
            return
        }

        msg.textContent = "Conta criada com sucesso! Redirecionando..."
        msg.className = "mensagem ok"

        setTimeout(() => { window.location.href = "login.html" }, 1500)

    } catch {
        msg.textContent = "Erro de conexão com o servidor."
        msg.className = "mensagem erro"
    }
}