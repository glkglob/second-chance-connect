# API Documentation

## Overview
The Second Chance Connect API follows RESTful principles and returns JSON responses.

## Base URL
`/api`

## Authentication
Authentication is handled via Supabase Auth cookies.

## Response Format

### Success
\`\`\`json
{
  "success": true,
  "data": { ... },
  "timestamp": "2023-11-21T12:00:00Z"
}
\`\`\`

### Error
\`\`\`json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... },
    "timestamp": "2023-11-21T12:00:00Z"
  }
}
\`\`\`

## Endpoints

### Jobs

#### GET /api/jobs
List all jobs with pagination and filtering.

**Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 10)
- `search` (string): Search term for title
- `location` (string): Filter by location
- `type` (string): Filter by employment type

#### POST /api/jobs
Create a new job posting. Requires 'employer' role.

**Body:**
\`\`\`json
{
  "title": "Software Engineer",
  "description": "Job description...",
  "salary_min": 80000,
  "salary_max": 120000,
  "location": "Remote",
  "employment_type": "FULL_TIME"
}
\`\`\`

### Services

#### GET /api/services
List support services.

#### POST /api/services
Create a new service. Requires 'admin' role.

## Error Codes
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `RATE_LIMIT`: Too many requests
- `INTERNAL_ERROR`: Server error
