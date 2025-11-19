import { createApplicationSchema, updateApplicationSchema } from '@/lib/validations/applications'

describe('Applications Validation', () => {
  describe('createApplicationSchema', () => {
    test('rejects cover letter shorter than 100 characters', () => {
      const result = createApplicationSchema.safeParse({
        job_id: '123e4567-e89b-12d3-a456-426614174000',
        cover_letter: 'Too short'
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 100 characters')
      }
    })

    test('accepts valid application', () => {
      const result = createApplicationSchema.safeParse({
        job_id: '123e4567-e89b-12d3-a456-426614174000',
        cover_letter: 'I am very interested in this position. I have extensive experience in software development and believe I would be a great fit for your team. My background includes working with various technologies and I am eager to contribute.'
      })

      expect(result.success).toBe(true)
    })

    test('rejects invalid UUID for job_id', () => {
      const result = createApplicationSchema.safeParse({
        job_id: 'not-a-uuid',
        cover_letter: 'I am very interested in this position and believe I would be a great fit for your team with my extensive background.'
      })

      expect(result.success).toBe(false)
    })
  })

  describe('updateApplicationSchema', () => {
    test('accepts valid status update', () => {
      const result = updateApplicationSchema.safeParse({
        status: 'REVIEWED',
        notes: 'Good candidate'
      })

      expect(result.success).toBe(true)
    })

    test('rejects invalid status', () => {
      const result = updateApplicationSchema.safeParse({
        status: 'INVALID_STATUS'
      })

      expect(result.success).toBe(false)
    })
  })
})
