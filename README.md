# Hackathon Full-Stack Application

A comprehensive full-stack enterprise application built with Next.js frontend, FastAPI backend, and SQL Server database, integrated with Google's Gemini AI. Ready for Azure deployment.

## Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: FastAPI with Python
- **Database**: SQL Server Developer Edition (Azure SQL Database ready)
- **AI Integration**: Google Gemini API
- **Containerization**: Docker & Docker Compose
- **Enterprise Ready**: Designed for Azure cloud deployment

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

2. **Configure secrets**:
   ```bash
   cp .env.example .env
   # Edit secrets.local.json with your actual API keys and passwords
   # This file is ignored by git for security
   ```

3. **Setup HashiCorp Vault** (first time only):
   ```bash
   ./scripts/setup-vault.sh
   ```

4. **Start the application**:
   ```bash
   docker-compose up
   ```

5. **Initialize the database** (first time only):
   ```bash
   ./scripts/init-database.sh
   ```

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - SQL Server: localhost:1433
   - Vault UI: http://localhost:8200/ui (Token: dev-only-token)

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
├── database/               # SQL Server database
│   ├── init/              # Database initialization scripts
│   │   ├── 01-create-database.sql
│   │   └── 02-seed-data.sql
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

### Database Development
```bash
# Connect to SQL Server
docker exec -it hackathon-sqlserver-1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd"

# Or use Azure Data Studio / SQL Server Management Studio
# Server: localhost,1433
# Username: sa
# Password: YourStrong!Passw0rd
```

## Environment Variables

Required environment variables (see `.env.example`):

- `GEMINI_API_KEY`: Your Google Gemini API key
- `SECRET_KEY`: JWT secret key
- `DATABASE_URL`: SQL Server connection string
- `DATABASE_HOST`: SQL Server host
- `DATABASE_PORT`: SQL Server port
- `DATABASE_NAME`: Database name
- `DATABASE_USER`: Database username
- `DATABASE_PASSWORD`: Database password
- `NEXT_PUBLIC_API_URL`: Frontend API URL

## Security Features

- **Secrets Management**: HashiCorp Vault integration for secure secrets storage
- **Password Security**: bcrypt hashing with salt rounds
- **Authentication**: JWT token-based authentication with configurable expiration
- **Authorization**: Role-based access control with granular permissions
- **API Security**: CORS protection and input validation with Pydantic
- **Database Security**: Parameterized queries to prevent SQL injection
- **Production Ready**: Azure Key Vault integration for cloud deployment

## Database Schema

### Users Table
- `Id`: Unique identifier (NVARCHAR(36) PRIMARY KEY)
- `Username`: Unique username (NVARCHAR(100) UNIQUE)
- `Email`: Unique email address (NVARCHAR(255) UNIQUE)
- `PasswordHash`: Hashed password (NVARCHAR(255))
- `Role`: User role (NVARCHAR(50))
- `Permissions`: JSON array of permissions (NVARCHAR(MAX))
- `CreatedAt`: Creation timestamp (DATETIME2)
- `UpdatedAt`: Last update timestamp (DATETIME2)

### ChatMessages Table
- `Id`: Unique identifier (NVARCHAR(36) PRIMARY KEY)
- `UserId`: Reference to user (NVARCHAR(36) FOREIGN KEY)
- `Message`: User message (NVARCHAR(MAX))
- `Response`: AI response (NVARCHAR(MAX))
- `CreatedAt`: Creation timestamp (DATETIME2)

### Events Table
- `Id`: Unique identifier (NVARCHAR(36) PRIMARY KEY)
- `Name`: Event name (NVARCHAR(255))
- `Description`: Event description (NVARCHAR(MAX))
- `Status`: Event status (NVARCHAR(50))
- `StartDate`: Start date (DATETIME2)
- `EndDate`: End date (DATETIME2)
- `ParticipantCount`: Number of participants (INT)
- `Organization`: Organizing body (NVARCHAR(255))
- `Type`: Event type (NVARCHAR(100))
- `EventData`: JSON configuration (NVARCHAR(MAX))
- `CreatedBy`: User who created event (NVARCHAR(36) FOREIGN KEY)
- `CreatedAt`: Creation timestamp (DATETIME2)
- `UpdatedAt`: Last update timestamp (DATETIME2)

### Infrastructure Table
- `Id`: Unique identifier (NVARCHAR(36) PRIMARY KEY)
- `EventId`: Reference to event (NVARCHAR(36) FOREIGN KEY)
- `Name`: Infrastructure name (NVARCHAR(255))
- `Status`: Infrastructure status (NVARCHAR(50))
- `TotalVMs`: Number of VMs (INT)
- `NetworkSegments`: Number of network segments (INT)
- `EstimatedResources`: JSON resource estimates (NVARCHAR(MAX))
- `NetworkNodes`: JSON network topology (NVARCHAR(MAX))
- `CreatedAt`: Creation timestamp (DATETIME2)
- `UpdatedAt`: Last update timestamp (DATETIME2)

## Azure Deployment

This application is designed for easy deployment to Azure using the following services:

### Recommended Azure Architecture

1. **Azure SQL Database**: Production database (same engine as SQL Server Developer Edition)
2. **Azure Container Apps**: For backend API deployment
3. **Azure Static Web Apps**: For frontend deployment
4. **Azure Key Vault**: For secure secret management

### Azure SQL Database Setup

1. Create Azure SQL Database:
   ```bash
   az sql server create --name your-server --resource-group your-rg --location eastus --admin-user sqladmin --admin-password YourStrong!Passw0rd
   az sql db create --resource-group your-rg --server your-server --name HackathonDB --service-objective Basic
   ```

2. Update connection string in Azure App Service configuration:
   ```
   DATABASE_URL=mssql+pyodbc://sqladmin:YourStrong!Passw0rd@your-server.database.windows.net:1433/HackathonDB?driver=ODBC+Driver+17+for+SQL+Server&Encrypt=yes&TrustServerCertificate=no&Connection+Timeout=30
   ```

3. Run database initialization scripts via Azure SQL Database Query Editor or Azure Data Studio

### Container Apps Deployment

1. Build and push backend container:
   ```bash
   az acr create --resource-group your-rg --name yourregistry --sku Basic
   docker build -t yourregistry.azurecr.io/hackathon-backend:latest ./backend
   docker push yourregistry.azurecr.io/hackathon-backend:latest
   ```

2. Deploy to Container Apps:
   ```bash
   az containerapp create \
     --name hackathon-backend \
     --resource-group your-rg \
     --environment your-env \
     --image yourregistry.azurecr.io/hackathon-backend:latest \
     --target-port 8000 \
     --ingress external
   ```

### Static Web Apps Deployment

1. Deploy frontend via GitHub Actions (automatically configured)
2. Update `NEXT_PUBLIC_API_URL` to point to your Container App URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.