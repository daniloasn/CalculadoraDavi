const math = require("mathjs") //biblioteca da matematica
const pool = require("../db") //puxando banco de dados

async function calcularRoute(fastify, options) { //plugin do fastify
    
    fastify.post("/calcular", async (request, reply) => { //cria a rota post/calcular       request:pede ,reply:responde
        const {expressao, usuario_id} = request.body //separa expressao por usuario

        if(!expressao) {
            return { resultado: "Expressão vazia"}
        }

        try {
            const resultado = math.evaluate(expressao) //tenta executar a conta, se der certo manda pro banco, 
            // se der errado só mostra que due errado e não quebra o server

            await pool.query(
                "INSERT INTO historico (usuario_id, expressao, resultado) values ($1,$2,$3)",
                [usuario_id || 1, expressao, resultado.toString()]
            )

            return {resultado} //resposta pro front
        } catch (err) {
            return {resultado: "Erro"} //resposta pro front
        }
    })
}

module.exports = calcularRoute //exporta