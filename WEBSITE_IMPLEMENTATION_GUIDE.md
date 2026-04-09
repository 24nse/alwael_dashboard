# 🌐 End-User Website Implementation Guide

## 📋 Overview

This guide shows you how to implement **data reading from Supabase** in your end-user website (the public-facing pages, not the admin panel).

Based on your database structure, the website will display:
- ✅ Team members
- ✅ Projects portfolio
- ✅ Dynamic content sections
- ✅ Allow users to submit orders and consultation requests

---

## 🗂️ Current Website Structure

Your website (`src/pages/Index.tsx`) currently has **static/hardcoded** data:

```tsx
// ❌ Current: Hardcoded data
{[
  { icon: '🏗️', title: 'البناء والمقاولات', desc: '...' },
  { icon: '🏢', title: 'التطوير العقاري', desc: '...' },
  // ...
].map((service, index) => (
  <div key={index}>...</div>
))}
```

We need to change this to **dynamic data from Supabase**.

---

## 🎯 Implementation Plan

### Phase 1: Create Data Hooks (Custom Hooks)
Create reusable hooks to fetch data from Supabase

### Phase 2: Create Display Components
Create components to display the data

### Phase 3: Update Index Page
Replace hardcoded data with dynamic data

### Phase 4: Add Forms
Add forms for orders and consultations

---

## 📁 File Structure

We'll create these new files:

```
src/
├── hooks/
│   ├── website/
│   │   ├── usePublicTeam.ts          ← Fetch team members
│   │   ├── usePublicProjects.ts      ← Fetch projects
│   │   ├── usePublicContent.ts       ← Fetch content sections
│   │   └── usePublicForms.ts         ← Submit orders/consultations
│
├── components/
│   ├── website/
│   │   ├── TeamSection.tsx           ← Display team members
│   │   ├── ProjectsSection.tsx       ← Display projects
│   │   ├── HeroSection.tsx           ← Dynamic hero section
│   │   ├── AboutSection.tsx          ← Dynamic about section
│   │   ├── OrderForm.tsx             ← Order submission form
│   │   └── ConsultationForm.tsx      ← Consultation form
│
└── pages/
    └── Index.tsx                      ← Updated main page
```

---

## 🔧 Step-by-Step Implementation

### Step 1: Create Public Data Hooks

#### 1.1 Create `usePublicTeam.ts`

**File:** `src/hooks/website/usePublicTeam.ts`

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
      
      // Fetch only ACTIVE team members (public can only see active)
      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)  // Only active members
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

#### 1.2 Create `usePublicProjects.ts`

**File:** `src/hooks/website/usePublicProjects.ts`

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

      // Filter by featured if requested
      if (options?.featuredOnly) {
        query = query.eq('featured', true);
      }

      // Limit results if requested
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Sort images by display_order
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

#### 1.3 Create `usePublicContent.ts`

**File:** `src/hooks/website/usePublicContent.ts`

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
        .eq('is_active', true);  // Only active content

      // Filter by section_key if provided
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

  // Helper to get a single section by key
  const getSection = (key: string) => {
    return content.find(section => section.section_key === key);
  };

  return { content, loading, error, refetch: fetchContent, getSection };
}
```

---

#### 1.4 Create `usePublicForms.ts`

**File:** `src/hooks/website/usePublicForms.ts`

```typescript
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface OrderFormData {
  customer_name: string;
  phone: string;
  email?: string;
  property_type: string;
  location: string;
  budget?: string;
  message?: string;
}

export interface ConsultationFormData {
  customer_name: string;
  phone: string;
  email?: string;
  consultation_type: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
}

export function usePublicForms() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submitOrder = async (formData: OrderFormData) => {
    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.customer_name,
          phone: formData.phone,
          email: formData.email,
          property_type: formData.property_type,
          location: formData.location,
          budget: formData.budget,
          message: formData.message,
          status: 'new'
        }]);

      if (error) throw error;

      toast({
        title: 'تم إرسال الطلب بنجاح',
        description: 'سنتواصل معك في أقرب وقت ممكن',
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل إرسال الطلب';
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  const submitConsultation = async (formData: ConsultationFormData) => {
    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('consultations')
        .insert([{
          customer_name: formData.customer_name,
          phone: formData.phone,
          email: formData.email,
          consultation_type: formData.consultation_type,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          message: formData.message,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: 'تم إرسال طلب الاستشارة بنجاح',
        description: 'سنتواصل معك لتحديد موعد الاستشارة',
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل إرسال طلب الاستشارة';
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  return { submitOrder, submitConsultation, submitting };
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    End-User Website                         │
│                    (Public Pages)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Uses Custom Hooks
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│usePublicTeam │ │usePublicProj │ │usePublicCont │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       │ Supabase       │ Supabase       │ Supabase
       │ Client         │ Client         │ Client
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Supabase RLS    │
              │  Checks Policies │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │  Returns Data    │
              │  (Active Only)   │
              └──────────────────┘
```

---

## 🎨 Component Examples

### Example: TeamSection Component

**File:** `src/components/website/TeamSection.tsx`

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

## 📝 Updated Index.tsx Example

**File:** `src/pages/Index.tsx` (partial update)

```typescript
import { usePublicContent } from '@/hooks/website/usePublicContent';
import { TeamSection } from '@/components/website/TeamSection';
import { ProjectsSection } from '@/components/website/ProjectsSection';

const Index = () => {
  // Fetch dynamic content
  const { getSection, loading } = usePublicContent();
  
  const heroSection = getSection('hero');
  const aboutSection = getSection('about');

  return (
    <div className="min-h-screen bg-background">
      {/* Header - same as before */}
      <header>...</header>

      {/* Hero Section - Now Dynamic */}
      <section id="home" className="...">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {loading ? 'جاري التحميل...' : (heroSection?.title || 'نبني أحلامك بإتقان')}
          </h1>
          <p className="text-xl md:text-2xl text-secondary-foreground/80 mb-8 max-w-3xl mx-auto">
            {loading ? '' : (heroSection?.content || 'مؤسسة رائدة في مجال العقارات والمقاولات')}
          </p>
          {/* Buttons */}
        </div>
      </section>

      {/* About Section - Now Dynamic */}
      <section id="about" className="...">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {aboutSection?.title || 'من نحن'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {aboutSection?.content || 'مؤسسة الوعل للعقارات والمقاولات...'}
            </p>
          </div>
          {/* Stats - can be dynamic too */}
        </div>
      </section>

      {/* Team Section - Now Dynamic */}
      <TeamSection />

      {/* Projects Section - Now Dynamic */}
      <ProjectsSection />

      {/* Footer - same as before */}
      <footer>...</footer>
    </div>
  );
};

export default Index;
```

---

## ✅ Implementation Checklist

### Phase 1: Setup (Complete)
- [x] Database structure created
- [x] RLS policies configured
- [x] Sample data added

### Phase 2: Create Hooks
- [ ] Create `src/hooks/website/` directory
- [ ] Create `usePublicTeam.ts`
- [ ] Create `usePublicProjects.ts`
- [ ] Create `usePublicContent.ts`
- [ ] Create `usePublicForms.ts`

### Phase 3: Create Components
- [ ] Create `src/components/website/` directory
- [ ] Create `TeamSection.tsx`
- [ ] Create `ProjectsSection.tsx`
- [ ] Create `HeroSection.tsx`
- [ ] Create `OrderForm.tsx`
- [ ] Create `ConsultationForm.tsx`

### Phase 4: Update Pages
- [ ] Update `Index.tsx` to use dynamic data
- [ ] Replace hardcoded content with database content
- [ ] Add loading states
- [ ] Add error handling

### Phase 5: Testing
- [ ] Test team members display
- [ ] Test projects display
- [ ] Test content sections
- [ ] Test order form submission
- [ ] Test consultation form submission

---

## 🔍 Testing Guide

### Test 1: Verify Data Fetching

```typescript
// In browser console
import { supabase } from '@/lib/supabase';

// Test team members
const { data, error } = await supabase
  .from('team_members')
  .select('*')
  .eq('is_active', true);

console.log('Team members:', data);
```

### Test 2: Verify Form Submission

```typescript
// Test order submission
const { data, error } = await supabase
  .from('orders')
  .insert([{
    customer_name: 'Test User',
    phone: '1234567890',
    property_type: 'Villa',
    location: 'Mukalla',
    message: 'Test order'
  }]);

console.log('Order submitted:', data, error);
```

---

## 📚 Next Steps

1. **Create the hooks** - Start with `usePublicTeam.ts`
2. **Create components** - Build `TeamSection.tsx` first
3. **Update Index.tsx** - Replace one section at a time
4. **Test thoroughly** - Verify each section works
5. **Add loading states** - Improve UX with skeletons
6. **Add error handling** - Handle network errors gracefully

---

**Ready to implement? Start with Step 1: Create the hooks!** 🚀
