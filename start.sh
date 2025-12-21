#!/bin/bash

echo "🚀 Starting Prompt2Support Application"
echo "======================================"

# Check if we're in production (Railway sets RAILWAY_ENVIRONMENT)
if [ "$RAILWAY_ENVIRONMENT" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    echo "🏭 Production deployment detected"
    export NODE_ENV=production

    # Install dependencies if needed
    if [ ! -d "../backend/node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        cd ../backend && npm ci && cd ../frontend
    fi

    # Build frontend for production
    echo "🔨 Building frontend..."
    npm run build

    # Start backend
    echo "🔧 Starting backend server..."
    cd ../backend
    node server-final.js &
    BACKEND_PID=$!

    # Start frontend (serve built files)
    echo "🎨 Starting frontend server..."
    cd ../frontend
    npx serve -s build -l 3000 &
    FRONTEND_PID=$!

    echo "✅ Services started in production mode"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8000"

    # Wait for services
    wait
else
    echo "💻 Development mode"

    # Kill any existing processes
    echo "🧹 Cleaning up existing processes..."
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "craco start" 2>/dev/null
    sleep 2

    # Start backend
    echo "🔧 Starting backend server..."
    cd backend
    node server-final.js &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID) on http://localhost:8000"

    # Wait for backend to start
    sleep 3

    # Test backend
    echo "🧪 Testing backend..."
    curl -s http://localhost:8000/ > /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Backend is responding"
    else
        echo "❌ Backend failed to start"
        exit 1
    fi

    # Start frontend
    echo "🎨 Starting frontend..."
    cd ../frontend
    npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID)"

    echo ""
    echo "🎉 Application is starting up!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8000"
    echo "🎯 Demo Page: http://localhost:3000/demo"
    echo ""
    echo "Press Ctrl+C to stop both servers"

    # Wait for user to stop
    trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
fi