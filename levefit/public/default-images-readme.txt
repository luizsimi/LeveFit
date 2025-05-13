# Instruções para imagens padrão

Para resolver os erros de carregamento de imagens, coloque os seguintes arquivos neste diretório:

1. `default-avatar.png` - Uma imagem de avatar padrão para usuários e fornecedores
2. `default-dish.png` - Uma imagem padrão para pratos

Se preferir, você pode baixar esses arquivos de sites gratuitos como:
- https://www.flaticon.com/
- https://www.freepik.com/

Ou criar seus próprios ícones simples usando um editor de imagens.

Depois de adicionar essas imagens, reinicie a aplicação.

Alternativamente, se você não quiser usar imagens locais, modifique os seguintes arquivos:
- `src/components/FornecedorCarousel.tsx`
- `src/components/PratoCard.tsx`

E substitua as URLs de fallback por URLs de imagens online confiáveis. 