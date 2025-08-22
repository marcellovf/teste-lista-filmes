'use server';

import nodemailer, { Transporter } from 'nodemailer';


export async function createTransporter(): Promise<Transporter> {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

export async function sendVerificationEmail(email: string, token: string) {
  // const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${token}`;
  const verificationLink = `http://localhost:3000/api/verify?token=${token}`;

  const mailOptions = {
    from: '"Movie Catalog" <no-reply@moviecatalog.com>',
    to: email,
    subject: 'Verifique seu email',
    html: `<p>Clique <a href="${verificationLink}">aqui</a> para verificar seu email.</p>`,
  };

  try {
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    throw new Error('Não foi possível enviar o email de verificação.');
  }
}
