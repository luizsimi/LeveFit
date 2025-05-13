export interface BlogPost {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  categoria: string;
  slug: string;
  autor: string;
  tags?: string;
  publicado: boolean;
  destaque: boolean;
  visualizacoes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogPostDTO {
  titulo: string;
  conteudo: string;
  imagem?: string;
  categoria: string;
  slug?: string; // Opcional porque pode ser gerado automaticamente
  autor?: string;
  tags?: string;
  publicado?: boolean;
  destaque?: boolean;
}

export interface UpdateBlogPostDTO {
  titulo?: string;
  conteudo?: string;
  imagem?: string;
  categoria?: string;
  slug?: string;
  autor?: string;
  tags?: string;
  publicado?: boolean;
  destaque?: boolean;
}
