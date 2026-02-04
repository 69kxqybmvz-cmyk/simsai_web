'use server';

import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';

export async function uploadCertificate(submissionId: string, formData: FormData) {
    try {
        // Get the file from form data
        const file = formData.get('certificate') as File;
        if (!file) {
            return { error: 'No file provided' };
        }

        // Validate file type (PDF only)
        if (!file.type.includes('pdf')) {
            return { error: 'Only PDF files are allowed' };
        }

        // Get submission and verify it's approved
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId }
        });

        if (!submission) {
            return { error: 'Submission not found' };
        }

        if (submission.status !== 'APPROVED') {
            return { error: 'Can only upload certificates for approved submissions' };
        }

        // Create certificates directory if it doesn't exist
        const certificatesDir = join(process.cwd(), 'uploads', 'certificates');
        await mkdir(certificatesDir, { recursive: true });

        // Generate filename
        const filename = `${submissionId}-certificate.pdf`;
        const filepath = join(certificatesDir, filename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Update submission with certificate filename
        await prisma.submission.update({
            where: { id: submissionId },
            data: { certificateFile: filename }
        });

        revalidatePath('/staff');
        revalidatePath('/dashboard');

        return { success: true, filename };
    } catch (error) {
        console.error('Certificate upload error:', error);
        return { error: 'Failed to upload certificate' };
    }
}

export async function removeCertificate(submissionId: string) {
    try {
        await prisma.submission.update({
            where: { id: submissionId },
            data: { certificateFile: null }
        });

        revalidatePath('/staff');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Certificate removal error:', error);
        return { error: 'Failed to remove certificate' };
    }
}
