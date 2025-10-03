// ============================================
// FUNÇÕES DE LINKS
// ============================================

/**
 * Carrega todos os links do usuário
 */
async function loadLinks() {
  const container = document.getElementById('linksContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Carregando links...</p>
    </div>
  `;
  
  const categoryFilter = document.getElementById('categoryFilter')?.value || '';
  const endpoint = categoryFilter ? `/links?category_id=${categoryFilter}` : '/links';
  
  try {
    const data = await apiRequest(endpoint);
    
    if (data.success) {
      displayLinks(data.data);
      updateLinkCount(data.data.length);
    } else {
      container.innerHTML = '<p class="error-message show">Erro ao carregar links</p>';
    }
  } catch (error) {
    container.innerHTML = '<p class="error-message show">Erro ao conectar com o servidor</p>';
  }
}

/**
 * Exibe os links na interface
 */
function displayLinks(links) {
  const container = document.getElementById('linksContainer');
  if (!container) return;
  
  if (links.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>Nenhum link cadastrado</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <ul class="links-list">
      ${links.map((link, index) => `
        <li class="link-item" style="animation-delay: ${index * 0.05}s">
          <div class="link-header">
            <h4 class="link-title">${escapeHtml(link.title)}</h4>
            ${link.category_name ? `<span class="link-category">${escapeHtml(link.category_name)}</span>` : ''}
          </div>
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-url">${escapeHtml(link.url)}</a>
          ${link.description ? `<p class="link-description">${escapeHtml(link.description)}</p>` : ''}
          <div class="link-actions">
            <button class="btn-edit" onclick='editLink(${JSON.stringify(link).replace(/'/g, "&#39;")})' title="Editar link">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Editar
            </button>
            <button class="btn-delete" onclick="deleteLink(${link.id})" title="Excluir link">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Excluir
            </button>
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

/**
 * Atualiza o contador de links
 */
function updateLinkCount(count) {
  const linkCount = document.getElementById('linkCount');
  if (linkCount) {
    linkCount.textContent = `${count} ${count === 1 ? 'link' : 'links'}`;
  }
}

/**
 * Salva um link (criar ou atualizar)
 */
async function handleSaveLink(event) {
  event.preventDefault();
  clearMessages();
  
  const title = document.getElementById('linkTitle').value.trim();
  const url = document.getElementById('linkUrl').value.trim();
  const description = document.getElementById('linkDescription').value.trim();
  const category_id = document.getElementById('linkCategory').value || null;
  const editId = document.getElementById('editLinkId').value;
  
  // Validações
  if (!title || !url) {
    showError('linkError', 'Por favor, preencha os campos obrigatórios');
    return;
  }
  
  // Validação básica de URL
  try {
    new URL(url);
  } catch {
    showError('linkError', 'Por favor, insira uma URL válida (ex: https://exemplo.com)');
    return;
  }
  
  const isEditing = editId !== '';
  const endpoint = isEditing ? `/links/${editId}` : '/links';
  const method = isEditing ? 'PUT' : 'POST';
  
  try {
    const data = await apiRequest(endpoint, {
      method,
      body: JSON.stringify({ title, url, description, category_id })
    });
    
    if (data.success) {
      showSuccess('linkSuccess', data.data.message || 'Link salvo com sucesso');
      document.getElementById('linkForm').reset();
      cancelEdit();
      loadLinks();
    } else {
      showError('linkError', data.error || 'Erro ao salvar link');
    }
  } catch (error) {
    showError('linkError', 'Erro ao conectar com o servidor');
  }
}

/**
 * Prepara o formulário para editar um link
 */
function editLink(link) {
  document.getElementById('editLinkId').value = link.id;
  document.getElementById('linkTitle').value = link.title;
  document.getElementById('linkUrl').value = link.url;
  document.getElementById('linkDescription').value = link.description || '';
  document.getElementById('linkCategory').value = link.category_id || '';
  
  const formTitle = document.getElementById('formTitle');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  if (formTitle) {
    formTitle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Editar Link
    `;
  }
  
  if (saveBtn) {
    saveBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Atualizar Link
    `;
  }
  
  if (cancelBtn) {
    cancelBtn.style.display = 'inline-flex';
  }
  
  scrollToTop();
  clearMessages();
  
  // Foca no primeiro campo
  document.getElementById('linkTitle').focus();
}

/**
 * Cancela a edição de link
 */
function cancelEdit() {
  document.getElementById('linkForm').reset();
  document.getElementById('editLinkId').value = '';
  
  const formTitle = document.getElementById('formTitle');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  if (formTitle) {
    formTitle.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Adicionar Novo Link
    `;
  }
  
  if (saveBtn) {
    saveBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Salvar Link
    `;
  }
  
  if (cancelBtn) {
    cancelBtn.style.display = 'none';
  }
  
  clearMessages();
}

/**
 * Exclui um link
 */
async function deleteLink(id) {
  if (!confirm('Tem certeza que deseja excluir este link?')) {
    return;
  }
  
  try {
    const data = await apiRequest(`/links/${id}`, {
      method: 'DELETE'
    });
    
    if (data.success) {
      showSuccess('linkSuccess', 'Link excluído com sucesso');
      loadLinks();
    } else {
      showError('linkError', data.error || 'Erro ao excluir link');
    }
  } catch (error) {
    showError('linkError', 'Erro ao conectar com o servidor');
  }
}