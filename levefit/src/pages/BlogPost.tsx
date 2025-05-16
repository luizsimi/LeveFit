import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaCalendarAlt,
  FaEye,
  FaArrowLeft,
  FaLeaf,
  FaShare,
  FaTags,
  FaExclamationCircle,
  FaUser,
  FaClock,
} from "react-icons/fa";

interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string;
  categoria: string;
  slug: string;
  autor: string;
  tags: string;
  publicado: boolean;
  destaque: boolean;
  visualizacoes: number;
  createdAt: string;
}

// Dados estáticos para o blog
const postsMock: BlogPost[] = [
  {
    id: 1,
    titulo: "10 Dicas para uma Alimentação Saudável no Dia a Dia",
    conteudo:
      "A alimentação saudável é a base para uma vida equilibrada e com mais energia. Confira estas 10 dicas práticas que podem ser aplicadas no seu dia a dia:\n\n1. **Priorize alimentos naturais**: Frutas, legumes, verduras, grãos e proteínas magras devem ser a base da sua alimentação.\n\n2. **Hidrate-se adequadamente**: Beba pelo menos 2 litros de água por dia. Uma boa hidratação ajuda em todos os processos do corpo.\n\n3. **Coma mais fibras**: Alimentos ricos em fibras como aveia, quinoa, chia e linhaça ajudam na digestão e dão sensação de saciedade.\n\n4. **Reduza o consumo de açúcar**: O açúcar refinado está presente em muitos alimentos industrializados e seu consumo excessivo está relacionado a diversas doenças.\n\n5. **Modere o sal**: Prefira ervas e especiarias para temperar seus alimentos em vez de excesso de sal.\n\n6. **Faça refeições regulares**: Comer a cada 3-4 horas ajuda a manter o metabolismo ativo e evita o excesso de fome.\n\n7. **Planeje suas refeições**: Ter um cardápio semanal facilita fazer escolhas saudáveis e evita a tentação de pedir delivery.\n\n8. **Coma com calma**: Mastigar devagar ajuda na digestão e dá tempo para o cérebro reconhecer a saciedade.\n\n9. **Evite distrações durante as refeições**: Comer assistindo TV ou usando o celular pode levar ao consumo excessivo de calorias.\n\n10. **Permita-se pequenos prazeres**: Uma alimentação saudável não precisa ser restritiva. Comer algo que gosta ocasionalmente faz parte do equilíbrio.\n\nLembre-se que pequenas mudanças consistentes trazem grandes resultados ao longo do tempo. Comece implementando uma ou duas dicas por vez e vá incorporando as demais gradualmente ao seu estilo de vida.",
    imagem:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop",
    categoria: "Nutrição",
    slug: "dicas-alimentacao-saudavel",
    autor: "Dra. Ana Silva",
    tags: "alimentação,saúde,bem-estar",
    publicado: true,
    destaque: true,
    visualizacoes: 1520,
    createdAt: "2025-05-10T14:30:00.000Z",
  },
  {
    id: 2,
    titulo: "Os Benefícios dos Alimentos Orgânicos",
    conteudo:
      "Os alimentos orgânicos têm ganhado cada vez mais espaço nas prateleiras dos supermercados e nas mesas dos consumidores. Mas você sabe realmente quais são seus benefícios?\n\nAlimentos orgânicos são cultivados sem o uso de pesticidas, fertilizantes sintéticos, organismos geneticamente modificados ou hormônios de crescimento. Este método de cultivo traz diversos benefícios tanto para a saúde quanto para o meio ambiente.\n\n**Benefícios para a saúde:**\n\n- **Menor exposição a químicos**: Ao consumir alimentos orgânicos, você reduz significativamente sua exposição a resíduos de pesticidas e outras substâncias químicas.\n\n- **Maior valor nutricional**: Diversos estudos indicam que alimentos orgânicos possuem maior concentração de certos nutrientes, especialmente antioxidantes.\n\n- **Sabor mais autêntico**: Muitas pessoas relatam que frutas e verduras orgânicas têm sabor mais intenso e natural.\n\n- **Sem antibióticos ou hormônios**: Produtos de origem animal orgânicos são livres de antibióticos e hormônios utilizados na produção convencional.\n\n**Benefícios para o meio ambiente:**\n\n- **Preservação da biodiversidade**: O cultivo orgânico promove a diversidade de espécies e preserva o ecossistema local.\n\n- **Proteção dos recursos hídricos**: Sem o uso de pesticidas e fertilizantes químicos, há menor contaminação da água.\n\n- **Solos mais saudáveis**: As práticas de agricultura orgânica melhoram a qualidade do solo a longo prazo.\n\n- **Menor impacto climático**: Estudos mostram que as emissões de carbono são menores em sistemas de produção orgânica.\n\nAo optar por alimentos orgânicos, você está não apenas investindo na sua saúde, mas também apoiando um sistema de produção que respeita o meio ambiente e promove a sustentabilidade. Comece incorporando alguns itens orgânicos em sua dieta e observe os benefícios ao longo do tempo.",
    imagem:
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974&auto=format&fit=crop",
    categoria: "Alimentos",
    slug: "beneficios-alimentos-organicos",
    autor: "Carlos Mendes",
    tags: "orgânicos,saúde,alimentos",
    publicado: true,
    destaque: false,
    visualizacoes: 980,
    createdAt: "2025-05-07T10:15:00.000Z",
  },
  {
    id: 3,
    titulo: "Proteínas Vegetais: O Guia Completo",
    conteudo:
      "As proteínas são essenciais para o funcionamento adequado do nosso organismo, mas não precisamos depender exclusivamente de fontes animais para obtê-las. Este guia completo sobre proteínas vegetais irá mostrar como manter uma alimentação equilibrada e nutritiva usando apenas fontes vegetais.\n\n**Por que proteínas vegetais?**\n\nAlém de serem excelentes fontes de proteínas, os alimentos vegetais geralmente contêm menos gordura saturada, mais fibras e diversos nutrientes essenciais. Eles também têm menor impacto ambiental quando comparados à produção de proteínas animais.\n\n**Principais fontes de proteínas vegetais:**\n\n1. **Leguminosas**:\n   - Feijões (preto, carioca, branco): 15g por xícara (cozidos)\n   - Lentilhas: 18g por xícara (cozidas)\n   - Grão-de-bico: 14g por xícara (cozido)\n   - Ervilhas: 8g por xícara (cozidas)\n\n2. **Soja e derivados**:\n   - Tofu: 10g por 100g\n   - Tempeh: 19g por 100g\n   - Edamame: 11g por xícara\n   - Leite de soja: 7g por xícara\n\n3. **Cereais e grãos**:\n   - Quinoa: 8g por xícara (cozida)\n   - Aveia: 6g por xícara (cozida)\n   - Arroz integral: 5g por xícara (cozido)\n\n4. **Sementes e oleaginosas**:\n   - Chia: 5g por 2 colheres de sopa\n   - Linhaça: 3g por 2 colheres de sopa\n   - Amêndoas: 6g por 1/4 xícara\n   - Castanha-do-pará: 4g por 6 unidades\n\n**Como garantir uma ingestão adequada de proteínas:**\n\n- **Combine diferentes fontes**: A combinação de leguminosas com cereais (como arroz com feijão) forma uma proteína completa com todos os aminoácidos essenciais.\n\n- **Distribua ao longo do dia**: Inclua fontes de proteína vegetal em todas as refeições.\n\n- **Diversifique as fontes**: Não dependa de apenas um ou dois alimentos; explore a variedade disponível.\n\n**Receitas ricas em proteínas vegetais:**\n\n- Bowl de quinoa com grão-de-bico, legumes e molho tahine\n- Curry de lentilhas com leite de coco\n- Smoothie de frutas com leite de amêndoas e pasta de amendoim\n\nCom planejamento adequado, é perfeitamente possível obter toda a proteína necessária de fontes vegetais, beneficiando sua saúde e o planeta.",
    imagem:
      "https://images.unsplash.com/photo-1540914124281-342587941389?q=80&w=2074&auto=format&fit=crop",
    categoria: "Nutrição",
    slug: "proteinas-vegetais",
    autor: "Dra. Paula Costa",
    tags: "proteínas,vegetariano,nutrição",
    publicado: true,
    destaque: false,
    visualizacoes: 1240,
    createdAt: "2025-05-03T09:45:00.000Z",
  },
  {
    id: 4,
    titulo: "Jejum Intermitente: Prós e Contras",
    conteudo:
      "O jejum intermitente se tornou uma das abordagens alimentares mais populares nos últimos anos. Mas será que ele é adequado para todos? Vamos analisar os prós e contras desta prática.\n\n**O que é o jejum intermitente?**\n\nO jejum intermitente não é uma dieta, mas sim um padrão alimentar que alterna entre períodos de alimentação e jejum. Os métodos mais comuns incluem:\n\n- **16/8**: 16 horas de jejum e 8 horas de alimentação\n- **5:2**: Alimentação normal por 5 dias e restrição calórica (500-600 calorias) em 2 dias da semana\n- **Eat-Stop-Eat**: Jejum de 24 horas uma ou duas vezes por semana\n\n**Prós do jejum intermitente:**\n\n1. **Perda de peso**: Pode ajudar na redução de calorias consumidas e aumentar hormônios que facilitam a queima de gordura.\n\n2. **Melhora da sensibilidade à insulina**: Estudos mostram que pode reduzir os níveis de insulina em jejum e melhorar a resistência à insulina.\n\n3. **Autofagia**: O jejum promove o processo de autofagia, onde as células se livram de componentes danificados.\n\n4. **Redução da inflamação**: Alguns estudos sugerem que o jejum intermitente pode reduzir marcadores inflamatórios.\n\n5. **Simplificação do dia alimentar**: Menos refeições significa menos tempo preparando comida e pensando sobre alimentação.\n\n**Contras do jejum intermitente:**\n\n1. **Não é para todos**: Pessoas com histórico de transtornos alimentares, diabetes tipo 1, gestantes, lactantes e crianças não devem praticar jejum intermitente.\n\n2. **Fome e irritabilidade**: Especialmente no início, muitas pessoas relatam fome intensa, irritabilidade e dificuldade de concentração.\n\n3. **Potencial perda muscular**: Sem uma ingestão adequada de proteínas e exercícios de resistência, pode haver perda de massa muscular.\n\n4. **Impacto social**: Pode dificultar eventos sociais que envolvem alimentação fora dos horários estabelecidos.\n\n5. **Efeitos hormonais**: Algumas mulheres relatam alterações no ciclo menstrual com jejuns prolongados.\n\n**Considerações finais:**\n\nO jejum intermitente pode ser benéfico para muitas pessoas, mas não é uma solução milagrosa nem adequada para todos. Como qualquer mudança significativa na alimentação, o ideal é consultar um profissional de saúde antes de iniciar esta prática.\n\nLembre-se que a qualidade dos alimentos que você consome durante o período de alimentação continua sendo fundamental para sua saúde, independentemente do padrão de jejum escolhido.",
    imagem:
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=2070&auto=format&fit=crop",
    categoria: "Dietas",
    slug: "jejum-intermitente",
    autor: "Dr. Roberto Alves",
    tags: "jejum,dieta,saúde",
    publicado: true,
    destaque: false,
    visualizacoes: 2150,
    createdAt: "2025-04-28T16:20:00.000Z",
  },
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [postsRelacionados, setPostsRelacionados] = useState<BlogPost[]>([]);

  // Buscar post pelo slug (simulado com dados estáticos)
  useEffect(() => {
    // Encontrar o post com o slug correspondente
    const foundPost = postsMock.find((p) => p.slug === slug) || null;
    setPost(foundPost);

    // Se encontrou o post, buscar posts relacionados
    if (foundPost) {
      const related = postsMock
        .filter(
          (p) => p.categoria === foundPost.categoria && p.id !== foundPost.id
        )
        .slice(0, 3);
      setPostsRelacionados(related);
    }
  }, [slug]);

  // Função para formatar a data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Função para compartilhar o post
  const compartilhar = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post?.titulo,
          text: post?.conteudo.substring(0, 100) + "...",
          url: window.location.href,
        })
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-6 rounded-xl shadow-sm flex flex-col items-center text-center py-16">
              <FaExclamationCircle className="text-5xl mb-4" />
              <h2 className="text-2xl font-bold mb-2">Artigo não encontrado</h2>
              <p className="mb-6">
                O artigo solicitado não existe ou não está disponível.
              </p>
              <Link
                to="/blog"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Voltar para o Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb e voltar */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Link
                to="/"
                className="hover:text-green-600 dark:hover:text-green-400"
              >
                Home
              </Link>
              <span className="mx-2">›</span>
              <Link
                to="/blog"
                className="hover:text-green-600 dark:hover:text-green-400"
              >
                Blog
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-500 dark:text-gray-500 truncate max-w-[200px]">
                {post.titulo}
              </span>
            </div>
            <Link
              to="/blog"
              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center"
            >
              <FaArrowLeft className="mr-1.5" />
              Voltar para o Blog
            </Link>
          </div>

          {/* Imagem de capa */}
          {post.imagem && (
            <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden shadow-md">
              <img
                src={post.imagem}
                alt={post.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
          )}

          {/* Categoria e data */}
          <div className="flex items-center flex-wrap gap-3 mb-4 text-sm">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-medium">
              {post.categoria}
            </span>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="mr-1.5" />
              {formatarData(post.createdAt)}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FaEye className="mr-1.5" />
              {post.visualizacoes} visualizações
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            {post.titulo}
          </h1>

          {/* Autor */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
              {post.autor.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-800 dark:text-white">
                {post.autor}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Autor
              </div>
            </div>
          </div>

          {/* Conteúdo do post */}
          <div className="prose prose-lg dark:prose-invert prose-green max-w-none mb-10">
            {/* Renderizar parágrafos do conteúdo */}
            {post.conteudo.split("\n").map((paragrafo, index) => (
              <p
                key={index}
                dangerouslySetInnerHTML={{
                  __html: paragrafo.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            ))}
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-8">
              <div className="flex items-center flex-wrap gap-2">
                <FaTags className="text-gray-500 dark:text-gray-400 mr-2" />
                {post.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botões de compartilhamento */}
          <div className="flex justify-center mb-16">
            <button
              onClick={compartilhar}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaShare className="mr-2" />
              Compartilhar artigo
            </button>
          </div>

          {/* Artigos relacionados */}
          {postsRelacionados.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-12 mb-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <FaLeaf className="mr-2 text-green-500" />
                Artigos Relacionados
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {postsRelacionados.map((postRelacionado) => (
                  <div
                    key={postRelacionado.id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow transition-shadow hover:shadow-lg"
                  >
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
                      {postRelacionado.imagem ? (
                        <img
                          src={postRelacionado.imagem}
                          alt={postRelacionado.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaLeaf className="text-4xl text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                        {postRelacionado.titulo}
                      </h4>
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <FaUser className="mr-1" />
                          <span>{postRelacionado.autor.split(" ")[0]}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>
                            {new Date(
                              postRelacionado.createdAt
                            ).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/${postRelacionado.slug}`}
                        className="block text-center w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-green-600 dark:text-green-400 py-2 rounded font-medium transition-colors"
                      >
                        Ler artigo
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
