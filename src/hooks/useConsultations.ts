// src/hooks/useConsultations.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Consultation } from '@/types/admin';

export function useConsultations() {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initial fetch
        fetchConsultations();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('consultations_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'consultations' },
                (payload) => {
                    console.log('Consultation changed:', payload);
                    fetchConsultations(); // Refetch on any change
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchConsultations = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('consultations')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            if (data) {
                // Transform snake_case to camelCase
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    customerName: item.customer_name,
                    phone: item.phone,
                    email: item.email,
                    consultationType: item.consultation_type,
                    preferredDate: item.preferred_date,
                    preferredTime: item.preferred_time,
                    message: item.message,
                    status: item.status,
                    createdAt: item.created_at,
                }));
                setConsultations(transformedData as Consultation[]);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch consultations');
            console.error('Error fetching consultations:', err);
        } finally {
            setLoading(false);
        }
    };

    const createConsultation = async (consultationData: Omit<Consultation, 'id' | 'createdAt'>) => {
        try {
            // Transform camelCase to snake_case
            const dbData = {
                customer_name: consultationData.customerName,
                phone: consultationData.phone,
                email: consultationData.email,
                consultation_type: consultationData.consultationType,
                preferred_date: consultationData.preferredDate,
                preferred_time: consultationData.preferredTime,
                message: consultationData.message,
                status: consultationData.status,
            };

            const { data, error: insertError } = await supabase
                .from('consultations')
                .insert([dbData])
                .select()
                .single();

            if (insertError) throw insertError;
            return data;
        } catch (err) {
            console.error('Error creating consultation:', err);
            throw err;
        }
    };

    const updateConsultation = async (consultationId: string, updates: Partial<Consultation>) => {
        try {
            // Transform camelCase to snake_case
            const dbUpdates: any = {};
            if (updates.customerName) dbUpdates.customer_name = updates.customerName;
            if (updates.phone) dbUpdates.phone = updates.phone;
            if (updates.email) dbUpdates.email = updates.email;
            if (updates.consultationType) dbUpdates.consultation_type = updates.consultationType;
            if (updates.preferredDate) dbUpdates.preferred_date = updates.preferredDate;
            if (updates.preferredTime) dbUpdates.preferred_time = updates.preferredTime;
            if (updates.message) dbUpdates.message = updates.message;
            if (updates.status) dbUpdates.status = updates.status;

            const { data, error: updateError } = await supabase
                .from('consultations')
                .update(dbUpdates)
                .eq('id', consultationId)
                .select()
                .single();

            if (updateError) throw updateError;
            return data;
        } catch (err) {
            console.error('Error updating consultation:', err);
            throw err;
        }
    };

    const deleteConsultation = async (consultationId: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('consultations')
                .delete()
                .eq('id', consultationId);

            if (deleteError) throw deleteError;
        } catch (err) {
            console.error('Error deleting consultation:', err);
            throw err;
        }
    };

    return {
        consultations,
        loading,
        error,
        createConsultation,
        updateConsultation,
        deleteConsultation,
        refetch: fetchConsultations
    };
}
