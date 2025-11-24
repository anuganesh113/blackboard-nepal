#!/bin/bash

echo "🚀 Starting BrandOS MVP - Living Brand System"
echo "============================================="
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Starting development server..."
echo ""
echo "🌐 Opening at: http://localhost:3000"
echo "   (If port 3000 is busy, trying port 3001)"
echo ""
echo "📝 Key Pages:"
echo "   • Landing:  http://localhost:3000"
echo "   • Create:   http://localhost:3000/create"
echo "   • Dashboard: http://localhost:3000/dashboard"
echo ""
echo "Press Ctrl+C to stop the server"
echo "============================================="
echo ""

# Try port 3000 first, fallback to 3001
PORT=3000 npm run dev || PORT=3001 npm run dev