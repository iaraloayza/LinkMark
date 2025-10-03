import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'linkmark_api',
  password: process.env.DB_PASSWORD || 'linkmark',
  database: process.env.DB_NAME || 'linkmark',
};

async function waitForDatabase(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      console.log('✅ Conectado ao MySQL!');
      await connection.end();
      return;
    } catch (err) {
      console.log(`⏳ Aguardando MySQL... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('Não foi possível conectar ao MySQL');
}

async function runMigrations(connection) {
  console.log('📄 Lendo migrations...');
  
  const filePath = path.join(__dirname, 'migrations.sql');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }
  
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`⚡ Executando ${statements.length} comandos SQL...`);

  for (let i = 0; i < statements.length; i++) {
    try {
      await connection.query(statements[i]);
      console.log(`  ✓ Comando ${i + 1}/${statements.length} executado`);
    } catch (err) {
      console.error(`  ✗ Erro no comando ${i + 1}:`, err.message);
      throw err;
    }
  }
}

async function runSeed(connection) {
  console.log('🌱 Inserindo dados de exemplo com senhas criptografadas...\n');
  
  // Gera hashes para as senhas
  const password1 = await bcrypt.hash('123456', 10);
  const password2 = await bcrypt.hash('123456', 10);
  
  console.log('  → Inserindo usuários...');
  await connection.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?), (?, ?, ?)',
    ['Usuário Teste', 'teste@exemplo.com', password1, 'João Silva', 'joao@exemplo.com', password2]
  );
  
  console.log('  → Inserindo categorias...');
  await connection.query(
    `INSERT INTO categories (name, user_id) VALUES 
     ('Trabalho', 1), ('Estudos', 1), ('Pessoal', 1), ('Projetos', 2)`
  );
  
  console.log('  → Inserindo links...');
  await connection.query(
    `INSERT INTO links (title, url, description, category_id, user_id) VALUES 
     ('Google', 'https://google.com', 'Motor de busca', 1, 1),
     ('GitHub', 'https://github.com', 'Repositórios de código', 1, 1),
     ('YouTube', 'https://youtube.com', 'Vídeos educacionais', 2, 1),
     ('Stack Overflow', 'https://stackoverflow.com', 'Dúvidas de programação', 2, 1)`
  );
}

async function main() {
  let connection = null;
  
  try {
    console.log('🚀 Iniciando setup do banco de dados...\n');
    
    await waitForDatabase();
    
    connection = await mysql.createConnection(dbConfig);
    
    console.log('\n🔄 Executando migrations...');
    await runMigrations(connection);
    console.log('✅ Migrations concluídas!\n');
    
    await runSeed(connection);
    console.log('✅ Seed concluído!\n');
    
    console.log('🎉 Setup do banco de dados finalizado com sucesso!\n');
    console.log('📝 Credenciais para teste:');
    console.log('   Email: teste@exemplo.com');
    console.log('   Senha: 123456\n');
    
  } catch (err) {
    console.error('\n❌ Erro durante o setup:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();