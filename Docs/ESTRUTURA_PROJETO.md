# 📂 Estrutura de Diretórios do Projeto LeveFit

Este documento detalha a organização e a estrutura de arquivos e pastas do projeto LeveFit, dividido em suas principais partes: `backend` e `levefit` (frontend).

## 🌳 Visão Geral

```
LeveFit/
├── backend/             # API e lógica de servidor
├── levefit/             # Interface de usuário (frontend)
├── Docs/                # Documentação do projeto
└── README.md            # Informações gerais do projeto
```

## 📁 Backend

A pasta `backend` contém toda a lógica do servidor, API REST e comunicação com banco de dados.

```
backend/
├── prisma/                     # Configurações do ORM Prisma
│   ├── migrations/             # Migrações do banco de dados
│   │   └── 20250512233450_init/  # Migração inicial
│   ├── schema.prisma           # Esquema do banco de dados
│   └── seed.ts                 # Script para popular o banco com dados iniciais
│
├── src/                        # Código-fonte do backend
│   ├── controllers/            # Controladores da API
│   │   ├── AuthController.ts   # Autenticação
│   │   ├── ClienteController.ts  # Operações de clientes
│   │   ├── FornecedorController.ts # Operações de fornecedores
│   │   └── PratoController.ts  # Operações de pratos
│   │
│   ├── middlewares/            # Middlewares do Express
│   │   ├── auth.ts             # Autenticação JWT
│   │   ├── errorHandler.ts     # Tratamento de erros
│   │   └── upload.ts          # Upload de arquivos
│   │
│   ├── routes/                 # Rotas da API
│   │   ├── auth.routes.ts      # Rotas de autenticação
│   │   ├── cliente.routes.ts   # Rotas de clientes
│   │   ├── fornecedor.routes.ts # Rotas de fornecedores
│   │   ├── prato.routes.ts     # Rotas de pratos
│   │   └── index.ts            # Configuração geral das rotas
│   │
│   ├── types/                  # Tipos TypeScript
│   │   ├── User.ts             # Tipos de usuário
│   │   ├── Prato.ts            # Tipos de prato
│   │   └── Pedido.ts           # Tipos de pedido
│   │
│   ├── utils/                  # Funções utilitárias
│   │   ├── jwt.ts              # Utilidades de JWT
│   │   └── validation.ts       # Validação de dados
│   │
│   ├── app.ts                  # Configuração da aplicação Express
│   └── server.ts               # Ponto de entrada do servidor
│
├── uploads/                    # Armazenamento de arquivos enviados
│   ├── pratos/                 # Imagens dos pratos
│   └── perfil/                 # Imagens de perfil dos usuários
│
├── .env                        # Variáveis de ambiente (não versionado)
├── .env.example                # Exemplo de variáveis de ambiente
├── package.json                # Dependências e scripts
└── tsconfig.json               # Configuração do TypeScript
```

## 📱 Frontend (levefit)

A pasta `levefit` contém a interface de usuário desenvolvida com React, TypeScript e Tailwind CSS.

```
levefit/
├── public/                     # Arquivos públicos estáticos
│   ├── favicon.svg             # Ícone do site
│   ├── favicon.ico             # Ícone do site (formato alternativo)
│   ├── default-avatar.png      # Imagem padrão para usuários
│   └── default-dish.png        # Imagem padrão para pratos
│
├── src/                        # Código-fonte do frontend
│   ├── assets/                 # Recursos estáticos
│   │   ├── react.svg           # Logo React
│   │   └── images/             # Imagens da aplicação
│   │
│   ├── components/             # Componentes reutilizáveis
│   │   ├── CategoriaFilter.tsx # Filtro de categorias
│   │   ├── Footer.tsx          # Rodapé da aplicação
│   │   ├── FornecedorCarousel.tsx # Carrossel de fornecedores
│   │   ├── LoginModal.tsx      # Modal de login
│   │   ├── Navbar.tsx          # Barra de navegação
│   │   ├── PratoCard.tsx       # Card de prato
│   │   ├── RegisterModal.tsx   # Modal de registro
│   │   └── UserProfileModal.tsx # Modal de perfil de usuário
│   │
│   ├── contexts/               # Contextos do React
│   │   ├── AuthContext.tsx     # Contexto de autenticação
│   │   └── ThemeContext.tsx    # Contexto de tema (claro/escuro)
│   │
│   ├── pages/                  # Páginas da aplicação
│   │   ├── AssinaturaFornecedor.tsx # Página de assinatura
│   │   ├── Categorias.tsx      # Página de categorias
│   │   ├── DetalhePrato.tsx    # Página de detalhes do prato
│   │   ├── Fornecedores.tsx    # Lista de fornecedores
│   │   ├── FornecedorDashboard.tsx # Dashboard do fornecedor
│   │   ├── FornecedorPerfil.tsx # Perfil do fornecedor
│   │   ├── FormularioPrato.tsx # Formulário para criar/editar pratos
│   │   └── Home.tsx            # Página inicial
│   │
│   ├── routes/                 # Configuração de rotas
│   │   └── AppRoutes.tsx       # Definição das rotas da aplicação
│   │
│   ├── App.tsx                 # Componente principal da aplicação
│   ├── index.css               # Estilos globais (Tailwind)
│   ├── main.tsx                # Ponto de entrada da aplicação
│   └── vite-env.d.ts           # Definições de tipos para Vite
│
├── .env                        # Variáveis de ambiente (não versionado)
├── .env.example                # Exemplo de variáveis de ambiente
├── index.html                  # HTML principal
├── package.json                # Dependências e scripts
├── tailwind.config.js          # Configuração do Tailwind CSS
├── tsconfig.json               # Configuração do TypeScript
└── vite.config.ts              # Configuração do Vite
```

## 🔄 Fluxo de Dados

O fluxo de dados entre o frontend e o backend acontece da seguinte forma:

1. O frontend (`levefit`) faz requisições HTTP para a API no backend
2. O backend (`backend`) processa as requisições, interage com o banco de dados e retorna as respostas
3. O frontend atualiza a interface com base nas respostas recebidas

## 📦 Principais Dependências

### Backend

- Express: Framework web para Node.js
- Prisma: ORM para interação com banco de dados
- JSON Web Token: Para autenticação
- Bcrypt: Para criptografia de senhas
- Multer: Para upload de arquivos

### Frontend

- React: Biblioteca para construção de interfaces
- React Router: Para navegação entre páginas
- Axios: Cliente HTTP para requisições à API
- Tailwind CSS: Framework CSS utilitário
- React Icons: Biblioteca de ícones
- Vite: Ferramenta de build

---

<div align="center">
  <p>📄 Documentação do Projeto LeveFit</p>
</div>
