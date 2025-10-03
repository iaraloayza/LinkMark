import { db } from './index.js';
import fs from 'fs';
import path from 'path';

async function runSQLFile(filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf8');

  // Divide os comandos pelo ponto e vírgula
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    await db.query(stmt);
  }
}

async function runMigrations() {
  await runSQLFile(path.join(__dirname, 'migrations.sql'));
  console.log('✅ Migrations rodadas com sucesso');
}

async function runSeed() {
  await runSQLFile(path.join(__dirname, 'seed.sql'));
  console.log('🌱 Seed inserido com sucesso');
}

(async () => {
  try {
    await runMigrations();
    await runSeed();
    process.exit(0);
  } catch (err) {
    console.error('Erro ao rodar migrations/seed:', err);
    process.exit(1);
  }
})();
