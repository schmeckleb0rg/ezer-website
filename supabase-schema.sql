-- ============================================================
-- Ezer Enterprises - Supabase Database Schema
-- Run this in the Supabase SQL Editor after creating your project
-- ============================================================

-- Enable Row Level Security on all tables
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- ADMIN USERS TABLE
-- ============================================================
create table if not exists admin_users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  role text default 'editor' check (role in ('super_admin', 'admin', 'editor')),
  created_at timestamptz default now(),
  last_login timestamptz
);

-- RLS: Only service role can access admin_users
alter table admin_users enable row level security;

-- ============================================================
-- SITE CONTENT TABLE (CMS)
-- ============================================================
create table if not exists site_content (
  id uuid default uuid_generate_v4() primary key,
  section_key text unique not null, -- e.g., 'hero_title', 'hero_subtitle', 'mission_text'
  page text not null default 'home', -- 'home', 'ezerguard-od', 'ezerguard-military', 'ezerguard-cd'
  content_type text default 'text' check (content_type in ('text', 'rich_text', 'image_url', 'number', 'json')),
  value text not null,
  label text, -- Human-readable label for admin UI
  sort_order int default 0,
  updated_at timestamptz default now(),
  updated_by uuid references admin_users(id)
);

alter table site_content enable row level security;

-- Allow public read access to site content
create policy "Public can read site content"
  on site_content for select
  using (true);

-- ============================================================
-- INVESTOR INQUIRIES TABLE
-- ============================================================
create table if not exists investor_inquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  company text,
  phone text,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'in_progress', 'closed')),
  created_at timestamptz default now()
);

alter table investor_inquiries enable row level security;

-- Allow inserts from public (contact form)
create policy "Public can submit inquiries"
  on investor_inquiries for insert
  with check (true);

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================
create table if not exists audit_log (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references admin_users(id),
  action text not null, -- 'login', 'update_content', 'create', 'delete'
  table_name text,
  record_id uuid,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  created_at timestamptz default now()
);

alter table audit_log enable row level security;

-- ============================================================
-- TEAM MEMBERS TABLE
-- ============================================================
create table if not exists team_members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title text not null, -- e.g., 'CEO', 'CTO, CIPO'
  bio text, -- education and background info
  photo_url text, -- URL to uploaded photo
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references admin_users(id)
);

alter table team_members enable row level security;

-- Allow public read access
create policy "Public can read team members"
  on team_members for select
  using (true);

-- Seed team members
insert into team_members (name, title, bio, sort_order) values
  ('Irving Kaplan, MD', 'CEO', 'Radiation Oncologist - Harvard Medical School
Education: undergrad- University of Rochester
MD- Stanford University Medical School', 1),
  ('Howie Zaretsky, BEE, MSEE, JD', 'CTO, CIPO', 'Brooklyn Law School (JD, 1994)
Polytechnic University of New York (MSEE, 1987)
State University of New York (SUNY) at Stony Brook (BEE, 1983)', 2),
  ('Ed Holpuka, PhD', 'CSO', 'PhD Physics (Brown)
MA in Mathematics (Boston University) Undergrad (Clark University)', 3)
on conflict do nothing;

-- ============================================================
-- SEED INITIAL CONTENT
-- ============================================================
insert into site_content (section_key, page, content_type, value, label, sort_order) values
  ('hero_title', 'home', 'text', 'Life-Saving Medication, Delivered Instantly', 'Hero Title', 1),
  ('hero_subtitle', 'home', 'text', 'Ezer Enterprises is developing wearable devices that autonomously deliver critical medications when every second counts — even when the wearer cannot act.', 'Hero Subtitle', 2),
  ('hero_stat_1_value', 'home', 'text', '81,000+', 'Hero Stat 1 Value', 3),
  ('hero_stat_1_label', 'home', 'text', 'US opioid deaths in 2023', 'Hero Stat 1 Label', 4),
  ('hero_stat_2_value', 'home', 'text', '69-75%', 'Hero Stat 2 Value', 5),
  ('hero_stat_2_label', 'home', 'text', 'Overdose deaths when alone', 'Hero Stat 2 Label', 6),
  ('mission_title', 'home', 'text', 'When Minutes Matter, Our Technology Acts', 'Mission Title', 10),
  ('mission_text', 'home', 'rich_text', 'In emergency situations, drugs such as antidotes for opioid overdose or chemical warfare agents must be delivered immediately. The person in danger is often unconscious and cannot self-administer these medications. Our wearable devices solve this critical gap.', 'Mission Text', 11),
  ('investor_title', 'home', 'text', 'Join Us in Saving Lives', 'Investor CTA Title', 20),
  ('investor_text', 'home', 'rich_text', 'Ezer Enterprises is seeking strategic partners and investors to bring our life-saving wearable technology from vision to reality.', 'Investor CTA Text', 21)
on conflict (section_key) do nothing;

-- ============================================================
-- PAGE IMAGES TABLE (for uploadable media zones)
-- ============================================================
create table if not exists page_images (
  id uuid default uuid_generate_v4() primary key,
  page text not null,
  image_key text not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(page, image_key)
);

alter table page_images enable row level security;

create policy "Public can read page images"
  on page_images for select
  using (true);
