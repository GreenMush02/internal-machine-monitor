#!/bin/bash

# SmartFlow Dashboard - Quick Start Script

echo "=================================="
echo "   SmartFlow Dashboard Starter"
echo "=================================="
echo ""

# Check if Python3 is installed
if command -v python3 &> /dev/null; then
    echo "✓ Python3 found"
    echo ""
    echo "Starting HTTP server on port 8000..."
    echo "Dashboard will be available at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "=================================="
    echo ""
    
    # Start Python HTTP server
    python3 -m http.server 8000
else
    echo "✗ Python3 not found"
    echo ""
    echo "Please install Python3 or use one of these alternatives:"
    echo "  1. VS Code Live Server extension"
    echo "  2. npx http-server"
    echo "  3. Open index.html directly in browser"
    echo ""
fi
