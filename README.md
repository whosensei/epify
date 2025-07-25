# Epify - Product Management System

A modern inventory management system built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Product Management**: Complete CRUD operations for products with inventory tracking
- **Real-time Analytics**: Product and user analytics dashboard
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database Migrations**: Automated schema management with Drizzle ORM

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon Database)
- **ORM**: Drizzle ORM
- **Authentication**: JWT, bcryptjs
- **Styling**: Tailwind CSS
- **Package Manager**: npm/pnpm

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- npm or pnpm package manager
- A PostgreSQL database (we recommend Neon Database)
- Git for version control

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd epify
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm:
```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@hostname:port/database"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secure-jwt-secret-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: 
- Replace `DATABASE_URL` with your actual PostgreSQL connection string
- Generate a secure `JWT_SECRET` (32+ characters recommended)

### 4. Database Setup

#### Option A: Automatic Setup (Recommended)
Run the database initialization script:

```bash
npm run db:init
```

This will:
- Generate migration files
- Run all pending migrations
- Set up the complete database schema

#### Option B: Manual Setup
If you prefer manual setup:

```bash
# Generate migration files from schema
npm run db:generate

# Apply migrations to database
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Schema

The application uses two main tables:

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
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate migration files from schema |
| `npm run db:migrate` | Apply migrations to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run db:push` | Push schema changes directly to database |
| `npm run db:init` | Initialize database with complete setup |

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User authentication

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]/quantity` - Update product quantity

### Analytics
- `GET /api/analytics` - Get analytics data

## 🔒 Authentication Flow

1. Users register with email, username, and password
2. Passwords are hashed using bcryptjs
3. JWT tokens are issued upon successful login
4. Protected routes validate JWT tokens
5. User sessions are maintained client-side

## 🗂 Project Structure

```
epify/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── products/          # Product pages
│   └── layout.tsx         # Root layout
├── lib/                   # Utility libraries
│   ├── db/               # Database configuration
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Database schema
│   └── auth.ts           # Authentication utilities
├── migrations/           # Database migrations
├── public/              # Static assets
└── scripts/             # Utility scripts
```

## 🔄 Database Migrations

The project uses Drizzle Kit for database migrations:

1. **Create Migration**: Modify `lib/db/schema.ts` and run `npm run db:generate`
2. **Apply Migration**: Run `npm run db:migrate`
3. **View Database**: Use `npm run db:studio` for a visual interface

## 🛡 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Protected API routes
- Environment variable configuration
