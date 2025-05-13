import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o seed de promoções...");

  // Buscar todos os fornecedores para distribuir as promoções
  const fornecedores = await prisma.fornecedor.findMany();

  if (fornecedores.length === 0) {
    console.error(
      "Nenhum fornecedor encontrado. Cadastre fornecedores antes de criar promoções."
    );
    return;
  }

  // Definir as ofertas especiais
  const promocoes = [
    {
      nome: "Bowl Tropical de Açaí",
      descricao:
        "Bowl refrescante com açaí puro, banana, morango, granola e mel. Perfeito para um boost de energia!",
      preco: 16.9,
      categoria: "Café da Manhã",
      imagem:
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      fornecedorId: fornecedores[0]?.id || 1,
    },
    {
      nome: "Salada Caesar Fitness",
      descricao:
        "Salada com folhas verdes frescas, frango grelhado, croutons integrais e molho Caesar light. Opção saudável e saborosa.",
      preco: 22.5,
      categoria: "Saladas",
      imagem:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      fornecedorId: fornecedores[Math.min(1, fornecedores.length - 1)]?.id || 1,
    },
    {
      nome: "Wrap Proteico de Frango",
      descricao:
        "Wrap integral recheado com frango desfiado, homus, vegetais frescos e molho de iogurte. Rico em proteínas e baixo em carboidratos.",
      preco: 18.9,
      categoria: "Lanches",
      imagem:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      fornecedorId: fornecedores[Math.min(2, fornecedores.length - 1)]?.id || 1,
    },
    {
      nome: "Smoothie Proteico Detox",
      descricao:
        "Bebida refrescante com espinafre, abacaxi, maçã verde, gengibre e whey protein. Ideal para pós-treino e desintoxicação.",
      preco: 14.5,
      categoria: "Bebidas",
      imagem:
        "https://images.unsplash.com/photo-1638176902880-580a3ff1204f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80",
      fornecedorId: fornecedores[0]?.id || 1,
    },
    {
      nome: "Marmita Fitness Premium",
      descricao:
        "Marmita balanceada com arroz integral, frango grelhado, brócolis e batata doce. 400g de pura nutrição para seu almoço.",
      preco: 27.9,
      categoria: "Almoço",
      imagem:
        "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=744&q=80",
      fornecedorId: fornecedores[Math.min(1, fornecedores.length - 1)]?.id || 1,
    },
    {
      nome: "Bowl de Quinoa com Legumes",
      descricao:
        "Bowl vegano com base de quinoa, legumes assados, abacate, tomate, grão-de-bico e molho tahine. Rico em proteínas vegetais.",
      preco: 24.5,
      categoria: "Vegano",
      imagem:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      fornecedorId: fornecedores[Math.min(2, fornecedores.length - 1)]?.id || 1,
    },
  ];

  // Adicionar cada promoção ao banco de dados
  for (const promocao of promocoes) {
    try {
      // Verificar se já existe um prato com o mesmo nome para o mesmo fornecedor
      const pratoExistente = await prisma.prato.findFirst({
        where: {
          nome: promocao.nome,
          fornecedorId: promocao.fornecedorId,
        },
      });

      if (pratoExistente) {
        // Atualizar o prato existente
        await prisma.prato.update({
          where: { id: pratoExistente.id },
          data: {
            preco: promocao.preco,
          },
        });
        console.log(`Prato existente "${promocao.nome}" atualizado.`);
      } else {
        // Criar um novo prato
        await prisma.prato.create({
          data: {
            nome: promocao.nome,
            descricao: promocao.descricao,
            preco: promocao.preco,
            imagem: promocao.imagem,
            categoria: promocao.categoria,
            fornecedorId: promocao.fornecedorId,
            disponivel: true,
          },
        });
        console.log(`Novo prato "${promocao.nome}" criado com sucesso.`);
      }
    } catch (error) {
      console.error(`Erro ao adicionar prato "${promocao.nome}":`, error);
    }
  }

  console.log("Seed de pratos concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
