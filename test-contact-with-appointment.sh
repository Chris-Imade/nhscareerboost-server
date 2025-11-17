#!/bin/bash

# Test script for contact form with appointment scheduling
# Tests the updated /api/contact endpoint with date and time fields

echo "=========================================="
echo "Testing Contact Form with Appointment"
echo "=========================================="
echo ""

# Set the base URL (change this if testing locally)
BASE_URL="http://localhost:3000"
# BASE_URL="https://nhscareerboost-server.onrender.com"

# Test 1: Valid booking with all fields
echo "Test 1: Valid booking with appointment date and time"
echo "----------------------------------------------"
curl -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "07123456789",
    "service": "CV Review & Optimisation",
    "appointmentDate": "2025-11-20",
    "appointmentTime": "14:30",
    "message": "Payment ID: pi_test123abc\nNHS Band: Band 5\nRole: Senior Nurse\nI would like help optimizing my CV for a senior nurse position."
  }'
echo -e "\n\n"

# Test 2: Missing appointment date
echo "Test 2: Missing appointment date (should fail)"
echo "----------------------------------------------"
curl -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "07987654321",
    "service": "Interview Preparation",
    "appointmentTime": "10:00",
    "message": "Need help with interview prep"
  }'
echo -e "\n\n"

# Test 3: Invalid date format
echo "Test 3: Invalid date format (should fail)"
echo "----------------------------------------------"
curl -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "phone": "07111222333",
    "service": "Application Support",
    "appointmentDate": "20/11/2025",
    "appointmentTime": "15:00",
    "message": "Invalid date format test"
  }'
echo -e "\n\n"

# Test 4: Invalid time format
echo "Test 4: Invalid time format (should fail)"
echo "----------------------------------------------"
curl -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Brown",
    "email": "alice@example.com",
    "phone": "07444555666",
    "service": "Career Coaching",
    "appointmentDate": "2025-11-25",
    "appointmentTime": "3:30 PM",
    "message": "Invalid time format test"
  }'
echo -e "\n\n"

# Test 5: Past date (should fail)
echo "Test 5: Past date (should fail)"
echo "----------------------------------------------"
curl -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Charlie Wilson",
    "email": "charlie@example.com",
    "phone": "07777888999",
    "service": "LinkedIn Profile Review",
    "appointmentDate": "2020-01-01",
    "appointmentTime": "12:00",
    "message": "Past date test"
  }'
echo -e "\n\n"

# Test 6: Valid booking with minimal fields
echo "Test 6: Valid booking with minimal required fields"
echo "----------------------------------------------"
curl -X POST "${BASE_URL}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emma Davis",
    "email": "emma@example.com",
    "service": "Personal Statement Writing",
    "appointmentDate": "2025-12-01",
    "appointmentTime": "09:00"
  }'
echo -e "\n\n"

echo "=========================================="
echo "Tests completed!"
echo "=========================================="
