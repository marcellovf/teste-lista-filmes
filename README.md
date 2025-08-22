# Sistema de Gestão de Filmes

Este projeto é um sistema completo para gerenciamento de filmes, com frontend em Next.js, TypeScript e banco de dados PostgreSQL. Ele suporta autenticação, cadastro de usuários, listagem de filmes com busca, filtros e paginação, adição/edição de filmes com envio automático de e-mails na estreia e modo claro/escuro.

---

## Tecnologias Utilizadas

### Frontend
- **React** (ou React + Next.js)
- CSS / Tailwind CSS
- Responsivo para diferentes larguras

### Backend
- **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL** (com migrations)
- Armazenamento de imagens: AWS S3
- Envio de e-mails: Ethereal

---

## Funcionalidades

### Autenticação
- Login com e-mail e senha
- Cadastro de novos usuários
- Redirecionamento automático caso o usuário já esteja logado

### Filmes
- Listagem com busca por texto
- Paginação (10 filmes por página)
- Filtros por:
  - Titulo
  - Intervalo de datas
  - Categorias
  - Duração
- Adição/Edição de filmes
- Se a data de lançamento for futura, envia e-mail automático no dia da estreia

## Pré-requisitos
  - Node.js >= 22
  - npm ou yarn
  - PostgreSQL[NeonDB](https://neon.com/docs/connect/connect-from-any-app)
  - Conta de armazenamento de imagens (AWS S3)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/marcellovf/teste-lista-filmes.git
cd teste-lista-filmes
```
2. Instale as dependências:
```bash
npm install
```
3. Configure o .env:
```bash
DATABASE_URL="" // Url do NeonDB. Em pré-requisitos tem a doc de integração
AWS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET_NAME=""
AWS_S3_REGION=""
```
4. Executar o migrate do prisma:
```bash
npx prisma migrate dev
```
5. Executar o projeto:
```bash
npm run dev
```

Email para contato caso queira o meu .env: marcellovasconcelos91@gmail.com
