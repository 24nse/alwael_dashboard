-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.team_members
    FOR SELECT
    USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.team_members
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.team_members
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.team_members
    FOR DELETE
    TO authenticated
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.team_members
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data
INSERT INTO public.team_members (name, position, department, phone, email, bio, display_order) VALUES
('نوح سعيد', 'مدير مشاريع', 'إدارة المشاريع', '770496767', 'aad@alwael.com', 'خبرة 10 سنوات في إدارة المشاريع العقارية', 1),
('أحمد محمد', 'مهندس معماري', 'الهندسة', '773123456', 'ahmed@alwael.com', 'متخصص في التصميم المعماري الحديث', 2),
('فاطمة علي', 'مديرة التسويق', 'التسويق', '775987654', 'fatima@alwael.com', 'خبيرة في التسويق العقاري الرقمي', 3)
ON CONFLICT DO NOTHING;
