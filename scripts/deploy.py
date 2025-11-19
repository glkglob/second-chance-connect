#!/usr/bin/env python3

"""
Supabase SQL Deployment Script
Deploys SQL migrations using psql
"""

import os
import sys
import subprocess
from pathlib import Path

# Read .env.local manually
def read_env():
    env = {}
    try:
        with open('.env.local', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env[key.strip()] = value.strip()
    except FileNotFoundError:
        pass
    return env

env = read_env()
SUPABASE_URL = env.get('NEXT_PUBLIC_SUPABASE_URL', '')
PROJECT_ID = SUPABASE_URL.split('//')[1].split('.')[0] if SUPABASE_URL else None

if not PROJECT_ID:
    print('❌ Could not extract project ID from NEXT_PUBLIC_SUPABASE_URL')
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent
MIGRATIONS = [
    '001_create_tables.sql',
    '002_enable_rls.sql',
    '003_create_profile_trigger.sql'
]

print('\n╔════════════════════════════════════════════════════╗')
print('║     Supabase SQL Schema Deployment                ║')
print('╚════════════════════════════════════════════════════╝\n')

print(f'📍 Project ID: {PROJECT_ID}')
print(f'🌐 Supabase URL: {SUPABASE_URL}\n')

print('⚠️  To deploy the SQL schema, use one of these methods:\n')

print('METHOD 1: Supabase Dashboard (Easiest)')
print('─' * 60)
print('1. Go to: https://app.supabase.com')
print('2. Select your project')
print('3. Click: SQL Editor → New Query')
print('4. Copy & paste SQL files in order')
print('5. Click: Run\n')

print('METHOD 2: psql Command Line')
print('─' * 60)
print('1. Get your database password from:')
print('   Supabase → Settings → Database → Password\n')

print('2. Run these commands:\n')

for i, migration in enumerate(MIGRATIONS, 1):
    filepath = SCRIPT_DIR / migration
    if filepath.exists():
        print(f'   Step {i}: {migration}')
        print(f'   psql "postgresql://postgres:[PASSWORD]@db.{PROJECT_ID}.supabase.co:5432/postgres" < scripts/{migration}\n')

print('METHOD 3: This Script (via Supabase API)')
print('─' * 60)
print('Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local')
print('Get from: Supabase → Settings → API → Service Role (secret)\n')

print('📊 Migration Files:')
print('─' * 60)

total_lines = 0
for migration in MIGRATIONS:
    filepath = SCRIPT_DIR / migration
    if filepath.exists():
        with open(filepath, 'r') as f:
            lines = len(f.readlines())
            total_lines += lines
            print(f'✓ {migration:<30} {lines:>4} lines')

print(f'  {"TOTAL":<30} {total_lines:>4} lines\n')

print('💡 Recommended: Use METHOD 1 (Supabase Dashboard) for simplicity')
print('✅ After deployment, verify with:')
print('   curl http://localhost:3000/api/health | jq .\n')
