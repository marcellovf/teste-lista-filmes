import { PrismaClient } from '@prisma/client';

// Declara uma variável global para o cliente Prisma para evitar múltiplas instâncias em desenvolvimento
declare global {
  var prisma: PrismaClient | undefined;
}

// Cria a instância do cliente, reutilizando a instância global em desenvolvimento
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
