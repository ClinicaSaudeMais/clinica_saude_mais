-- Insert perfis
INSERT INTO "perfil" ("nome") VALUES
('administrador'),
('medico'),
('paciente');

-- Insert especialidades
INSERT INTO "especialidade" ("nome", "descricao") VALUES
('Cardiologia', 'Especialidade médica que se ocupa do diagnóstico e tratamento das doenças que afetam o coração, bem como os outros componentes do sistema circulatório.'),
('Dermatologia', 'Especialidade médica que se ocupa do diagnóstico e tratamento clínico-cirúrgico das doenças que acometem o maior órgão do corpo humano – a pele.'),
('Ginecologia', 'Especialidade que trata da saúde da mulher, da infância à terceira idade.'),
('Ortopedia', 'Especialidade médica que cuida das doenças e deformidades dos ossos, músculos, ligamentos, articulações, enfim, elementos relacionados ao aparelho locomotor.');

-- Insert usuario admin
-- A password é "Admin123!"
INSERT INTO "usuario" ("cpf", "data_nascimento", "nome", "sobrenome", "email", "senha") VALUES
('00000000000', '1990-01-01', 'Admin', 'User', 'admin@saudemais.com', '$2a$10$f.wM9s6St0dcehR7nB/B4uWjL1.B2.rC1m3jJ8.DxY/C6p.L5t.G');

INSERT INTO "perfil_usuario" ("perfil_id", "usuario_id") VALUES
((SELECT "id" FROM "perfil" WHERE "nome" = 'administrador'), (SELECT "id" FROM "usuario" WHERE "email" = 'admin@saudemais.com'));
