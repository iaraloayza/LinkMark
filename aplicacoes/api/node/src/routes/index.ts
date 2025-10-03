import { Router } from 'express';
import { getLinks, createLink, deleteLink } from '../controllers/link.controller.js';
import { getCategories, createCategory } from '../controllers/category.controller.js';

const router = Router();

// Links
router.get('/links', getLinks);
router.post('/links', createLink);
router.delete('/links/:id', deleteLink);

// Categorias
router.get('/categories', getCategories);
router.post('/categories', createCategory);

export default router;