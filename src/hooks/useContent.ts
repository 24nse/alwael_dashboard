// src/hooks/useContent.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ContentSection } from '@/types/admin';

export function useContent() {
    const [contentSections, setContentSections] = useState<ContentSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initial fetch
        fetchContentSections();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('content_sections_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'content_sections' },
                (payload) => {
                    console.log('Content section changed:', payload);
                    fetchContentSections(); // Refetch on any change
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchContentSections = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('content_sections')
                .select('*')
                .order('section_key', { ascending: true });

            if (fetchError) throw fetchError;

            if (data) {
                // Transform snake_case to camelCase
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    sectionKey: item.section_key,
                    title: item.title,
                    content: item.content,
                    image: item.image_url,
                    isActive: item.is_active,
                    updatedAt: item.updated_at,
                }));
                setContentSections(transformedData as ContentSection[]);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch content sections');
            console.error('Error fetching content sections:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateContentSection = async (sectionId: string, updates: Partial<ContentSection>) => {
        try {
            // Transform camelCase to snake_case
            const dbUpdates: any = {};
            if (updates.title) dbUpdates.title = updates.title;
            if (updates.content) dbUpdates.content = updates.content;
            if (updates.image !== undefined) dbUpdates.image_url = updates.image;
            if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

            const { data, error: updateError } = await supabase
                .from('content_sections')
                .update(dbUpdates)
                .eq('id', sectionId)
                .select()
                .single();

            if (updateError) throw updateError;
            return data;
        } catch (err) {
            console.error('Error updating content section:', err);
            throw err;
        }
    };

    const updateContentByKey = async (sectionKey: string, updates: Partial<ContentSection>) => {
        try {
            // Transform camelCase to snake_case
            const dbUpdates: any = {};
            if (updates.title) dbUpdates.title = updates.title;
            if (updates.content) dbUpdates.content = updates.content;
            if (updates.image !== undefined) dbUpdates.image_url = updates.image;
            if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

            const { data, error: updateError } = await supabase
                .from('content_sections')
                .update(dbUpdates)
                .eq('section_key', sectionKey)
                .select()
                .single();

            if (updateError) throw updateError;
            return data;
        } catch (err) {
            console.error('Error updating content section by key:', err);
            throw err;
        }
    };

    return {
        contentSections,
        loading,
        error,
        updateContentSection,
        updateContentByKey,
        refetch: fetchContentSections
    };
}
