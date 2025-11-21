# Database Schema

## Tables

### profiles
- `id`: UUID (PK, FK auth.users.id)
- `role`: VARCHAR ('job_seeker', 'employer', 'officer', 'admin')
- `full_name`: VARCHAR
- `bio`: TEXT
- `avatar_url`: VARCHAR
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### jobs
- `id`: UUID (PK)
- `created_by`: UUID (FK profiles.id)
- `title`: VARCHAR (indexed)
- `description`: TEXT
- `salary_min`: DECIMAL
- `salary_max`: DECIMAL
- `location`: VARCHAR (indexed)
- `employment_type`: VARCHAR
- `status`: VARCHAR ('active', 'draft', 'closed')
- `created_at`: TIMESTAMP (indexed)
- `updated_at`: TIMESTAMP

### applications
- `id`: UUID (PK)
- `job_id`: UUID (FK jobs.id)
- `applicant_id`: UUID (FK profiles.id)
- `status`: VARCHAR ('applied', 'reviewed', 'accepted', 'rejected')
- `cover_letter`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### messages
- `id`: UUID (PK)
- `sender_id`: UUID (FK profiles.id)
- `recipient_id`: UUID (FK profiles.id)
- `content`: TEXT
- `is_read`: BOOLEAN
- `created_at`: TIMESTAMP

### services
- `id`: UUID (PK)
- `name`: VARCHAR
- `description`: TEXT
- `category`: VARCHAR
- `contact_info`: VARCHAR
- `created_at`: TIMESTAMP

### audit_logs
- `id`: BIGINT (PK)
- `action`: VARCHAR
- `user_id`: UUID (FK profiles.id)
- `resource_type`: VARCHAR
- `resource_id`: UUID
- `changes`: JSONB
- `status`: VARCHAR
- `ip_address`: INET
- `user_agent`: TEXT
- `created_at`: TIMESTAMP
