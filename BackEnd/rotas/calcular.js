const math = require("mathjs")
const pool = require("../db")

// Limite de usos para usuários gratuitos
const LIMITE_GRATUITO = 10

// Detecta o tipo principal de operação na expressão
function detectarOperacao(expressao) {
    // Ordem: potência > raiz > multiplicação > divisão > soma > subtração
    if (expressao.includes("^") || expressao.toLowerCase().includes("pow"))
        return "potencia"
    if (expressao.toLowerCase().includes("nthroot") || expressao.toLowerCase().includes("sqrt"))
        return "raiz"
    if (expressao.includes("*"))
        return "multiplicacao"
    if (expressao.includes("/"))
        return "divisao"
    if (expressao.includes("+"))
        return "soma"
    if (/\d\s*-/.test(expressao))
        return "subtracao"
    return "outro"
}

async function calcularRoute(fastify, options) {

    fastify.post("/calcular", async (request, reply) => {
        const { expressao, usuario_id } = request.body

        if (!expressao || expressao.trim() === "") {
            return { erro: "Expressão vazia" }
        }

        const uid = usuario_id || 1

        try {
            // Buscar usuário para verificar tipo e limite
            const userResult = await pool.query(
                "SELECT tipo, usos_mes FROM usuarios WHERE id = $1",
                [uid]
            )

            if (userResult.rows.length === 0) {
                return { erro: "Usuário não encontrado" }
            }

            const usuario = userResult.rows[0]

            // Verificar limite para usuários gratuitos
            if (usuario.tipo === "gratuito" && usuario.usos_mes >= LIMITE_GRATUITO) {
                return {
                    erro: `Limite de ${LIMITE_GRATUITO} cálculos atingido. Faça upgrade para o plano pago!`,
                    limite_atingido: true
                }
            }

            // Avaliar a expressão (mathjs já suporta parênteses, ^, nthRoot, sqrt)
            const resultado = math.evaluate(expressao)

            const operacao = detectarOperacao(expressao)

            // Salvar no histórico
            await pool.query(
                "INSERT INTO historico (usuario_id, expressao, resultado, operacao) VALUES ($1, $2, $3, $4)",
                [uid, expressao, resultado.toString(), operacao]
            )

            // Incrementar contador de usos
            await pool.query(
                "UPDATE usuarios SET usos_mes = usos_mes + 1 WHERE id = $1",
                [uid]
            )

            return {
                resultado,
                usos_restantes: usuario.tipo === "gratuito"
                    ? LIMITE_GRATUITO - usuario.usos_mes - 1
                    : null,
                tipo_usuario: usuario.tipo
            }

        } catch (err) {
            console.log(err)
            return { erro: "Expressão inválida. Verifique a sintaxe." }
        }
    })
}

module.exports = calcularRoute