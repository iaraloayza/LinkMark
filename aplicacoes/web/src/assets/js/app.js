// ============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================

/**
 * Inicializa a aplicação quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 LinkMark inicializado');
  
  // Verifica se há usuário logado
  checkAuthStatus();
  
  // Adiciona listeners para melhorar UX
  setupEventListeners();
});

/**
 * Configura event listeners adicionais
 */
function setupEventListeners() {
  // Previne submit acidental de formulários
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.disabled = false;
        }, 1000);
      }
    });
  });
  
  // Auto-dismiss de mensagens ao clicar
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('error-message') || 
        e.target.classList.contains('success-message')) {
      e.target.classList.remove('show');
    }
  });
  
  // Tecla ESC cancela edições
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const editLinkId = document.getElementById('editLinkId');
      const editCategoryId = document.getElementById('editCategoryId');
      
      if (editLinkId && editLinkId.value) {
        cancelEdit();
      }
      if (editCategoryId && editCategoryId.value) {
        cancelCategoryEdit();
      }
    }
  });
  
  // Validação em tempo real para URLs
  const urlInput = document.getElementById('linkUrl');
  if (urlInput) {
    urlInput.addEventListener('blur', function() {
      const url = this.value.trim();
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        this.value = 'https://' + url;
      }
    });
  }
  
  // Conta caracteres em textarea
  const descriptionTextarea = document.getElementById('linkDescription');
  if (descriptionTextarea) {
    let charCounter = document.createElement('div');
    charCounter.className = 'char-counter';
    charCounter.style.cssText = 'text-align: right; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem;';
    descriptionTextarea.parentElement.appendChild(charCounter);
    
    descriptionTextarea.addEventListener('input', function() {
      const length = this.value.length;
      charCounter.textContent = `${length} caracteres`;
      charCounter.style.color = length > 500 ? 'var(--warning-color)' : 'var(--text-muted)';
    });
  }
}

/**
 * Manipula erros globais
 */
window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error);
});

/**
 * Manipula rejeições de promises não tratadas
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejeitada não tratada:', event.reason);
});

/**
 * Detecta quando usuário está offline/online
 */
window.addEventListener('offline', () => {
  showError('linkError', 'Você está offline. Verifique sua conexão com a internet.');
});

window.addEventListener('online', () => {
  showSuccess('linkSuccess', 'Conexão restabelecida!');
  // Recarrega dados quando voltar online
  if (currentUser) {
    loadCategories();
    loadLinks();
  }
});

/**
 * Previne perda de dados ao sair da página com formulário preenchido
 */
window.addEventListener('beforeunload', (e) => {
  const linkTitle = document.getElementById('linkTitle');
  const linkUrl = document.getElementById('linkUrl');
  const categoryName = document.getElementById('categoryName');
  
  const hasUnsavedLink = linkTitle && linkUrl && (linkTitle.value || linkUrl.value);
  const hasUnsavedCategory = categoryName && categoryName.value;
  
  if (hasUnsavedLink || hasUnsavedCategory) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }
});

// Exporta funções globais para uso no console (útil para debug)
if (typeof window !== 'undefined') {
  window.LinkMarkDebug = {
    currentUser: () => currentUser,
    reloadData: () => {
      loadCategories();
      loadLinks();
    },
    clearStorage: () => {
      localStorage.clear();
      location.reload();
    },
    version: '2.0.0'
  };
  
  console.log('%c💡 LinkMark Debug disponível: window.LinkMarkDebug', 
    'color: #6366f1; font-weight: bold; font-size: 12px;');
}