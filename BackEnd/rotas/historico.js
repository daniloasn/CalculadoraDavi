const pool = require("../db") //conexao com o banco

async function historicoRoute(fastify,options) {
    
    fastify.get("/historico/:usuario_id", async (request, reply) => { //cria rota

        const {usuario_id} = request.params //captura o id para diferenciar usuarios

        try { //tenta executar o banco de dados
            const result = await pool.query( //consulta no banco, $1: valor seguro do id
                "SELECT * FROM historico WHERE usuario_id = $1 ORDER BY criado_em DESC", // pega da tbaela e ordena do mais novo para o mais antigo
                [usuario_id]
            ) 

            return result.rows //retorna para o front

        } catch (err) {
            return {erro : "erro ao buscar historico"} //se errar ta seguro
        }

    })

}

module.exports = historicoRoute //exporta 