import { createJobSchema, updateJobSchema, jobQuerySchema } from '@/lib/validations/jobs'

describe('Job Validation Schemas', () => {
  describe('createJobSchema', () => {
    const validJob = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      description: 'We are looking for a talented software engineer to join our team. This is a great opportunity for growth.',
      requirements: 'Must have 2+ years experience',
      salary_range: '$80k - $120k',
      employment_type: 'FULL_TIME',
      status: 'ACTIVE'
    }

    test('validates correct job data', () => {
      const result = createJobSchema.safeParse(validJob)
      expect(result.success).toBe(true)
    })

    test('rejects title shorter than 5 characters', () => {
      const result = createJobSchema.safeParse({
        ...validJob,
        title: 'Dev'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 5 characters')
      }
    })

    test('rejects description shorter than 50 characters', () => {
      const result = createJobSchema.safeParse({
        ...validJob,
        description: 'Short description'
      })
      expect(result.success).toBe(false)
    })

    test('rejects invalid employment type', () => {
      const result = createJobSchema.safeParse({
        ...validJob,
        employment_type: 'INVALID_TYPE'
      })
      expect(result.success).toBe(false)
    })

    test('trims whitespace from string fields', () => {
      const result = createJobSchema.safeParse({
        ...validJob,
        title: '  Software Engineer  '
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Software Engineer')
      }
    })

    test('allows optional fields to be undefined', () => {
      const { requirements, salary_range, ...requiredFields } = validJob
      const result = createJobSchema.safeParse(requiredFields)
      expect(result.success).toBe(true)
    })
  })

  describe('updateJobSchema', () => {
    test('allows partial updates', () => {
      const result = updateJobSchema.safeParse({
        title: 'Updated Title'
      })
      expect(result.success).toBe(true)
    })

    test('validates fields that are provided', () => {
      const result = updateJobSchema.safeParse({
        title: 'Bad' // Too short
      })
      expect(result.success).toBe(false)
    })
  })

  describe('jobQuerySchema', () => {
    test('validates valid query parameters', () => {
      const result = jobQuerySchema.safeParse({
        status: 'ACTIVE',
        search: 'engineer'
      })
      expect(result.success).toBe(true)
    })

    test('rejects invalid status', () => {
      const result = jobQuerySchema.safeParse({
        status: 'INVALID'
      })
      expect(result.success).toBe(false)
    })

    test('rejects invalid UUID for employerId', () => {
      const result = jobQuerySchema.safeParse({
        employerId: 'not-a-uuid'
      })
      expect(result.success).toBe(false)
    })
  })
})
