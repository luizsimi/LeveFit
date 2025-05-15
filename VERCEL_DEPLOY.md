# Guia de Implantação na Vercel

## Pré-requisitos

1. Conta na Vercel
2. Banco de dados PostgreSQL (recomendado: Vercel Postgres, Supabase ou Railway)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## Passos para implantação

### 1. Preparar o banco de dados

- Configure um banco de dados PostgreSQL em um serviço como Vercel Postgres, Supabase ou Railway
- Obtenha a string de conexão do banco de dados

### 2. Fazer o fork/clone do repositório

- Certifique-se de que o código está em um repositório Git

### 3. Configurar o projeto na Vercel

1. Acesse https://vercel.com e faça login
2. Clique em "Add New" → "Project"
3. Importe o repositório Git
4. Configure o projeto:
   - **Framework Preset**: Outros
   - **Root Directory**: ./
   - **Build Command**: Deixe o padrão (definido no vercel.json)
   - **Output Directory**: Deixe o padrão (definido no vercel.json)

### 4. Configurar variáveis de ambiente

Na seção "Environment Variables" da Vercel, adicione:

- `DATABASE_URL`: String de conexão do seu banco de dados PostgreSQL
- `JWT_SECRET`: Um valor secreto para assinar tokens JWT
- `VITE_API_URL`: `https://[seu-dominio-vercel].vercel.app/api`

### 5. Fazer deploy

- Clique em "Deploy"
- Aguarde a conclusão do processo de build e deploy

### 6. Executar migrações do banco de dados

Após o deploy inicial, você precisará executar as migrações do banco de dados:

1. Na interface da Vercel, vá para o projeto → "Settings" → "Functions" → "Console"
2. Execute:

```
cd backend && npx prisma migrate deploy
```

### Atualizações e redeploys

- Cada push para a branch principal do repositório acionará automaticamente um novo deploy
- Para mudanças no banco de dados, lembre-se de criar novas migrações com `npx prisma migrate dev` localmente e depois fazer deploy

### Solução de problemas

- **Erros de build**: Verifique os logs de build na Vercel
- **Erros de runtime**: Verifique os logs de função na seção "Functions" → "Logs"
- **Problemas de banco de dados**: Verifique se a string de conexão está correta e se o banco está acessível
