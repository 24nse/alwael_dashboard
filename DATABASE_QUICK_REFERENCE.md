# 🎯 Quick Reference: Database Access Control

## 📊 Access Matrix

```
┌─────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Table               │ Public READ  │ Public WRITE │ Auth READ    │ Auth WRITE   │
├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ team_members        │ ✅ Active    │ ❌           │ ✅ All       │ ✅           │
│ projects            │ ✅ All       │ ❌           │ ✅ All       │ ✅           │
│ project_images      │ ✅ All       │ ❌           │ ✅ All       │ ✅           │
│ orders              │ ❌           │ ✅ Insert    │ ✅ All       │ ✅           │
│ consultations       │ ❌           │ ✅ Insert    │ ✅ All       │ ✅           │
│ content_sections    │ ✅ Active    │ ❌           │ ✅ All       │ ✅           │
│ users               │ ❌           │ ❌           │ ✅ All       │ ✅           │
└─────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

## 🌐 Use Cases

### Website (Public Users)

**Can READ:**
- ✅ Active team members (for "Our Team" page)
- ✅ All projects (for "Projects" portfolio)
- ✅ Active content sections (for homepage, about, etc.)

**Can WRITE:**
- ✅ Submit orders (contact form)
- ✅ Submit consultation requests

**Cannot:**
- ❌ Read inactive/draft content
- ❌ Modify any data
- ❌ Delete any data

### Admin Panel (Authenticated Users)

**Can READ:**
- ✅ Everything (all tables, all rows)

**Can WRITE:**
- ✅ Everything (INSERT/UPDATE/DELETE on all tables)

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Website Visitor                          │
│                     (No Authentication)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │   Supabase RLS     │
                    │   Checks Policies  │
                    └────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌──────────────┐
        │  READ Access  │         │ WRITE Access │
        │               │         │              │
        │ ✅ Projects   │         │ ✅ Orders    │
        │ ✅ Team       │         │ ✅ Consults  │
        │ ✅ Content    │         │              │
        └───────────────┘         └──────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                        Admin User                               │
│                  (Authenticated via Supabase Auth)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │   Supabase RLS     │
                    │   Checks: Auth OK  │
                    └────────┬───────────┘
                             │
                             ▼
                    ┌────────────────────┐
                    │   FULL ACCESS      │
                    │                    │
                    │ ✅ READ All        │
                    │ ✅ INSERT All      │
                    │ ✅ UPDATE All      │
                    │ ✅ DELETE All      │
                    └────────────────────┘
```

## 📋 Setup Checklist

- [ ] Run `complete_database_setup.sql` in Supabase SQL Editor
- [ ] Verify all 7 tables are created
- [ ] Verify RLS is enabled on all tables
- [ ] Verify policies are created (should see ~30 policies)
- [ ] Test public read from website
- [ ] Test public insert (orders/consultations)
- [ ] (Later) Implement Supabase Auth for admin
- [ ] (Later) Test authenticated access from admin panel

## 🚀 Quick Test Commands

### Test in Supabase SQL Editor:

```sql
-- 1. Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- 2. Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- 3. Check policies
SELECT tablename, policyname, cmd FROM pg_policies 
WHERE schemaname = 'public' ORDER BY tablename;

-- 4. View sample data
SELECT * FROM team_members ORDER BY display_order;
SELECT * FROM projects ORDER BY created_at DESC;
SELECT * FROM content_sections ORDER BY section_key;
```

## 🔧 Troubleshooting

### Problem: "permission denied for table X"
**Solution:** RLS is blocking access. Check if policies are created:
```sql
SELECT * FROM pg_policies WHERE tablename = 'X';
```

### Problem: "new row violates row-level security policy"
**Solution:** You're trying to write as public user to a table that requires auth.
- For development: Temporarily allow public write
- For production: Implement Supabase Auth

### Problem: Can't read data from website
**Solution:** Check if data is marked as active:
```sql
SELECT * FROM team_members WHERE is_active = true;
SELECT * FROM content_sections WHERE is_active = true;
```

## 📞 Support

For issues, check:
1. `DATABASE_STRUCTURE.md` - Full documentation
2. `complete_database_setup.sql` - The setup script
3. Supabase Dashboard → Database → Policies

---

**Last Updated:** 2026-01-31
