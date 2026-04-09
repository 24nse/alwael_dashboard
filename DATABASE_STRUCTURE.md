# 🗄️ Database Structure & Security Guide

## 📊 Overview

This database is designed with **security-first** approach using Row Level Security (RLS):

- **Public Users** (website visitors) can **READ** data
- **Authenticated Users** (admin panel) can **CREATE/UPDATE/DELETE** data

---

## 🏗️ Database Tables

### 1. **team_members** - Team Members
Stores information about company team members displayed on the website.

**Columns:**
- `id` - UUID (auto-generated)
- `name` - Team member name
- `position` - Job position
- `department` - Department
- `phone` - Phone number
- `email` - Email address
- `image_url` - Profile image URL
- `bio` - Biography
- `is_active` - Active status (boolean)
- `display_order` - Display order (integer)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**RLS Policies:**
- ✅ **Public**: Can read **active** members only
- ✅ **Authenticated**: Can read ALL members
- ✅ **Authenticated**: Can INSERT/UPDATE/DELETE

---

### 2. **projects** - Projects Portfolio
Stores company projects displayed on the website.

**Columns:**
- `id` - UUID
- `title` - Project title
- `description` - Project description
- `category` - Category (e.g., 'سكني', 'تجاري')
- `location` - Project location
- `area` - Project area
- `year` - Completion year
- `features` - Array of features
- `status` - Status: 'planning', 'in_progress', 'completed', 'on_hold'
- `featured` - Featured project (boolean)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**RLS Policies:**
- ✅ **Public**: Can read ALL projects
- ✅ **Authenticated**: Can INSERT/UPDATE/DELETE

---

### 3. **project_images** - Project Images
Stores multiple images for each project.

**Columns:**
- `id` - UUID
- `project_id` - Foreign key to projects table
- `image_url` - Image URL
- `display_order` - Display order
- `created_at` - Creation timestamp

**RLS Policies:**
- ✅ **Public**: Can read ALL images
- ✅ **Authenticated**: Can INSERT/UPDATE/DELETE

---

### 4. **orders** - Customer Orders
Stores customer orders submitted from the website.

**Columns:**
- `id` - UUID
- `customer_name` - Customer name
- `phone` - Phone number
- `email` - Email address
- `property_type` - Type of property
- `location` - Desired location
- `budget` - Budget
- `message` - Additional message
- `status` - Status: 'new', 'in_progress', 'completed', 'archived'
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**RLS Policies:**
- ✅ **Public**: Can INSERT (submit orders from website)
- ✅ **Authenticated**: Can READ/UPDATE/DELETE

---

### 5. **consultations** - Consultation Requests
Stores consultation requests from website visitors.

**Columns:**
- `id` - UUID
- `customer_name` - Customer name
- `phone` - Phone number
- `email` - Email address
- `consultation_type` - Type of consultation
- `preferred_date` - Preferred date
- `preferred_time` - Preferred time
- `message` - Additional message
- `status` - Status: 'pending', 'scheduled', 'completed', 'cancelled'
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**RLS Policies:**
- ✅ **Public**: Can INSERT (submit consultations from website)
- ✅ **Authenticated**: Can READ/UPDATE/DELETE

---

### 6. **content_sections** - Website Content
Stores dynamic content sections for the website.

**Columns:**
- `id` - UUID
- `section_key` - Unique key (e.g., 'hero', 'about', 'services')
- `title` - Section title
- `content` - Section content
- `image_url` - Section image URL
- `is_active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**RLS Policies:**
- ✅ **Public**: Can read **active** content only
- ✅ **Authenticated**: Can read ALL content
- ✅ **Authenticated**: Can INSERT/UPDATE/DELETE

---

### 7. **users** - Admin Users
Stores admin user accounts.

**Columns:**
- `id` - UUID
- `name` - User name
- `email` - Email (unique)
- `role` - Role: 'super_admin', 'admin', 'editor'
- `avatar_url` - Avatar image URL
- `is_active` - Active status
- `last_login` - Last login timestamp
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**RLS Policies:**
- ✅ **Authenticated**: Can READ all users
- ✅ **Authenticated**: Can INSERT/UPDATE/DELETE

---

## 🔐 Security Model

### Row Level Security (RLS)

All tables have RLS enabled with the following pattern:

```sql
-- Example for team_members table

-- Public can read ACTIVE members (for website)
CREATE POLICY "Public can read active team members" 
    ON public.team_members
    FOR SELECT
    USING (is_active = true);

-- Authenticated can read ALL members (for admin)
CREATE POLICY "Authenticated can read all team members" 
    ON public.team_members
    FOR SELECT
    TO authenticated
    USING (true);

-- Authenticated can write
CREATE POLICY "Authenticated can insert team members" 
    ON public.team_members
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
```

### Access Levels

| User Type | Read | Insert | Update | Delete |
|-----------|------|--------|--------|--------|
| **Public** (website visitors) | ✅ Active data only | ✅ Orders & Consultations | ❌ | ❌ |
| **Authenticated** (admin) | ✅ All data | ✅ All tables | ✅ All tables | ✅ All tables |

---

## 🚀 Setup Instructions

### Step 1: Run the Complete Setup Script

1. Open Supabase SQL Editor
2. Copy the entire content of `complete_database_setup.sql`
3. Run the script
4. Wait for "Success" message

### Step 2: Verify Tables

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

### Step 3: Test Access

**Test Public Read:**
```sql
-- This should work (public can read active team members)
SELECT * FROM team_members WHERE is_active = true;

-- This should work (public can read all projects)
SELECT * FROM projects;
```

**Test Public Write:**
```sql
-- This should work (public can insert orders)
INSERT INTO orders (customer_name, phone, property_type, location, message)
VALUES ('Test Customer', '1234567890', 'Villa', 'Mukalla', 'Test order');

-- This should work (public can insert consultations)
INSERT INTO consultations (customer_name, phone, consultation_type, message)
VALUES ('Test Customer', '1234567890', 'Real Estate', 'Test consultation');
```

---

## 📱 Frontend Integration

### For Public Website (End Users)

```typescript
// Read team members (no auth required)
const { data: teamMembers } = await supabase
  .from('team_members')
  .select('*')
  .eq('is_active', true)
  .order('display_order');

// Read projects (no auth required)
const { data: projects } = await supabase
  .from('projects')
  .select('*, project_images(*)')
  .order('created_at', { ascending: false });

// Submit order (no auth required)
const { data, error } = await supabase
  .from('orders')
  .insert({
    customer_name: 'John Doe',
    phone: '1234567890',
    property_type: 'Villa',
    location: 'Mukalla',
    message: 'I want to buy a villa'
  });
```

### For Admin Panel (Authenticated Users)

```typescript
// First, authenticate
const { data: { user } } = await supabase.auth.signInWithPassword({
  email: 'admin@alwael.com',
  password: 'password'
});

// Now you can read/write everything
const { data: allMembers } = await supabase
  .from('team_members')
  .select('*')
  .order('display_order');

// Update team member
const { error } = await supabase
  .from('team_members')
  .update({ is_active: false })
  .eq('id', memberId);

// Delete team member
const { error } = await supabase
  .from('team_members')
  .delete()
  .eq('id', memberId);
```

---

## ⚠️ Current Limitation

**IMPORTANT:** The current setup uses RLS policies that check for `authenticated` users, but your app **doesn't have authentication yet**.

### Temporary Solution (Development Only)

For development, you can temporarily allow public write access:

```sql
-- WARNING: Only for development!
-- Replace authenticated policies with public policies

DROP POLICY "Authenticated can insert team members" ON public.team_members;
CREATE POLICY "Public can insert team members" ON public.team_members
    FOR INSERT
    WITH CHECK (true);

-- Repeat for UPDATE and DELETE policies
```

### Permanent Solution (Production)

Implement Supabase Authentication:

1. **Enable Email Auth in Supabase:**
   - Go to Authentication → Providers
   - Enable Email provider

2. **Create Admin Users:**
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('admin@alwael.com', crypt('your_password', gen_salt('bf')), now());
   ```

3. **Add Login to Your App:**
   ```typescript
   const { data, error } = await supabase.auth.signInWithPassword({
     email: 'admin@alwael.com',
     password: 'your_password'
   });
   ```

---

## 📊 Sample Data Included

The setup script includes sample data:
- ✅ 5 team members
- ✅ 3 content sections (hero, about, services)
- ✅ 3 sample projects

---

## 🔄 Auto-Update Timestamps

All tables have automatic `updated_at` timestamp updates via triggers:

```sql
CREATE TRIGGER set_updated_at 
    BEFORE UPDATE ON public.team_members 
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();
```

---

## 📝 Next Steps

1. ✅ Run `complete_database_setup.sql` in Supabase
2. ✅ Verify tables and policies
3. ✅ Test public read access from website
4. ⏳ Implement Supabase Auth for admin panel
5. ⏳ Update RLS policies after implementing auth

---

**Created:** 2026-01-31  
**Status:** Ready for deployment
