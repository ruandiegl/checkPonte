import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const seedPassword = process.env.SEED_DEFAULT_PASSWORD;
  if (!seedPassword || seedPassword.length < 8) {
    throw new Error('SEED_DEFAULT_PASSWORD deve estar configurado com pelo menos 8 caracteres.');
  }

  const passwordHash = await bcrypt.hash(seedPassword, 12);

  await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      name: 'Administrador Master',
      login: 'admin',
      email: 'admin@vulcano.local',
      passwordHash,
      role: 'master',
    },
  });

  await prisma.user.upsert({
    where: { login: 'operador' },
    update: {},
    create: {
      name: 'Operador Teste',
      login: 'operador',
      email: 'operador@vulcano.local',
      passwordHash,
      role: 'operator',
    },
  });

  await prisma.equipment.createMany({
    data: [
      { name: 'Ponte Rolante 01', description: 'Capacidade 10t', location: 'Galpão A' },
      { name: 'Ponte Rolante 02', description: 'Capacidade 5t', location: 'Galpão B' },
      { name: 'Ponte Rolante 03', description: 'Capacidade 20t', location: 'Galpão C' },
    ],
    skipDuplicates: true,
  });

  await prisma.checklistItem.createMany({
    data: [
      { description: 'Controle de acionamento em condições de uso?', isImperative: true, orderIndex: 1 },
      { description: 'Trava de segurança do gancho funcionando?', isImperative: true, orderIndex: 2 },
      { description: 'Estado dos cabos de aço', isImperative: true, orderIndex: 3 },
      { description: 'Funcionamento da sirene de alerta', isImperative: true, orderIndex: 4 },
      { description: 'Lubrificação das engrenagens', isImperative: false, orderIndex: 5 },
      { description: 'Limpeza da cabine', isImperative: false, orderIndex: 6 },
      { description: 'Iluminação de trabalho', isImperative: false, orderIndex: 7 },
    ],
    skipDuplicates: true,
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
