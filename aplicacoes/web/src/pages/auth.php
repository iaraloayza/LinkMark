<div id="authScreen" class="auth-screen">
    <div class="auth-container">
        <!-- <div class="auth-header">
            <div class="auth-logo">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h2>Bem-vindo ao LinkMark</h2>
            <p class="auth-subtitle">Organize e gerencie seus links favoritos</p>
        </div> -->

        <div class="auth-header">
            <div class="auth-header-content">
                <div class="auth-logo">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="auth-header-text">
                    <h2>Bem-vindo ao LinkMark</h2>
                    <p class="auth-subtitle">Organize e gerencie seus links favoritos</p>
                </div>
            </div>
        </div>

        <div class="auth-tabs">
            <button class="auth-tab active" onclick="showTab('login')">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Login
            </button>
            <button class="auth-tab" onclick="showTab('register')">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Registrar
            </button>
        </div>

        <!-- Formulário de Login -->
        <div id="loginForm" class="auth-form">
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label for="loginEmail">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Email
                    </label>
                    <input type="email" id="loginEmail" placeholder="seu@email.com" required/>
                </div>
                
                <div class="form-group">
                    <label for="loginPassword">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Senha
                    </label>
                    <input type="password" id="loginPassword" placeholder="••••••••" required/>
                </div>
                
                <button type="submit" class="btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Entrar
                </button>
            </form>
            <div id="loginError" class="error-message"></div>
        </div>

        <!-- Formulário de Registro -->
        <div id="registerForm" class="auth-form" style="display: none;">
            <form onsubmit="handleRegister(event)">
                <div id="registerError" class="error-message" style="margin-bottom: 15px;"></div>
                
                <div class="form-group">
                    <label for="registerName">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Nome
                    </label>
                    <input type="text" id="registerName" placeholder="Seu nome completo" required/>
                </div>
                
                <div class="form-group">
                    <label for="registerEmail">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Email
                    </label>
                    <input type="email" id="registerEmail" placeholder="seu@email.com" required/>
                </div>
                
                <div class="form-group">
                    <label for="registerPassword">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Senha
                    </label>
                    <input type="password" id="registerPassword" placeholder="Mínimo 6 caracteres" required minlength="6"/>
                </div>
                
                <div class="form-group">
                    <label for="registerConfirmPassword">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Confirmar Senha
                    </label>
                    <input type="password" id="registerConfirmPassword" placeholder="Digite a senha novamente" required minlength="6"/>
                </div>
                
                <button type="submit" class="btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Criar Conta
                </button>
            </form>
        </div>
    </div>
</div>