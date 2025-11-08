#!/bin/bash

# Test script for NHS Career Boost Mail Server
# Usage: ./test-contact.sh [server_url]

SERVER_URL="${1:-http://localhost:3000}"

echo "=================================================="
echo "NHS Career Boost Mail Server - Test Script"
echo "=================================================="
echo "Testing server at: $SERVER_URL"
echo ""

# Test 1: Health Check
echo "📡 Test 1: Health Check"
echo "--------------------------------------------------"
curl -s -X GET "$SERVER_URL/health" | json_pp
echo ""
echo ""

# Test 2: Valid Contact Form Submission
echo "✅ Test 2: Valid Contact Form Submission"
echo "--------------------------------------------------"
curl -s -X POST "$SERVER_URL/api/contact" \
  -H "Content-Type: application/json" \
  -H "Origin: http://127.0.0.1:5500" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+44 7700 900000",
    "service": "CV Review",
    "message": "This is a test message from the test script"
  }' | json_pp
echo ""
echo ""

# Test 3: Invalid Email
echo "❌ Test 3: Invalid Email (Should Fail)"
echo "--------------------------------------------------"
curl -s -X POST "$SERVER_URL/api/contact" \
  -H "Content-Type: application/json" \
  -H "Origin: http://127.0.0.1:5500" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "service": "CV Review"
  }' | json_pp
echo ""
echo ""

# Test 4: Missing Required Field
echo "❌ Test 4: Missing Required Field (Should Fail)"
echo "--------------------------------------------------"
curl -s -X POST "$SERVER_URL/api/contact" \
  -H "Content-Type: application/json" \
  -H "Origin: http://127.0.0.1:5500" \
  -d '{
    "name": "Test User",
    "email": "test@example.com"
  }' | json_pp
echo ""
echo ""

# Test 5: CORS Test (Unauthorized Origin)
echo "🔒 Test 5: CORS Test (Unauthorized Origin)"
echo "--------------------------------------------------"
curl -s -X POST "$SERVER_URL/api/contact" \
  -H "Content-Type: application/json" \
  -H "Origin: https://unauthorized-site.com" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service": "CV Review"
  }'
echo ""
echo ""

echo "=================================================="
echo "Tests Complete!"
echo "=================================================="
echo ""
echo "Note: Check your email (${ADMIN_EMAIL:-daniel@nhscareerboost.co.uk})"
echo "for the test contact form submission if Test 2 succeeded."
echo ""
