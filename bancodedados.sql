
DROP TABLE IF EXISTS historico;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo TEXT DEFAULT 'gratuito' CHECK (tipo IN ('gratuito', 'pago')),
    instituicao TEXT,
    escolaridade TEXT,
    endereco TEXT,
    usos_mes INTEGER DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historico (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    expressao TEXT,
    resultado TEXT,
    operacao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
