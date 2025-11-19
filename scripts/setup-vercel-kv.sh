#!/bin/bash

# Vercel KV Setup Script
# This script helps you set up Vercel KV for rate limiting

set -e

echo "🚀 Vercel KV Setup for Second Chance Connect"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
fi

echo -e "${BLUE}Step 1: Checking Vercel login status...${NC}"
if vercel whoami &> /dev/null; then
    USER=$(vercel whoami)
    echo -e "${GREEN}✓ Logged in as: $USER${NC}"
else
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
    echo "Please log in to Vercel..."
    vercel login
    echo -e "${GREEN}✓ Successfully logged in${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Linking project...${NC}"
if [ -f ".vercel/project.json" ]; then
    echo -e "${GREEN}✓ Project already linked${NC}"
else
    echo "Linking to Vercel project..."
    vercel link
    echo -e "${GREEN}✓ Project linked${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Setting up Vercel KV...${NC}"
echo ""
echo "📋 You now need to create a KV database in the Vercel dashboard:"
echo ""
echo "   1. Opening Vercel dashboard in your browser..."
echo "   2. Navigate to: Storage → Create Database → KV"
echo "   3. Name: 'second-chance-connect-kv'"
echo "   4. Region: Choose closest to your users"
echo "   5. Click 'Create' and 'Connect' to your project"
echo ""

# Try to open dashboard
if command -v open &> /dev/null; then
    PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$PROJECT_ID" ]; then
        DASHBOARD_URL="https://vercel.com/dashboard/stores"
        echo -e "${BLUE}Opening Vercel Storage dashboard...${NC}"
        open "$DASHBOARD_URL" 2>/dev/null || echo "Please open: $DASHBOARD_URL"
    fi
fi

echo ""
read -p "Press ENTER after you've created the KV database in the dashboard..."

echo ""
echo -e "${BLUE}Step 4: Pulling environment variables...${NC}"
vercel env pull .env.local
echo -e "${GREEN}✓ Environment variables downloaded to .env.local${NC}"

echo ""
echo -e "${BLUE}Step 5: Verifying KV setup...${NC}"

# Check if KV variables exist
if grep -q "KV_REST_API_URL" .env.local && \
   grep -q "KV_REST_API_TOKEN" .env.local; then
    echo -e "${GREEN}✓ KV environment variables found!${NC}"
    echo ""
    echo "KV Configuration:"
    echo "  URL: $(grep KV_REST_API_URL .env.local | cut -d'=' -f2 | cut -c1-50)..."
    echo "  Token: ********"
    echo ""
else
    echo -e "${RED}✗ KV environment variables not found${NC}"
    echo ""
    echo "Please make sure you:"
    echo "  1. Created the KV database in Vercel dashboard"
    echo "  2. Connected it to your project"
    echo "  3. Re-run this script"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Vercel KV setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test locally: npm run dev"
echo "  2. Test rate limiting: ./scripts/test-rate-limit.sh"
echo "  3. Deploy: git push origin feature/production-readiness"
echo ""
echo "Rate limiting is now:"
echo "  • API routes: 100 requests/minute"
echo "  • Auth routes: 5 requests/minute"
echo "  • Admin routes: 500 requests/minute"
echo ""
