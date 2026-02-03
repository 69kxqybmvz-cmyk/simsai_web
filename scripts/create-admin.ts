import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
        where: { email: 'admin@simsai.com' }
    });

    if (existing) {
        console.log('Admin user already exists');
        return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);

    await prisma.user.create({
        data: {
            email: 'admin@simsai.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'STAFF'
        }
    });

    console.log('✅ Admin user created: admin@simsai.com / admin');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
