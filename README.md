# LinkMark - Sistema de Gerenciamento de Links

Sistema web fullstack para gerenciamento e organização de links com categorização, desenvolvido como parte do teste técnico para Desenvolvedor Júnior na Dynamos Tecnologia.

## 📋 Sobre o Projeto

O LinkMark permite que usuários salvem, organizem e categorizem links em um ambiente seguro e intuitivo. A aplicação foi desenvolvida seguindo os requisitos do desafio técnico, utilizando uma arquitetura separada entre frontend e backend.

## 🛠️ Tecnologias Utilizadas

### Backend (API)
- **Node.js 20** com TypeScript
- **Express.js** - Framework web
- **MySQL 8.0** - Banco de dados
- **bcrypt** - Criptografia de senhas
- **Docker & Docker Compose** - Containerização

### Frontend
- **PHP 8.3** puro (sem frameworks)
- **HTML5, CSS3, JavaScript** vanilla
- **Nginx** - Servidor web

## 🏗️ Arquitetura

```
LinkMark/
├── aplicacoes/
│   ├── api/node/              # Backend API REST
│   │   ├── node_modules/      # Dependências do Node.js
│   │   ├── dist/              # Código compilado TypeScript
│   │   ├── src/
│   │   │   ├── controllers/   # Controladores (lógica de requisições)
│   │   │   │   ├── authController.ts
│   │   │   │   ├── categoriesController.ts
│   │   │   │   └── linksController.ts
│   │   │   │
│   │   │   ├── database/      # Configurações e scripts de banco
│   │   │   │   ├── index.ts   # Configuração de conexão
│   │   │   │   ├── migrations.sql  # Scripts de migração
│   │   │   │   └── setup.mjs  # Script de setup do banco
│   │   │   │
│   │   │   ├── middleware/    # Middlewares da aplicação
│   │   │   │   └── auth.ts    # Autenticação simples
│   │   │   │
│   │   │   ├── routes/        # Definição de rotas
│   │   │   │   ├── auth.ts    # Rotas de autenticação
│   │   │   │   ├── categories.ts  # Rotas de categorias
│   │   │   │   ├── index.ts   # Agregador de rotas
│   │   │   │   └── links.ts   # Rotas de links
│   │   │   │
│   │   │   └── server.ts      # Arquivo principal do servidor
│   │   │
│   │   ├── .dockerignore
│   │   ├── .env               # Variáveis de ambiente
│   │   ├── .env.example       # Exemplo de variáveis de ambiente
│   │   ├── .gitignore
│   │   ├── compose.yaml       # Docker Compose config
│   │   ├── package.json       # Dependências e scripts NPM
│   │   └── tsconfig.json      # Configuração TypeScript
│   │
│   └── web/                   # Frontend PHP
│       ├── src/
│       │   ├── index.php      # Arquivo principal da aplicação
│       │   ├── pages/         # Páginas da aplicação
│       │   │   ├── auth.php   # Tela de login/registro
│       │   │   └── dashboard.php  # Painel principal (após login)
│       │   │
│       │   ├── components/    # Componentes reutilizáveis
│       │   │   ├── header.php # Cabeçalho com logo e menu
│       │   │   └── footer.php # Rodapé
│       │   │
│       │   └── assets/
│       │       ├── css/       # Estilos modularizados
│       │       │   ├── main.css       # Estilos globais e variáveis
│       │       │   ├── auth.css       # Estilos da tela de autenticação
│       │       │   ├── dashboard.css  # Estilos do dashboard
│       │       │   └── components.css # Estilos de componentes
│       │       │
│       │       └── js/        # JavaScript modularizado
│       │           ├── app.js        # Inicialização e eventos globais
│       │           ├── auth.js       # Lógica de autenticação
│       │           ├── categories.js # Gerenciamento de categorias
│       │           ├── links.js      # Gerenciamento de links
│       │           └── utils.js      # Funções utilitárias
│       │
│       ├── nginx/
│       │   └── default.conf   # Configuração Nginx
│       └── compose.yaml       # Docker Compose config frontend
```

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados
- Portas 8000 (API) e 8080 (Web) disponíveis

> **⚠️ Observação sobre Portas:** A porta padrão do frontend foi alterada de **80** para **8080** para evitar conflitos com outros projetos Apache que possuo rodando localmente. A configuração de CORS no backend (`FRONTEND_URL`) também foi ajustada para refletir essa mudança.

### 1. Clonar o Repositório
```bash
git clone https://github.com/iaraloayza/LinkMark.git
cd LinkMark
```

### 2. Subir a API (Backend)

```bash
cd aplicacoes/api/node
docker compose up -d
```

Aguarde cerca de 15 segundos para o MySQL inicializar completamente.

### 3. Executar Migrations e Seeds

```bash
docker exec -it node-node-1 npm run setup-db
```

Este comando irá:
- Criar as tabelas no banco de dados
- Inserir dados de exemplo com senhas criptografadas

**Credenciais de teste:**
- Email: `teste@exemplo.com`
- Senha: `123456`

ou 

- Email: `joao@exemplo.com`
- Senha: `123456`

### 4. Subir o Frontend

```bash
cd ../web
docker compose up -d
```

### 5. Acessar a Aplicação

Abra o navegador e acesse: **http://localhost:8080**

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
- `id` (PK)
- `name`
- `email` (UNIQUE)
- `password` (hash bcrypt)
- `created_at`

### Tabela `categories`
- `id` (PK)
- `name`
- `user_id` (FK → users)
- `created_at`

### Tabela `links`
- `id` (PK)
- `title`
- `url`
- `description`
- `category_id` (FK → categories, nullable)
- `user_id` (FK → users)
- `created_at`
- `updated_at`

## 📡 Endpoints da API

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/me` - Obter dados do usuário logado

### Categorias
- `GET /categories` - Listar categorias do usuário
- `GET /categories/:id` - Buscar categoria específica
- `POST /categories` - Criar nova categoria
- `PUT /categories/:id` - Atualizar categoria
- `DELETE /categories/:id` - Deletar categoria

### Links
- `GET /links` - Listar links do usuário
- `GET /links?category_id=X` - Filtrar links por categoria
- `GET /links/:id` - Buscar link específico
- `POST /links` - Criar novo link
- `PUT /links/:id` - Atualizar link
- `DELETE /links/:id` - Deletar link

**Autenticação:** Todas as rotas (exceto register e login) requerem o header `X-User-Id` com o ID do usuário.

## ✨ Funcionalidades Implementadas

### Frontend
- ✅ Sistema de login e registro
- ✅ Gerenciamento completo de links (CRUD)
- ✅ Gerenciamento de categorias (CRUD)
- ✅ Filtro de links por categoria
- ✅ Interface responsiva e moderna
- ✅ Validação de formulários
- ✅ Feedback visual de sucesso/erro

### Backend
- ✅ API RESTful com arquitetura em camadas
- ✅ Autenticação com bcrypt
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ CORS configurado
- ✅ Relacionamentos entre tabelas
- ✅ Migrations automatizadas

## 🔒 Segurança

- Senhas criptografadas com bcrypt (salt rounds = 10)
- Validação de entradas no backend
- Proteção contra SQL injection (prepared statements)
- CORS configurado para aceitar apenas origem autorizada
- Validação de propriedade de recursos (usuário só acessa seus próprios dados)

## 🛠️ Comandos Úteis

### Resetar o banco de dados
```bash
cd aplicacoes/api/node
docker compose down -v
docker compose up -d
# Aguardar 15 segundos
docker exec -it node-node-1 npm run setup-db
```

### Ver logs em tempo real
```bash
# API
docker compose logs -f node

# MySQL
docker compose logs -f mysql
```

### Parar os containers
```bash
docker compose down
```

## 📝 Decisões Técnicas

### Backend
- **TypeScript**: Escolhido para maior segurança de tipos e melhor manutenibilidade
- **Arquitetura em camadas**: Controllers, Routes e Middleware separados para melhor organização
- **Bcrypt**: Implementado para criptografia de senhas seguindo boas práticas
- **MySQL**: Banco relacional para garantir integridade referencial

### Frontend
- **PHP puro**: Seguindo requisito do desafio
- **Fetch API**: Para comunicação com a API REST
- **CSS moderno**: Variáveis CSS, flexbox e design responsivo
- **JavaScript vanilla**: Sem dependências externas, código limpo e performático

### Infraestrutura
- **Docker Compose**: Facilita setup e garante ambiente consistente
- **Healthcheck no MySQL**: Evita problemas de conexão na inicialização
- **Volumes persistentes**: Dados do banco são mantidos entre restarts

## 🎯 Pontos de Destaque

- ✅ Código limpo e bem documentado
- ✅ Tratamento completo de erros
- ✅ Validações robustas
- ✅ Interface intuitiva e responsiva
- ✅ Arquitetura escalável
- ✅ Commits organizados e descritivos
- ✅ README completo com instruções claras

## 👨‍💻 Desenvolvedora

**Ana Iara Loayza Costa**
- GitHub: [@iaraloayza](https://github.com/iaraloayza)

---

⭐ Espero que tenham gostado!