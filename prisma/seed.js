// Adicione no TOPO do arquivo
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL); // Debug

  const hashedPassword = await hash('senha123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@easyprospect.com' },
    update: {},
    create: {
      email: 'admin@easyprospect.com',
      name: 'Administrador',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário criado:', { id: user.id, email: user.email });
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });