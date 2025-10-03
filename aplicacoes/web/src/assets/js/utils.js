// ============================================
// UTILIDADES E FUNÇÕES AUXILIARES
// ============================================

const API_URL = window.__CONFIG__.API_URL;

// Estado da aplicação
let currentUser = null;

/**
 * Exibe mensagem de erro
 */
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 5000);
}

/**
 * Exibe mensagem de sucesso
 */
function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 3000);
}

/**
 * Limpa todas as mensagens da tela
 */
function clearMessages() {
  document.querySelectorAll('.error-message, .success-message').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
}

/**
 * Limpa todos os formulários
 */
function clearForms() {
  document.getElementById('linkForm')?.reset();
  document.getElementById('categoryForm')?.reset();
  
  const authFields = [
    'loginEmail', 'loginPassword',
    'registerName', 'registerEmail', 
    'registerPassword', 'registerConfirmPassword'
  ];
  
  authFields.forEach(id => {
    const field = document.getElementById(id);
    if (field) field.value = '';
  });
  
  if (typeof cancelEdit === 'function') cancelEdit();
  if (typeof cancelCategoryEdit === 'function') cancelCategoryEdit();
}

/**
 * Faz requisição à API
 */
async function apiRequest(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };
  
  const userId = localStorage.getItem('userId');
  if (userId) {
    defaultHeaders['X-User-Id'] = userId;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

/**
 * Gera iniciais do nome para o avatar
 */
function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Atualiza o avatar do usuário
 */
function updateUserAvatar(name) {
  const avatar = document.getElementById('userAvatar');
  if (avatar) {
    avatar.textContent = getInitials(name);
  }
}

/**
 * Scroll suave para o topo
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Debounce para otimizar eventos
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}