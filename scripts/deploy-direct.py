#!/usr/bin/env python3

"""
Deploy SQL schema to Supabase using the Supabase Python client
Requires: pip install supabase python-dotenv
"""

import os
import sys
import subprocess
from pathlib import Path

# Get credentials from environment or .env.local
PROJECT_ID = "ymjjvgzyhtdmqianuqse"
SUPABASE_URL = f"https://{PROJECT_ID}.supabase.co"
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")

if not DB_PASSWORD:
    print("❌ DB_PASSWORD environment variable not set")
    print("Usage: DB_PASSWORD='your_password' python3 deploy-direct.py")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent
MIGRATIONS = [
    "001_create_tables.sql",
    "002_enable_rls.sql",
    "003_create_profile_trigger.sql"
]

print("\n╔════════════════════════════════════════════════════╗")
print("║   Supabase SQL Schema Deployment (via PostgreSQL) ║")
print("╚════════════════════════════════════════════════════╝\n")

print(f"📍 Project ID: {PROJECT_ID}")
print(f"🌐 Supabase URL: {SUPABASE_URL}\n")

# Try psql with IPv4
db_host = "db.ymjjvgzyhtdmqianuqse.supabase.co"
db_port = "5432"
db_user = "postgres"
db_name = "postgres"

success_count = 0
fail_count = 0

for i, migration in enumerate(MIGRATIONS, 1):
    filepath = SCRIPT_DIR / migration
    
    if not filepath.exists():
        print(f"❌ {migration} not found")
        fail_count += 1
        continue
    
    print(f"Step {i}: {migration}")
    print(f"   Reading file... {filepath.stat().st_size} bytes")
    
    # Use psql with password
    env = os.environ.copy()
    env["PGPASSWORD"] = DB_PASSWORD
    
    # Try connection
    cmd = [
        "psql",
        "-h", db_host,
        "-U", db_user,
        "-d", db_name,
        "-p", db_port,
        "-f", str(filepath),
        "-v", "ON_ERROR_STOP=1"
    ]
    
    try:
        result = subprocess.run(cmd, env=env, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print(f"   ✅ Success")
            success_count += 1
        else:
            print(f"   ⚠️  Exit code: {result.returncode}")
            if result.stderr:
                # Show only first error line
                error_line = result.stderr.split('\n')[0]
                print(f"   Error: {error_line}")
            fail_count += 1
    except subprocess.TimeoutExpired:
        print(f"   ❌ Timeout (30s)")
        fail_count += 1
    except Exception as e:
        print(f"   ❌ Error: {e}")
        fail_count += 1

print(f"\n╔════════════════════════════════════════════════════╗")
print(f"║              Deployment Summary                   ║")
print(f"╚════════════════════════════════════════════════════╝")
print(f"\n✅ Successful: {success_count}/{len(MIGRATIONS)}")
print(f"❌ Failed: {fail_count}/{len(MIGRATIONS)}\n")

if fail_count == 0:
    print("🎉 All migrations deployed successfully!")
    print("\n✅ Verify with:")
    print("   curl http://localhost:3000/api/health | jq .")
else:
    print("⚠️  Some migrations failed")
    print("\n💡 Alternative: Use Supabase Dashboard")
    print("   1. Go to: https://app.supabase.com")
    print("   2. SQL Editor → New Query")
    print("   3. Copy & paste the SQL file content")
    print("   4. Click Run")

sys.exit(0 if fail_count == 0 else 1)
