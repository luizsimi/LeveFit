/**
 * Converte um texto em um slug para URLs
 * Remove acentos, converte para minúsculas, substitui espaços por hífens
 * e remove caracteres especiais
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD") // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .toLowerCase() // Converte para minúsculo
    .trim() // Remove espaços do início e fim
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/[^\w\-]+/g, "") // Remove caracteres não alfanuméricos
    .replace(/\-\-+/g, "-") // Substitui múltiplos hífens por um único
    .replace(/^-+/, "") // Remove hífens do início
    .replace(/-+$/, ""); // Remove hífens do fim
}
