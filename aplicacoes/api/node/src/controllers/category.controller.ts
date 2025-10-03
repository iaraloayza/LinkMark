import { Request, Response } from 'express';
import { db } from '../database/index.js';

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao buscar categorias' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Nome é obrigatório' });
    }

    const [result]: any = await db.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );

    res.json({
      success: true,
      data: { id: result.insertId, name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao criar categoria' });
  }
};