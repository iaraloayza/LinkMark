<div id="mainScreen" class="dashboard" style="display: none;">
    <div class="dashboard-container">
        
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Categorias
                </h3>
                
                <form id="categoryForm" onsubmit="handleSaveCategory(event)" class="category-form">
                    <input type="hidden" id="editCategoryId" value=""/>
                    <div class="category-input-group">
                        <input type="text" id="categoryName" placeholder="Nova categoria" required/>
                        <button type="submit" class="btn-icon" id="saveCategoryBtn" title="Adicionar">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button type="button" class="btn-icon btn-cancel" id="cancelCategoryBtn" onclick="cancelCategoryEdit()" style="display: none;" title="Cancelar">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </form>
                
                <div id="categoryError" class="error-message"></div>
                <div id="categorySuccess" class="success-message"></div>
                
                <ul id="categoriesList" class="categories-list"></ul>
            </div>

            <!-- Filtro -->
            <div class="sidebar-section">
                <h3 class="sidebar-title">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Filtrar
                </h3>
                <select id="categoryFilter" onchange="loadLinks()" class="filter-select">
                    <option value="">Todas as categorias</option>
                </select>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            
            <!-- Seção de Adicionar/Editar Link -->
            <section class="card link-form-section">
                <div class="card-header">
                    <h2 id="formTitle">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Adicionar Novo Link
                    </h2>
                </div>
                
                <div class="card-body">
                    <form id="linkForm" onsubmit="handleSaveLink(event)">
                        <input type="hidden" id="editLinkId" value=""/>
                        
                        <div class="form-row">
                            <div class="form-group flex-2">
                                <label for="linkTitle">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Título *
                                </label>
                                <input type="text" id="linkTitle" placeholder="Nome do link" required/>
                            </div>
                            
                            <div class="form-group flex-1">
                                <label for="linkCategory">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Categoria
                                </label>
                                <select id="linkCategory">
                                    <option value="">Sem categoria</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="linkUrl">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                URL *
                            </label>
                            <input type="url" id="linkUrl" placeholder="https://exemplo.com" required/>
                        </div>
                        
                        <div class="form-group">
                            <label for="linkDescription">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6h16M4 12h16M4 18h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Descrição (opcional)
                            </label>
                            <textarea id="linkDescription" placeholder="Adicione uma breve descrição..." rows="3"></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn-primary" id="saveBtn">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Salvar Link
                            </button>
                            <button type="button" class="btn-secondary" id="cancelBtn" onclick="cancelEdit()" style="display: none;">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                Cancelar
                            </button>
                        </div>
                    </form>
                    
                    <div id="linkError" class="error-message"></div>
                    <div id="linkSuccess" class="success-message"></div>
                </div>
            </section>

            <!-- Lista de Links -->
            <section class="card links-section">
                <div class="card-header">
                    <h2>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Meus Links
                    </h2>
                    <span class="link-count" id="linkCount">0 links</span>
                </div>
                
                <div class="card-body">
                    <div id="linksContainer">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p>Carregando links...</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    </div>
</div>