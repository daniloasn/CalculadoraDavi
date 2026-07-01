const display = document.getElementById("display")
const operadores = ["+", "-", "*", "/", "^"]

//operações para o ranking
const nomeOperacao = {
    soma: "Soma",
    subtracao: "Subtração",
    multiplicacao: "Multiplicação",
    divisao: "Divisão",
    potencia: "Potência",
    raiz: "Raiz",
    outro: "Outro"
}

window.addEventListener("DOMContentLoaded", () => {
    const nome = localStorage.getItem("nome_usuario") || "Usuário"
    const tipo = localStorage.getItem("tipo_usuario") || "gratuito"

    document.getElementById("nome-usuario").textContent = `Olá, ${nome}`

    const badge = document.getElementById("badge-tipo")
    badge.textContent = tipo === "pago" ? "Pago" : "Gratuito"
    badge.className = `badge ${tipo}`
})

// botao
document.querySelectorAll(".botoes").forEach(botao => {
    botao.addEventListener("click", async () => {
        const valor = botao.getAttribute("data-valor")

        if (!valor) return  // botões sem data-valor (ex: ranking) ignorar

        if (valor === "clear") {
            display.value = ""
            return
        }

        if (valor === "backspace") {
            display.value = display.value.slice(0, -1)
            return
        }

        if (valor === "=") {
            await calcular()
            return
        }

        const ultimoChar = display.value.slice(-1)

        // Evitar dois operadores seguidos (exceto parênteses e funções)
        if (operadores.includes(valor) && operadores.includes(ultimoChar)) {
            return
        }

        // Não começar com operador (exceto -)
        if (display.value === "" && operadores.includes(valor) && valor !== "-") {
            return
        }

        display.value += valor
    })
})

// calcular
async function calcular() {
    const expressao = display.value.trim()
    if (!expressao) return

    const usuario_id = localStorage.getItem("usuario_id")
    const avisoEl = document.getElementById("aviso-usos")

    try {
        const resposta = await fetch("http://localhost:3000/calcular", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expressao, usuario_id })
        })

        const dados = await resposta.json()

        if (dados.erro) {
            if (dados.limite_atingido) {
                avisoEl.textContent = dados.erro
                avisoEl.className = "aviso erro"
                avisoEl.classList.remove("hidden")
            } else {
                display.value = "Erro: " + dados.erro
            }
            return
        }

        display.value = dados.resultado

        // Mostrar usos restantes para gratuitos
        if (dados.usos_restantes !== null && dados.usos_restantes !== undefined) {
            avisoEl.textContent = `Você tem ${dados.usos_restantes} cálculo(s) restante(s) este mês.`
            avisoEl.className = dados.usos_restantes <= 3 ? "aviso erro" : "aviso"
            avisoEl.classList.remove("hidden")
        } else {
            avisoEl.classList.add("hidden")
        }

    } catch (erro) {
        display.value = "Erro de conexão"
    }
}

// historico
function toggleHistorico() {
    const painel = document.getElementById("dois")
    if (painel.classList.contains("hidden")) {
        painel.classList.remove("hidden")
        carregarHistorico()
    } else {
        painel.classList.add("hidden")
    }
}

async function carregarHistorico() {
    const usuario_id = localStorage.getItem("usuario_id")
    const div = document.getElementById("hist")
    div.innerHTML = "Carregando..."

    try {
        const res = await fetch(`http://localhost:3000/historico/${usuario_id}`)
        const dados = await res.json()

        div.innerHTML = ""

        if (dados.length === 0) {
            div.innerHTML = "<p style='color:#555'>Nenhum cálculo ainda.</p>"
            return
        }

        dados.forEach(item => {
            const p = document.createElement("p")
            p.textContent = `${item.expressao} = ${item.resultado}`
            p.onclick = () => { display.value = item.expressao }
            div.appendChild(p)
        })
    } catch {
        div.innerHTML = "<p style='color:#ff4444'>Erro ao carregar.</p>"
    }
}

// Ranking
function toggleRanking() {
    const painel = document.getElementById("painel-ranking")
    if (painel.classList.contains("hidden")) {
        painel.classList.remove("hidden")
        carregarRanking()
    } else {
        painel.classList.add("hidden")
    }
}

async function carregarRanking() {
    const usuario_id = localStorage.getItem("usuario_id")
    const content = document.getElementById("ranking-content")
    content.innerHTML = "Carregando..."

    try {
        const res = await fetch(`http://localhost:3000/ranking/${usuario_id}`)
        const dados = await res.json()

        if (dados.erro) {
            content.innerHTML = `<p style='color:#ff4444'>${dados.erro}</p>`
            return
        }

        content.innerHTML = ""

        dados.ranking.forEach((item, i) => {
            const div = document.createElement("div")
            div.className = "ranking-item"
            div.innerHTML = `
                <span>${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "▫️"} ${nomeOperacao[item.operacao] || item.operacao}</span>
                <span class="ranking-badge">${item.total}x</span>
            `
            content.appendChild(div)
        })

        if (dados.ranking.every(r => r.total === 0)) {
            content.innerHTML = "<p style='color:#555'>Nenhuma operação registrada.</p>"
        }

    } catch {
        content.innerHTML = "<p style='color:#ff4444'>Erro ao carregar ranking.</p>"
    }
}


// Perfil
async function togglePerfil() {
    const modal = document.getElementById("modal-perfil")

    if (!modal.classList.contains("hidden")) {
        modal.classList.add("hidden")
        return
    }

    const usuario_id = localStorage.getItem("usuario_id")
    const info = document.getElementById("perfil-info")
    info.innerHTML = "Carregando..."
    modal.classList.remove("hidden")

    try {
        const res = await fetch(`http://localhost:3000/perfil/${usuario_id}`)
        const u = await res.json()

        info.innerHTML = `
            <div class="perfil-linha"><span>Nome</span><span>${u.nome || "-"}</span></div>
            <div class="perfil-linha"><span>Email</span><span>${u.email || "-"}</span></div>
            <div class="perfil-linha"><span>Tipo</span><span>${u.tipo === "pago" ? "Pago" : "Gratuito"}</span></div>
            <div class="perfil-linha"><span>Instituição</span><span>${u.instituicao || "-"}</span></div>
            <div class="perfil-linha"><span>Escolaridade</span><span>${u.escolaridade || "-"}</span></div>
            <div class="perfil-linha"><span>Endereço</span><span>${u.endereco || "-"}</span></div>
            <div class="perfil-linha"><span>Usos este mês</span><span>${u.usos_mes} ${u.tipo === "gratuito" ? "/ 10" : "(ilimitado)"}</span></div>
        `
    } catch {
        info.innerHTML = "<p style='color:#ff4444'>Erro ao carregar perfil.</p>"
    }
}