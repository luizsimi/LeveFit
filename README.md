# 🥗 LeveFit

<div align="center">
  <img src="levefit/public/favicon.svg" alt="LeveFit Logo" width="120" />
  <h3>Comida saudável, vida leve</h3>
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
</div>

## 📋 Sobre o Projeto

A **LeveFit** é uma plataforma que conecta clientes a fornecedores de comida saudável, oferecendo uma experiência simples e eficiente para fazer pedidos de refeições nutritivas e saborosas diretamente pelo WhatsApp.

### 🎯 Objetivo

Facilitar o acesso à alimentação saudável, conectando pessoas que buscam uma vida mais equilibrada a fornecedores especializados em refeições nutritivas e deliciosas.

## ✨ Funcionalidades Principais

- 🔍 **Navegação por Categorias**: Explore pratos por tipo (vegano, low-carb, proteico, etc.)
- 👨‍🍳 **Perfil de Fornecedores**: Conheça os fornecedores parceiros e seus cardápios
- 📱 **Pedidos via WhatsApp**: Solicite seu pedido diretamente pelo WhatsApp com mensagem pré-formatada
- ⭐ **Avaliações**: Veja e deixe avaliações dos pratos experimentados
- 🌙 **Modo Escuro**: Interface adaptável ao tema do sistema

## 🚀 Como Funciona

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.icons8.com/ios-filled/50/4CAF50/restaurant-menu.png" width="30" />
        <br />
        <b>1. Escolha seu prato</b>
        <br />
        <small>Navegue pelo cardápio e escolha suas refeições</small>
      </td>
      <td align="center">
        <img src="https://img.icons8.com/ios-filled/50/4CAF50/whatsapp.png" width="30" />
        <br />
        <b>2. Peça pelo WhatsApp</b>
        <br />
        <small>Comunique-se diretamente com o fornecedor</small>
      </td>
      <td align="center">
        <img src="https://img.icons8.com/ios-filled/50/4CAF50/delivery.png" width="30" />
        <br />
        <b>3. Receba em casa</b>
        <br />
        <small>Sua refeição saudável entregue onde você estiver</small>
      </td>
    </tr>
  </table>
</div>

## 🔧 Tecnologias Utilizadas

### Frontend

- **React** + **TypeScript**: Para construção da interface
- **Tailwind CSS**: Para estilização responsiva
- **Vite**: Como bundler e ferramenta de desenvolvimento
- **Axios**: Para requisições HTTP
- **React Icons**: Biblioteca de ícones
- **React Router**: Para navegação entre páginas

### Backend

- **Node.js** + **Express**: Para criação da API
- **Prisma**: ORM para comunicação com banco de dados
- **JWT**: Para autenticação de usuários
- **Multer**: Para upload de imagens

## 📊 Arquitetura

O projeto segue uma arquitetura de duas camadas:

```
LeveFit/
├── levefit/         # Frontend em React
│   ├── public/      # Arquivos públicos
│   ├── src/         # Código fonte
│   │   ├── assets/  # Recursos estáticos
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── contexts/   # Contextos React
│   │   ├── pages/      # Páginas da aplicação
│   │   └── routes/     # Rotas da aplicação
│   └── ...
│
└── backend/         # API em Node.js
    ├── prisma/      # Configuração do Prisma
    └── src/         # Código fonte
        ├── controllers/ # Controladores
        ├── middlewares/ # Middlewares
        ├── routes/      # Rotas da API
        └── types/       # Tipos TypeScript
```

## 🔐 Autenticação

O sistema utiliza dois tipos de usuários:

- **Clientes**: Podem navegar, comprar e avaliar pratos
- **Fornecedores**: Podem gerenciar cardápios e receber pedidos

## 🌱 Sustentabilidade

A LeveFit valoriza a sustentabilidade e encoraja fornecedores a utilizarem:

- 🌿 Embalagens biodegradáveis ou recicláveis
- 🛒 Ingredientes locais e sazonais
- ♻️ Práticas de redução de desperdício alimentar

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Passos para instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/LeveFit.git
cd LeveFit

# Instale as dependências do frontend
cd levefit
npm install
npm run dev

# Em outro terminal, configure o backend
cd backend
npm install
npx prisma migrate dev
npm run dev
```

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

---

<div align="center">
  <p>Feito com ❤️ para um estilo de vida mais saudável</p>
  <p>
    <a href="https://github.com/seu-usuario/LeveFit">
      <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github" alt="Github Repository" />
    </a>
  </p>
</div>
