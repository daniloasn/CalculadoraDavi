async function login() {
    const email = document.getElementById("email").value.trim()
    const senha = document.getElementById("senha").value

    const msg = document.getElementById("mensagem")

    if (!email || !senha) {
        msg.textContent = "Preencha email e senha."
        msg.className = "mensagem erro"
        return
    }

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        })

        const dados = await resposta.json()

        if (dados.erro) {
            msg.textContent = dados.erro
            msg.className = "mensagem erro"
            return
        }

        // Salvar dados no localStorage
        localStorage.setItem("usuario_id",   dados.usuario_id)
        localStorage.setItem("nome_usuario", dados.nome)
        localStorage.setItem("tipo_usuario", dados.tipo)

        msg.textContent = `Bem-vindo, ${dados.nome}!`
        msg.className = "mensagem ok"

        setTimeout(() => { window.location.href = "../Calculadora/index.html" }, 1000)

    } catch {
        msg.textContent = "Erro de conexão com o servidor."
        msg.className = "mensagem erro"
    }
}