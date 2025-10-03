import { Request, Response } from 'express';
import { db } from '../database/index.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

/**
 * Registra um novo usuário
 * POST /auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'Nome, email e senha são obrigatórios'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'A senha deve ter no mínimo 6 caracteres'
      });
      return;
    }

    // Validação de email simples
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
      return;
    }

    // Verifica se o email já existe
    const [existingUsers] = await db.query<User[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      res.status(409).json({
        success: false,
        error: 'Este email já está cadastrado'
      });
      return;
    }

    // Hash da senha usando bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    res.status(201).json({
      success: true,
      data: {
        id: userId,
        name,
        email,
        message: 'Usuário registrado com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar usuário'
    });
  }
};

/**
 * Faz login do usuário
 * POST /auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
      return;
    }

    // Busca o usuário pelo email
    const [users] = await db.query<User[]>(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
      return;
    }

    const user = users[0];

    // Verifica a senha usando bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
      return;
    }

    // Login feito com sucesso
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        message: 'Login realizado com sucesso'
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login'
    });
  }
};

/**
 * Retorna os dados do usuário atual
 * GET /auth/me
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Não autenticado'
      });
      return;
    }

    const [users] = await db.query<User[]>(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar dados do usuário'
    });
  }
};