# API Documentation

## Overview

The Second Chance Connect API is built on Next.js API routes with Supabase backend. All endpoints require authentication unless otherwise noted.

**Base URL**: `https://your-domain.com/api`  
**Authentication**: Session-based via Supabase Auth  
**Content-Type**: `application/json`

## Authentication

All authenticated endpoints require a valid session cookie. Authentication is handled by Supabase Auth.

### Headers

\`\`\`
Cookie: sb-<project-ref>-auth-token=<token>
Content-Type: application/json
\`\`\`

### Error Responses

\`\`\`json
{
  "error": "Unauthorized"
}
\`\`\`

**Status Codes**:
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but insufficient permissions
- `404 Not Found` - Resource not found
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

---

## Jobs API

### List Jobs

Get a list of job postings with optional filters.

**Endpoint**: `GET /api/jobs`

**Query Parameters**:
- `status` (optional) - Filter by status: `ACTIVE`, `DRAFT`, `CLOSED`
- `employerId` (optional) - Filter by employer UUID
- `search` (optional) - Search in title, company, description

**Request Example**:
\`\`\`bash
curl -X GET \
  'https://your-domain.com/api/jobs?status=ACTIVE&search=developer' \
  -H 'Cookie: sb-auth-token=...'
\`\`\`

**Response**: `200 OK`
\`\`\`json
{
  "jobs": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Software Developer",
      "company": "Tech Company Inc",
      "location": "Remote",
      "description": "We're hiring...",
      "requirements": "2+ years experience",
      "salary_range": "$60k-$80k",
      "employment_type": "FULL_TIME",
      "status": "ACTIVE",
      "employer_id": "uuid",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z",
      "profiles": {
        "name": "Jane Employer",
        "location": "New York, NY"
      }
    }
  ]
}
\`\`\`

**Errors**:
- `401` - Not authenticated
- `500` - Server error

---

### Create Job

Create a new job posting (Employer role only).

**Endpoint**: `POST /api/jobs`

**Request Body**:
\`\`\`json
{
  "title": "Software Developer",
  "company": "Tech Company Inc",
  "location": "Remote",
  "description": "We're looking for...",
  "requirements": "2+ years experience",
  "salary_range": "$60k-$80k",
  "employment_type": "FULL_TIME",
  "status": "ACTIVE"
}
\`\`\`

**Required Fields**: `title`, `company`, `location`, `description`

**Response**: `201 Created`
\`\`\`json
{
  "job": {
    "id": "uuid",
    "title": "Software Developer",
    "company": "Tech Company Inc",
    "location": "Remote",
    "description": "We're looking for...",
    "requirements": "2+ years experience",
    "salary_range": "$60k-$80k",
    "employment_type": "FULL_TIME",
    "status": "ACTIVE",
    "employer_id": "uuid",
    "created_at": "2025-01-20T10:00:00Z",
    "updated_at": "2025-01-20T10:00:00Z"
  }
}
\`\`\`

**Errors**:
- `400` - Missing required fields
- `401` - Not authenticated
- `403` - Not an employer
- `500` - Server error

---

### Get Job Details

Get details of a specific job posting.

**Endpoint**: `GET /api/jobs/[id]`

**Path Parameters**:
- `id` - Job UUID

**Response**: `200 OK`
\`\`\`json
{
  "job": {
    "id": "uuid",
    "title": "Software Developer",
    ...
  }
}
\`\`\`

**Errors**:
- `401` - Not authenticated
- `404` - Job not found
- `500` - Server error

---

### Update Job

Update an existing job posting (Owner only).

**Endpoint**: `PATCH /api/jobs/[id]`

**Request Body**:
\`\`\`json
{
  "title": "Senior Software Developer",
  "status": "CLOSED"
}
\`\`\`

**Response**: `200 OK`
\`\`\`json
{
  "job": {
    "id": "uuid",
    "title": "Senior Software Developer",
    ...
  }
}
\`\`\`

**Errors**:
- `401` - Not authenticated
- `403` - Not the job owner
- `404` - Job not found
- `500` - Server error

---

### Delete Job

Delete a job posting (Owner only).

**Endpoint**: `DELETE /api/jobs/[id]`

**Response**: `200 OK`
\`\`\`json
{
  "message": "Job deleted successfully"
}
\`\`\`

**Errors**:
- `401` - Not authenticated
- `403` - Not the job owner
- `404` - Job not found
- `500` - Server error

---

## Applications API

### List Applications

Get applications filtered by user role.

**Endpoint**: `GET /api/applications`

**Query Parameters**:
- `seekerId` (optional) - Filter by seeker UUID
- `jobId` (optional) - Filter by job UUID
- `status` (optional) - Filter by status: `PENDING`, `REVIEWED`, `ACCEPTED`, `REJECTED`

**Response**: `200 OK`
\`\`\`json
{
  "applications": [
    {
      "id": "uuid",
      "seeker_id": "uuid",
      "job_id": "uuid",
      "status": "PENDING",
      "cover_letter": "I am interested...",
      "resume_url": "https://...",
      "notes": null,
      "created_at": "2025-01-20T10:00:00Z",
      "updated_at": "2025-01-20T10:00:00Z",
      "jobs": {
        "title": "Software Developer",
        "company": "Tech Company Inc"
      },
      "profiles": {
        "name": "John Seeker",
        "location": "Boston, MA"
      }
    }
  ]
}
\`\`\`

---

### Create Application

Submit a job application (Seeker role only).

**Endpoint**: `POST /api/applications`

**Request Body**:
\`\`\`json
{
  "job_id": "uuid",
  "cover_letter": "I am interested...",
  "resume_url": "https://storage.../resume.pdf"
}
\`\`\`

**Required Fields**: `job_id`

**Response**: `201 Created`
\`\`\`json
{
  "application": {
    "id": "uuid",
    "seeker_id": "uuid",
    "job_id": "uuid",
    "status": "PENDING",
    ...
  }
}
\`\`\`

**Errors**:
- `400` - Missing job_id or duplicate application
- `401` - Not authenticated
- `403` - Not a seeker
- `500` - Server error

---

### Update Application

Update application status or details.

**Endpoint**: `PATCH /api/applications/[id]`

**Request Body** (Seeker):
\`\`\`json
{
  "cover_letter": "Updated letter",
  "resume_url": "https://..."
}
\`\`\`

**Request Body** (Employer):
\`\`\`json
{
  "status": "ACCEPTED",
  "notes": "Great candidate"
}
\`\`\`

**Response**: `200 OK`
\`\`\`json
{
  "application": { ... }
}
\`\`\`

---

## Messages API

### List Messages

Get user's messages (sent and received).

**Endpoint**: `GET /api/messages`

**Query Parameters**:
- `conversationWith` (optional) - Filter messages with specific user UUID

**Response**: `200 OK`
\`\`\`json
{
  "messages": [
    {
      "id": "uuid",
      "sender_id": "uuid",
      "receiver_id": "uuid",
      "subject": "Application Follow-up",
      "content": "Thank you for applying...",
      "read": false,
      "created_at": "2025-01-20T10:00:00Z",
      "sender": {
        "name": "Jane Employer",
        "role": "EMPLOYER"
      },
      "receiver": {
        "name": "John Seeker",
        "role": "SEEKER"
      }
    }
  ]
}
\`\`\`

---

### Send Message

Send a message to another user.

**Endpoint**: `POST /api/messages`

**Request Body**:
\`\`\`json
{
  "receiver_id": "uuid",
  "subject": "Application Follow-up",
  "content": "Thank you for applying..."
}
\`\`\`

**Required Fields**: `receiver_id`, `content`

**Response**: `201 Created`
\`\`\`json
{
  "message": {
    "id": "uuid",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "subject": "Application Follow-up",
    "content": "Thank you for applying...",
    "read": false,
    "created_at": "2025-01-20T10:00:00Z"
  }
}
\`\`\`

---

### Mark Message as Read

Mark a received message as read.

**Endpoint**: `PATCH /api/messages/[id]`

**Request Body**:
\`\`\`json
{
  "read": true
}
\`\`\`

**Response**: `200 OK`

---

## Services API

### List Services

Get support services directory (Public - no auth required).

**Endpoint**: `GET /api/services`

**Query Parameters**:
- `category` (optional) - Filter by category: `HOUSING`, `EDUCATION`, `HEALTH`, `LEGAL`, `OTHER`
- `location` (optional) - Filter by location
- `search` (optional) - Search in name, description

**Response**: `200 OK`
\`\`\`json
{
  "services": [
    {
      "id": "uuid",
      "name": "Second Chance Housing",
      "category": "HOUSING",
      "contact_email": "info@housing.org",
      "contact_phone": "+1-555-0100",
      "location": "Boston, MA",
      "address": "123 Main St",
      "description": "Affordable housing for formerly incarcerated individuals",
      "website_url": "https://housing.org",
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

---

## Admin APIs (Future)

### Analytics Endpoint

Get platform analytics (Admin only).

**Endpoint**: `GET /api/admin/analytics`

**Query Parameters**:
- `startDate` - Start date (ISO 8601)
- `endDate` - End date (ISO 8601)
- `metric` - Metric type: `users`, `jobs`, `applications`, `placements`

**Response**: `200 OK`
\`\`\`json
{
  "metrics": {
    "totalUsers": 1250,
    "newUsersThisMonth": 85,
    "activeJobs": 142,
    "totalApplications": 3420,
    "successfulPlacements": 156,
    "usersByRole": {
      "SEEKER": 890,
      "EMPLOYER": 320,
      "OFFICER": 35,
      "ADMIN": 5
    }
  }
}
\`\`\`

---

## Rate Limiting

API rate limits (per IP address):
- **Authenticated requests**: 100 requests per minute
- **Unauthenticated requests**: 20 requests per minute
- **POST requests**: 20 requests per minute

**Rate Limit Headers**:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
\`\`\`

**Rate Limit Response**: `429 Too Many Requests`
\`\`\`json
{
  "error": "Too many requests, please try again later",
  "retryAfter": 60
}
\`\`\`

---

## Webhooks (Future)

Event-driven webhooks for integrations.

### Events

- `application.created` - New application submitted
- `application.updated` - Application status changed
- `job.created` - New job posted
- `message.received` - New message received

### Payload Format

\`\`\`json
{
  "event": "application.created",
  "timestamp": "2025-01-20T10:00:00Z",
  "data": {
    "id": "uuid",
    "job_id": "uuid",
    "seeker_id": "uuid",
    "status": "PENDING"
  }
}
\`\`\`

---

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_CREDENTIALS` | Invalid login credentials |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `INVALID_INPUT` | Invalid request data |
| `RESOURCE_NOT_FOUND` | Requested resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## SDK / Client Libraries (Future)

### JavaScript/TypeScript

\`\`\`typescript
import { SecondChanceAPI } from '@second-chance/api-client'

const client = new SecondChanceAPI({
  apiUrl: 'https://your-domain.com/api',
  auth: { /* auth config */ }
})

// List jobs
const jobs = await client.jobs.list({ status: 'ACTIVE' })

// Create application
const app = await client.applications.create({
  job_id: 'uuid',
  cover_letter: '...'
})
\`\`\`

---

## Best Practices

### Error Handling

\`\`\`javascript
try {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Request failed')
  }
  
  const data = await response.json()
  return data.job
} catch (error) {
  console.error('Failed to create job:', error)
  // Handle error appropriately
}
\`\`\`

### Pagination (Future)

\`\`\`javascript
// Future implementation
const response = await fetch('/api/jobs?page=2&perPage=20')
const data = await response.json()

// Response includes pagination metadata
{
  "jobs": [...],
  "pagination": {
    "page": 2,
    "perPage": 20,
    "total": 150,
    "totalPages": 8
  }
}
\`\`\`

### Caching

- GET requests are cacheable
- Cache-Control headers respected
- ETags supported for efficient updates

---

## Testing

### Using curl

\`\`\`bash
# List jobs
curl -X GET 'https://your-domain.com/api/jobs?status=ACTIVE' \
  -H 'Cookie: sb-auth-token=...'

# Create job
curl -X POST 'https://your-domain.com/api/jobs' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: sb-auth-token=...' \
  -d '{
    "title": "Test Job",
    "company": "Test Co",
    "location": "Remote",
    "description": "Test description"
  }'
\`\`\`

### Using JavaScript

\`\`\`javascript
// Using fetch
const response = await fetch('/api/jobs', {
  method: 'GET',
  credentials: 'include' // Include cookies
})
const data = await response.json()
\`\`\`

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-22  
**Next Review**: 2025-04-22
