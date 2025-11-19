# API Documentation

## Overview

This document describes the REST API endpoints available in Second Chance Connect. All API routes are located in the `app/api/` directory and follow Next.js 15 App Router conventions.

## Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Health Check](#health-check)
- [Jobs API](#jobs-api)
- [Applications API](#applications-api)
- [Messages API](#messages-api)
- [Services API](#services-api)
- [Admin APIs](#admin-apis)

## Authentication

All protected endpoints require authentication via Supabase Auth. Authentication is checked using the user's session cookie.

### Authentication Flow

1. User authenticates via Supabase Auth (email/password, OAuth, etc.)
2. Supabase sets secure HTTP-only cookies
3. Middleware validates the session on each request
4. API routes access user info via `supabase.auth.getUser()`

### Unauthorized Response

\`\`\`json
{
  "error": "Unauthorized"
}
\`\`\`
Status: `401`

### Forbidden Response

\`\`\`json
{
  "error": "Forbidden - Reason for denial"
}
\`\`\`
Status: `403`

## Error Handling

All API routes follow consistent error handling patterns.

### Error Response Format

\`\`\`json
{
  "error": "Error message describing what went wrong"
}
\`\`\`

### Common Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST creating resource |
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

## Rate Limiting

Rate limiting is handled at the infrastructure level (Vercel). Current limits:

- **Free tier**: 100 requests per 10 seconds
- **Pro tier**: 600 requests per 10 seconds

Exceeded rate limits return `429 Too Many Requests`.

## Health Check

### GET /api/health

Check system health and dependencies.

**Authentication**: None required

**Response**:
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Connected",
      "responseTime": 45
    },
    "environment": {
      "status": "healthy",
      "message": "All required variables set"
    }
  },
  "responseTime": 52
}
\`\`\`

**Status Codes**:
- `200`: All systems healthy
- `207`: Some systems degraded
- `503`: Critical failures

## Jobs API

### GET /api/jobs

List job postings with optional filters.

**Authentication**: Required

**Query Parameters**:
- `status` (string, optional): Filter by job status (ACTIVE, DRAFT, CLOSED)
- `employerId` (string, optional): Filter by employer ID
- `search` (string, optional): Search in title, company, or description

**Example Request**:
\`\`\`bash
GET /api/jobs?status=ACTIVE&search=engineer
\`\`\`

**Response**:
\`\`\`json
{
  "jobs": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "company": "Tech Co",
      "location": "San Francisco, CA",
      "description": "We're looking for...",
      "requirements": "3+ years experience...",
      "salary_range": "$80,000 - $120,000",
      "employment_type": "FULL_TIME",
      "status": "ACTIVE",
      "created_at": "2025-01-15T10:00:00.000Z",
      "employer_id": "650e8400-e29b-41d4-a716-446655440000",
      "profiles": {
        "name": "John Employer",
        "location": "San Francisco, CA"
      }
    }
  ]
}
\`\`\`

### POST /api/jobs

Create a new job posting.

**Authentication**: Required (EMPLOYER role)

**Request Body**:
\`\`\`json
{
  "title": "Software Engineer",
  "company": "Tech Co",
  "location": "San Francisco, CA",
  "description": "We're looking for...",
  "requirements": "3+ years experience...",
  "salary_range": "$80,000 - $120,000",
  "employment_type": "FULL_TIME",
  "status": "DRAFT"
}
\`\`\`

**Required Fields**: `title`, `company`, `location`, `description`

**Response**:
\`\`\`json
{
  "job": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Software Engineer",
    "company": "Tech Co",
    "location": "San Francisco, CA",
    "description": "We're looking for...",
    "requirements": "3+ years experience...",
    "salary_range": "$80,000 - $120,000",
    "employment_type": "FULL_TIME",
    "status": "DRAFT",
    "created_at": "2025-01-15T10:00:00.000Z",
    "employer_id": "650e8400-e29b-41d4-a716-446655440000"
  }
}
\`\`\`

Status: `201 Created`

### GET /api/jobs/[id]

Get details of a specific job.

**Authentication**: Required

**Response**: Single job object (same structure as GET /api/jobs)

### PATCH /api/jobs/[id]

Update a job posting.

**Authentication**: Required (must be job owner)

**Request Body**: Partial job object with fields to update

**Response**: Updated job object

### DELETE /api/jobs/[id]

Delete a job posting.

**Authentication**: Required (must be job owner)

**Response**: `204 No Content`

## Applications API

### GET /api/applications

List applications. Seekers see their applications; employers see applications to their jobs.

**Authentication**: Required

**Query Parameters**:
- `seekerId` (string, optional): Filter by seeker (employers only)
- `jobId` (string, optional): Filter by job
- `status` (string, optional): Filter by status (PENDING, REVIEWED, ACCEPTED, REJECTED)

**Response**:
\`\`\`json
{
  "applications": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "seeker_id": "850e8400-e29b-41d4-a716-446655440000",
      "job_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PENDING",
      "cover_letter": "I am very interested...",
      "resume_url": "https://storage.example.com/resume.pdf",
      "notes": null,
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": "2025-01-15T10:00:00.000Z"
    }
  ]
}
\`\`\`

### POST /api/applications

Submit a job application.

**Authentication**: Required (SEEKER role)

**Request Body**:
\`\`\`json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "cover_letter": "I am very interested...",
  "resume_url": "https://storage.example.com/resume.pdf"
}
\`\`\`

**Response**: Created application object

Status: `201 Created`

### PATCH /api/applications/[id]

Update an application. Seekers can update their application; employers can update status.

**Authentication**: Required (seeker or employer of job)

**Request Body**:
\`\`\`json
{
  "status": "REVIEWED",
  "notes": "Looks promising"
}
\`\`\`

**Response**: Updated application object

## Messages API

### GET /api/messages

List messages for the authenticated user.

**Authentication**: Required

**Query Parameters**:
- `conversationWith` (string, optional): Filter by conversation partner

**Response**:
\`\`\`json
{
  "messages": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440000",
      "sender_id": "850e8400-e29b-41d4-a716-446655440000",
      "receiver_id": "650e8400-e29b-41d4-a716-446655440000",
      "subject": "Question about the position",
      "content": "I was wondering...",
      "read": false,
      "created_at": "2025-01-15T10:00:00.000Z"
    }
  ]
}
\`\`\`

### POST /api/messages

Send a message.

**Authentication**: Required

**Request Body**:
\`\`\`json
{
  "receiver_id": "650e8400-e29b-41d4-a716-446655440000",
  "subject": "Question about the position",
  "content": "I was wondering..."
}
\`\`\`

**Response**: Created message object

Status: `201 Created`

### PATCH /api/messages/[id]

Mark a message as read.

**Authentication**: Required (must be receiver)

**Request Body**:
\`\`\`json
{
  "read": true
}
\`\`\`

**Response**: Updated message object

## Services API

### GET /api/services

List support services (public directory).

**Authentication**: None required

**Query Parameters**:
- `category` (string, optional): Filter by category (HOUSING, EDUCATION, HEALTH, LEGAL, OTHER)
- `search` (string, optional): Search in name or description

**Response**:
\`\`\`json
{
  "services": [
    {
      "id": "a50e8400-e29b-41d4-a716-446655440000",
      "name": "Housing First Initiative",
      "category": "HOUSING",
      "contact_email": "info@housingfirst.org",
      "contact_phone": "555-0100",
      "location": "San Francisco, CA",
      "address": "123 Main St, San Francisco, CA 94102",
      "description": "Providing stable housing...",
      "website_url": "https://housingfirst.org",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
\`\`\`

## Admin APIs

### GET /api/admin/analytics

Get platform analytics and metrics.

**Authentication**: Required (ADMIN role)

**Response**:
\`\`\`json
{
  "overview": {
    "totalUsers": 1247,
    "userGrowth": 12.5,
    "activeJobs": 156,
    "jobGrowth": 8.3,
    "totalApplications": 892,
    "applicationGrowth": 15.7,
    "totalMessages": 3421,
    "messageGrowth": 22.1,
    "usersByRole": {
      "SEEKER": 845,
      "EMPLOYER": 312,
      "OFFICER": 78,
      "ADMIN": 12
    },
    "recentActivity": {
      "newUsers": 87,
      "jobsPosted": 34,
      "applicationsSubmitted": 156,
      "messagesSent": 421
    }
  },
  "performance": {
    "avgResponseTime": 245,
    "errorRate": 0.8,
    "uptime": 99.9
  }
}
\`\`\`

## Testing

### Using curl

\`\`\`bash
# Health check
curl http://localhost:3000/api/health

# Get jobs (requires authentication cookie)
curl -b cookies.txt http://localhost:3000/api/jobs

# Create job
curl -X POST \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Job","company":"Test Co","location":"Remote","description":"Test"}' \
  http://localhost:3000/api/jobs
\`\`\`

### Using Postman

1. Import the OpenAPI spec (if available)
2. Set up Supabase authentication
3. Test endpoints with different user roles

### Automated Testing

See [TESTING.md](./TESTING.md) for information about API testing with Jest.

## Best Practices

### For API Consumers

1. **Always handle errors**: Check status codes and error messages
2. **Use appropriate headers**: Set `Content-Type: application/json`
3. **Respect rate limits**: Implement backoff strategies
4. **Cache when appropriate**: Reduce unnecessary requests
5. **Validate responses**: Don't assume success

### For API Developers

1. **Validate input**: Check all required fields
2. **Use consistent error messages**: Follow established patterns
3. **Log errors**: Use the logging utility
4. **Document changes**: Update this file
5. **Test thoroughly**: Include API tests

## Versioning

Currently, the API is unversioned (v1). Future versions will use URL prefixing:
- Current: `/api/jobs`
- Future: `/api/v2/jobs`

Version 1 will be maintained for at least 6 months after v2 release.

## Support

For API questions or issues:
- Check [DEBUGGING_GUIDE.md](../DEBUGGING_GUIDE.md)
- Review existing tests in `tests/api/`
- Open an issue on GitHub
- Contact: api@secondchanceconnect.org

## Changelog

### 2025-01-15
- Initial API documentation
- Added health check endpoint
- Added admin analytics endpoint
- Implemented structured logging

---

**Note**: This API is under active development. Check back for updates.
