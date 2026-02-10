# Homelab Service Manager API

A comprehensive REST API for managing homelab services with built-in security monitoring, vulnerability tracking, SSL certificate management, and maintenance logging.

## Project Overview
This API provides a complete solution for homelab administrators to:
- **Manage Services**: Track all your homelab services with detailed metadata
- **Security Monitoring**: Monitor vulnerabilities and security scores
- **SSL Certificate Management**: Track certificate expiration and prevent outages
- **Maintenance Logging**: Document all maintenance activities and changes
- **Role-Based Access**: Support for users and admins

## Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher (Must be installed and running)

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/homelab-service-manager-api.git
cd homelab-service-manager-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=homelab_service_manager
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

4. **Set up the database**
```bash
# Create database, run migrations, and seed data
npm run db:setup
```

5. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Documentation

- [**API Endpoint Documentation**](docs/API.md)
- [**POSTMAN Documentation**](https://documenter.getpostman.com/view/51755130/2sBXcAJhzM)

## Running Tests
This project uses Jest and Supertest for testing.
- **Run all tests:** `npm test`
- **Watch mode:** `npm run test:watch`

## Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Testing**: Jest, Supertest

## Project Structure

```
homelab-service-manager-api/
├── src/
│   ├── config/           # Configuration files
│   ├── models/           # Sequelize models
│   ├── middleware/       # Express middleware
│   ├── controllers/      # Route controllers
│   ├── routes/           # API routes
│   ├── validators/       # Request validators
│   ├── utils/            # Utility functions
│   └── app.js            # Express app setup
├── database/
│   ├── migrations/       # Database migrations
│   └── seeders/          # Database seeders
├── tests/                
│   ├── unit/             # Unit tests
│   ├── utils/            # Utility functions for test
│   └── setup.js          # Test setup
├── logs/                 # Application logs
├── docs/                 # Documentation
├── jest.config.js        # Jest config
├── .sequelizerc          # Sequelize config
├── .env                  # Environment variables
├── server.js             # Entry point
└── package.json          # Dependencies
```

## Author
**Rasmus Westerlund**
- GitHub: [@Frasse007](https://github.com/Frasse007)
