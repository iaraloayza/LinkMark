import { Response } from 'express';
import { db } from '../database/index.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AuthRequest } from '../middleware/auth.js';

interface Category extends RowDataPacket {
  id: number;
  name: string;
  user_id: number;
  created_at: Date;
}

/**
 * Lista todas as categorias do usuário logado
 * GET /categories
 */
export const listCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const [categories] = await db.query<Category[]>(
      'SELECT id, name, created_at FROM categories WHERE user_id = ? ORDER BY name ASC',
      [userId]
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar categorias'
    });
  }
};

/**
 * Busca uma categoria específica
 * GET /categories/:id
 */
export const getCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const categoryId = req.params.id;

    const [categories] = await db.query<Category[]>(
      'SELECT id, name, created_at FROM categories WHERE id = ? AND user_id = ?',
      [categoryId, userId]
    );

    if (categories.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: categories[0]
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar categoria'
    });
  }
};

/**
 * Cria uma nova categoria
 * POST /categories
 */
export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    // Validação
    if (!name || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'O nome da categoria é obrigatório'
      });
      return;
    }

    if (name.length > 100) {
      res.status(400).json({
        success: false,
        error: 'O nome da categoria deve ter no máximo 100 caracteres'
      });
      return;
    }

    // Verifica se já existe uma categoria com esse nome para o usuário
    const [existing] = await db.query<Category[]>(
      'SELECT id FROM categories WHERE name = ? AND user_id = ?',
      [name.trim(), userId]
    );

    if (existing.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Você já possui uma categoria com este nome'
      });
      return;
    }

    // Cria a categoria
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO categories (name, user_id) VALUES (?, ?)',
      [name.trim(), userId]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        name: name.trim(),
        message: 'Categoria criada com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar categoria'
    });
  }
};

/**
 * Atualiza uma categoria
 * PUT /categories/:id
 */
export const updateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const categoryId = req.params.id;
    const { name } = req.body;

    // Validação
    if (!name || name.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'O nome da categoria é obrigatório'
      });
      return;
    }

    if (name.length > 100) {
      res.status(400).json({
        success: false,
        error: 'O nome da categoria deve ter no máximo 100 caracteres'
      });
      return;
    }

    // Verifica se a categoria existe e pertence ao usuário
    const [categories] = await db.query<Category[]>(
      'SELECT id FROM categories WHERE id = ? AND user_id = ?',
      [categoryId, userId]
    );

    if (categories.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
      return;
    }

    // Verifica se já existe outra categoria com esse nome
    const [existing] = await db.query<Category[]>(
      'SELECT id FROM categories WHERE name = ? AND user_id = ? AND id != ?',
      [name.trim(), userId, categoryId]
    );

    if (existing.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Você já possui outra categoria com este nome'
      });
      return;
    }

    // Atualiza a categoria
    await db.query(
      'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?',
      [name.trim(), categoryId, userId]
    );

    res.json({
      success: true,
      data: {
        id: Number(categoryId),
        name: name.trim(),
        message: 'Categoria atualizada com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar categoria'
    });
  }
};

/**
 * Deleta uma categoria
 * DELETE /categories/:id
 */
export const deleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const categoryId = req.params.id;

    // Verifica se a categoria existe e pertence ao usuário
    const [categories] = await db.query<Category[]>(
      'SELECT id FROM categories WHERE id = ? AND user_id = ?',
      [categoryId, userId]
    );

    if (categories.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
      return;
    }

    // Deleta a categoria (os links ficarão com category_id NULL devido ao ON DELETE SET NULL)
    await db.query(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [categoryId, userId]
    );

    res.json({
      success: true,
      data: {
        message: 'Categoria deletada com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar categoria'
    });
  }
};