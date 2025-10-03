import { Response } from 'express';
import { db } from '../database/index.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AuthRequest } from '../middleware/auth.js';

interface Link extends RowDataPacket {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category_id: number | null;
  category_name: string | null;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * Lista todos os links do usuário logado
 * GET /links?category_id=X
 */
export const listLinks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const categoryId = req.query.category_id;

    let query = `
      SELECT 
        l.id, 
        l.title, 
        l.url, 
        l.description, 
        l.category_id,
        c.name as category_name,
        l.created_at, 
        l.updated_at
      FROM links l
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE l.user_id = ?
    `;
    
    const params: any[] = [userId];

    // Filtro por categoria 
    if (categoryId) {
      query += ' AND l.category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY l.created_at DESC';

    const [links] = await db.query<Link[]>(query, params);

    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    console.error('Erro ao listar links:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar links'
    });
  }
};

/**
 * Busca um link específico
 * GET /links/:id
 */
export const getLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const linkId = req.params.id;

    const [links] = await db.query<Link[]>(
      `SELECT 
        l.id, 
        l.title, 
        l.url, 
        l.description, 
        l.category_id,
        c.name as category_name,
        l.created_at, 
        l.updated_at
      FROM links l
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE l.id = ? AND l.user_id = ?`,
      [linkId, userId]
    );

    if (links.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Link não encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: links[0]
    });
  } catch (error) {
    console.error('Erro ao buscar link:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar link'
    });
  }
};

/**
 * Cria um novo link
 * POST /links
 */
export const createLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, url, description, category_id } = req.body;

    // Validações
    if (!title || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'O título é obrigatório'
      });
      return;
    }

    if (!url || url.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'A URL é obrigatória'
      });
      return;
    }

    if (title.length > 150) {
      res.status(400).json({
        success: false,
        error: 'O título deve ter no máximo 150 caracteres'
      });
      return;
    }

    // Validação básica de URL
    try {
      new URL(url);
    } catch {
      res.status(400).json({
        success: false,
        error: 'URL inválida'
      });
      return;
    }

    // Se category_id foi fornecido, verifica se existe e pertence ao usuário
    if (category_id) {
      const [categories] = await db.query<RowDataPacket[]>(
        'SELECT id FROM categories WHERE id = ? AND user_id = ?',
        [category_id, userId]
      );

      if (categories.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Categoria não encontrada ou não pertence a você'
        });
        return;
      }
    }

    // Cria o link
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO links (title, url, description, category_id, user_id) VALUES (?, ?, ?, ?, ?)',
      [title.trim(), url.trim(), description || null, category_id || null, userId]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        title: title.trim(),
        url: url.trim(),
        description: description || null,
        category_id: category_id || null,
        message: 'Link criado com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro ao criar link:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar link'
    });
  }
};

/**
 * Atualiza um link
 * PUT /links/:id
 */
export const updateLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const linkId = req.params.id;
    const { title, url, description, category_id } = req.body;

    // Validações
    if (!title || title.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'O título é obrigatório'
      });
      return;
    }

    if (!url || url.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'A URL é obrigatória'
      });
      return;
    }

    if (title.length > 150) {
      res.status(400).json({
        success: false,
        error: 'O título deve ter no máximo 150 caracteres'
      });
      return;
    }

    // Validação básica de URL
    try {
      new URL(url);
    } catch {
      res.status(400).json({
        success: false,
        error: 'URL inválida'
      });
      return;
    }

    // Verifica se o link existe e pertence ao usuário
    const [links] = await db.query<RowDataPacket[]>(
      'SELECT id FROM links WHERE id = ? AND user_id = ?',
      [linkId, userId]
    );

    if (links.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Link não encontrado'
      });
      return;
    }

    // Se category_id foi fornecido, verifica se existe e pertence ao usuário
    if (category_id) {
      const [categories] = await db.query<RowDataPacket[]>(
        'SELECT id FROM categories WHERE id = ? AND user_id = ?',
        [category_id, userId]
      );

      if (categories.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Categoria não encontrada ou não pertence a você'
        });
        return;
      }
    }

    // Atualiza o link
    await db.query(
      'UPDATE links SET title = ?, url = ?, description = ?, category_id = ? WHERE id = ? AND user_id = ?',
      [title.trim(), url.trim(), description || null, category_id || null, linkId, userId]
    );

    res.json({
      success: true,
      data: {
        id: Number(linkId),
        title: title.trim(),
        url: url.trim(),
        description: description || null,
        category_id: category_id || null,
        message: 'Link atualizado com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar link:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar link'
    });
  }
};

/**
 * Deleta um link
 * DELETE /links/:id
 */
export const deleteLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const linkId = req.params.id;

    // Verifica se o link existe e pertence ao usuário
    const [links] = await db.query<RowDataPacket[]>(
      'SELECT id FROM links WHERE id = ? AND user_id = ?',
      [linkId, userId]
    );

    if (links.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Link não encontrado'
      });
      return;
    }

    // Deleta o link
    await db.query(
      'DELETE FROM links WHERE id = ? AND user_id = ?',
      [linkId, userId]
    );

    res.json({
      success: true,
      data: {
        message: 'Link deletado com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro ao deletar link:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar link'
    });
  }
};