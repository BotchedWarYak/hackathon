# Hackathon Full-Stack Application

A comprehensive full-stack application built with Next.js frontend, FastAPI backend, and SpacetimeDB for real-time data management, integrated with Google's Gemini AI.

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: FastAPI with Python
- **Database**: SpacetimeDB (real-time database)
- **AI Integration**: Google Gemini API
- **Containerization**: Docker & Docker Compose

## Features

- User authentication and authorization
- Role-based permissions (Admin, Moderator, User)
- Real-time chat with AI integration
- User management system
- Secure password handling
- JWT token authentication
- Real-time data synchronization

## Quick Start

1. **Clone and setup**:
   ```bash
   git clone <your-repo>
   cd hackathon
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Gemini API key and other configurations
   ```

3. **Start the application**:
   ```bash
   docker-compose up
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - SpacetimeDB: http://localhost:3001

## Project Structure

```
hackathon/
├── frontend/                 # Next.js frontend
│   ├── components/          # React components
│   ├── pages/              # Next.js pages
│   ├── styles/             # CSS styles
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript types
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Data models
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Business logic
│   └── requirements.txt    # Python dependencies
├── database/               # SpacetimeDB schema
│   ├── src/               # Rust source code
│   ├── Cargo.toml         # Rust dependencies
│   └── spacetime.toml     # SpacetimeDB config
├── docker/                # Docker configurations
├── scripts/               # Utility scripts
└── docker-compose.yml     # Docker orchestration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/` - Get all users (admin only)
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}/permissions` - Update user permissions

### Chat
- `POST /api/chat/` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### SpacetimeDB Development
```bash
cd database
cargo build
spacetimedb start
```

## Environment Variables

Required environment variables (see `.env.example`):

- `GEMINI_API_KEY`: Your Google Gemini API key
- `SECRET_KEY`: JWT secret key
- `SPACETIME_DB_URL`: SpacetimeDB connection URL
- `NEXT_PUBLIC_API_URL`: Frontend API URL

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- CORS protection
- Input validation with Pydantic

## Database Schema

### Users Table
- `id`: Unique identifier
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Hashed password
- `role`: User role (admin, moderator, user)
- `permissions`: JSON array of permissions
- `created_at`: Creation timestamp

### ChatMessage Table
- `id`: Unique identifier
- `user_id`: Reference to user
- `message`: User message
- `response`: AI response
- `created_at`: Creation timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.