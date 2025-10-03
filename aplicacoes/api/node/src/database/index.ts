import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'linkmark',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 segundos de timeout
});

// Função para testar conexão com retry
async function testConnection(retries = 5, delay = 2000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('✅ Conectado ao MySQL com sucesso!');
      connection.release();
      return;
    } catch (err) {
      console.log(`⏳ Tentativa ${i + 1}/${retries} - Aguardando MySQL estar pronto...`);
      if (i === retries - 1) {
        console.error('❌ Erro ao conectar ao MySQL após todas as tentativas:', err);
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Testa conexão ao iniciar
testConnection().catch(() => {
  console.error('Não foi possível conectar ao banco de dados');
});

export const db = pool;