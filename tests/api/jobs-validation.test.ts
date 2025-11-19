import { createJobSchema } from '@/lib/validations/jobs'

describe('Jobs API Validation', () => {
  test('rejects job creation with invalid data', () => {
    const invalidJob = {
      title: 'Bad', // Too short
      company: 'T', // Too short
      location: 'SF',
      description: 'Short', // Too short
      employment_type: 'INVALID'
    }

    const result = createJobSchema.safeParse(invalidJob)
    expect(result.success).toBe(false)

    if (!result.success) {
      const errors = result.error.errors
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some(e => e.path.includes('title'))).toBe(true)
      expect(errors.some(e => e.path.includes('company'))).toBe(true)
      expect(errors.some(e => e.path.includes('description'))).toBe(true)
    }
  })

  test('accepts valid job data', () => {
    const validJob = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      description: 'We are looking for a talented software engineer to join our team. This is a great opportunity.',
      employment_type: 'FULL_TIME'
    }

    const result = createJobSchema.safeParse(validJob)
    expect(result.success).toBe(true)
  })
})
