import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from '@/app/auth/sign-up/page'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn()
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

describe('Sign Up Page', () => {
  const mockSupabase = {
    auth: {
      signUp: jest.fn()
    }
  }

  const mockRouter = {
    push: jest.fn()
  }

  beforeEach(() => {
    createClient.mockReturnValue(mockSupabase)
    useRouter.mockReturnValue(mockRouter)
    jest.clearAllMocks()
  })

  test('passes user metadata to signUp with options object', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    })

    render(<SignUpPage />)

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    })
    // Use specific ID to target the password field (not confirm password)
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'SecurePass123!' }
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'SecurePass123!' }
    })
    // Role is pre-selected as SEEKER by default, no need to change

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'SecurePass123!',
        options: {
          data: {
            name: 'John Doe',
            role: 'SEEKER'
          }
        }
      })
    })
  })

  test('shows error when sign up fails', async () => {
    mockSupabase.auth.signUp.mockRejectedValue(
      new Error('Email already registered')
    )

    render(<SignUpPage />)

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument()
    })
  })
})
