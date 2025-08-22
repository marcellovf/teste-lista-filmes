import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import nodemailer, { Transporter } from "nodemailer";

const prisma = new PrismaClient();

let started = false; // evita múltiplas instâncias

async function createTransporter(): Promise<Transporter> {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function startCronJobs() {
  if (started) return; // já iniciado
  started = true;

  cron.schedule("0 */12 * * *", async () => {
    console.log("Rodando cron server-side...");

    const now = new Date();

    const movies = await prisma.movie.findMany({
      where: {
        sent: false,
        release_date: { lte: now },
      },
      include: {
        addedBy: { select: { email: true } },
      },
    });

    if (!movies.length) return console.log("Nenhum filme pendente.");

    const transporter = await createTransporter();

    for (const movie of movies) {
      if (!movie.addedBy?.email) {
        console.warn(`Filme "${movie.title}" não tem e-mail do usuário.`);
        continue;
      }

      try {
        const info = await transporter.sendMail({
          from: '"Notificação Next" <no-reply@example.com>',
          to: movie.addedBy.email,
          subject: `Lançamento: ${movie.title} já está disponível!`,
          text: `Olá! O filme "${movie.title}" que você cadastrou já foi lançado.`,
        });

        console.log(`E-mail enviado: ${nodemailer.getTestMessageUrl(info)}`);

        await prisma.movie.update({
          where: { id: movie.id },
          data: { sent: true },
        });
      } catch (err) {
        console.error(`Erro ao enviar e-mail do filme "${movie.title}":`, err);
      }
    }
  });

  console.log("Cron job iniciado no servidor.");
}
