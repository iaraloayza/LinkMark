// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

/**
 * Alterna entre abas de login e registro
 */
async function showTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginTab = document.querySelector('.auth-tab:first-child');
  const registerTab = document.querySelector('.auth-tab:last-child');
  
  if (tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
  }
  
  clearMessages();
}

/**
 * Processa o login do usuário
 */
async function handleLogin(event) {
  event.preventDefault();
  clearMessages();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showError('loginError', 'Por favor, preencha todos os campos');
    return;
  }
  
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.success) {
      currentUser = data.data;
      localStorage.setItem('userId', data.data.id);
      localStorage.setItem('userName', data.data.name);
      showMainScreen();
    } else {
      showError('loginError', data.error || 'Erro ao fazer login');
    }
  } catch (error) {
    showError('loginError', 'Erro ao conectar com o servidor');
  }
}

/**
 * Processa o registro de novo usuário
 */
async function handleRegister(event) {
  event.preventDefault();
  clearMessages();
  
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  
  // Validações
  if (!name || !email || !password || !confirmPassword) {
    showError('registerError', 'Por favor, preencha todos os campos');
    return;
  }
  
  if (password.length < 6) {
    showError('registerError', 'A senha deve ter no mínimo 6 caracteres');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('registerError', 'As senhas não coincidem');
    return;
  }
  
  try {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    if (data.success) {
      currentUser = data.data;
      localStorage.setItem('userId', data.data.id);
      localStorage.setItem('userName', data.data.name);
      showMainScreen();
    } else {
      showError('registerError', data.error || 'Erro ao criar conta');
    }
  } catch (error) {
    showError('registerError', 'Erro ao conectar com o servidor');
  }
}

/**
 * Faz logout do usuário
 */
function logout() {
  if (!confirm('Deseja realmente sair?')) {
    return;
  }
  
  currentUser = null;
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('mainScreen').style.display = 'none';
  document.getElementById('userInfo').style.display = 'none';
  
  clearForms();
  clearMessages();
}

/**
 * Exibe a tela principal após login
 */
function showMainScreen() {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('mainScreen').style.display = 'block';
  document.getElementById('userInfo').style.display = 'flex';
  document.getElementById('userName').textContent = currentUser.name;
  
  // Atualiza avatar com iniciais
  updateUserAvatar(currentUser.name);
  
  // Carrega dados
  if (typeof loadCategories === 'function') loadCategories();
  if (typeof loadLinks === 'function') loadLinks();
}

/**
 * Verifica se há usuário logado ao carregar a página
 */
function checkAuthStatus() {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  
  if (userId && userName) {
    currentUser = { id: userId, name: userName };
    showMainScreen();
  }
}