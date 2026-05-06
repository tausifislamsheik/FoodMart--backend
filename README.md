# 🍽️ FoodMart Server

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)

**A robust backend API for a modern multi-vendor food delivery marketplace platform**

[Live Demo](https://foodmart-ebon.vercel.app) • [Frontend Repo](https://github.com/tausif-islam-sheik/FoodMart--frontend)

</div>

---

## 📋 Overview

FoodMart is a comprehensive backend API built for a modern food delivery marketplace that connects customers with local restaurants and meal providers. The system handles everything from user authentication and meal browsing to order management and payment processing.

---

## ❓ Problem Statement

Traditional food delivery systems face several challenges:

- **Lack of Multi-Vendor Support** – Most platforms don't support multiple restaurants/providers under one system
- **Complex Authentication** – Managing different user roles (customers, providers, admins) securely is difficult
- **Order Management Chaos** – Tracking orders from placement to delivery across multiple providers
- **Payment Integration Issues** – Handling both cash and digital payments reliably
- **No Review System** – Customers cannot provide feedback on meals they've ordered
- **Manual Provider Management** – Restaurants need technical expertise to manage their online presence

---

## ✅ Solution Overview

FoodMart addresses these challenges with a comprehensive backend solution:

- **Multi-Vendor Architecture** – Supports multiple meal providers with individual profiles and menus
- **Better-Auth Integration** – Secure, role-based authentication with email/password and Google OAuth
- **Complete Order Lifecycle** – Full order tracking from PLACED → PREPARING → READY → DELIVERED
- **Dual Payment Options** – Cash on Delivery (COD) for traditional users and Stripe for digital payments
- **Integrated Review System** – Customers can rate and review meals after delivery
- **Provider Dashboard** – Restaurants can manage their menu, orders, and profile easily
- **RESTful API** – Clean, well-documented endpoints for seamless frontend integration
- **Database-First Design** – PostgreSQL with Prisma ORM for data integrity and performance

---

## ✨ Features

### 🔐 Authentication
- **Better-Auth Integration** – Secure authentication with email/password and Google OAuth
- **Role-Based Access** – Separate roles for Customers, Providers, and Admins
- **Session Management** – Secure cookie-based sessions with HTTP-only cookies

### 🏪 Providers
- **Provider Registration** – Restaurants can register and create their profile
- **Profile Management** – Manage restaurant details, logo, and contact information
- **Meal Management** – Add, update, and remove meals from their menu

### 🍔 Meals & Categories
- **Category System** – Organize meals by categories (e.g., Breakfast, Lunch, Dinner)
- **Meal Catalog** – Browse meals with filtering by category and provider
- **Availability Toggle** – Providers can mark meals as available/unavailable

### 🛒 Shopping Cart
- **Cart Management** – Add meals to cart with quantity control
- **Persistent Cart** – Cart items persist across sessions
- **Price Tracking** – Real-time price updates for cart items

### 📦 Order Management
- **Order Placement** – Seamless checkout with COD or Stripe payment
- **Order Tracking** – Real-time status updates (Placed → Preparing → Ready → Delivered)
- **Order History** – Complete order history for customers and providers

### 💳 Payments
- **Cash on Delivery (COD)** – Traditional payment option
<!-- - **Stripe Integration** – Secure card payments with Stripe
- **Payment Webhook** – Automated payment status updates -->
- **Refund Support** – Handle refunds for cancelled orders

### ⭐ Reviews & Ratings
- **Meal Reviews** – Customers can rate and review meals
- **Rating System** – 1-5 star rating system
- **Review Moderation** – One review per meal per user

---

## 🚀 Live Demo

**Base URL:** `https://foodmart-ebon.vercel.app`

**Health Check:** Visit `/` to verify server status

---

## ️ Tech Stack

| Category      | Technology          | Purpose                  |
|---------------|---------------------|--------------------------|
| **Language**  | TypeScript          | Type-safe development    |
| **Runtime**   | Node.js             | Server environment       |
| **Framework** | Express.js          | Web framework            |
| **ORM**       | Prisma              | Database ORM             |
| **Database**  | PostgreSQL          | Primary database         |
| **Auth**      | Better-Auth         | Authentication           |
| **Payment**   | Stripe              | Payment processing       |
| **Deploy**    | Vercel              | Serverless deployment    |
| **Build**     | tsup                | TypeScript bundling      |

---

## 📁 Project Structure

```
FoodMart--backend/
├── src/
│   ├── modules/
│   │   ├── cart/          # Cart management endpoints
│   │   ├── category/      # Category CRUD operations
│   │   ├── meal/          # Meal management & search
│   │   ├── order/         # Order processing & tracking
│   │   ├── provider/      # Provider profile management
│   │   ├── review/        # Reviews & ratings
│   │   └── user/          # User management
│   ├── lib/
│   │   └── auth.ts        # Better-Auth configuration
│   ├── middlewares/
│   │   ├── globalErrorHandler.ts
│   │   └── notFound.ts
│   ├── config/
│   │   └── stripe.config.ts
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   └── index.ts           # Vercel handler
├── prisma/
│   └── schema.prisma      # Database schema
├── generated/
│   └── prisma/            # Generated Prisma client
├── api/                   # Vercel build output
├── .env.example           # Environment variables template
├── vercel.json            # Vercel deployment config
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database Schema

### Entity Overview

| Entity          | Description                          | Key Fields                               |
|-----------------|--------------------------------------|------------------------------------------|
| **User**        | System users (customers & providers) | id, name, email, role, status            |
| **ProviderProfile** | Restaurant/provider details      | restaurantName, address, phone, logo     |
| **Category**    | Meal classification                  | name, slug                               |
| **Meal**        | Individual food items              | name, description, price, isAvailable    |
| **CartItem**    | User shopping cart items             | userId, mealId, quantity                 |
| **Order**       | Customer orders                      | status, totalAmount, address             |
| **OrderItem**   | Individual items in an order         | orderId, mealId, quantity                |
| **Payment**     | Payment transactions                 | amount, method, status, transactionId    |
| **Review**      | Meal reviews & ratings               | rating, comment, mealId, userId          |

### Enums

- **OrderStatus:** `PLACED`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED`
- **PaymentMethod:** `COD`, `STRIPE`
- **PaymentStatus:** `PENDING`, `PAID`, `FAILED`, `REFUNDED`

---

## 📚 API Reference

### Authentication (Better-Auth)

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| POST   | `/api/auth/sign-up/email`    | Register with email       |
| POST   | `/api/auth/sign-in/email`    | Login with email          |
| POST   | `/api/auth/sign-in/social`   | Google OAuth              |
| GET    | `/api/auth/session`          | Get current session       |
| POST   | `/api/auth/sign-out`         | Logout                    |

### Users

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/users`                 | List all users (Admin)    |
| GET    | `/api/users/:id`             | Get user by ID            |
| PUT    | `/api/users/:id`             | Update user               |
| DELETE | `/api/users/:id`             | Delete user               |

### Providers

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/providers`             | List all providers        |
| POST   | `/api/providers`             | Create provider profile   |
| GET    | `/api/providers/:id`         | Get provider details      |
| PUT    | `/api/providers/:id`         | Update provider           |

### Categories

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/categories`            | List all categories       |
| POST   | `/api/categories`            | Create category (Admin)   |
| GET    | `/api/categories/:id`        | Get category by ID        |
| PUT    | `/api/categories/:id`        | Update category           |
| DELETE | `/api/categories/:id`        | Delete category           |

### Meals

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/meals`                 | List meals (with filters) |
| POST   | `/api/meals`                 | Create meal (Provider)    |
| GET    | `/api/meals/:id`             | Get meal details          |
| PUT    | `/api/meals/:id`             | Update meal               |
| DELETE | `/api/meals/:id`             | Delete meal               |

### Cart

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/carts`                 | Get user's cart           |
| POST   | `/api/carts`                 | Add item to cart          |
| PUT    | `/api/carts/:id`             | Update cart item          |
| DELETE | `/api/carts/:id`             | Remove from cart          |

### Orders

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/orders`                | List user/provider orders |
| POST   | `/api/orders`                | Place new order           |
| GET    | `/api/orders/:id`            | Get order details         |
| PATCH  | `/api/orders/:id/status`     | Update order status       |

### Reviews

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/reviews/:mealId`       | Get meal reviews          |
| POST   | `/api/reviews`               | Create review             |
| PUT    | `/api/reviews/:id`           | Update review             |
| DELETE | `/api/reviews/:id`           | Delete review             |

<!-- ### Webhooks

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| POST   | `/webhook`                   | Stripe payment webhooks   | -->

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm (package manager)
- Stripe account (for payments)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tausif-islam-sheik/FoodMart--backend.git
   cd FoodMart--backend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values (see Environment Variables section below).

4. **Generate Prisma client:**
   ```bash
   pnpm generate
   ```

5. **Run database migrations:**
   ```bash
   pnpm migrate
   ```

6. **Seed admin user:**
   ```bash
   pnpm seed:admin
   ```

7. **Start development server:**
   ```bash
   pnpm dev
   ```

The server will start on `http://localhost:5000`

---

## ⚙️ Environment Variables

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV="development"
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/foodmart"

# Better-Auth
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:5000"

# Frontend URL (for CORS)
APP_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Admin Credentials
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASS="your-secure-password"
```

---

## 🏗️ Architecture

### Authentication Flow
1. Client sends credentials to Better-Auth endpoints
2. Server validates and creates session
3. Session cookie is set (HTTP-only, secure, same-site)
4. Subsequent requests include the session cookie

### Order Flow
1. Customer adds meals to cart
2. Cart items are persisted in database
3. Customer places order (creates Order + OrderItems)
4. Payment is created (COD or Stripe)
5. Provider receives order notification
6. Provider updates order status through lifecycle
7. Customer can track order status in real-time

<!-- ### Payment Flow (Stripe)
1. Client creates payment intent
2. Stripe processes the payment
3. Webhook updates payment status
4. Order status updated automatically on successful payment -->

---

## 📸 Screenshots

<div align="center">

**API Health Check**
```
GET /
Response: "FoodMart server is running...."
```

</div>

---

## 🔧 Development Commands

| Command          | Description                              |
|------------------|------------------------------------------|
| `pnpm dev`       | Start development server with hot reload |
| `pnpm build`     | Build for production                     |
| `pnpm seed:admin`| Create initial admin user                |
| `pnpm stripe:webhook` | Listen to Stripe webhooks locally   |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with for food lovers everywhere.

</div>
