import { createMessageSchema } from '@/lib/validations/messages'

describe('Messages Validation', () => {
  describe('createMessageSchema', () => {
    test('accepts valid message', () => {
      const result = createMessageSchema.safeParse({
        receiver_id: '123e4567-e89b-12d3-a456-426614174000',
        subject: 'Job Inquiry',
        content: 'Hello, I am interested in the position.'
      })

      expect(result.success).toBe(true)
    })

    test('rejects subject shorter than 3 characters', () => {
      const result = createMessageSchema.safeParse({
        receiver_id: '123e4567-e89b-12d3-a456-426614174000',
        subject: 'Hi',
        content: 'Hello there'
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 3 characters')
      }
    })

    test('rejects content shorter than 10 characters', () => {
      const result = createMessageSchema.safeParse({
        receiver_id: '123e4567-e89b-12d3-a456-426614174000',
        subject: 'Test Subject',
        content: 'Short'
      })

      expect(result.success).toBe(false)
    })

    test('rejects invalid UUID for receiver_id', () => {
      const result = createMessageSchema.safeParse({
        receiver_id: 'not-a-uuid',
        subject: 'Test',
        content: 'This is a test message'
      })

      expect(result.success).toBe(false)
    })

    test('trims whitespace from content', () => {
      const result = createMessageSchema.safeParse({
        receiver_id: '123e4567-e89b-12d3-a456-426614174000',
        subject: 'Test',
        content: '  This is a test message  '
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.content).toBe('This is a test message')
      }
    })
  })
})
