// src/hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/admin';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initial fetch
        fetchProjects();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('projects_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'projects' },
                (payload) => {
                    console.log('Project changed:', payload);
                    fetchProjects(); // Refetch on any change
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from('projects')
                .select(`
          *,
          project_images (
            id,
            image_url,
            display_order
          )
        `)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            if (data) {
                // Transform snake_case to camelCase
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    location: item.location,
                    area: item.area,
                    year: item.year,
                    images: item.project_images
                        ? item.project_images
                            .sort((a: any, b: any) => a.display_order - b.display_order)
                            .map((img: any) => img.image_url)
                        : [],
                    features: item.features || [],
                    status: item.status,
                    featured: item.featured,
                    createdAt: item.created_at,
                }));
                setProjects(transformedData as Project[]);
            }
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch projects');
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
        try {
            // Transform camelCase to snake_case
            const dbData = {
                title: projectData.title,
                description: projectData.description,
                category: projectData.category,
                location: projectData.location,
                area: projectData.area,
                year: projectData.year,
                features: projectData.features,
                status: projectData.status,
                featured: projectData.featured,
            };

            const { data, error: insertError } = await supabase
                .from('projects')
                .insert([dbData])
                .select()
                .single();

            if (insertError) throw insertError;

            // Handle project images if provided
            if (data && projectData.images && projectData.images.length > 0) {
                const imageInserts = projectData.images.map((imageUrl, index) => ({
                    project_id: data.id,
                    image_url: imageUrl,
                    display_order: index,
                }));

                const { error: imagesError } = await supabase
                    .from('project_images')
                    .insert(imageInserts);

                if (imagesError) throw imagesError;
            }

            return data;
        } catch (err) {
            console.error('Error creating project:', err);
            throw err;
        }
    };

    const updateProject = async (projectId: string, updates: Partial<Project>) => {
        try {
            // Transform camelCase to snake_case
            const dbUpdates: any = {};
            if (updates.title) dbUpdates.title = updates.title;
            if (updates.description) dbUpdates.description = updates.description;
            if (updates.category) dbUpdates.category = updates.category;
            if (updates.location) dbUpdates.location = updates.location;
            if (updates.area) dbUpdates.area = updates.area;
            if (updates.year) dbUpdates.year = updates.year;
            if (updates.features) dbUpdates.features = updates.features;
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

            const { data, error: updateError } = await supabase
                .from('projects')
                .update(dbUpdates)
                .eq('id', projectId)
                .select()
                .single();

            if (updateError) throw updateError;

            // Handle project images update if provided
            if (updates.images) {
                // Delete existing images
                await supabase
                    .from('project_images')
                    .delete()
                    .eq('project_id', projectId);

                // Insert new images
                if (updates.images.length > 0) {
                    const imageInserts = updates.images.map((imageUrl, index) => ({
                        project_id: projectId,
                        image_url: imageUrl,
                        display_order: index,
                    }));

                    const { error: imagesError } = await supabase
                        .from('project_images')
                        .insert(imageInserts);

                    if (imagesError) throw imagesError;
                }
            }

            return data;
        } catch (err) {
            console.error('Error updating project:', err);
            throw err;
        }
    };

    const deleteProject = async (projectId: string) => {
        try {
            // Project images will be deleted automatically due to ON DELETE CASCADE
            const { error: deleteError } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (deleteError) throw deleteError;
        } catch (err) {
            console.error('Error deleting project:', err);
            throw err;
        }
    };

    return {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects
    };
}
