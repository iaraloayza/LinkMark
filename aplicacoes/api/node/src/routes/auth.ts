import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';

const router = Router();

// POST /auth/register - Registra novo usuário
router.post('/register', register);

// POST /auth/login - Faz login
router.post('/login', login);

// GET /auth/me - Obtém dados do usuário logado
router.get('/me', getCurrentUser);

export default router;