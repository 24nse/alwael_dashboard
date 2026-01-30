// src/lib/uploadImage.ts
import { supabase } from './supabase';
export async function uploadImage(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (error) throw error;
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  return publicUrl;
}
// Usage:
// const imageUrl = await uploadImage(file, 'project-images', 'project-123');
