// src/hooks/useDashboardStats.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DashboardStats } from '@/types/admin';

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initial fetch
        fetchStats();

        // Subscribe to changes in all relevant tables
        const ordersChannel = supabase
            .channel('orders_stats_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => fetchStats()
            )
            .subscribe();

        const consultationsChannel = supabase
            .channel('consultations_stats_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'consultations' },
                () => fetchStats()
            )
            .subscribe();

        const projectsChannel = supabase
            .channel('projects_stats_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'projects' },
                () => fetchStats()
            )
            .subscribe();

        const teamChannel = supabase
            .channel('team_stats_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'team_members' },
                () => fetchStats()
            )
            .subscribe();

        return () => {
            ordersChannel.unsubscribe();
            consultationsChannel.unsubscribe();
            projectsChannel.unsubscribe();
            teamChannel.unsubscribe();
        };
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch all data in parallel
            const [ordersResult, consultationsResult, projectsResult, teamResult] = await Promise.all([
                supabase.from('orders').select('status', { count: 'exact' }),
                supabase.from('consultations').select('status', { count: 'exact' }),
                supabase.from('projects').select('status', { count: 'exact' }),
                supabase.from('team_members').select('is_active', { count: 'exact' }),
            ]);

            // Calculate statistics
            const dashboardStats: DashboardStats = {
                totalOrders: ordersResult.count || 0,
                newOrders: ordersResult.data?.filter(o => o.status === 'new').length || 0,
                totalConsultations: consultationsResult.count || 0,
                pendingConsultations: consultationsResult.data?.filter(c => c.status === 'pending').length || 0,
                totalProjects: projectsResult.count || 0,
                activeProjects: projectsResult.data?.filter(p => p.status === 'in_progress').length || 0,
                totalTeamMembers: teamResult.count || 0,
                activeTeamMembers: teamResult.data?.filter(t => t.is_active).length || 0,
            };

            setStats(dashboardStats);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    };
}
