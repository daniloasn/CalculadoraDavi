const pool = require("../db")

async function authRotas(fastify, options) {
    
    //Cadastro

    fastify.post("/register", async (request, reply) => {
        const { nome, email, senha } = request.body

        try {
            await pool.query (
                "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)",
                [nome,email,senha]
            )

            return { ok: true}
        } catch (err) {
            console.log(err)
            return { erro: "Erro ao cadastrar (email pode ja existir)"}
        }

    })

    //login
    fastify.post("/login", async (request, reply) => {

        const { email, senha } = request.body

        try {
            const result = await pool.query(
                "SELECT * FROM usuarios WHERE email = $1",
                [email]
            )

            if (result.rows.length === 0){
                return { erro : "Usuário não encontrado"}
            }

            const usuario = result.rows[0]

            if (usuario.senha !== senha) {
                return { erro: "Senha Incorreta "}
            }

            return {
                ok: true,
                usuario_id: usuario.id
            }
        } catch (err) {
            console.log(err)
            return { erro: "Erro no login" };
        }

    })

}

module.exports = authRotas