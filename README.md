# Acquisitions - Authentication API

A RESTful API for user authentication built with Node.js, Express.js, Drizzle ORM, and Neon Database.

## 🚀 Features

- User registration and authentication
- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting and security with Arcjet
- Logging with Winston
- Dockerized development and production environments
- Neon Local for development, Neon Cloud for production

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 22+** (for local development without Docker)
- **Neon Database account** (for production)
- **Arcjet API Key** (optional, for rate limiting)

## 🏗️ Architecture

### Development Environment
- **Neon Local**: PostgreSQL proxy running in Docker for local development
- **PostgreSQL 16**: Backing database for Neon Local
- **Application**: Node.js app with hot-reloading

### Production Environment
- **Neon Cloud**: Serverless PostgreSQL database
- **Application**: Optimized Node.js app

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Asadaligondal/acquisitions.git
cd acquisitions
```

### 2. Environment Setup

#### Development Environment

Copy the development environment template:

```bash
cp .env.development .env
```

Edit `.env` and update the following variables:
- `JWT_SECRET`: A secure secret for JWT tokens
- `ARCJET_KEY`: Your Arcjet API key (get from https://arcjet.com)

The `DATABASE_URL` is already configured to use Neon Local.

#### Production Environment

Copy the production environment template:

```bash
cp .env.production .env.prod
```

Edit `.env.prod` and update:
- `DATABASE_URL`: Your Neon Cloud connection string from https://console.neon.tech
- `JWT_SECRET`: A strong secret (generate with `openssl rand -base64 32`)
- `ARCJET_KEY`: Your production Arcjet API key

---

## 🐳 Docker Development

### Start Development Environment

This command starts:
- Neon Local proxy
- PostgreSQL database
- Application with hot-reloading

```bash
docker-compose -f docker-compose.dev.yml up --build
```

The application will be available at `http://localhost:3000`.

### Run Database Migrations

```bash
# Generate migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Apply migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Open Drizzle Studio (Database GUI)
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

### Stop Development Environment

```bash
docker-compose -f docker-compose.dev.yml down
```

### Clean Up (Remove Volumes)

```bash
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🚀 Docker Production

### Start Production Environment

```bash
# Load production environment variables
export $(cat .env.prod | xargs)

# Start production services
docker-compose -f docker-compose.prod.yml up --build -d
```

### Run Migrations in Production

```bash
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### View Logs

```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

### Stop Production Environment

```bash
docker-compose -f docker-compose.prod.yml down
```

---

## 💻 Local Development (Without Docker)

### Install Dependencies

```bash
npm install
```

### Set Up Neon Database

1. Create a Neon project at https://console.neon.tech
2. Copy the connection string
3. Update `DATABASE_URL` in `.env`

### Run Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

---

## 📚 API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user"
}
```

#### Sign In
```http
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Sign Out
```http
POST /api/auth/sign-out
```

### Health Check
```http
GET /health
```

---

## 🗃️ Database Schema

### Users Table

| Column     | Type      | Constraints           |
|------------|-----------|-----------------------|
| id         | serial    | PRIMARY KEY           |
| name       | varchar   | NOT NULL              |
| email      | varchar   | NOT NULL, UNIQUE      |
| password   | varchar   | NOT NULL (hashed)     |
| role       | varchar   | NOT NULL, DEFAULT 'user' |
| createdAt  | timestamp | NOT NULL, DEFAULT now() |
| updatedAt  | timestamp | NOT NULL, DEFAULT now() |

---

## 🔒 Environment Variables

### Required Variables

| Variable      | Description                          | Example                                      |
|---------------|--------------------------------------|----------------------------------------------|
| NODE_ENV      | Environment mode                     | `development` or `production`                |
| PORT          | Server port                          | `3000`                                       |
| DATABASE_URL  | Database connection string           | See below                                    |
| JWT_SECRET    | Secret for JWT token signing         | `your_secret_key`                            |
| ARCJET_KEY    | Arcjet API key for rate limiting     | `ajkey_*****`                                |
| LOG_LEVEL     | Logging level                        | `debug`, `info`, `warn`, `error`             |

### Database URLs

**Development (Neon Local):**
```
postgres://neondb_owner:neondb_password@neon-local:5432/neondb
```

**Production (Neon Cloud):**
```
postgres://user:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require
```

---

## 📦 Scripts

| Command            | Description                              |
|--------------------|------------------------------------------|
| `npm run dev`      | Start development server with hot-reload |
| `npm start`        | Start production server                  |
| `npm run lint`     | Run ESLint                               |
| `npm run lint:fix` | Fix ESLint errors                        |
| `npm run format`   | Format code with Prettier                |
| `npm run db:generate` | Generate database migrations          |
| `npm run db:migrate`  | Apply database migrations             |
| `npm run db:studio`   | Open Drizzle Studio                   |

---

## 🔧 Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Express.js 5
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Security**: Helmet, CORS, Arcjet
- **Logging**: Winston
- **Containerization**: Docker & Docker Compose

---

## 🌐 Neon Local vs Neon Cloud

### Neon Local (Development)
- Runs in Docker using `neondatabase/neon-proxy`
- Provides ephemeral PostgreSQL instances
- Fast local development without cloud dependency
- Automatic database creation and teardown
- Connection: `postgres://neondb_owner:neondb_password@neon-local:5432/neondb`

### Neon Cloud (Production)
- Serverless PostgreSQL in the cloud
- Auto-scaling and branching
- Production-grade reliability
- Connection from Neon Console
- Connection: `postgres://user:pass@ep-xyz.region.aws.neon.tech/db?sslmode=require`

---

## 🚢 Deployment

### Deploy with Docker

1. Build the production image:
   ```bash
   docker build -t acquisitions-app .
   ```

2. Run the container with environment variables:
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DATABASE_URL="your_neon_url" \
     -e JWT_SECRET="your_secret" \
     -e NODE_ENV=production \
     acquisitions-app
   ```

### Deploy to Cloud Platforms

#### Render / Railway / Fly.io
1. Connect your GitHub repository
2. Set environment variables in the platform dashboard
3. Use `Dockerfile` for deployment
4. Set build command: `docker build`
5. Set start command: `node src/index.js`

#### AWS / GCP / Azure
1. Push Docker image to container registry (ECR, GCR, ACR)
2. Deploy using container services (ECS, Cloud Run, Container Instances)
3. Set environment variables via platform configuration

---

## 🧪 Testing

### Test with HTTPie

```bash
# Sign up
http POST http://localhost:3000/api/auth/sign-up \
  name="John Doe" \
  email="john@example.com" \
  password="password123" \
  role="user"

# Sign in
http POST http://localhost:3000/api/auth/sign-in \
  email="john@example.com" \
  password="password123"

# Health check
http GET http://localhost:3000/health
```

---

## 📝 Project Structure

```
acquisitions/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validations/     # Input validation schemas
│   ├── app.js           # Express app setup
│   ├── server.js        # Server initialization
│   └── index.js         # Entry point
├── drizzle/             # Database migrations
├── logs/                # Application logs
├── Dockerfile           # Docker image definition
├── docker-compose.dev.yml   # Development environment
├── docker-compose.prod.yml  # Production environment
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
├── init-db.sql          # Database initialization script
└── package.json         # Node.js dependencies
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

- [Neon Database](https://neon.tech) - Serverless PostgreSQL
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Arcjet](https://arcjet.com) - Security and rate limiting
- [Express.js](https://expressjs.com) - Web framework

---

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/Asadaligondal/acquisitions/issues
- Neon Documentation: https://neon.tech/docs
- Neon Local Documentation: https://neon.tech/docs/local/neon-local
