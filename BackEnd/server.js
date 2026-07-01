const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

// Configuração do CORS
fastify.register(cors, {
    origin: "*"
});

// Registro das rotas
fastify.register(require("./rotas/calcular"));
fastify.register(require("./rotas/historico"));
fastify.register(require("./rotas/auth"));
fastify.register(require("./rotas/ranking")); // nova rota

// Rota de teste
fastify.get("/", async () => {
    return { ok: true };
});

// Inicialização do servidor
const start = async () => {
    try {
        await fastify.listen({
            port: 3000,
            host: "0.0.0.0"
        });

        console.log("Servidor rodando em http://localhost:3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();