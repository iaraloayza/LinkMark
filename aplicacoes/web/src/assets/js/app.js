// Configuração da API
const API_URL = window.__CONFIG__.API_URL;

// Estado da aplicação
let currentUser = null;

// ============================================
// Funções de Autenticação
// ============================================

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

async function handleLogin(event) {
  event.preventDefault();
  clearMessages();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = data.data;
      localStorage.setItem('userId', data.data.id);
      localStorage.setItem('userName', data.data.name);
      showMainScreen();
    } else {
      showError('loginError', data.error);
    }
  } catch (error) {
    showError('loginError', 'Erro ao conectar com o servidor');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  clearMessages();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  
  // Validação de confirmação de senha
  if (password !== confirmPassword) {
    showError('registerError', 'As senhas não coincidem');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      currentUser = data.data;
      localStorage.setItem('userId', data.data.id);
      localStorage.setItem('userName', data.data.name);
      showMainScreen();
    } else {
      showError('registerError', data.error);
    }
  } catch (error) {
    showError('registerError', 'Erro ao conectar com o servidor');
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  document.getElementById('authScreen').style.display = 'block';
  document.getElementById('mainScreen').style.display = 'none';
  document.getElementById('userInfo').style.display = 'none';
  clearForms();
}

function showMainScreen() {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('mainScreen').style.display = 'block';
  document.getElementById('userInfo').style.display = 'flex';
  document.getElementById('userName').textContent = currentUser.name;
  
  loadCategories();
  loadLinks();
}

// ============================================
// Funções de Categorias
// ============================================

async function loadCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: { 'X-User-Id': localStorage.getItem('userId') }
    });
    
    const data = await response.json();
    
    if (data.success) {
      updateCategorySelects(data.data);
      updateCategoriesList(data.data);
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

function updateCategorySelects(categories) {
  const linkCategorySelect = document.getElementById('linkCategory');
  const filterSelect = document.getElementById('categoryFilter');
  
  // Atualiza select do formulário de links
  linkCategorySelect.innerHTML = '<option value="">Sem categoria</option>';
  categories.forEach(cat => {
    linkCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
  });
  
  // Atualiza select de filtro
  filterSelect.innerHTML = '<option value="">Todas as categorias</option>';
  categories.forEach(cat => {
    filterSelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
  });
}

function updateCategoriesList(categories) {
  const list = document.getElementById('categoriesList');
  
  if (categories.length === 0) {
    list.innerHTML = '<li class="empty-state">Nenhuma categoria cadastrada</li>';
    return;
  }
  
  list.innerHTML = categories.map(cat => `
    <li class="category-item">
      <span class="category-name">${cat.name}</span>
      <div class="category-actions">
        <button class="btn-edit" onclick="editCategory(${cat.id}, '${cat.name}')">Editar</button>
        <button class="btn-danger" onclick="deleteCategory(${cat.id})">Excluir</button>
      </div>
    </li>
  `).join('');
}

async function handleSaveCategory(event) {
  event.preventDefault();
  clearMessages();
  
  const name = document.getElementById('categoryName').value;
  const editId = document.getElementById('editCategoryId').value;
  
  const isEditing = editId !== '';
  const url = isEditing ? `${API_URL}/categories/${editId}` : `${API_URL}/categories`;
  const method = isEditing ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': localStorage.getItem('userId')
      },
      body: JSON.stringify({ name })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('categorySuccess', data.data.message);
      document.getElementById('categoryForm').reset();
      document.getElementById('editCategoryId').value = '';
      document.getElementById('saveCategoryBtn').textContent = 'Adicionar';
      document.getElementById('cancelCategoryBtn').style.display = 'none';
      loadCategories();
    } else {
      showError('categoryError', data.error);
    }
  } catch (error) {
    showError('categoryError', 'Erro ao salvar categoria');
  }
}

function editCategory(id, name) {
  document.getElementById('editCategoryId').value = id;
  document.getElementById('categoryName').value = name;
  document.getElementById('saveCategoryBtn').textContent = 'Atualizar';
  document.getElementById('cancelCategoryBtn').style.display = 'inline-block';
  clearMessages();
}

function cancelCategoryEdit() {
  document.getElementById('categoryForm').reset();
  document.getElementById('editCategoryId').value = '';
  document.getElementById('saveCategoryBtn').textContent = 'Adicionar';
  document.getElementById('cancelCategoryBtn').style.display = 'none';
  clearMessages();
}

async function deleteCategory(id) {
  if (!confirm('Tem certeza que deseja excluir esta categoria? Os links não serão excluídos.')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': localStorage.getItem('userId') }
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('categorySuccess', 'Categoria excluída com sucesso');
      loadCategories();
      loadLinks();
    } else {
      showError('categoryError', data.error);
    }
  } catch (error) {
    showError('categoryError', 'Erro ao excluir categoria');
  }
}

// ============================================
// Funções de Links
// ============================================

async function loadLinks() {
  const container = document.getElementById('linksContainer');
  container.innerHTML = '<p class="loading">Carregando...</p>';
  
  const categoryFilter = document.getElementById('categoryFilter').value;
  const url = categoryFilter 
    ? `${API_URL}/links?category_id=${categoryFilter}`
    : `${API_URL}/links`;
  
  try {
    const response = await fetch(url, {
      headers: { 'X-User-Id': localStorage.getItem('userId') }
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayLinks(data.data);
    }
  } catch (error) {
    container.innerHTML = '<p class="error-message show">Erro ao carregar links</p>';
  }
}

function displayLinks(links) {
  const container = document.getElementById('linksContainer');
  
  if (links.length === 0) {
    container.innerHTML = '<p class="empty-state">Nenhum link cadastrado</p>';
    return;
  }
  
  container.innerHTML = `
    <ul class="links-list">
      ${links.map(link => `
        <li class="link-item">
          <div class="link-header">
            <h4 class="link-title">${link.title}</h4>
            ${link.category_name ? `<span class="link-category">${link.category_name}</span>` : ''}
          </div>
          <a href="${link.url}" target="_blank" class="link-url">${link.url}</a>
          ${link.description ? `<p class="link-description">${link.description}</p>` : ''}
          <div class="link-actions">
            <button class="btn-edit" onclick='editLink(${JSON.stringify(link)})'>Editar</button>
            <button class="btn-delete" onclick="deleteLink(${link.id})">Excluir</button>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

async function handleSaveLink(event) {
  event.preventDefault();
  clearMessages();
  
  const title = document.getElementById('linkTitle').value;
  const url = document.getElementById('linkUrl').value;
  const description = document.getElementById('linkDescription').value;
  const category_id = document.getElementById('linkCategory').value || null;
  const editId = document.getElementById('editLinkId').value;
  
  const isEditing = editId !== '';
  const apiUrl = isEditing ? `${API_URL}/links/${editId}` : `${API_URL}/links`;
  const method = isEditing ? 'PUT' : 'POST';
  
  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': localStorage.getItem('userId')
      },
      body: JSON.stringify({ title, url, description, category_id })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('linkSuccess', data.data.message);
      document.getElementById('linkForm').reset();
      cancelEdit();
      loadLinks();
    } else {
      showError('linkError', data.error);
    }
  } catch (error) {
    showError('linkError', 'Erro ao salvar link');
  }
}

function editLink(link) {
  document.getElementById('editLinkId').value = link.id;
  document.getElementById('linkTitle').value = link.title;
  document.getElementById('linkUrl').value = link.url;
  document.getElementById('linkDescription').value = link.description || '';
  document.getElementById('linkCategory').value = link.category_id || '';
  
  document.getElementById('formTitle').textContent = 'Editar Link';
  document.getElementById('saveBtn').textContent = 'Atualizar Link';
  document.getElementById('cancelBtn').style.display = 'inline-block';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  clearMessages();
}

function cancelEdit() {
  document.getElementById('linkForm').reset();
  document.getElementById('editLinkId').value = '';
  document.getElementById('formTitle').textContent = 'Adicionar Novo Link';
  document.getElementById('saveBtn').textContent = 'Salvar Link';
  document.getElementById('cancelBtn').style.display = 'none';
  clearMessages();
}

async function deleteLink(id) {
  if (!confirm('Tem certeza que deseja excluir este link?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/links/${id}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': localStorage.getItem('userId') }
    });
    
    const data = await response.json();
    
    if (data.success) {
      showSuccess('linkSuccess', 'Link excluído com sucesso');
      loadLinks();
    } else {
      showError('linkError', data.error);
    }
  } catch (error) {
    showError('linkError', 'Erro ao excluir link');
  }
}

// ============================================
// Funções Auxiliares
// ============================================

function showError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 5000);
}

function showSuccess(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 3000);
}

function clearMessages() {
  document.querySelectorAll('.error-message, .success-message').forEach(el => {
    el.classList.remove('show');
  });
}

function clearForms() {
  document.getElementById('linkForm').reset();
  document.getElementById('categoryForm').reset();
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('registerName').value = '';
  document.getElementById('registerEmail').value = '';
  document.getElementById('registerPassword').value = '';
  document.getElementById('registerConfirmPassword').value = '';
  cancelEdit();
  cancelCategoryEdit();
}

// ============================================
// Inicialização
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Verifica se há usuário logado
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  
  if (userId && userName) {
    currentUser = { id: userId, name: userName };
    showMainScreen();
  }
});