// Script para executar migrações e configurar o banco de dados na Vercel
const { execSync } = require("child_process");
const path = require("path");

console.log("Iniciando configuração do banco de dados...");

try {
  // Navega para o diretório backend
  const backendDir = path.join(__dirname, "../backend");

  // Executa as migrações do banco de dados
  console.log("Executando migrações...");
  execSync("npx prisma migrate deploy", {
    cwd: backendDir,
    stdio: "inherit",
  });

  console.log("Gerando cliente Prisma...");
  execSync("npx prisma generate", {
    cwd: backendDir,
    stdio: "inherit",
  });

  console.log("Configuração do banco de dados concluída com sucesso!");
} catch (error) {
  console.error("Erro ao configurar o banco de dados:", error.message);
  process.exit(1);
}
