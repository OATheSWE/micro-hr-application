# 🧠 Fullstack HR System

A modern, fullstack internal HR management system built with Next.js, featuring role-based authentication, employee management, and AWS S3 integration for image uploads.

## 📦 Tech Stack

- **Frontend**: Next.js 15 (TypeScript App Router), TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: AWS S3 for image uploads
- **Authentication**: JWT-based role-based access (Admin, Employee)
- **State Management**: React Context API
- **Testing**: Vitest for unit testing
- **CI/CD**: GitHub Actions
- **Deployment**: AWS Amplify

## 🚀 Live Demo

[Deployed on AWS Amplify](https://your-amplify-app-url.amplifyapp.com)

## 🎯 Features

### Authentication & Authorization
- **Role-based access control**: Admin and Employee roles
- **JWT-based authentication** with secure cookie storage
- **Protected routes** with middleware validation
- **Session management** with React Context API

### Admin Features
- ✅ **Employee Management**: Add, edit, delete employees
- ✅ **Employee Listing**: Paginated employee list with search
- ✅ **Dashboard**: Real-time statistics and department breakdown
- ✅ **Image Upload**: AWS S3 integration for employee photos
- ✅ **Settings**: System configuration management

### Employee Features
- ✅ **Profile View**: Read-only personal profile
- ✅ **Secure Access**: Role-based route protection

### Database Schema
- **Users Table**: Authentication and role management
- **Employees Table**: Employee data with S3 image URLs
- **Drizzle Migrations**: Type-safe database operations

### Image Upload System
- **AWS S3 Integration**: Secure file uploads with signed URLs
- **Image Processing**: Support for JPEG, PNG, GIF, WebP
- **Public URLs**: Direct access to uploaded images

## 🏗 Architecture Overview

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── employees/     # Employee CRUD operations
│   │   └── upload/        # Image upload endpoints
│   ├── admin/             # Admin dashboard pages
│   └── employee/          # Employee profile pages
├── components/            # Reusable UI components
│   └── ui/               # Animata UI components
├── contexts/              # React Context providers
├── lib/                   # Core utilities
│   ├── api/              # API client functions
│   ├── auth/             # JWT authentication
│   ├── aws/              # S3 integration
│   ├── config/           # Environment configuration
│   └── db/               # Database operations
└── test/                 # Test setup and utilities
```

## 🧪 Testing

Comprehensive unit tests using Vitest:

- **Authentication Tests**: JWT token validation and user authentication
- **Database Tests**: Connection and query validation
- **Utility Tests**: Helper function validation
- **API Tests**: Endpoint functionality validation

Run tests:
```bash
pnpm test              # Run all tests
pnpm test:run         # Run tests once
pnpm test:coverage    # Generate coverage report
```

## 🚀 Deployment

### AWS Amplify Setup

1. **Environment Variables**:
   ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret
   ACCESS_KEY_ID=your_aws_access_key
   SECRET_ACCESS_KEY=your_aws_secret_key
   REGION=eu-west-1
   S3_BUCKET=your_bucket_name
   ```

2. **Build Settings**:
   - Build Command: `pnpm build`
   - Output Directory: `.next`

3. **Database**: PostgreSQL instance (RDS or external)

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:generate
pnpm db:migrate

# Seed database
pnpm db:seed

# Start development server
pnpm dev
```

## 📊 Database Operations

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio

# Test database connection
pnpm db:test
```

## 🔧 Development Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report
```

## 🛡 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin and Employee role separation
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Drizzle ORM with parameterized queries
- **File Upload Security**: Type and size validation for images

## 🎨 UI/UX Features

- **Modern Design**: Clean, premium interface using TailwindCSS
- **Animations**: Smooth transitions with Framer Motion
- **Responsive Design**: Mobile-first approach
- **Loading States**: Optimistic UI updates
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback

## 📈 Performance Optimizations

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Strategic caching for API responses
- **Database Optimization**: Efficient queries with Drizzle ORM
- **Bundle Optimization**: Tree-shaking and minification

## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:
- ✅ Dependency installation
- ✅ Linting and type checking
- ✅ Unit test execution
- ✅ Build verification
- ✅ Automatic deployment to AWS Amplify

## 📝 Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hr_system

# JWT
JWT_SECRET=your-super-secret-jwt-key

# AWS S3 (Amplify-compatible names)
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
REGION=eu-west-1
S3_BUCKET=your_bucket_name

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🧠 Technical Decisions

### Why Next.js App Router?
- **Server Components**: Better performance and SEO
- **API Routes**: Unified fullstack development
- **TypeScript**: Type safety across the stack
- **Built-in Optimization**: Automatic code splitting and optimization

### Why Drizzle ORM?
- **Type Safety**: End-to-end type safety
- **Performance**: Lightweight and fast
- **Migration System**: Version-controlled schema changes
- **Query Builder**: Intuitive and powerful

### Why AWS S3 for Images?
- **Scalability**: Handles any amount of traffic
- **Security**: Signed URLs for secure access
- **Cost-effective**: Pay only for what you use
- **CDN Integration**: Global content delivery

### Why JWT Authentication?
- **Stateless**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Secure**: Tamper-proof tokens
- **Flexible**: Custom claims for roles

## 📹 Video Walkthrough
https://screenrec.com/share/PWQcVmRTaU

## Link to site
https://main.d2rui1j8gj3xa8.amplifyapp.com/

## 💬 Note on SQL Test Score

> During the timed technical test, I scored 0 on the single SQL question due to a mistake under time pressure. However, I actively use PostgreSQL with Drizzle ORM in this project. You will find my SQL logic clean, structured, and embedded in the real-world application layer.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is built as a technical assignment for demonstration purposes.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
