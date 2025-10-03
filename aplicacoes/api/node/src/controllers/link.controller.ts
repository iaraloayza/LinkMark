import { Request, Response } from 'express';
import { db } from '../database/index.js';

export const getLinks = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM links ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao buscar links' });
  }
};

export const createLink = async (req: Request, res: Response) => {
  try {
    const { title, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, error: 'Título e URL são obrigatórios' });
    }

    const [result]: any = await db.query(
      'INSERT INTO links (title, url) VALUES (?, ?)',
      [title, url]
    );

    res.json({
      success: true,
      data: { id: result.insertId, title, url }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao criar link' });
  }
};

export const deleteLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM links WHERE id = ?', [id]);
    res.json({ success: true, data: { id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Erro ao excluir link' });
  }
};