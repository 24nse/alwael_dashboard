// supabase/functions/dashboard-stats/index.ts
// @ts-expect-error - Deno URL imports are valid in Supabase Edge Functions runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-expect-error - Deno URL imports are valid in Supabase Edge Functions runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Declare Deno namespace for TypeScript
declare const Deno: {
    env: {
        get(key: string): string | undefined;
    };
};

serve(async (req: Request) => {
    try {
        // @ts-ignore - Deno is available in Supabase Edge Functions runtime
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );
        // Verify user is authenticated
        const authHeader = req.headers.get('Authorization')!;
        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
        );
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        // Get statistics
        const [orders, consultations, projects, teamMembers] = await Promise.all([
            supabase.from('orders').select('status', { count: 'exact' }),
            supabase.from('consultations').select('status', { count: 'exact' }),
            supabase.from('projects').select('status', { count: 'exact' }),
            supabase.from('team_members').select('is_active', { count: 'exact' }),
        ]);
        const stats = {
            totalOrders: orders.count || 0,
            newOrders: orders.data?.filter((o: { status: string }) => o.status === 'new').length || 0,
            totalConsultations: consultations.count || 0,
            pendingConsultations: consultations.data?.filter((c: { status: string }) => c.status === 'pending').length || 0,
            totalProjects: projects.count || 0,
            activeProjects: projects.data?.filter((p: { status: string }) => p.status === 'in_progress').length || 0,
            totalTeamMembers: teamMembers.count || 0,
            activeTeamMembers: teamMembers.data?.filter((t: { is_active: boolean }) => t.is_active).length || 0,
        };
        return new Response(JSON.stringify(stats), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});