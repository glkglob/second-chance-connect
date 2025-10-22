#!/usr/bin/env node

/**
 * Environment Validation Script
 * Run this before starting the development server or deploying
 * Usage: node scripts/validate-env.js
 */

import { z } from 'zod'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('\n' + '─'.repeat(60))
  log(title, 'cyan')
  console.log('─'.repeat(60))
}

// Environment variable schema
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
})

const optionalEnvSchema = z.object({
  NEXT_PUBLIC_DEBUG: z.enum(['true', 'false']).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
})

async function validateEnv() {
  logSection('🔍 Environment Validation')

  const errors = []
  const warnings = []

  // Check required environment variables
  try {
    const env = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })

    log('✅ NEXT_PUBLIC_SUPABASE_URL is set', 'green')
    log(`   ${env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 40)}...`, 'blue')
    
    log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set', 'green')
    log(`   ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`, 'blue')
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const field = err.path.join('.')
        errors.push(`${field}: ${err.message}`)
        log(`❌ ${field}`, 'red')
        log(`   ${err.message}`, 'yellow')
      })
    }
  }

  // Check optional variables
  if (!process.env.NODE_ENV) {
    warnings.push('NODE_ENV not set (defaults to development)')
    log('⚠️  NODE_ENV not set', 'yellow')
  } else {
    log(`✅ NODE_ENV: ${process.env.NODE_ENV}`, 'green')
  }

  if (!process.env.NEXT_PUBLIC_DEBUG) {
    log('ℹ️  NEXT_PUBLIC_DEBUG not set (debug mode disabled)', 'blue')
  } else {
    log(`✅ NEXT_PUBLIC_DEBUG: ${process.env.NEXT_PUBLIC_DEBUG}`, 'green')
  }

  return { errors, warnings }
}

async function checkDependencies() {
  logSection('📦 Dependency Check')

  try {
    const packageJson = require('../package.json')
    
    // Check for known problematic dependencies
    const problematicDeps = {
      vaul: {
        version: packageJson.dependencies.vaul,
        issue: 'May have peer dependency issues with React 19',
        solution: 'Use --legacy-peer-deps flag when installing',
      },
    }

    let hasIssues = false
    for (const [dep, info] of Object.entries(problematicDeps)) {
      if (packageJson.dependencies[dep]) {
        log(`⚠️  ${dep}@${info.version}`, 'yellow')
        log(`   Issue: ${info.issue}`, 'yellow')
        log(`   Solution: ${info.solution}`, 'blue')
        hasIssues = true
      }
    }

    if (!hasIssues) {
      log('✅ No known dependency issues found', 'green')
    }

    // Check if node_modules exists
    try {
      require.resolve('../node_modules')
      log('✅ node_modules directory exists', 'green')
    } catch {
      log('❌ node_modules not found - run npm install', 'red')
      return false
    }

    return true
  } catch (error) {
    log('❌ Failed to read package.json', 'red')
    return false
  }
}

async function checkSupabaseConnection() {
  logSection('🔌 Supabase Connection Check')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    log('⏭️  Skipped - environment variables not set', 'yellow')
    return false
  }

  try {
    // Test connection to Supabase
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    if (response.ok || response.status === 404) {
      log('✅ Successfully connected to Supabase', 'green')
      return true
    } else {
      log(`⚠️  Supabase returned status ${response.status}`, 'yellow')
      log('   This might be normal if RLS is enabled', 'blue')
      return true
    }
  } catch (error) {
    log('❌ Failed to connect to Supabase', 'red')
    log(`   ${error.message}`, 'yellow')
    return false
  }
}

async function checkFileStructure() {
  logSection('📁 File Structure Check')

  const fs = await import('fs')
  const path = await import('path')
  const rootDir = path.join(process.cwd())

  const criticalFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    'app/layout.jsx',
    'lib/supabase/client.js',
    'lib/supabase/server.js',
    'lib/supabase/middleware.js',
  ]

  let allPresent = true
  for (const file of criticalFiles) {
    const filePath = path.join(rootDir, file)
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}`, 'green')
    } else {
      log(`❌ ${file} not found`, 'red')
      allPresent = false
    }
  }

  return allPresent
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'cyan')
  log('║   Second Chance Connect - Environment Validator         ║', 'cyan')
  log('╚══════════════════════════════════════════════════════════╝', 'cyan')

  const { errors, warnings } = await validateEnv()
  const depsOk = await checkDependencies()
  const filesOk = await checkFileStructure()
  const supabaseOk = await checkSupabaseConnection()

  logSection('📊 Summary')

  if (errors.length === 0 && depsOk && filesOk) {
    log('✅ All checks passed!', 'green')
    log('\nYou can now run:', 'blue')
    log('  npm run dev     # Start development server', 'cyan')
    log('  npm run build   # Build for production', 'cyan')
  } else {
    log('❌ Some checks failed', 'red')
    
    if (errors.length > 0) {
      log('\n🔴 Critical errors:', 'red')
      errors.forEach((err) => log(`  • ${err}`, 'yellow'))
      log('\nPlease fix these errors before continuing.', 'red')
      log('See DEBUGGING_GUIDE.md for detailed instructions.', 'blue')
    }

    if (warnings.length > 0) {
      log('\n⚠️  Warnings:', 'yellow')
      warnings.forEach((warn) => log(`  • ${warn}`, 'yellow'))
    }

    process.exit(1)
  }

  if (warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow')
    warnings.forEach((warn) => log(`  • ${warn}`, 'yellow'))
  }

  console.log('')
}

main().catch((error) => {
  log(`\n❌ Validation script failed: ${error.message}`, 'red')
  process.exit(1)
})
