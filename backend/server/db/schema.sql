-- Tabela PERFIL
CREATE TABLE IF NOT EXISTS perfil (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- Tabela USUARIO
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    data_nascimento DATE,
    nome VARCHAR(45) NOT NULL,
    sobrenome VARCHAR(45),
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela ENDERECO
CREATE TABLE IF NOT EXISTS endereco (
    idendereco INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INT,
    logradouro VARCHAR(100),
    complemento VARCHAR(45),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    cep VARCHAR(10),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabela CONTATO
CREATE TABLE IF NOT EXISTS contato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INT,
    tipo_contato VARCHAR(100),
    valor VARCHAR(100),
    principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabela PERFIL_USUARIO (tabela associativa)
CREATE TABLE IF NOT EXISTS perfil_usuario (
    perfil_id INT,
    usuario_id INT,
    PRIMARY KEY (perfil_id, usuario_id),
    FOREIGN KEY (perfil_id) REFERENCES perfil(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabela PACIENTE
CREATE TABLE IF NOT EXISTS paciente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INT,
    convenio VARCHAR(45),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabela MEDICO
CREATE TABLE IF NOT EXISTS medico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INT,
    crm VARCHAR(20),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabela ESPECIALIDADE
CREATE TABLE IF NOT EXISTS especialidade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100),
    descricao VARCHAR(100)
);

-- Tabela ESPECIALIDADE_MEDICO (associação N:N)
CREATE TABLE IF NOT EXISTS especialidade_medico (
    especialidade_id INT,
    medico_id INT,
    PRIMARY KEY (especialidade_id, medico_id),
    FOREIGN KEY (especialidade_id) REFERENCES especialidade(id),
    FOREIGN KEY (medico_id) REFERENCES medico(id)
);

-- Tabela AGENDA
CREATE TABLE IF NOT EXISTS agenda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medico_id INT,
    data DATE,
    hora TIME,
    disponibilidade BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (medico_id) REFERENCES medico(id)
);

-- Tabela CONSULTA
CREATE TABLE IF NOT EXISTS consulta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INT,
    agenda_id INT,
    status VARCHAR(45),
    motivo_cancelamento VARCHAR(45),
    presenca BOOLEAN,
    FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    FOREIGN KEY (agenda_id) REFERENCES agenda(id)
);

-- Tabela AVALIACAO
CREATE TABLE IF NOT EXISTS avaliacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consulta_id INT,
    nota INT,
    comentario VARCHAR(100),
    data_avaliacao DATETIME,
    FOREIGN KEY (consulta_id) REFERENCES consulta(id)
);

INSERT INTO perfil (nome) VALUES
('Administrador'),
('Médico'),
('Paciente');

INSERT INTO especialidade (nome, descricao) VALUES
('Cardiologia', 'Doenças do coração e sistema circulatório'),
('Dermatologia', 'Tratamento de doenças da pele'),
('Pediatria', 'Cuidados médicos de crianças'),
('Ortopedia', 'Tratamento de ossos e articulações'),
('Ginecologia', 'Saúde reprodutiva feminina'),
('Psiquiatria', 'Tratamento de transtornos mentais'),
('Oftalmologia', 'Cuidados com os olhos e visão'),
('Endocrinologia', 'Distúrbios hormonais e metabólicos');
