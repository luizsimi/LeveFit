import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Começando a popular o banco de dados...");

  // Criar clientes de exemplo
  const senhaHashCliente = await bcrypt.hash("123456", 10);

  const cliente1 = await prisma.cliente.upsert({
    where: { email: "cliente1@exemplo.com" },
    update: {},
    create: {
      nome: "Cliente Exemplo 1",
      email: "cliente1@exemplo.com",
      senha: senhaHashCliente,
      endereco: "Rua A, 123",
      telefone: "(11) 98765-4321",
    },
  });

  const cliente2 = await prisma.cliente.upsert({
    where: { email: "cliente2@exemplo.com" },
    update: {},
    create: {
      nome: "Cliente Exemplo 2",
      email: "cliente2@exemplo.com",
      senha: senhaHashCliente,
      endereco: "Rua B, 456",
      telefone: "(11) 91234-5678",
    },
  });

  // Criar fornecedores de exemplo
  const senhaHashFornecedor = await bcrypt.hash("123456", 10);

  const fornecedor1 = await prisma.fornecedor.upsert({
    where: { email: "fornecedor1@exemplo.com" },
    update: {},
    create: {
      nome: "Fornecedor Saudável 1",
      email: "fornecedor1@exemplo.com",
      senha: senhaHashFornecedor,
      whatsapp: "(11) 98888-7777",
      descricao: "Especialista em refeições fitness equilibradas",
      logo: "https://via.placeholder.com/150",
      status: true,
      assinaturaAtiva: true,
    },
  });

  const fornecedor2 = await prisma.fornecedor.upsert({
    where: { email: "fornecedor2@exemplo.com" },
    update: {},
    create: {
      nome: "Fornecedor Vegano",
      email: "fornecedor2@exemplo.com",
      senha: senhaHashFornecedor,
      whatsapp: "(11) 97777-8888",
      descricao: "Comida vegana deliciosa e nutritiva",
      logo: "https://via.placeholder.com/150",
      status: true,
      assinaturaAtiva: true,
    },
  });

  // Criar pratos de exemplo
  const prato1 = await prisma.prato.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Salada Caesar com Frango",
      descricao:
        "Salada Caesar com peito de frango grelhado, croutons integrais e molho light",
      preco: 29.9,
      imagem: "https://via.placeholder.com/300",
      categoria: "Saladas",
      disponivel: true,
      fornecedorId: fornecedor1.id,
    },
  });

  const prato2 = await prisma.prato.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: "Bowl de Quinoa e Legumes",
      descricao:
        "Bowl nutritivo com quinoa, abacate, grão de bico, legumes frescos e molho de tahine",
      preco: 32.9,
      imagem: "https://via.placeholder.com/300",
      categoria: "Bowls",
      disponivel: true,
      fornecedorId: fornecedor1.id,
    },
  });

  const prato3 = await prisma.prato.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nome: "Hambúrguer Vegano",
      descricao:
        "Hambúrguer vegano de grão de bico e beterraba, com pão integral e molho especial",
      preco: 24.9,
      imagem: "https://via.placeholder.com/300",
      categoria: "Vegano",
      disponivel: true,
      fornecedorId: fornecedor2.id,
    },
  });

  const prato4 = await prisma.prato.upsert({
    where: { id: 4 },
    update: {},
    create: {
      nome: "Wrap de Falafel",
      descricao:
        "Wrap integral com falafel caseiro, homus, tabule e molho de iogurte",
      preco: 27.9,
      imagem: "https://via.placeholder.com/300",
      categoria: "Vegano",
      disponivel: true,
      fornecedorId: fornecedor2.id,
    },
  });

  // Criar avaliações de exemplo
  const avaliacao1 = await prisma.avaliacao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nota: 5,
      comentario: "Delicioso e muito bem servido!",
      pratoId: prato1.id,
      clienteId: cliente1.id,
    },
  });

  const avaliacao2 = await prisma.avaliacao.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nota: 4,
      comentario: "Muito bom, mas poderia ter um pouco mais de molho.",
      pratoId: prato1.id,
      clienteId: cliente2.id,
    },
  });

  const avaliacao3 = await prisma.avaliacao.upsert({
    where: { id: 3 },
    update: {},
    create: {
      nota: 5,
      comentario: "Melhor hambúrguer vegano que já provei!",
      pratoId: prato3.id,
      clienteId: cliente1.id,
    },
  });

  console.log("Banco de dados populado com sucesso!");
  console.log({
    clientes: [cliente1, cliente2],
    fornecedores: [fornecedor1, fornecedor2],
    pratos: [prato1, prato2, prato3, prato4],
    avaliacoes: [avaliacao1, avaliacao2, avaliacao3],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
