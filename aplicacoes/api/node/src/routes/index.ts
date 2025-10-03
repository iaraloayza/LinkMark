import { Router } from 'express';
import authRoutes from './auth.js';
import categoriesRoutes from './categories.js';
import linksRoutes from './links.js';

const router = Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de categorias
router.use('/categories', categoriesRoutes);

// Rotas de links
router.use('/links', linksRoutes);

export default router;