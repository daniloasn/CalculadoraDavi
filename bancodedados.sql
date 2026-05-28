CREATE TABLE historico (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    expressao TEXT,
    resultado TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
	nome TEXT NOT NULL,
	email TEXT UNIQUE
);

insert into historico (usuario_id, expressao, resultado) values (1, '2+2', '4')

select * from historico
select * from usuarios