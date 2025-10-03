// ============================================
// FUNÇÕES DE CATEGORIAS
// ============================================

/**
 * Carrega todas as categorias do usuário
 */
async function loadCategories() {
  try {
    const data = await apiRequest('/categories');
    
    if (data.success) {
      updateCategorySelects(data.data);
      updateCategoriesList(data.data);
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

/**
 * Atualiza os selects de categoria
 */
function updateCategorySelects(categories) {
  const linkCategorySelect = document.getElementById('linkCategory');
  const filterSelect = document.getElementById('categoryFilter');
  
  if (!linkCategorySelect || !filterSelect) return;
  
  // Atualiza select do formulário de links
  linkCategorySelect.innerHTML = '<option value="">Sem categoria</option>';
  categories.forEach(cat => {
    linkCategorySelect.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
  });
  
  // Atualiza select de filtro
  filterSelect.innerHTML = '<option value="">Todas as categorias</option>';
  categories.forEach(cat => {
    filterSelect.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
  });
}

/**
 * Atualiza a lista visual de categorias
 */
function updateCategoriesList(categories) {
  const list = document.getElementById('categoriesList');
  if (!list) return;
  
  if (categories.length === 0) {
    list.innerHTML = '<li class="empty-state">Nenhuma categoria cadastrada</li>';
    return;
  }
  
  list.innerHTML = categories.map(cat => {
    const escapedName = escapeHtml(cat.name);
    const escapedNameJson = escapedName.replace(/"/g, '&quot;');
    
    return `
      <li class="category-item">
        <span class="category-name">${escapedName}</span>
        <div class="category-actions">
          <button class="btn-edit" onclick="editCategory(${cat.id}, '${escapedNameJson}')" title="Editar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="btn-danger" onclick="deleteCategory(${cat.id})" title="Excluir">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </li>
    `;
  }).join('');
}

/**
 * Salva uma categoria (criar ou atualizar)
 */
async function handleSaveCategory(event) {
  event.preventDefault();
  clearMessages();
  
  const name = document.getElementById('categoryName').value.trim();
  const editId = document.getElementById('editCategoryId').value;
  
  if (!name) {
    showError('categoryError', 'Por favor, digite o nome da categoria');
    return;
  }
  
  const isEditing = editId !== '';
  const endpoint = isEditing ? `/categories/${editId}` : '/categories';
  const method = isEditing ? 'PUT' : 'POST';
  
  try {
    const data = await apiRequest(endpoint, {
      method,
      body: JSON.stringify({ name })
    });
    
    if (data.success) {
      showSuccess('categorySuccess', data.data.message || 'Categoria salva com sucesso');
      document.getElementById('categoryForm').reset();
      document.getElementById('editCategoryId').value = '';
      document.getElementById('saveCategoryBtn').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      document.getElementById('cancelCategoryBtn').style.display = 'none';
      loadCategories();
      
      // Recarrega links se houver mudança em categorias
      if (typeof loadLinks === 'function') loadLinks();
    } else {
      showError('categoryError', data.error || 'Erro ao salvar categoria');
    }
  } catch (error) {
    showError('categoryError', 'Erro ao conectar com o servidor');
  }
}

/**
 * Prepara o formulário para editar uma categoria
 */
function editCategory(id, name) {
  document.getElementById('editCategoryId').value = id;
  document.getElementById('categoryName').value = name;
  document.getElementById('saveCategoryBtn').innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  document.getElementById('cancelCategoryBtn').style.display = 'inline-flex';
  document.getElementById('categoryName').focus();
  clearMessages();
}

/**
 * Cancela a edição de categoria
 */
function cancelCategoryEdit() {
  document.getElementById('categoryForm').reset();
  document.getElementById('editCategoryId').value = '';
  document.getElementById('saveCategoryBtn').innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  document.getElementById('cancelCategoryBtn').style.display = 'none';
  clearMessages();
}

/**
 * Exclui uma categoria
 */
async function deleteCategory(id) {
  if (!confirm('Tem certeza que deseja excluir esta categoria? Os links não serão excluídos.')) {
    return;
  }
  
  try {
    const data = await apiRequest(`/categories/${id}`, {
      method: 'DELETE'
    });
    
    if (data.success) {
      showSuccess('categorySuccess', 'Categoria excluída com sucesso');
      loadCategories();
      
      // Recarrega links para atualizar visualização
      if (typeof loadLinks === 'function') loadLinks();
    } else {
      showError('categoryError', data.error || 'Erro ao excluir categoria');
    }
  } catch (error) {
    showError('categoryError', 'Erro ao conectar com o servidor');
  }
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}