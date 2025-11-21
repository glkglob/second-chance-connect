#!/bin/bash

# Supabase SQL Deployment Helper Script
# Helps you deploy the schema using psql

set -e

PROJECT_ID="ymjjvgzyhtdmqianuqse"
DB_HOST="db.${PROJECT_ID}.supabase.co"

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║   Supabase SQL Schema Deployment Helper           ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ psql is not installed"
    echo "   Install PostgreSQL: brew install postgresql@16"
    exit 1
fi

echo "✓ psql found"
echo ""

# Ask for password
read -sp "Enter your Supabase database password: " PASSWORD
echo ""
echo ""

# Connection string
DB_URL="postgresql://postgres:${PASSWORD}@${DB_HOST}:5432/postgres"

# Test connection
echo "🔍 Testing database connection..."
if PGPASSWORD="$PASSWORD" psql -h "$DB_HOST" -U postgres -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Connection successful!"
else
    echo "❌ Connection failed"
    echo "   Check your password and try again"
    exit 1
fi

echo ""
echo "📊 Deploying SQL migrations..."
echo ""

# Deploy scripts
MIGRATIONS=(
    "001_create_tables.sql"
    "002_enable_rls.sql"
    "003_create_profile_trigger.sql"
)

for i in "${!MIGRATIONS[@]}"; do
    MIGRATION="${MIGRATIONS[$i]}"
    STEP=$((i + 1))
    
    echo "Step $STEP: $MIGRATION"
    
    if PGPASSWORD="$PASSWORD" psql -h "$DB_HOST" -U postgres -d postgres < "scripts/$MIGRATION" > /dev/null 2>&1; then
        echo "   ✅ Success"
    else
        echo "   ❌ Failed"
        exit 1
    fi
done

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║              Deployment Complete!                 ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "✅ All SQL migrations deployed successfully!"
echo ""
echo "💡 Verify with:"
echo "   curl http://localhost:3000/api/health | jq ."
echo ""
echo "🎉 Your database is ready to use!"
echo ""
