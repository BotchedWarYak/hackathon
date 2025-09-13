#!/bin/bash

echo "Setting up Hackathon Project..."

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your actual API keys and configuration"
fi

# All dependencies will be installed in Docker containers

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Make sure Docker is running"
echo "2. Run: docker-compose up"
echo ""
echo "Don't forget to:"
echo "1. Edit .env file with your Gemini API key"
echo "2. Configure any other environment variables as needed"