#!/usr/bin/env node

/**
 * Deploy SQL schema to Supabase using psql
 * Run: node scripts/deploy-schema.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

// Extract project ID from URL
const projectId = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectId) {
  console.error('❌ Could not extract project ID from Supabase URL');
  process.exit(1);
}

console.log('╔════════════════════════════════════════════════════╗');
console.log('║   Deploy SQL Schema to Supabase                    ║');
console.log('╚════════════════════════════════════════════════════╝\n');

console.log('📍 Project ID:', projectId);
console.log('🌐 Supabase URL:', SUPABASE_URL);
console.log('\n⚠️  To complete deployment, you need to:\n');

console.log('1. Get your database password:');
console.log('   - Go to Supabase Dashboard → Settings → Database');
console.log('   - Copy the "Password" field\n');

console.log('2. Copy your connection string:');
console.log('   - Go to Supabase Dashboard → Settings → Database');
console.log('   - Connection Pooling: Session mode');
console.log('   - Copy the connection string\n');

console.log('3. Run these commands:\n');

const SQL_FILES = [
  '001_create_tables.sql',
  '002_enable_rls.sql',
  '003_create_profile_trigger.sql'
];

SQL_FILES.forEach((file, i) => {
  console.log(`   # Step ${i + 1}: Deploy ${file}`);
  console.log(`   psql "postgresql://postgres:[PASSWORD]@db.${projectId}.supabase.co:5432/postgres" < scripts/${file}\n`);
});

console.log('\n📝 Or use the Supabase Dashboard:');
console.log('   1. Go to SQL Editor');
console.log('   2. Click "New Query"');
console.log('   3. Copy & paste the SQL script contents');
console.log('   4. Click "Run"\n');

console.log('💡 After deployment, verify with:');
console.log(`   curl http://localhost:3000/api/health | jq .\n`);
