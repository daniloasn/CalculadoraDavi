const pool = require("../db")

async function authRotas(fastify, options) {

    // Cadastro
    fastify.post("/register", async (request, reply) => {
        const { nome, email, senha, tipo, instituicao, escolaridade, endereco } = request.body

        if (!nome || !email || !senha) {
            return { erro: "Nome, email e senha são obrigatórios" }
        }

        const tipoValido = tipo === "pago" ? "pago" : "gratuito"

        try {
            const result = await pool.query(
                `INSERT INTO usuarios (nome, email, senha, tipo, instituicao, escolaridade, endereco)
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                [nome, email, senha, tipoValido, instituicao || null, escolaridade || null, endereco || null]
            )

            return { ok: true, usuario_id: result.rows[0].id }
        } catch (err) {
            console.log(err)
            return { erro: "Erro ao cadastrar (email pode já existir)" }
        }
    })

    // Login
    fastify.post("/login", async (request, reply) => {
        const { email, senha } = request.body

        try {
            const result = await pool.query(
                "SELECT * FROM usuarios WHERE email = $1",
                [email]
            )

            if (result.rows.length === 0) {
                return { erro: "Usuário não encontrado" }
            }

            const usuario = result.rows[0]

            if (usuario.senha !== senha) {
                return { erro: "Senha incorreta" }
            }

            return {
                ok: true,
                usuario_id: usuario.id,
                nome: usuario.nome,
                tipo: usuario.tipo,
                instituicao: usuario.instituicao,
                escolaridade: usuario.escolaridade,
                endereco: usuario.endereco
            }
        } catch (err) {
            console.log(err)
            return { erro: "Erro no login" }
        }
    })

    // Buscar perfil do usuário
    fastify.get("/perfil/:usuario_id", async (request, reply) => {
        const { usuario_id } = request.params

        try {
            const result = await pool.query(
                "SELECT id, nome, email, tipo, instituicao, escolaridade, endereco, usos_mes FROM usuarios WHERE id = $1",
                [usuario_id]
            )

            if (result.rows.length === 0) {
                return { erro: "Usuário não encontrado" }
            }

            return result.rows[0]
        } catch (err) {
            return { erro: "Erro ao buscar perfil" }
        }
    })
}

module.exports = authRotas