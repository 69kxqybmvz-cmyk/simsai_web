import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/session';
import { DashboardContent } from './dashboard-client';
import Link from 'next/link';

export default async function DashboardPage() {
    const userId = await requireUser();
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            submissions: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="branding-logo" style={{ fontSize: '5rem', marginBottom: '1rem' }}>
                    <span className="text-sims">SIMS</span> <span className="text-ai">AI</span>
                </h1>
                <h2 style={{ fontSize: '2rem', fontWeight: 500, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                    Student Dashboard
                </h2>
                <p style={{ color: '#666', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Welcome back, {user.name}</p>
                {user.courseType && user.department && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            fontSize: '0.95rem',
                            fontWeight: 500
                        }}>
                            {user.courseType === 'BTECH' ? 'B.Tech' : 'Polytechnic'}
                        </span>
                        <span style={{
                            background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            fontSize: '0.95rem',
                            fontWeight: 500
                        }}>
                            {user.department.replace(/_/g, ' ')}
                        </span>
                        <span style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            fontSize: '0.95rem',
                            fontWeight: 500
                        }}>
                            Semester {user.semester}
                        </span>
                    </div>
                )}
            </header>



            <DashboardContent user={user} />

            <footer style={{ textAlign: 'center', marginTop: '3rem', paddingBottom: '2rem' }}>
                <form action={async () => {
                    'use server';
                    const { deleteSession } = await import('@/lib/session');
                    const { redirect } = await import('next/navigation');
                    await deleteSession();
                    redirect('/login');
                }}>
                    <button className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem', background: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}>Logout</button>
                </form>
            </footer>
        </div>
    );
}
