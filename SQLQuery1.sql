CREATE DATABASE Avalia_mais;
GO

USE Avalia_mais;
GO

CREATE TABLE usuario (
    id INTEGER IDENTITY PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(50),
    senha VARCHAR(8)
);

CREATE TABLE avaliacao (
    id INTEGER  IDENTITY PRIMARY KEY,
    nota INTEGER,
    comentario VARCHAR(100),
    data_hora DATETIME
);

CREATE TABLE setor (
    id INTEGER  IDENTITY PRIMARY KEY,
    nome VARCHAR(100),
    pergunta VARCHAR(100),
    fk_usuario_id INTEGER
);

CREATE TABLE avalicao_setor (
    id INTEGER IDENTITY PRIMARY KEY,
    nota INTEGER,
    fk_setor_id INTEGER,
    fk_avaliacao_id INTEGER
);
 
ALTER TABLE setor ADD CONSTRAINT FK_setor_2
    FOREIGN KEY (fk_usuario_id)
    REFERENCES usuario (id)
    ON DELETE NO ACTION ;
 
ALTER TABLE avalicao_setor ADD CONSTRAINT FK_avalicao_setor_2
    FOREIGN KEY (fk_setor_id)
    REFERENCES setor (id)
   ON DELETE NO ACTION ;

ALTER TABLE avalicao_setor ADD CONSTRAINT FK_avalicao_setor_3
    FOREIGN KEY (fk_avaliacao_id)
    REFERENCES avaliacao (id)
     ON DELETE NO ACTION ;

     -- USUÁRIOS (gestores)
INSERT INTO usuario ( nome, email, senha) VALUES
( 'Carlos Mendes', 'carlos@avalia.com', '12345678'),
( 'Mariana Souza', 'mariana@avalia.com', '87654321');


-- SETORES
INSERT INTO setor ( nome, pergunta, fk_usuario_id) VALUES
( 'Atendimento', 'Como você avalia nosso atendimento?', 1),
( 'Caixa', 'Como você avalia o atendimento no caixa?', 1),
( 'Ambiente', 'Como você avalia o ambiente da empresa?', 2),
( 'Produtos', 'Como você avalia a qualidade dos nossos produtos?', 2),
( 'Entrega', 'Como você avalia nosso serviço de entrega?', 1);


-- AVALIAÇÕES DOS CLIENTES
INSERT INTO avaliacao ( nota, comentario, data_hora) VALUES
( 9, 'Fui muito bem atendido.', '2026-09-01 09:15:00'),
( 7, 'O atendimento foi bom, mas demorou um pouco.', '2026-09-01 11:30:00'),
( 10, 'Excelente experiência.', '2026-09-02 14:20:00'),
( 6, 'O atendimento poderia ser mais rápido.', '2026-09-02 16:45:00'),
( 8, 'Gostei dos produtos e do ambiente.', '2026-09-03 10:10:00');


-- AVALIAÇÕES POR SETOR
INSERT INTO avalicao_setor ( nota, fk_setor_id, fk_avaliacao_id) VALUES
-- Avaliação 1
( 5, 1, 1),
( 4, 2, 1),
( 5, 3, 1),
( 5, 4, 1),

-- Avaliação 2
( 4, 1, 2),
( 3, 2, 2),
( 4, 3, 2),
(5, 4, 2),

-- Avaliação 3
( 5, 1, 3),
( 5, 2, 3),
( 5, 3, 3),
( 5, 4, 3),
( 5, 5, 3),

-- Avaliação 4
( 3, 1, 4),
( 2, 2, 4),
( 4, 3, 4),
( 4, 4, 4),

-- Avaliação 5
( 4, 1, 5),
( 4, 2, 5),
( 5, 3, 5),
( 5, 4, 5),
( 4, 5, 5);

