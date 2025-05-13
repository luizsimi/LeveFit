# 📚 Guia Detalhado de Instalação e Execução - LeveFit

Este documento fornece um guia completo e detalhado para configurar, instalar e executar o projeto LeveFit em seu ambiente local, seja para fins de desenvolvimento ou teste.

![LeveFit Logo](../levefit/public/favicon.svg)

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Instalação](#instalação)
  - [Clonando o Repositório](#1-clonando-o-repositório)
  - [Configurando o Backend](#2-configurando-o-backend)
  - [Configurando o Frontend](#3-configurando-o-frontend)
- [Execução do Projeto](#execução-do-projeto)
- [Acessando a Aplicação](#acessando-a-aplicação)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Solução de Problemas Comuns](#solução-de-problemas-comuns)
- [Configurações Avançadas](#configurações-avançadas)

## 🛠️ Pré-requisitos

Certifique-se de ter instalado em seu computador:

- **Node.js** (versão 16+) - [Download Node.js](https://nodejs.org/)
  - Verifique sua versão: `node -v`
- **npm** (normalmente instalado com o Node.js)
  - Verifique sua versão: `npm -v`
- **Git** - [Download Git](https://git-scm.com/downloads)
  - Verifique sua versão: `git --version`
- Editor de código de sua preferência (recomendamos [Visual Studio Code](https://code.visualstudio.com/))

## 🌐 Configuração do Ambiente

### Windows

1. **Instalação do Node.js**:

   - Baixe o instalador do [site oficial](https://nodejs.org/)
   - Execute o instalador e siga as instruções
   - Reinicie seu computador após a instalação

2. **Configuração do PowerShell para execução de scripts**:
   - Abra o PowerShell como administrador
   - Execute: `Set-ExecutionPolicy RemoteSigned`
   - Confirme com "S" quando solicitado

### macOS

1. **Usando Homebrew**:

   ```bash
   # Instalar Homebrew (se ainda não tiver)
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Instalar Node.js
   brew install node
   ```

### Linux (Ubuntu/Debian)

1. **Usando apt**:

   ```bash
   # Atualizar os repositórios
   sudo apt update

   # Instalar Node.js e npm
   sudo apt install nodejs npm
   ```

## 📥 Instalação

### 1. Clonando o Repositório

Abra seu terminal (PowerShell no Windows, Terminal no macOS/Linux) e execute:

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/LeveFit.git

# Entre na pasta do projeto
cd LeveFit
```

### 2. Configurando o Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file (copy from template)
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux

# Run database migrations to set up the database
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database with initial data (optional but recommended for testing)
npx prisma db seed
```

#### Detalhes da Configuração do Backend

1. O arquivo `.env` contém variáveis de ambiente essenciais:

   ```
   DATABASE_URL="file:./dev.db"  # Caminho para o banco SQLite
   JWT_SECRET="seu-segredo-aqui"  # Chave para assinatura de tokens JWT
   PORT=3333                      # Porta onde a API irá rodar
   ```

2. Verifique se o banco de dados foi criado corretamente:
   ```bash
   npx prisma studio
   ```
   Isso abrirá uma interface web para visualizar os dados no seu banco.

### 3. Configurando o Frontend

Abra uma nova janela de terminal e execute:

```bash
# Volte à pasta raiz do projeto (se necessário)
cd ..

# Entre na pasta do frontend
cd levefit

# Instale as dependências
npm install

# Crie um arquivo .env local (opcional)
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux
```

#### Detalhes da Configuração do Frontend

O arquivo `.env` do frontend deve conter:

```
VITE_API_URL=http://localhost:3333
```

## ▶️ Execução do Projeto

É necessário executar tanto o backend quanto o frontend em terminais separados.

### Terminal 1: Backend

```bash
# Na pasta backend
cd backend  # Se você não estiver já na pasta

# Iniciar o servidor de desenvolvimento
npm run dev
```

Você deverá ver uma mensagem semelhante a:

```
Server running on http://localhost:3333
```

### Terminal 2: Frontend

```bash
# Na pasta frontend
cd levefit  # Se você não estiver já na pasta

# Iniciar o servidor de desenvolvimento
npm run dev
```

Você deverá ver uma mensagem semelhante a:

```
  VITE v4.4.5  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

## 🌐 Acessando a Aplicação

Abra seu navegador e acesse:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Backend**: [http://localhost:3333](http://localhost:3333)
- **Interface do Prisma Studio**: [http://localhost:5555](http://localhost:5555) (após executar `npx prisma studio`)

## 👤 Contas para Teste

Se você executou o comando de seed, as seguintes contas de teste estarão disponíveis:

### Cliente

- **Email**: cliente@teste.com
- **Senha**: 123456

### Fornecedor

- **Email**: fornecedor@teste.com
- **Senha**: 123456

## 🧩 Funcionalidades Principais

Depois de configurar e executar o projeto, você poderá testar as seguintes funcionalidades:

1. **Como Cliente**:

   - Registrar-se como novo cliente
   - Fazer login com suas credenciais
   - Navegar pelo catálogo de pratos
   - Filtrar pratos por categoria
   - Ver detalhes dos pratos
   - Ver perfis de fornecedores
   - Fazer pedidos via WhatsApp
   - Avaliar pratos experimentados

2. **Como Fornecedor**:
   - Registrar-se como novo fornecedor
   - Fazer login com suas credenciais
   - Criar e gerenciar seu catálogo de pratos
   - Adicionar, editar e remover pratos
   - Ver avaliações recebidas
   - Gerenciar assinatura na plataforma
   - Atualizar informações de perfil
   - Receber pedidos via WhatsApp

## ❓ Solução de Problemas Comuns

### Backend não inicia

1. **Problema com o banco de dados**:

   ```bash
   # Reinicie o banco de dados
   cd backend
   rm -rf prisma/dev.db
   npx prisma migrate reset --force
   npx prisma generate
   ```

2. **Porta 3333 já em uso**:
   - Verifique se você não tem outra instância do servidor rodando
   - Altere a porta no arquivo `.env` do backend

### Frontend não inicia

1. **Problemas com dependências**:

   ```bash
   # Limpe o cache e reinstale as dependências
   cd levefit
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```

2. **Porta 5173 já em uso**:
   - Pare outros serviços que possam estar usando esta porta
   - Ou aceite a sugestão de porta alternativa que o Vite oferece

### Erro de CORS

Se o frontend não conseguir se comunicar com o backend, verifique:

1. Se o backend está rodando corretamente
2. Se as URLs no arquivo `.env` estão corretas
3. Se não há problemas de rede ou firewall bloqueando a comunicação

## ⚙️ Configurações Avançadas

### Conexão com Banco de Dados Externo

Para usar um banco de dados PostgreSQL ou MySQL em vez do SQLite padrão:

1. Instale as dependências necessárias:

   ```bash
   cd backend
   npm install @prisma/client
   ```

2. Atualize o arquivo `.env` do backend:

   ```
   # Para PostgreSQL
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/levefit"

   # Para MySQL
   DATABASE_URL="mysql://usuario:senha@localhost:3306/levefit"
   ```

3. Execute a migração para o novo banco:
   ```bash
   npx prisma migrate dev
   ```

### Configuração para Produção

Para preparar o projeto para produção:

1. **Backend**:

   ```bash
   cd backend
   npm run build
   ```

2. **Frontend**:

   ```bash
   cd levefit
   npm run build
   ```

   Os arquivos de produção estarão na pasta `dist`.

---

## 🌟 Contribuindo para o Projeto

Se você deseja contribuir, siga estes passos:

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'Adiciona nova feature'`
4. Envie para seu fork: `git push origin minha-feature`
5. Crie um Pull Request

---

<div align="center">
  <p>🌱 <b>LeveFit</b> - Comida saudável, vida leve 🌱</p>
</div>
