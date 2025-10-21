-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('SEEKER', 'EMPLOYER', 'OFFICER', 'ADMIN');
create type job_status as enum ('ACTIVE', 'DRAFT', 'CLOSED');
create type application_status as enum ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED');
create type service_category as enum ('HOUSING', 'EDUCATION', 'HEALTH', 'LEGAL', 'OTHER');

-- Users/Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role user_role not null default 'SEEKER',
  phone text,
  location text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Jobs table
create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company text not null,
  location text not null,
  description text not null,
  requirements text,
  salary_range text,
  employment_type text,
  status job_status default 'ACTIVE',
  employer_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Applications table
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  status application_status default 'PENDING',
  cover_letter text,
  resume_url text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(seeker_id, job_id)
);

-- Messages table
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  subject text,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Services table
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category service_category not null,
  contact_email text not null,
  contact_phone text,
  location text not null,
  address text,
  description text not null,
  website_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index if not exists idx_jobs_employer on public.jobs(employer_id);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_applications_seeker on public.applications(seeker_id);
create index if not exists idx_applications_job on public.applications(job_id);
create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_messages_receiver on public.messages(receiver_id);
create index if not exists idx_services_category on public.services(category);
