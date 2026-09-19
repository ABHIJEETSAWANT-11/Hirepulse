#!/bin/bash

echo "🚀 Starting Local Setup for Hire Pulse..."

# Frontend Setup
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

# Backend Setup
echo "📦 Installing Backend Dependencies..."
cd backend-Node
npm install
cd ..

echo "✅ Setup Complete!"
echo "To run the application, open 2 terminal tabs and run:"
echo "1. Backend: cd backend-Node && npm start"
echo "   Verify at: http://localhost:3000/job-recommendations (Should return a JSON response)"
echo "2. Frontend: cd frontend && npm run dev"
echo "   Verify at: http://localhost:5173"
