import { z } from 'zod'

/**
 * Environment variable schema for validation
 * Ensures required Supabase configuration is present
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL (e.g., https://your-project.supabase.co)',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY must be at least 20 characters',
  }),
})

/**
 * Optional environment variables
 */
const optionalEnvSchema = z.object({
  NEXT_PUBLIC_DEBUG: z.enum(['true', 'false']).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
})

export type Env = z.infer<typeof envSchema>
export type OptionalEnv = z.infer<typeof optionalEnvSchema>

/**
 * Validates required environment variables
 * @throws {Error} If environment variables are missing or invalid
 * @returns {Env} Validated environment configuration
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => {
        const field = err.path.join('.')
        const message = err.message
        return `  ❌ ${field}: ${message}`
      })

      throw new Error(
        `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `🔴 Environment Configuration Error\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
          `Missing or invalid environment variables:\n\n` +
          `${errorMessages.join('\n')}\n\n` +
          `Please follow these steps:\n\n` +
          `  1. Create a .env.local file in the project root\n` +
          `  2. Add the required variables:\n\n` +
          `     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n` +
          `     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here\n\n` +
          `  3. Get your Supabase credentials from:\n` +
          `     https://supabase.com/dashboard/project/_/settings/api\n\n` +
          `  4. Restart the development server\n\n` +
          `For more help, see: DEBUGGING_GUIDE.md\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      )
    }
    throw error
  }
}

/**
 * Checks if environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Checks if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return process.env.NEXT_PUBLIC_DEBUG === 'true'
}

/**
 * Gets environment configuration with safe defaults
 * Does not throw, returns partial config for graceful degradation
 */
export function getEnvSafe() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return {
    supabaseUrl: url || '',
    supabaseAnonKey: key || '',
    isValid: !!(url && key && url.length > 0 && key.length > 20),
    isDevelopment: isDevelopment(),
    isDebugMode: isDebugMode(),
  }
}

/**
 * Logs environment status (useful for debugging)
 */
export function logEnvStatus() {
  if (!isDebugMode()) return

  const env = getEnvSafe()

  console.log('[v0] Environment Status:')
  console.log('  ├─ Supabase URL:', env.supabaseUrl ? `${env.supabaseUrl.substring(0, 30)}...` : '❌ NOT SET')
  console.log('  ├─ Supabase Key:', env.supabaseAnonKey ? `${env.supabaseAnonKey.substring(0, 20)}...` : '❌ NOT SET')
  console.log('  ├─ Valid:', env.isValid ? '✅' : '❌')
  console.log('  ├─ Environment:', env.isDevelopment ? 'Development' : 'Production')
  console.log('  └─ Debug Mode:', env.isDebugMode ? 'Enabled' : 'Disabled')
}
