const pool = require("../db")

async function rankingRoute(fastify, options) {

    fastify.get("/ranking/:usuario_id", async (request, reply) => {
        const { usuario_id } = request.params

        try {
            // Conta diretamente pelo campo operacao salvo no histórico
            const result = await pool.query(
                `SELECT operacao, COUNT(*) as total
                 FROM historico
                 WHERE usuario_id = $1
                 GROUP BY operacao
                 ORDER BY total DESC`,
                [usuario_id]
            )

            const ranking = {
                soma: 0,
                subtracao: 0,
                multiplicacao: 0,
                divisao: 0,
                potencia: 0,
                raiz: 0,
                outro: 0
            }

            result.rows.forEach(row => {
                if (ranking.hasOwnProperty(row.operacao)) {
                    ranking[row.operacao] = parseInt(row.total)
                }
            })

            // Ordena do mais usado para o menos
            const ordenado = Object.entries(ranking)
                .sort((a, b) => b[1] - a[1])
                .map(([operacao, total]) => ({ operacao, total }))

            return { ranking: ordenado }

        } catch (err) {
            console.log(err)
            return { erro: "Erro ao gerar ranking" }
        }
    })
}

module.exports = rankingRoute