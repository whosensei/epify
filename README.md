
A modern inventory management system built with Next.js, TypeScript, and PostgreSQL. Features complete Docker containerization for instant setup and development.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Product Management**: Complete CRUD operations for products with inventory tracking
- **Real-time Analytics**: Product and user analytics dashboard
- **Sample Data**: Pre-loaded with demo users and 25 sample products for testing
- **Docker Ready**: Full containerization with one-command setup
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database Migrations**: Automated schema management with Drizzle ORM

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 15 (Docker container with persistent storage)
- **ORM**: Drizzle ORM with Drizzle Kit
- **Authentication**: JWT, bcryptjs
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm (with npm fallback)
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

### 🐳 Docker Setup (Recommended - Fastest)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git for version control
- **No database setup required!** 

### 🐳 One-Command Setup

```bash
# Clone and setup in one go
git clone <repository-url>
cd epify

# Auto-setup with secure defaults
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**OR manually:**

```bash
git clone <repository-url>
cd epify

# Start the application and database
docker-compose up --build
```

#### 🎉 That's it!
- **Web App**: http://localhost:3000
- **Database**: localhost:5432 
- **Sample Data**: Automatically loaded with demo users and 25 products

#### 🔑 Demo Accounts
The setup includes pre-configured demo accounts:
- **user1**: `user1@epify.com` / `password123`
- **user2**: `user2@epify.com` / `password123`  
- **user3**: `user3@epify.com` / `password123`

📖 **For more Docker options, see [docs/DOCKER_SETUP.md](docs/DOCKER_SETUP.md)**

---

## 🔒 Security & Environment Variables

### Environment Configuration

Epify uses environment variables for configuration. The setup script automatically creates a `.env` file with secure defaults.

**Key Security Features:**
- ✅ Auto-generated JWT secrets (64-character hex)
- ✅ Environment-based configuration
- ✅ `.env` files excluded from version control
- ✅ No hardcoded secrets in Docker files
- ✅ Secure password hashing with bcrypt

### Manual Environment Setup

If you need to manually configure environment variables:

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update the values in `.env`:**

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database"

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET="your-super-secure-jwt-secret-key-32-chars-minimum"

# App Configuration  
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. **Generate a secure JWT secret:**
   ```bash
   openssl rand -hex 32
   ```

⚠️ **IMPORTANT**: Never commit `.env` files to version control!

---

### 💻 Manual Setup (Advanced Users)

For developers who prefer manual configuration:

#### 1. Clone and Install
```bash
git clone <repository-url>
cd epify

# Install dependencies (pnpm recommended)
pnpm install
# or
npm install
```

#### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database"

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET="your-super-secure-jwt-secret-key-32-chars-minimum"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### 3. Database Setup

**Option A: Use provided SQL schema (Recommended)**
```bash
# Run the initialization script on your PostgreSQL database
psql -d your_database -f scripts/init-db.sql
```

**Option B: Use Drizzle migrations**
```bash
# Generate migration files from schema
pnpm db:generate

# Apply migrations to database  
pnpm db:migrate
```

#### 4. Start Development Server
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Schema

The application uses a relational PostgreSQL schema

### Users Table
- `userID` (Primary Key, Serial)
- `username` (Unique, Not Null)
- `email` (Unique, Not Null)
- `password` (Hashed, Not Null)

### Products Table
- `id` (Primary Key, Serial)
- `productName` (Not Null)
- `type` (Not Null)
- `sku` (Unique, Not Null)
- `image_url` (Optional)
- `description` (Not Null)
- `quantity` (Integer, Not Null)
- `price` (Decimal, Not Null)
- `userID` (Foreign Key to Users, Not Null)

## 🔍 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate migration files from schema |
| `pnpm db:migrate` | Apply migrations to database |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:push` | Push schema changes directly to database |

*Note: All commands work with `npm` as well (replace `pnpm` with `npm run`)*

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication

### Products
- `GET /api/products` - List all products for authenticated user
- `POST /api/products` - Create new product
- `PUT /api/products/[id]/quantity` - Update product quantity

### Analytics
- `GET /api/analytics` - Get user and product analytics data

## 🔒 Authentication Flow

1. **Registration**: Users register with email, username, and password
2. **Password Security**: Passwords are hashed using bcryptjs with salt rounds
3. **JWT Tokens**: Secure tokens issued upon successful login
4. **Protected Routes**: API routes validate JWT tokens for access control
5. **Session Management**: Client-side session handling with automatic token validation

## 🗂 Project Structure

```
epify/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── analytics/     # Analytics endpoints
│   │   ├── login/         # Authentication
│   │   ├── products/      # Product management
│   │   └── signup/        # User registration
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── products/          # Product management pages
│   └── layout.tsx         # Root layout
├── lib/                   # Utility libraries
│   ├── db/               # Database configuration
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Database schema
│   └── auth.ts           # Authentication utilities
├── migrations/           # Database migrations
├── scripts/             # Setup and utility scripts
│   ├── setup.sh         # Automated Docker setup
│   └── init-db.sql      # Database initialization
├── docker-compose.yml   # Docker services configuration
├── Dockerfile          # Container build instructions
└── .dockerignore       # Docker build optimization
```

## 🔄 Database Management

### Using Docker (Recommended)
The Docker setup automatically handles database creation, schema setup, and sample data loading. No manual intervention required!

### Manual Database Operations
```bash
# Generate new migrations after schema changes
pnpm db:generate

# Apply pending migrations
pnpm db:migrate

# Push schema changes directly (development only)
pnpm db:push

# Open database GUI
pnpm db:studio
```

### Sample Data
The `scripts/init-db.sql` file includes:
- 3 demo user accounts
- 25 sample products across various categories (Electronics, Appliances, Furniture, etc.)
- Proper indexes for optimal performance
- Referential integrity constraints

## 📊 Database Viewing & Inspection

Easily view and inspect your database content with these convenient options:

### 🚀 Option 1: Custom Database Viewer Script (Easiest)
```bash
./scripts/view-db.sh
```
**Quick overview of your entire database with formatted output including:**
- Database tables summary
- All users with count
- Products preview with count
- Helpful commands for further exploration

### 📱 Option 2: Quick Data Queries
```bash
# View all users
docker exec epify-db-1 psql -U epify_user -d epify_db -c "SELECT * FROM users;"

# View all products
docker exec epify-db-1 psql -U epify_user -d epify_db -c "SELECT id, \"productName\", price, quantity FROM products;"

# Search products by name
docker exec epify-db-1 psql -U epify_user -d epify_db -c "SELECT * FROM products WHERE \"productName\" ILIKE '%iPhone%';"

# Count total records
docker exec epify-db-1 psql -U epify_user -d epify_db -c "SELECT COUNT(*) FROM products;"
```

### 💻 Option 3: Interactive Database Shell
```bash
docker exec -it epify-db-1 psql -U epify_user -d epify_db
```
**Full interactive PostgreSQL shell for complex queries. Common commands:**
- `\dt` - List all tables
- `\d table_name` - Describe table structure
- `SELECT * FROM users;` - Query users
- `\q` - Exit shell

### 🔧 Option 4: External GUI Tools
Connect any PostgreSQL client with these credentials:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `epify_db`
- **Username**: `epify_user`
- **Password**: `epify_password`

## 🛡 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Protected API routes
- Environment variable configuration
