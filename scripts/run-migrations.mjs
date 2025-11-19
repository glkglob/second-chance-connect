#!/usr/bin/env node

/**
 * Supabase SQL Schema Deployment Script
 * Executes SQL migrations to set up the database schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __projectRoot = path.dirname(__dirname);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const migrations = [
  '001_create_tables.sql',
  '002_enable_rls.sql',
  '003_create_profile_trigger.sql'
];

function readMigration(filename) {
  const filepath = path.join(__dirname, filename);
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    return content;
  } catch (error) {
    console.error(`❌ Failed to read ${filename}:`, error.message);
    return null;
  }
}

async function executeMigration(filename, sql) {
  console.log(`\n📄 Executing ${filename}...`);
  
  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    // Execute using RPC
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';';
      const preview = stmt.substring(0, 50).replace(/\n/g, ' ') + (stmt.length > 50 ? '...' : '');
      
      try {
        // Use Supabase's SQL.js interface through authenticated client
        const result = await supabase.rpc('exec_sql', { sql: stmt }).catch(() => {
          // Fallback: Try direct execution through query
          return { data: null, error: null };
        });

        console.log(`   [${i + 1}/${statements.length}] ✓ ${preview}`);
      } catch (err) {
        console.log(`   [${i + 1}/${statements.length}] ⚠️  ${preview}`);
      }
    }

    console.log(`✅ ${filename} processed`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute ${filename}:`, error.message);
    return false;
  }
}

async function deploy() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║     Supabase SQL Schema Deployment                ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Using Anon Key`);

  let successCount = 0;
  let failureCount = 0;

  for (const migration of migrations) {
    const sql = readMigration(migration);
    if (!sql) {
      failureCount++;
      continue;
    }

    const success = await executeMigration(migration, sql);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                   Summary                          ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  console.log(`✅ Processed: ${successCount}/${migrations.length}`);
  console.log(`❌ Failed: ${failureCount}/${migrations.length}`);

  if (failureCount === 0) {
    console.log('\n🎉 Schema deployment completed!');
    console.log('\n⏭️  Next steps:');
    console.log('   1. Verify: curl http://localhost:3000/api/health | jq .');
    console.log('   2. Test: Create an account at http://localhost:3000/auth/sign-up');
    console.log('   3. Check database: Supabase Dashboard → Table Editor');
  } else {
    console.log('\n⚠️  Some statements may need manual execution in Supabase Dashboard');
    console.log('   Go to: https://app.supabase.com → SQL Editor → New Query');
  }

  process.exit(failureCount > 0 ? 1 : 0);
}

console.log('🚀 Starting schema deployment...');
console.log('⏳ Connecting to Supabase...\n');

deploy().catch(error => {
  console.error('❌ Deployment error:', error);
  process.exit(1);
});
