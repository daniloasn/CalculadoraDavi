//Inputs 
const display = document.getElementById("display")
const botoes = document.querySelectorAll(".botoes")
const operadores = ["+","-","*","/"]

//vai percorrer todos os botões .botoes do html
botoes.forEach(botao => {

    botao.addEventListener("click", async () =>{
        const valor = botao.getAttribute("data-valor")

        //função pra limpar o display quando chegar no botao clear
        if(valor === "clear") {
            display.value = ""
            return 
        }

        //Se for igual envia pro backend
        if(valor === "="){
            try {
                const usuario_id = localStorage.getItem("usuario_id");
                const resposta = await fetch("http://localhost:3000/calcular",{
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json",
                    },

                    body: JSON.stringify({
                        expressao:display.value,
                        usuario_id: usuario_id
                    })
                })

                const dados = await resposta.json()

                // resultado vindo do backend
                display.value = dados.resultado
            } catch(erro){
                display.value = "erro"
            }

            return
        }

        const ultimoChar = display.value.slice(-1)

        //evitar dois operadores 
        if (operadores.includes(valor) && operadores.includes(ultimoChar)){
            return
        }

        //só começa com numero negativo, não começa com outro operador
        if (display.value === "" && operadores.includes(valor) && valor !== "-"){
            return
        }

        display.value += valor
    })

})

function toggleHistorico(){
    const painel = document.getElementById("dois")

    if (painel.classList.contains("hidden")){
        painel.classList.remove("hidden")
        carregarHistorico()
    } else {
        painel.classList.add("hidden")
    }
}

async function carregarHistorico() {
    const usuario_id = localStorage.getItem("usuario_id")

    const res = await fetch(`http://localhost:3000/historico/${usuario_id}`)
    const dados = await res.json()

    const div = document.getElementById("hist")

    div.innerHTML = ""

    dados.forEach(item => {
        const p = document.createElement("p")
        p.textContent = `${item.expressao} = ${item.resultado}`
        
        p.onclick = () => {
            document.getElementById("display").value = item.expressao
        }

        div.appendChild(p)
    })
}

