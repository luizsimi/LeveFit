import { PrismaClient } from "@prisma/client";
import { slugify } from "./utils/slugify";

const prisma = new PrismaClient();

const artigos = [
  {
    titulo: "Como montar uma refeição balanceada para ganho de massa muscular",
    conteudo: `A alimentação adequada é fundamental para o ganho de massa muscular saudável. Quando combinada com um programa de treinamento bem estruturado, uma dieta balanceada pode maximizar seus resultados na academia.

Para montar uma refeição balanceada que auxilie no ganho de massa muscular, você deve considerar alguns componentes essenciais:

## Proteínas de qualidade

As proteínas são os blocos de construção dos músculos. Inclua fontes como:
- Peito de frango
- Carne bovina magra
- Peixes (especialmente atum e salmão)
- Ovos
- Whey protein
- Tofu e outras proteínas vegetais

Busque consumir cerca de 1,6g a 2,2g de proteína por quilo de peso corporal, distribuídos ao longo do dia.

## Carboidratos complexos

Os carboidratos fornecem energia para os treinos intensos e contribuem para recuperação muscular:
- Arroz integral
- Batata doce
- Aveia
- Quinoa
- Frutas

## Gorduras saudáveis

Não elimine as gorduras da dieta - elas são essenciais para a produção hormonal:
- Abacate
- Azeite de oliva
- Oleaginosas (castanhas, amêndoas, nozes)
- Sementes (chia, linhaça)

## Micronutrientes

Não esqueça dos vegetais e frutas que fornecem vitaminas e minerais essenciais para o metabolismo e recuperação muscular.

## Montando seu prato

Uma boa estratégia é dividir seu prato em:
- 1/4 de proteínas
- 1/4 de carboidratos complexos
- 1/2 de vegetais e verduras

Mantenha-se hidratado e distribua as refeições ao longo do dia para otimizar o aproveitamento dos nutrientes.

Lembre-se que cada organismo é único - o ideal é consultar um nutricionista para personalizar sua alimentação conforme seus objetivos.`,
    imagem:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    categoria: "Nutrição",
    autor: "Dra. Carolina Mendes",
    tags: "nutrição,musculação,proteínas,alimentação,dieta",
    destaque: true,
  },
  {
    titulo: "Benefícios do jejum intermitente: o que a ciência diz?",
    conteudo: `O jejum intermitente tornou-se uma tendência popular no mundo da nutrição e do fitness. Mas o que exatamente é o jejum intermitente e quais são seus benefícios comprovados?

## O que é jejum intermitente?

O jejum intermitente não é uma dieta, mas um padrão alimentar que alterna entre períodos de alimentação e jejum. Os métodos mais comuns incluem:

- **16/8**: 16 horas de jejum e 8 horas de alimentação
- **5:2**: Alimentação normal por 5 dias e restrição calórica (500-600 calorias) em 2 dias
- **Eat-Stop-Eat**: Jejum de 24 horas, uma ou duas vezes por semana

## Benefícios comprovados cientificamente

### 1. Perda de peso e redução de gordura corporal
O jejum intermitente pode ajudar a reduzir a ingestão calórica total e aumentar o metabolismo, favorecendo a perda de peso. Estudos mostram que pode ser tão eficaz quanto a restrição calórica contínua.

### 2. Melhora na sensibilidade à insulina
Períodos de jejum podem reduzir os níveis de insulina no sangue, tornando as células mais sensíveis a este hormônio, o que ajuda a prevenir diabetes tipo 2.

### 3. Redução da inflamação
Pesquisas indicam que o jejum intermitente pode reduzir marcadores de inflamação no corpo, associados a várias doenças crônicas.

### 4. Saúde cardiovascular
Há evidências de que o jejum intermitente pode melhorar perfis lipídicos, reduzir pressão arterial e diminuir fatores de risco para doenças cardíacas.

### 5. Saúde cerebral
Alguns estudos sugerem benefícios para a saúde cognitiva, incluindo proteção contra neurodegeneração.

## Quem deve evitar?

O jejum intermitente não é recomendado para:
- Gestantes e lactantes
- Pessoas com histórico de transtornos alimentares
- Indivíduos com diabetes tipo 1
- Pessoas com baixo peso
- Adolescentes em fase de crescimento

## Conclusão

O jejum intermitente pode oferecer benefícios significativos para algumas pessoas, mas é importante lembrar que não existe uma abordagem única que funcione para todos. A qualidade dos alimentos consumidos durante a janela de alimentação continua sendo fundamental.

Consulte um profissional de saúde antes de iniciar qualquer regime de jejum, especialmente se você tiver condições médicas preexistentes.`,
    imagem: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    categoria: "Nutrição",
    autor: "Dr. Marcelo Ribeiro",
    tags: "jejum intermitente,emagrecimento,metabolismo,saúde",
    destaque: false,
  },
  {
    titulo: "5 receitas de smoothies proteicos para pós-treino",
    conteudo: `Os smoothies proteicos são uma excelente opção para o pós-treino, pois combinam proteínas de alta qualidade com carboidratos e outros nutrientes essenciais para a recuperação muscular. Além de nutritivos, são práticos e deliciosos!

Confira 5 receitas de smoothies proteicos que vão turbinar sua recuperação e seus resultados:

## 1. Smoothie de Banana e Manteiga de Amendoim

**Ingredientes:**
- 1 banana madura
- 1 colher de sopa de manteiga de amendoim natural
- 1 scoop de whey protein sabor baunilha
- 1 colher de chá de mel (opcional)
- 200ml de leite (pode ser substituído por bebida vegetal)
- 5 cubos de gelo

**Como preparar:** Bata todos os ingredientes no liquidificador até ficar homogêneo.

**Benefícios:** Rico em proteínas, potássio e carboidratos de absorção rápida para reposição de glicogênio.

## 2. Smoothie Verde Proteico

**Ingredientes:**
- 1 maçã verde sem sementes
- 1 punhado de espinafre
- 1/2 pepino
- Suco de 1/2 limão
- 1 scoop de whey protein sabor natural
- 200ml de água de coco
- Gengibre a gosto (opcional)

**Como preparar:** Bata tudo no liquidificador e sirva imediatamente.

**Benefícios:** Combina proteínas com antioxidantes e eletrólitos para hidratação e recuperação.

## 3. Smoothie de Frutas Vermelhas e Chia

**Ingredientes:**
- 1 xícara de frutas vermelhas congeladas (morango, framboesa, mirtilo)
- 1 colher de sopa de sementes de chia
- 1 scoop de whey protein sabor frutas vermelhas
- 200ml de leite desnatado ou bebida vegetal
- 1/2 xícara de iogurte grego natural

**Como preparar:** Deixe as sementes de chia de molho em água por 15 minutos. Bata todos os outros ingredientes e adicione a chia por último.

**Benefícios:** Alta concentração de antioxidantes, proteínas e ômega-3.

## 4. Smoothie Tropical Proteico

**Ingredientes:**
- 1/2 xícara de abacaxi
- 1/2 manga
- 1/4 de abacate
- 1 scoop de whey protein sabor coco ou baunilha
- 200ml de leite de coco ou água de coco
- 1 colher de chá de cúrcuma (opcional)

**Como preparar:** Bata todos os ingredientes até obter uma consistência cremosa.

**Benefícios:** Combina proteínas com enzimas digestivas do abacaxi e gorduras saudáveis do abacate.

## 5. Smoothie de Café Proteico

**Ingredientes:**
- 1 xícara de café forte (frio)
- 1 banana congelada
- 1 scoop de whey protein sabor chocolate
- 1 colher de sopa de cacau em pó
- 1 colher de chá de canela
- 200ml de leite de amêndoas

**Como preparar:** Bata todos os ingredientes e sirva com gelo.

**Benefícios:** Combina proteínas com cafeína para energia extra e antioxidantes do cacau.

## Dicas extras:

- Sempre consuma seu smoothie nos primeiros 30-45 minutos após o treino
- Ajuste a quantidade de proteína de acordo com seus objetivos
- Experimente adicionar colágeno, creatina ou outros suplementos conforme sua necessidade
- Para ganho de massa, adicione mais fontes de carboidratos como aveia ou tâmaras

Os smoothies são extremamente versáteis - experimente combinar os ingredientes que você mais gosta!`,
    imagem: "https://images.unsplash.com/photo-1553530666-ba11a90a3360?w=800",
    categoria: "Receitas",
    autor: "Nutricionista Paula Costa",
    tags: "receitas,pós-treino,smoothies,proteínas,recuperação",
    destaque: true,
  },
  {
    titulo: "Guia completo para iniciantes em treinos de força",
    conteudo: `Se você está começando sua jornada no treinamento de força, parabéns pela decisão! O treinamento resistido traz inúmeros benefícios para a saúde geral, além de contribuir para a estética corporal. Este guia vai ajudá-lo a começar com segurança e eficiência.

## Por que treinar força?

O treinamento de força vai além da estética. Seus benefícios incluem:
- Aumento da massa muscular
- Fortalecimento dos ossos
- Melhora do metabolismo
- Redução do risco de lesões
- Melhora da postura e equilíbrio
- Maior qualidade de vida na terceira idade

## Por onde começar?

### 1. Consulte um médico
Antes de iniciar qualquer programa de exercícios, especialmente se você tem condições médicas preexistentes, faça um check-up.

### 2. Aprenda a técnica correta
A execução inadequada dos exercícios pode levar a lesões. Considere:
- Contratar um personal trainer para as primeiras sessões
- Assistir vídeos de profissionais qualificados
- Começar com cargas leves para dominar o movimento

### 3. Crie uma rotina de treinos para iniciantes

**Exemplo de treino para iniciantes:**

**Segunda-feira: Treino de Corpo Inteiro**
- Agachamento com peso corporal: 3 séries de 12 repetições
- Flexão de braços com joelhos apoiados: 3 séries de 10 repetições
- Remada curvada com halteres leves: 3 séries de 12 repetições
- Elevação lateral: 3 séries de 12 repetições
- Prancha: 3 séries de 20 segundos

**Quarta-feira: Treino de Corpo Inteiro**
- Afundo: 3 séries de 10 repetições por perna
- Supino com halteres: 3 séries de 12 repetições
- Puxada no cabo (ou com faixa elástica): 3 séries de 12 repetições
- Elevação de panturrilha: 3 séries de 15 repetições
- Abdominal: 3 séries de 15 repetições

**Sexta-feira: Treino de Corpo Inteiro**
- Levantamento terra com halteres: 3 séries de 10 repetições
- Desenvolvimento de ombros: 3 séries de 12 repetições
- Rosca direta: 3 séries de 12 repetições
- Extensão de tríceps: 3 séries de 12 repetições
- Prancha lateral: 3 séries de 15 segundos por lado

### 4. Descanse adequadamente
O descanso é tão importante quanto o treino para o desenvolvimento muscular:
- Durma 7-8 horas por noite
- Permita 48 horas de recuperação para os mesmos grupos musculares
- Faça alongamentos nos dias de descanso

### 5. Alimente-se corretamente
Uma nutrição adequada é fundamental:
- Consuma proteínas suficientes (entre 1,6g e 2g por kg de peso corporal)
- Mantenha-se hidratado
- Não treine em jejum (como iniciante)
- Consuma carboidratos de qualidade para energia

## Erros comuns a evitar

- Usar cargas muito pesadas no início
- Negligenciar a técnica correta
- Copiar treinos avançados da internet
- Não respeitar os limites do corpo
- Comparar seu progresso com o de outras pessoas

## Progresso gradual

À medida que você vai ganhando força e confiança, aumente gradualmente:
- O peso dos equipamentos
- O número de séries e repetições
- A frequência dos treinos
- A complexidade dos exercícios

Lembre-se: consistência é mais importante que intensidade extrema, especialmente no início. O treinamento de força é uma maratona, não uma corrida de 100 metros!`,
    imagem:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    categoria: "Treinos",
    autor: "Personal Trainer Ricardo Almeida",
    tags: "musculação,iniciantes,treino de força,exercícios,saúde",
    destaque: false,
  },
  {
    titulo: "Como manter a motivação para treinar durante o inverno",
    conteudo: `O inverno pode ser um desafio para manter a consistência nos treinos. As manhãs escuras, o frio e a vontade de ficar debaixo das cobertas podem sabotar até os mais disciplinados. No entanto, com algumas estratégias, é possível manter-se motivado e ativo mesmo nos dias mais frios.

## Por que é mais difícil treinar no inverno?

- Dias mais curtos e menos exposição à luz solar afetam a produção de serotonina e vitamina D
- Temperaturas baixas diminuem a motivação para sair de casa
- O corpo tende a economizar energia e buscar mais calorias
- Roupas adicionais podem tornar os exercícios menos confortáveis

## Estratégias para manter a motivação

### 1. Ajuste seus horários de treino
Tente treinar durante o período da luz do dia, quando possível. Se você costuma treinar pela manhã e está difícil sair da cama, considere mudar para o horário do almoço ou final da tarde.

### 2. Invista em roupas apropriadas
Roupas térmicas de qualidade fazem toda diferença para treinos ao ar livre:
- Camadas leves e térmicas são mais eficientes que uma única peça grossa
- Tecidos que afastam o suor da pele são essenciais
- Não esqueça extremidades: luvas, meias térmicas e gorros

### 3. Traga o treino para dentro de casa
Crie uma rotina de exercícios que possa fazer em casa:
- Treinos HIIT não exigem muito espaço ou equipamento
- Yoga e pilates são excelentes para manter-se ativo
- Considere investir em equipamentos básicos como faixas elásticas, kettlebells ou halteres ajustáveis

### 4. Estabeleça metas específicas para o inverno
Em vez de apenas "sobreviver" ao inverno, estabeleça objetivos claros:
- Desafie-se a melhorar a flexibilidade
- Foque em fortalecer um grupo muscular específico
- Participe de um desafio online de 30 dias

### 5. Use a tecnologia a seu favor
- Aplicativos de fitness podem fornecer novas rotinas de exercícios
- Aulas virtuais criam compromisso e conexão
- Dispositivos de rastreamento de atividade ajudam a visualizar seu progresso

### 6. Encontre um parceiro de treino
A responsabilidade compartilhada aumenta significativamente as chances de manter a consistência:
- Marque encontros para treinos
- Crie desafios amigáveis
- Compartilhe resultados e celebre conquistas juntos

### 7. Recompense-se adequadamente
Crie um sistema de recompensas que não sabote seus objetivos:
- Um banho quente relaxante após o treino
- Uma xícara de chá especial
- Tempo para ler ou assistir algo que goste
- Uma nova peça de roupa de treino após completar um mês consistente

### 8. Lembre-se dos benefícios para saúde mental
O exercício regular durante o inverno pode:
- Combater o Transtorno Afetivo Sazonal (TAS)
- Melhorar o humor e os níveis de energia
- Fortalecer o sistema imunológico quando mais precisamos
- Proporcionar uma sensação de conquista

## A importância de ser gentil consigo mesmo

Nem todos os dias serão perfeitos, e está tudo bem. A consistência ao longo do tempo é mais importante que a perfeição diária. Se perder um treino, não transforme isso em uma série de dias perdidos.

O inverno é também um momento para respeitar os ritmos naturais do corpo. Talvez você não atinja os mesmos recordes pessoais que no verão, e isso é completamente normal.

Mantenha o movimento, adapte suas expectativas e chegará na primavera mais forte - tanto física quanto mentalmente.`,
    imagem:
      "https://images.unsplash.com/photo-1486218119243-13883505764c?w=800",
    categoria: "Treinos",
    autor: "Psicóloga Esportiva Beatriz Alves",
    tags: "motivação,inverno,treino,frio,exercícios",
    destaque: false,
  },
];

async function main() {
  console.log("Iniciando o seed do blog...");

  for (const artigo of artigos) {
    // Criar slug a partir do título se não fornecido
    const slug = slugify(artigo.titulo);

    // Verificar se já existe um post com este slug
    const postExistente = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (postExistente) {
      console.log(`Post com slug "${slug}" já existe. Pulando...`);
      continue;
    }

    // Criar post
    await prisma.blogPost.create({
      data: {
        titulo: artigo.titulo,
        conteudo: artigo.conteudo,
        imagem: artigo.imagem,
        categoria: artigo.categoria,
        slug,
        autor: artigo.autor,
        tags: artigo.tags,
        destaque: artigo.destaque,
        visualizacoes: Math.floor(Math.random() * 100) + 20, // Número aleatório entre 20 e 120
      },
    });

    console.log(`Post "${artigo.titulo}" criado com sucesso.`);
  }

  console.log("Seed do blog concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
