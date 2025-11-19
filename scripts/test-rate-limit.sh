#!/bin/bash

# Rate Limit Testing Script
# Tests that rate limiting is working correctly

set -e

echo "🧪 Testing Rate Limiting"
echo "========================"
echo ""

# Configuration
URL="${1:-http://localhost:3000/api/jobs}"
LIMIT=100
TEST_REQUESTS=105

echo "Configuration:"
echo "  URL: $URL"
echo "  Rate Limit: $LIMIT requests/minute"
echo "  Test Count: $TEST_REQUESTS requests"
echo ""
echo "Starting test..."
echo ""

SUCCESS_COUNT=0
RATE_LIMITED_COUNT=0

for i in $(seq 1 $TEST_REQUESTS); do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>&1)

    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "401" ]; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        if [ $((i % 10)) -eq 0 ]; then
            echo "✓ Request $i: Success ($SUCCESS_COUNT successful so far)"
        fi
    elif [ "$RESPONSE" = "429" ]; then
        RATE_LIMITED_COUNT=$((RATE_LIMITED_COUNT + 1))
        echo "🛑 Request $i: Rate Limited (HTTP 429) - Working as expected!"
        echo ""
        echo "Test Result: ✅ PASS"
        echo ""
        echo "Summary:"
        echo "  • Successful requests: $SUCCESS_COUNT"
        echo "  • Rate limited after: $SUCCESS_COUNT requests"
        echo "  • Expected limit: ~$LIMIT requests/minute"
        echo ""
        echo "Rate limiting is working correctly! 🎉"
        exit 0
    else
        echo "⚠️  Request $i: Unexpected response ($RESPONSE)"
    fi

    # Small delay to not overwhelm the system
    sleep 0.01
done

echo ""
echo "Test Result: ❌ FAIL"
echo ""
echo "Summary:"
echo "  • Sent $TEST_REQUESTS requests"
echo "  • All requests succeeded (no rate limiting triggered)"
echo "  • Expected to be rate limited after ~$LIMIT requests"
echo ""
echo "Possible issues:"
echo "  1. Vercel KV not configured"
echo "  2. Environment variables missing"
echo "  3. Rate limiting not applied to this endpoint"
echo ""
echo "Please check:"
echo "  • .env.local contains KV_REST_API_URL and KV_REST_API_TOKEN"
echo "  • Development server is running (npm run dev)"
echo "  • API route has applyRateLimit() call"
echo ""
exit 1
