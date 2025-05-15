const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Função para executar comandos
function runCommand(command, cwd) {
  try {
    execSync(command, {
      cwd,
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`Falha ao executar comando: ${command}`);
    throw error;
  }
}

// Configura o ambiente
console.log("Configurando o ambiente...");

// Instala dependências do frontend
console.log("Instalando dependências do frontend...");
runCommand("npm install", path.join(__dirname, "levefit"));

// Instala dependências do backend
console.log("Instalando dependências do backend...");
runCommand("npm install", path.join(__dirname, "backend"));

// Instala dependências da API serverless
console.log("Instalando dependências da API serverless...");
runCommand("npm install", path.join(__dirname, "api"));

// Gera artefatos Prisma
console.log("Gerando artefatos Prisma...");
runCommand("npx prisma generate", path.join(__dirname, "backend"));

// Compila o frontend
console.log("Compilando o frontend...");
runCommand("npm run build", path.join(__dirname, "levefit"));

// Compila o backend
console.log("Compilando o backend...");
runCommand("npm run build", path.join(__dirname, "backend"));

console.log("Instalação concluída com sucesso!");
