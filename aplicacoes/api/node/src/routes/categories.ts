import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoriesController.js';

const router = Router();

// Todas as rotas de categorias precisam de autenticação
router.use(authMiddleware);

// GET /categories - Lista todas as categorias do usuário
router.get('/', listCategories);

// GET /categories/:id - Busca uma categoria específica
router.get('/:id', getCategory);

// POST /categories - Cria nova categoria
router.post('/', createCategory);

// PUT /categories/:id - Atualiza categoria
router.put('/:id', updateCategory);

// DELETE /categories/:id - Deleta categoria
router.delete('/:id', deleteCategory);

export default router;