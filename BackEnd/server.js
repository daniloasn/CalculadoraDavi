const fastify = require("fastify")({ logger: true }); //cria a parada toda(server)
const cors = require("@fastify/cors"); //importa os plugins do cors(é o que permite o front acessar o back)



fastify.register(cors, {
    origin: "*" //origin "*" qualquer front pode acessar
});

fastify.register(require("./rotas/calcular")); //importa os dados do calcular.js
fastify.register(require("./rotas/historico"))
fastify.register(require("./rotas/auth"));

fastify.get("/", async () => { //pra saber se o server ta bom
    return { ok: true };
});

const start = async () => { //função que inicia o server
    try {
        await fastify.listen({ port: 3000 });
        console.log("Servidor rodando em http://localhost:3000"); //console pra saber se ta funcionando
    } catch (err) {
        fastify.log.error(err); //se não da erro e evita cair a parada
        process.exit(1);
    }
};

start(); // chama a função e liga tudo