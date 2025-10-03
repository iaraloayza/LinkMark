-- Inserir usuário de teste
-- Senha: 123456 (em produção use bcrypt!)
INSERT INTO users (name, email, password) VALUES 
('Usuário Teste', 'teste@exemplo.com', '123456'),
('João Silva', 'joao@exemplo.com', '123456');

-- Inserir categorias de exemplo
INSERT INTO categories (name, user_id) VALUES 
('Trabalho', 1),
('Estudos', 1),
('Pessoal', 1),
('Projetos', 2);

-- Inserir links de exemplo
INSERT INTO links (title, url, description, category_id, user_id) VALUES 
('Google', 'https://google.com', 'Motor de busca', 1, 1),
('GitHub', 'https://github.com', 'Repositórios de código', 1, 1),
('YouTube', 'https://youtube.com', 'Vídeos educacionais', 2, 1),
('Stack Overflow', 'https://stackoverflow.com', 'Dúvidas de programação', 2, 1);