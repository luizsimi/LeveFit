# LeveFit - Guia de Execução

Este documento fornece instruções detalhadas para configurar e executar o projeto LeveFit, uma plataforma de delivery de comida saudável similar ao iFood.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

1. **Backend**: API RESTful em Node.js + Express + Prisma ORM
2. **Frontend**: Aplicação web em React + Tailwind CSS

## Requisitos

- Node.js 16+ (recomendado: Node.js 18 LTS)
- NPM 8+
- Git

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/LeveFit.git
cd LeveFit
```

### 2. Configure o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Prepare o banco de dados (SQLite)
npx prisma migrate dev

# Popule o banco de dados com dados iniciais (opcional)
npx prisma db seed
```

### 3. Configure o Frontend

```bash
# Entre na pasta do frontend
cd ../levefit

# Instale as dependências
npm install
```

## Execução

Para executar o projeto, você precisará iniciar tanto o backend quanto o frontend.

### Iniciando o Backend

No PowerShell do Windows:

```powershell
cd backend
npm run dev
```

No terminal Linux/macOS:

```bash
cd backend && npm run dev
```

O servidor backend estará disponível em http://localhost:3333

### Iniciando o Frontend

Em outra janela do terminal:

No PowerShell do Windows:

```powershell
cd levefit
npm run dev
```

No terminal Linux/macOS:

```bash
cd levefit && npm run dev
```

O frontend estará disponível em http://localhost:5173

## Solução de Problemas

### Erro ao conectar-se ao servidor

Se você receber o erro "Servidor não está respondendo", verifique se:

1. O backend está em execução na porta 3333
2. Não existem firewalls ou aplicações bloqueando a comunicação entre frontend e backend
3. O terminal que está executando o backend não foi fechado

### No PowerShell do Windows

O PowerShell não aceita o operador `&&` para executar comandos em sequência. Use o ponto e vírgula (`;`) para separar comandos:

```powershell
cd backend ; npm run dev
```

### Usuários para Teste

Se você executou o seed, os seguintes usuários já estão disponíveis para teste:

#### Cliente

- Email: cliente@teste.com
- Senha: 123456

#### Fornecedor

- Email: fornecedor@teste.com
- Senha: 123456

## Funcionalidades Principais

1. **Cadastro e Login**: Clientes e fornecedores podem se cadastrar e fazer login
2. **Navegação de Pratos**: Visualização de pratos por categoria e fornecedor
3. **Dashboard de Fornecedor**: Gerenciamento de pratos e perfil
4. **Assinatura**: Sistema de assinatura mensal (R$40) para fornecedores
5. **Pedidos**: Realização e acompanhamento de pedidos (via WhatsApp)

## Arquitetura

### Backend

- **Express**: Framework web
- **Prisma ORM**: ORM para gerenciamento do banco de dados
- **JWT**: Autenticação baseada em tokens
- **Bcrypt**: Criptografia de senhas

### Frontend

- **React**: Biblioteca UI
- **React Router**: Roteamento
- **Tailwind CSS**: Framework CSS
- **Axios**: Cliente HTTP

## Considerações para Produção

Para um ambiente de produção, considere:

1. Migrar para um banco de dados robusto como PostgreSQL ou MySQL
2. Implementar um sistema de pagamento real como Stripe ou MercadoPago
3. Configurar HTTPS para segurança
4. Adicionar variáveis de ambiente para configurações sensíveis
5. Implementar testes automatizados
