// src/hooks/useTeam.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { TeamMember } from '@/types/admin';

export function useTeam() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initial fetch
        fetchTeamMembers();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('team_members_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'team_members' },
                (payload) => {
                    console.log('Team member changed:', payload);
                    fetchTeamMembers(); // Refetch on any change
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('team_members')
                .select('*')
                .order('display_order', { ascending: true });

            if (fetchError) throw fetchError;

            if (data) {
                // Transform snake_case to camelCase
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    position: item.position,
                    department: item.department,
                    phone: item.phone,
                    email: item.email,
                    image: item.image_url,
                    bio: item.bio,
                    isActive: item.is_active,
                    createdAt: item.created_at,
                }));
                setTeamMembers(transformedData as TeamMember[]);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch team members');
            console.error('Error fetching team members:', err);
        } finally {
            setLoading(false);
        }
    };

    const createTeamMember = async (memberData: Omit<TeamMember, 'id' | 'createdAt'>) => {
        try {
            // Transform camelCase to snake_case
            const dbData = {
                name: memberData.name,
                position: memberData.position,
                department: memberData.department,
                phone: memberData.phone,
                email: memberData.email,
                image_url: memberData.image,
                bio: memberData.bio,
                is_active: memberData.isActive,
            };

            const { data, error: insertError } = await supabase
                .from('team_members')
                .insert([dbData])
                .select()
                .single();

            if (insertError) throw insertError;
            return data;
        } catch (err) {
            console.error('Error creating team member:', err);
            throw err;
        }
    };

    const updateTeamMember = async (memberId: string, updates: Partial<TeamMember>) => {
        try {
            // Transform camelCase to snake_case
            const dbUpdates: any = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.position) dbUpdates.position = updates.position;
            if (updates.department) dbUpdates.department = updates.department;
            if (updates.phone) dbUpdates.phone = updates.phone;
            if (updates.email) dbUpdates.email = updates.email;
            if (updates.image) dbUpdates.image_url = updates.image;
            if (updates.bio) dbUpdates.bio = updates.bio;
            if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

            const { data, error: updateError } = await supabase
                .from('team_members')
                .update(dbUpdates)
                .eq('id', memberId)
                .select()
                .single();

            if (updateError) throw updateError;
            return data;
        } catch (err) {
            console.error('Error updating team member:', err);
            throw err;
        }
    };

    const deleteTeamMember = async (memberId: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('team_members')
                .delete()
                .eq('id', memberId);

            if (deleteError) throw deleteError;
        } catch (err) {
            console.error('Error deleting team member:', err);
            throw err;
        }
    };

    const toggleActive = async (memberId: string) => {
        try {
            // Get current member
            const member = teamMembers.find(m => m.id === memberId);
            if (!member) throw new Error('Team member not found');

            // Toggle active status
            const { data, error: updateError } = await supabase
                .from('team_members')
                .update({ is_active: !member.isActive })
                .eq('id', memberId)
                .select()
                .single();

            if (updateError) throw updateError;
            return data;
        } catch (err) {
            console.error('Error toggling team member active status:', err);
            throw err;
        }
    };

    return {
        teamMembers,
        loading,
        error,
        createTeamMember,
        updateTeamMember,
        deleteTeamMember,
        toggleActive,
        refetch: fetchTeamMembers
    };
}
