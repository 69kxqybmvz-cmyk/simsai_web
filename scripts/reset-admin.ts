import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Reset admin password
    const hashedPassword = await bcrypt.hash('admin', 10);

    await prisma.user.update({
        where: { email: 'admin@simsai.com' },
        data: {
            password: hashedPassword,
            name: 'Admin Staff',
            role: 'STAFF'
        }
    });

    console.log('✅ Admin password reset to: admin');
    console.log('📧 Email: admin@simsai.com');
    console.log('🔑 Password: admin');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
