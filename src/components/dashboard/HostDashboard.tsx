/**
 * HostDashboard — Shows render pipeline status and marketing assets for hosts.
 *
 * Displays:
 * - Active render jobs with progress status
 * - Completed video assets with download/preview links
 * - Quick actions to generate new videos
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Film, Download, RefreshCw, CheckCircle, Clock, AlertCircle, Sparkles, Share2 } from 'lucide-react';

// === Types ===

interface RenderJob {
    id: string;
    car_id: string;
    render_type: string;
    status: string;
    output_url: string | null;
    error_message: string | null;
    created_at: string;
    completed_at: string | null;
    car?: {
        brand: string;
        model: string;
        name: string;
    };
}

// === Helpers ===

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: 'Queued', color: '#F59E0B', icon: Clock },
    rendering: { label: 'Rendering', color: '#3B82F6', icon: RefreshCw },
    complete: { label: 'Complete', color: '#10B981', icon: CheckCircle },
    failed: { label: 'Failed', color: '#EF4444', icon: AlertCircle },
};

const RENDER_TYPE_LABELS: Record<string, string> = {
    showcase: '🎬 Car Showcase',
    social_reel: '📱 Social Reel',
    og_video: '🔗 OG Preview',
    hero: '🏠 Hero Video',
    ad: '📢 Ad Campaign',
    onboarding: '👋 Welcome Video',
};

function timeAgo(date: string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// === Component ===

export default function HostDashboard() {
    const [jobs, setJobs] = useState<RenderJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'complete' | 'failed'>('all');

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        const query = supabase
            .from('render_queue')
            .select('*, car:cars(brand, model, name)')
            .order('created_at', { ascending: false })
            .limit(50);

        if (filter !== 'all') {
            query.eq('status', filter);
        }

        const { data } = await query;
        setJobs((data as RenderJob[]) ?? []);
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        Promise.resolve().then(() => fetchJobs());

        // Realtime subscription for job status updates
        const channel = supabase
            .channel('render-queue-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'render_queue' },
                () => fetchJobs()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchJobs]);

    const completedJobs = jobs.filter((j) => j.status === 'complete');
    const pendingJobs = jobs.filter((j) => j.status === 'pending' || j.status === 'rendering');
    const failedJobs = jobs.filter((j) => j.status === 'failed');

    return (
        <div
            style={{
                maxWidth: 960,
                margin: '0 auto',
                padding: '40px 24px',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 32,
                }}
            >
                <div>
                    <h1
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: 28,
                            fontWeight: 800,
                            color: '#F4F6F8',
                            margin: 0,
                        }}
                    >
                        <Film
                            style={{
                                display: 'inline',
                                marginRight: 10,
                                verticalAlign: 'middle',
                            }}
                            size={24}
                        />
                        Marketing Studio
                    </h1>
                    <p
                        style={{
                            fontSize: 14,
                            color: 'rgba(244, 246, 248, 0.5)',
                            marginTop: 4,
                        }}
                    >
                        Auto-generated videos for your listings
                    </p>
                </div>
                <button
                    onClick={fetchJobs}
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#D7A04D',
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                    }}
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Stats cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginBottom: 32,
                }}
            >
                {[
                    { label: 'Ready', value: completedJobs.length, icon: CheckCircle, color: '#10B981' },
                    { label: 'Processing', value: pendingJobs.length, icon: Sparkles, color: '#3B82F6' },
                    { label: 'Failed', value: failedJobs.length, icon: AlertCircle, color: '#EF4444' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 12,
                            padding: '20px 24px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 8,
                            }}
                        >
                            <stat.icon size={16} color={stat.color} />
                            <span
                                style={{
                                    fontSize: 12,
                                    color: 'rgba(244,246,248,0.4)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                }}
                            >
                                {stat.label}
                            </span>
                        </div>
                        <div
                            style={{
                                fontFamily: "'Montserrat', sans-serif",
                                fontSize: 28,
                                fontWeight: 700,
                                color: '#F4F6F8',
                            }}
                        >
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    marginBottom: 20,
                }}
            >
                {(['all', 'complete', 'pending', 'failed'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 13,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor:
                                filter === f
                                    ? 'rgba(215, 160, 77, 0.15)'
                                    : 'rgba(255,255,255,0.04)',
                            color: filter === f ? '#D7A04D' : 'rgba(244,246,248,0.5)',
                            fontWeight: filter === f ? 600 : 400,
                        }}
                    >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Job list */}
            {loading ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: 48,
                        color: 'rgba(244,246,248,0.3)',
                    }}
                >
                    Loading...
                </div>
            ) : jobs.length === 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: 48,
                        color: 'rgba(244,246,248,0.3)',
                    }}
                >
                    No render jobs found.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {jobs.map((job) => {
                        const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.pending;
                        const StatusIcon = statusCfg.icon;
                        const carLabel = job.car
                            ? `${job.car.brand} ${job.car.model}`
                            : 'Unknown Car';

                        return (
                            <div
                                key={job.id}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 10,
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                }}
                            >
                                {/* Status icon */}
                                <StatusIcon
                                    size={18}
                                    color={statusCfg.color}
                                    style={{
                                        flexShrink: 0,
                                        animation:
                                            job.status === 'rendering'
                                                ? 'spin 1s linear infinite'
                                                : undefined,
                                    }}
                                />

                                {/* Info */}
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: '#F4F6F8',
                                        }}
                                    >
                                        {carLabel}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: 'rgba(244,246,248,0.4)',
                                            marginTop: 2,
                                        }}
                                    >
                                        {RENDER_TYPE_LABELS[job.render_type] ?? job.render_type}{' '}
                                        · {timeAgo(job.created_at)}
                                    </div>
                                </div>

                                {/* Status badge */}
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: statusCfg.color,
                                        backgroundColor: `${statusCfg.color}15`,
                                        padding: '4px 10px',
                                        borderRadius: 6,
                                    }}
                                >
                                    {statusCfg.label}
                                </span>

                                {/* Actions */}
                                {job.status === 'complete' && job.output_url && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <a
                                            href={job.output_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#D7A04D',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                fontSize: 12,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <Download size={14} />
                                        </a>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(job.output_url!);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'rgba(244,246,248,0.4)',
                                                cursor: 'pointer',
                                                padding: 0,
                                            }}
                                        >
                                            <Share2 size={14} />
                                        </button>
                                    </div>
                                )}

                                {/* Error message */}
                                {job.status === 'failed' && job.error_message && (
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: '#EF4444',
                                            maxWidth: 200,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                        title={job.error_message}
                                    >
                                        {job.error_message}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
