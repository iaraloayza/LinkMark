import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  listLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink
} from '../controllers/linksController.js';

const router = Router();

// Todas as rotas de links precisam de autenticação
router.use(authMiddleware);

// GET /links - Lista os links do usuário
router.get('/', listLinks);

// GET /links/:id - Busca um link específico
router.get('/:id', getLink);

// POST /links - Cria novo link
router.post('/', createLink);

// PUT /links/:id - Atualiza link
router.put('/:id', updateLink);

// DELETE /links/:id - Deleta link
router.delete('/:id', deleteLink);

export default router;