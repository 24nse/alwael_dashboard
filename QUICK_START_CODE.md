# 🚀 Quick Start: Copy-Paste Code Snippets

## 📋 Overview

This file contains **ready-to-use code snippets** that you can copy and paste directly into your project.

Follow the steps in order, and you'll have a fully functional dynamic website!

---

## Step 1: Create Directory Structure

```bash
# Create directories
mkdir -p src/hooks/website
mkdir -p src/components/website
```

---

## Step 2: Create Hooks

### File 1: `src/hooks/website/usePublicTeam.ts`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PublicTeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  image_url: string | null;
  bio: string | null;
  display_order: number;
}

export function usePublicTeam() {
  const [teamMembers, setTeamMembers] = useState<PublicTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;

      setTeamMembers(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  return { teamMembers, loading, error, refetch: fetchTeamMembers };
}
```

---

### File 2: `src/hooks/website/usePublicProjects.ts`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PublicProject {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  area: string | null;
  year: string | null;
  features: string[];
  status: string;
  featured: boolean;
  created_at: string;
  images: { id: string; image_url: string; display_order: number }[];
}

export function usePublicProjects(options?: { featuredOnly?: boolean; limit?: number }) {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [options?.featuredOnly, options?.limit]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('projects')
        .select(`
          *,
          images:project_images(id, image_url, display_order)
        `)
        .order('created_at', { ascending: false });

      if (options?.featuredOnly) {
        query = query.eq('featured', true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const projectsWithSortedImages = (data || []).map(project => ({
        ...project,
        images: (project.images || []).sort((a, b) => a.display_order - b.display_order)
      }));

      setProjects(projectsWithSortedImages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return { projects, loading, error, refetch: fetchProjects };
}
```

---

### File 3: `src/hooks/website/usePublicContent.ts`

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PublicContentSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  image_url: string | null;
}

export function usePublicContent(sectionKey?: string) {
  const [content, setContent] = useState<PublicContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  const fetchContent = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('content_sections')
        .select('*')
        .eq('is_active', true);

      if (sectionKey) {
        query = query.eq('section_key', sectionKey);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setContent(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSection = (key: string) => {
    return content.find(section => section.section_key === key);
  };

  return { content, loading, error, refetch: fetchContent, getSection };
}
```

---

## Step 3: Create Components

### File 4: `src/components/website/TeamSection.tsx`

```typescript
import { usePublicTeam } from '@/hooks/website/usePublicTeam';
import { Mail, Phone } from 'lucide-react';

export function TeamSection() {
  const { teamMembers, loading, error } = usePublicTeam();

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p>جاري التحميل...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">حدث خطأ في تحميل البيانات</p>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return null; // Don't show section if no team members
  }

  return (
    <section id="team" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">فريق العمل</h2>
          <p className="text-muted-foreground">
            فريق من المحترفين ذوي الخبرة الواسعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow"
            >
              {member.image_url && (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              )}
              <h3 className="font-bold text-lg text-center mb-1">
                {member.name}
              </h3>
              <p className="text-primary text-center mb-2">
                {member.position}
              </p>
              <p className="text-muted-foreground text-sm text-center mb-4">
                {member.department}
              </p>
              {member.bio && (
                <p className="text-sm text-muted-foreground mb-4">
                  {member.bio}
                </p>
              )}
              <div className="flex flex-col gap-2 text-sm">
                {member.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr">{member.phone}</span>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span dir="ltr">{member.email}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### File 5: `src/components/website/ProjectsSection.tsx`

```typescript
import { usePublicProjects } from '@/hooks/website/usePublicProjects';
import { MapPin, Calendar } from 'lucide-react';

export function ProjectsSection() {
  const { projects, loading, error } = usePublicProjects({ limit: 6 });

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p>جاري التحميل...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">حدث خطأ في تحميل المشاريع</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">مشاريعنا</h2>
          <p className="text-muted-foreground">
            نفتخر بإنجازاتنا في مجال العقارات والمقاولات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {project.images.length > 0 && (
                <img
                  src={project.images[0].image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">
                      مميز
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  {project.year && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{project.year}</span>
                    </div>
                  )}
                </div>
                {project.features.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Step 4: Update Index.tsx

Add these imports at the top of `src/pages/Index.tsx`:

```typescript
import { TeamSection } from '@/components/website/TeamSection';
import { ProjectsSection } from '@/components/website/ProjectsSection';
import { usePublicContent } from '@/hooks/website/usePublicContent';
```

Then add this inside the component:

```typescript
const Index = () => {
  // Fetch dynamic content
  const { getSection, loading } = usePublicContent();
  
  const heroSection = getSection('hero');
  const aboutSection = getSection('about');

  // ... rest of component
```

Replace the hardcoded hero title with:

```typescript
<h1 className="text-4xl md:text-6xl font-bold mb-6">
  {loading ? 'جاري التحميل...' : (heroSection?.title || 'نبني أحلامك بإتقان')}
</h1>
```

Add the TeamSection and ProjectsSection components before the contact section:

```typescript
{/* Team Section - Dynamic */}
<TeamSection />

{/* Projects Section - Dynamic */}
<ProjectsSection />
```

---

## ✅ Verification Steps

### 1. Check Hooks Work

Open browser console and run:

```javascript
// Test in browser console
const { data } = await window.supabase
  .from('team_members')
  .select('*')
  .eq('is_active', true);

console.log('Team members:', data);
```

### 2. Check Components Render

Look for:
- Team members section with real data
- Projects section with real data
- No console errors

### 3. Check Loading States

Refresh the page and verify:
- "جاري التحميل..." appears briefly
- Data loads and displays correctly

---

## 🐛 Troubleshooting

### Problem: "Cannot find module '@/hooks/website/usePublicTeam'"

**Solution:** Make sure you created the file in the correct location:
```
src/hooks/website/usePublicTeam.ts
```

### Problem: "supabase is not defined"

**Solution:** Check that `src/lib/supabase.ts` exists and exports `supabase`

### Problem: No data showing

**Solution:** 
1. Check database has data (run SQL: `SELECT * FROM team_members WHERE is_active = true;`)
2. Check RLS policies are set up correctly
3. Check browser console for errors

### Problem: "Failed to fetch team members"

**Solution:**
1. Verify Supabase URL and keys in `.env`
2. Check RLS policies allow public read
3. Check network tab in browser dev tools

---

## 📚 Next Steps

After implementing these files:

1. ✅ Test each section individually
2. ✅ Add loading skeletons for better UX
3. ✅ Add error boundaries
4. ✅ Implement forms (orders, consultations)
5. ✅ Add image optimization
6. ✅ Test on mobile devices

---

**Ready to start? Copy the code snippets above and paste them into your project!** 🚀
