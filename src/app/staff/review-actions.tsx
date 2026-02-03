'use client';

import { verifySubmission } from '@/app/actions/staff';
import { useState, useTransition } from 'react';

export function ReviewActions({ submissionId }: { submissionId: string }) {
    const [isPending, startTransition] = useTransition();
    const [feedback, setFeedback] = useState('');
    const [showConfirm, setShowConfirm] = useState<'APPROVED' | 'REJECTED' | null>(null);

    function handleVerify(status: 'APPROVED' | 'REJECTED') {
        if (!showConfirm) {
            setShowConfirm(status);
            return;
        }

        startTransition(async () => {
            await verifySubmission(submissionId, status, feedback);
            setShowConfirm(null);
            setFeedback('');
        });
    }

    if (showConfirm) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', background: '#1a1a1a', padding: '1rem', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#fbbf24', fontWeight: 500 }}>
                    ⚠️ Confirm {showConfirm === 'APPROVED' ? 'Approval' : 'Rejection'}
                </p>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add feedback for the student (optional)"
                    className="input"
                    rows={3}
                    style={{ fontSize: '0.875rem' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => handleVerify(showConfirm)}
                        className="btn"
                        style={{
                            flex: 1,
                            backgroundColor: showConfirm === 'APPROVED' ? 'var(--success)' : 'var(--error)',
                            color: '#fff',
                            fontSize: '1rem',
                            padding: '0.75rem'
                        }}
                        disabled={isPending}
                    >
                        {isPending ? 'Processing...' : `Confirm ${showConfirm === 'APPROVED' ? '✓' : '✗'}`}
                    </button>
                    <button
                        onClick={() => setShowConfirm(null)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
            <button
                onClick={() => handleVerify('APPROVED')}
                className="btn"
                style={{
                    flex: 1,
                    backgroundColor: 'var(--success)',
                    color: '#fff',
                    fontSize: '1.125rem',
                    padding: '1rem',
                    fontWeight: 600
                }}
                disabled={isPending}
            >
                ✓ Approve
            </button>
            <button
                onClick={() => handleVerify('REJECTED')}
                className="btn"
                style={{
                    flex: 1,
                    backgroundColor: 'var(--error)',
                    color: '#fff',
                    fontSize: '1.125rem',
                    padding: '1rem',
                    fontWeight: 600
                }}
                disabled={isPending}
            >
                ✗ Reject
            </button>
        </div>
    );
}
