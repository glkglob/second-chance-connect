/**
 * API Route Tests - Jobs
 * Tests for /api/jobs endpoints
 */

import { GET, POST } from '@/app/api/jobs/route'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

jest.mock('@/lib/supabase/server')
jest.mock('@/lib/logger')

describe('/api/jobs', () => {
  let mockSupabase
  let mockRequest

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
      })),
    }

    createClient.mockResolvedValue(mockSupabase)

    // Mock request
    mockRequest = {
      url: 'http://localhost:3000/api/jobs',
      method: 'GET',
      headers: new Map(),
    }
  })

  describe('GET /api/jobs', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return jobs for authenticated user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      const mockJobs = [
        {
          id: 'job-1',
          title: 'Software Engineer',
          company: 'Tech Co',
          location: 'Remote',
          status: 'ACTIVE',
        },
        {
          id: 'job-2',
          title: 'Designer',
          company: 'Design Co',
          location: 'NYC',
          status: 'ACTIVE',
        },
      ]

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const selectChain = mockSupabase.from().select()
      selectChain.eq.mockReturnThis()
      selectChain.order.mockResolvedValue({
        data: mockJobs,
        error: null,
      })

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.jobs).toEqual(mockJobs)
      expect(mockSupabase.from).toHaveBeenCalledWith('jobs')
    })

    it('should filter jobs by status', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockRequest.url = 'http://localhost:3000/api/jobs?status=DRAFT'

      const selectChain = mockSupabase.from().select()
      selectChain.eq.mockReturnThis()
      selectChain.order.mockResolvedValue({
        data: [],
        error: null,
      })

      await GET(mockRequest)

      expect(selectChain.eq).toHaveBeenCalledWith('status', 'DRAFT')
    })

    it('should handle database errors gracefully', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const selectChain = mockSupabase.from().select()
      selectChain.eq.mockReturnThis()
      selectChain.order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch jobs')
    })
  })

  describe('POST /api/jobs', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockRequest.json = jest.fn().mockResolvedValue({})

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return 403 if user is not an employer', async () => {
      const mockUser = { id: 'user-123' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const selectChain = mockSupabase.from().select()
      selectChain.eq.mockReturnThis()
      selectChain.single.mockResolvedValue({
        data: { role: 'SEEKER' },
        error: null,
      })

      mockRequest.json = jest.fn().mockResolvedValue({
        title: 'Test Job',
        company: 'Test Co',
        location: 'Test City',
        description: 'Test description',
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Only employers can create jobs')
    })

    it('should create job for employer', async () => {
      const mockUser = { id: 'employer-123' }
      const mockJob = {
        id: 'job-123',
        title: 'Software Engineer',
        company: 'Tech Co',
        location: 'Remote',
        description: 'Great opportunity',
        employer_id: 'employer-123',
      }

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const profileChain = mockSupabase.from().select()
      profileChain.eq.mockReturnThis()
      profileChain.single.mockResolvedValue({
        data: { role: 'EMPLOYER' },
        error: null,
      })

      const insertChain = mockSupabase.from().insert()
      insertChain.select.mockReturnThis()
      insertChain.single.mockResolvedValue({
        data: mockJob,
        error: null,
      })

      mockRequest.json = jest.fn().mockResolvedValue({
        title: 'Software Engineer',
        company: 'Tech Co',
        location: 'Remote',
        description: 'Great opportunity',
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.job).toEqual(mockJob)
    })

    it('should return 400 if required fields are missing', async () => {
      const mockUser = { id: 'employer-123' }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const selectChain = mockSupabase.from().select()
      selectChain.eq.mockReturnThis()
      selectChain.single.mockResolvedValue({
        data: { role: 'EMPLOYER' },
        error: null,
      })

      mockRequest.json = jest.fn().mockResolvedValue({
        title: 'Test Job',
        // Missing company, location, description
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Missing required fields')
    })
  })
})
