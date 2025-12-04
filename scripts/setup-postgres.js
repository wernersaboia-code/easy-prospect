const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function setup() {
  console.log('🔧 Configurando PostgreSQL...');

  const prisma = new PrismaClient();

  try {
    // Conectar ao banco
    await prisma.$connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash('senha123', 10);

    const user = await prisma.user.upsert({
      where: { email: 'admin@easyprospect.com' },
      update: {},
      create: {
        email: 'admin@easyprospect.com',
        name: 'Administrador',
        password: hashedPassword,
      },
    });

    console.log('✅ Usuário criado:');
    console.log('   📧 Email:', user.email);
    console.log('   🔑 Senha: senha123');
    console.log('   🆔 ID:', user.id);

    // Contar usuários
    const count = await prisma.user.count();
    console.log('📊 Total de usuários:', count);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Desconectado do banco');
  }
}

setup();