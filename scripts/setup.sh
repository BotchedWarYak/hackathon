#!/bin/bash

echo "Setting up Hackathon Project..."

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your actual API keys and configuration"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Build SpacetimeDB module
echo "Building SpacetimeDB module..."
cd database
cargo build --release
cd ..

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Make sure Docker is running"
echo "2. Run: docker-compose up"
echo ""
echo "Don't forget to:"
echo "1. Edit .env file with your Gemini API key"
echo "2. Configure any other environment variables as needed"