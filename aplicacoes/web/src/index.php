<?php
$apiUrl = getenv('API_URL') ?: 'http://localhost:8000';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>LinkMark - Gerenciador de Links</title>
    <link rel="stylesheet" href="/assets/css/app.css"/>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="logo"></div>
        <div class="title">LinkMark</div>
        <div class="user-info" id="userInfo" style="display: none;">
            <span id="userName"></span>
            <button onclick="logout()" class="btn-logout">Sair</button>
        </div>
    </header>

    <!-- Container Principal -->
    <div class="container">
        <!-- Tela de Login/Registro -->
        <div id="authScreen" class="auth-screen">
            <div class="auth-tabs">
                <button class="auth-tab active" onclick="showTab('login')">Login</button>
                <button class="auth-tab" onclick="showTab('register')">Registrar</button>
            </div>

            <!-- Formulário de Login -->
            <div id="loginForm" class="auth-form">
                <h2>Entrar</h2>
                <form onsubmit="handleLogin(event)">
                    <input type="email" id="loginEmail" placeholder="Email" required/>
                    <input type="password" id="loginPassword" placeholder="Senha" required/>
                    <button type="submit" class="btn-primary">Entrar</button>
                </form>
                <div id="loginError" class="error-message"></div>
            </div>

            <!-- Formulário de Registro -->
            <div id="registerForm" class="auth-form" style="display: none;">
                <h2>Criar Conta</h2>
                <div id="registerError" class="error-message" style="margin-bottom: 15px;"></div>
                <form onsubmit="handleRegister(event)">
                    <input type="text" id="registerName" placeholder="Nome" required/>
                    <input type="email" id="registerEmail" placeholder="Email" required/>
                    <input type="password" id="registerPassword" placeholder="Senha (min: 6 caracteres)" required minlength="6"/>
                    <input type="password" id="registerConfirmPassword" placeholder="Confirmar senha" required minlength="6"/>
                    <button type="submit" class="btn-primary">Registrar</button>
                </form>
            </div>
        </div>

        <!-- Tela Principal (após login) -->
        <div id="mainScreen" style="display: none;">
            <!-- Filtro por Categoria -->
            <div class="filter-section">
                <label>Filtrar por categoria:</label>
                <select id="categoryFilter" onchange="loadLinks()">
                    <option value="">Todas as categorias</option>
                </select>
            </div>

            <!-- Seção de Adicionar Link -->
            <div class="panel">
                <h3 id="formTitle">Adicionar Novo Link</h3>
                <form id="linkForm" onsubmit="handleSaveLink(event)">
                    <input type="hidden" id="editLinkId" value=""/>
                    <input type="text" id="linkTitle" placeholder="Título *" required/>
                    <input type="url" id="linkUrl" placeholder="URL (https://...) *" required/>
                    <textarea id="linkDescription" placeholder="Descrição (opcional)" rows="3"></textarea>
                    <select id="linkCategory">
                        <option value="">Sem categoria</option>
                    </select>
                    <div class="form-buttons">
                        <button type="submit" class="btn-primary" id="saveBtn">Salvar Link</button>
                        <button type="button" class="btn-secondary" id="cancelBtn" onclick="cancelEdit()" style="display: none;">Cancelar</button>
                    </div>
                </form>
                <div id="linkError" class="error-message"></div>
                <div id="linkSuccess" class="success-message"></div>
            </div>

            <!-- Gerenciar Categorias -->
            <div class="panel">
                <h3>Gerenciar Categorias</h3>
                <form id="categoryForm" onsubmit="handleSaveCategory(event)">
                    <input type="hidden" id="editCategoryId" value=""/>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="categoryName" placeholder="Nome da categoria" required style="flex: 1;"/>
                        <button type="submit" class="btn-primary" id="saveCategoryBtn">Adicionar</button>
                        <button type="button" class="btn-secondary" id="cancelCategoryBtn" onclick="cancelCategoryEdit()" style="display: none;">Cancelar</button>
                    </div>
                </form>
                <div id="categoryError" class="error-message"></div>
                <div id="categorySuccess" class="success-message"></div>
                
                <ul id="categoriesList" class="categories-list"></ul>
            </div>

            <!-- Lista de Links -->
            <div class="panel">
                <h3>Meus Links</h3>
                <div id="linksContainer">
                    <p class="loading">Carregando...</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.__CONFIG__ = {API_URL: <?php echo json_encode($apiUrl); ?> };
    </script>
    <script src="/assets/js/app.js?v=<?php echo time(); ?>"></script>
</body>
</html>