# Running Bytebot Project

## Prerequisites

- Node.js (version 18 or higher)
- npm (version 8 or higher)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bytebot-main
   ```

2. Install dependencies for each package:
   ```bash
   cd packages/bytebotd
   npm install
   
   cd ../bytebot-agent
   npm install
   
   cd ../shared
   npm install
   ```

3. Install required type definitions:
   ```bash
   cd packages/bytebotd
   npm install --save-dev @types/node @types/express
   npm install bcryptjs passport passport-jwt @nestjs/jwt @nestjs/passport
   ```

## Environment Configuration

1. Create environment files:
   ```bash
   cd packages/bytebotd
   cp .env.example .env
   ```

2. For production deployment:
   ```bash
   cp .env.production .env
   ```
   Then edit the `.env` file to set appropriate values for your production environment.

## Running the Application

### Development Mode

1. Start the bytebotd service:
   ```bash
   cd packages/bytebotd
   npm run start:dev
   ```

2. Start the bytebot-agent service:
   ```bash
   cd packages/bytebot-agent
   npm run start:dev
   ```

### Production Mode

1. Build the applications:
   ```bash
   cd packages/bytebotd
   npm run build
   
   cd packages/bytebot-agent
   npm run build
   ```

2. Start the applications:
   ```bash
   cd packages/bytebotd
   npm run start:prod
   
   cd packages/bytebot-agent
   npm run start:prod
   ```

## Key API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### OS Intelligence
- `GET /os-intelligence/status` - System intelligence status
- `POST /os-intelligence/optimize` - Optimize system resources
- `POST /os-intelligence/anticipate-needs` - Anticipate user needs

### Monitoring
- `GET /monitoring/health` - Application health status
- `GET /monitoring/metrics` - System metrics

### SMARTS (AI Agent System)
- `POST /smarts/execute` - Execute AI tasks
- `GET /smarts/status` - Get SMARTS system status

## Default Credentials

For development purposes, a default admin user is created:
- Username: `admin`
- Password: `admin123`

**Important**: Change these credentials in production!

## Project Structure

- `packages/bytebotd/` - Daemon service with OS-level intelligence
- `packages/bytebot-agent/` - AI agent system (SMARTS)
- `packages/shared/` - Shared code between services

## Troubleshooting

1. If you encounter TypeScript errors, ensure all dependencies are installed:
   ```bash
   npm install --save-dev @types/node @types/express
   ```

2. If authentication fails, check your JWT secret in the environment file.

3. For database issues, verify the DATABASE_URL in your environment configuration.

## Security Considerations

1. Always use strong, unique passwords in production
2. Change the default JWT secret
3. Use HTTPS in production
4. Regularly run security audits using the built-in security audit endpoints
5. Monitor logs for suspicious activity