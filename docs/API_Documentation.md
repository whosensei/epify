# API Documentation

## Overview

This document provides comprehensive documentation for the Epify API. The API provides endpoints for user authentication, product management, and analytics. All endpoints that require authentication use JWT (JSON Web Token) based authentication.

## Base URL

```
http://localhost:3000/
```

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. **Sign Up**: Create a new user account
2. **Login**: Authenticate and receive a JWT token
3. **Use Token**: Include the token in subsequent API calls

---

## Endpoints

### Authentication Endpoints

#### 1. User Signup

**POST** `/signup`

Creates a new user account.

**Authentication Required**: No

**Request Body**:
```json
{
  "username": "string",
  "email": "string", 
  "password": "string"
}
```

**Request Body Parameters**:
- `username` (string, required): Unique username for the account
- `email` (string, required): Valid email address
- `password` (string, required): Password (minimum 6 characters)

**Success Response** (201):
```json
{
  "message": "User successfully signed up",
  "user": {
    "userID": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- **400 Bad Request**: Missing required fields or password too short
  ```json
  {
    "message": "Username, email, and password are required"
  }
  ```
- **409 Conflict**: Username or email already exists
  ```json
  {
    "message": "Username already exists"
  }
  ```

---

#### 2. User Login

**POST** `/login`

Authenticates a user and returns a JWT token.

**Authentication Required**: No

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Request Body Parameters**:
- `username` (string, required): User's username
- `password` (string, required): User's password

**Success Response** (201):
```json
{
  "message": "User successfully signed in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**:
- **400 Bad Request**: Missing username or password
  ```json
  {
    "message": "Username and password are required"
  }
  ```
- **401 Unauthorized**: Invalid credentials
  ```json
  {
    "message": "No such user exists. Please signup"
  }
  ```
  ```json
  {
    "message": "Incorrect password"
  }
  ```

---

### Product Management Endpoints

#### 3. Add Product

**POST** `/products`

Creates a new product or updates quantity if product with same SKU exists.

**Authentication Required**: Yes

**Request Body**:
```json
{
  "name": "string",
  "type": "string",
  "sku": "string",
  "image_url": "string",
  "description": "string",
  "quantity": "number",
  "price": "number"
}
```

**Request Body Parameters**:
- `name` (string, required): Product name
- `type` (string, required): Product category/type
- `sku` (string, required): Stock Keeping Unit (unique identifier)
- `image_url` (string, optional): URL to product image
- `description` (string, required): Product description
- `quantity` (number, required): Product quantity (non-negative integer)
- `price` (number, required): Product price (non-negative number)

**Success Response** (201):

*For new product*:
```json
{
  "message": "Product added successfully",
  "product": {
    "id": 1
  }
}
```

*For existing SKU (quantity update)*:
```json
{
  "message": "Product quantity updated successfully",
  "product": {
    "id": 1
  }
}
```

**Error Responses**:
- **400 Bad Request**: Missing or invalid fields
  ```json
  {
    "message": "Product name is required"
  }
  ```
- **401 Unauthorized**: Authentication required
  ```json
  {
    "message": "Authentication required to add products"
  }
  ```
- **409 Conflict**: SKU exists with different product name
  ```json
  {
    "message": "Product with SKU ABC123 already exists with different name: Existing Product"
  }
  ```

---

#### 4. Get Products

**GET** `/products?page=<page_number>`

Retrieves a paginated list of products.

**Authentication Required**: Yes

**Query Parameters**:
- `page` (number, optional): Page number for pagination (default: 1)

**Success Response** (200):
```json
{
  "message": "Products retrieved successfully",
  "products": [
    {
      "id": 1,
      "productName": "Sample Product",
      "type": "Electronics",
      "sku": "SKU123",
      "quantity": 50,
      "price": "29.99",
      "userID": 1
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 45,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Authentication required
  ```json
  {
    "message": "Authentication required to view products"
  }
  ```

---

#### 5. Update Product Quantity

**PUT** `/products/[id]/quantity`

Updates the quantity of a specific product.

**Authentication Required**: Yes

**Path Parameters**:
- `id` (number, required): Product ID

**Request Body**:
```json
{
  "quantity": "number"
}
```

**Request Body Parameters**:
- `quantity` (number, required): New quantity (non-negative number)

**Success Response** (201):
```json
{
  "message": "Quantity updated successfully",
  "productId": 1,
  "quantity": 25
}
```

**Error Responses**:
- **400 Bad Request**: Invalid quantity
  ```json
  {
    "message": "Valid quantity is required (must be a non-negative number)"
  }
  ```
- **401 Unauthorized**: Authentication required
  ```json
  {
    "message": "Authentication required to update product quantity"
  }
  ```
- **404 Not Found**: Product not found
  ```json
  {
    "message": "Product not found"
  }
  ```

---

### Analytics Endpoints

#### 6. Get Analytics

**GET** `/analytics`

Retrieves analytics data including most stocked and most expensive products.

**Authentication Required**: Yes

**Success Response** (200):
```json
{
  "mostStockedProduct": {
    "id": 1,
    "productName": "High Stock Product",
    "type": "Electronics",
    "sku": "HSP001",
    "quantity": 1000,
    "price": "19.99",
    "userID": 1
  },
  "mostExpensiveProduct": {
    "id": 2,
    "productName": "Premium Product",
    "type": "Luxury",
    "sku": "LUX001",
    "quantity": 5,
    "price": "999.99",
    "userID": 1
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Authentication required
  ```json
  {
    "message": "Authentication required to access analytics"
  }
  ```

---

## Data Models

### User
```json
{
  "userID": "number",
  "username": "string",
  "email": "string",
  "password": "string (hashed)"
}
```

### Product
```json
{
  "id": "number",
  "productName": "string",
  "type": "string",
  "sku": "string",
  "image_url": "string",
  "description": "string",
  "quantity": "number",
  "price": "string",
  "userID": "number"
}
```

---

## Error Handling

All endpoints follow consistent error response patterns:

### Common Status Codes

**Success Codes:**
- **200 OK**: Request successful (GET requests)
- **201 Created**: Resource created or updated successfully (POST/PUT requests)

**Error Codes:**
- **400 Bad Request**: Invalid request data or missing required fields
- **401 Unauthorized**: Authentication required or invalid credentials
- **404 Not Found**: Requested resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate SKU, username)
- **500 Internal Server Error**: Server-side error

### Error Response Format

```json
{
  "message": "Error description"
}
```

---

## Authentication Details

### JWT Token Structure

The JWT token contains:
- `username`: User's username
- `userID`: User's unique identifier
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (24 hours from issue)

### Token Usage

Include the token in the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

Tokens expire after 24 hours. Users must re-authenticate to obtain a new token.


## Environment Variables

Required environment variables:
- `JWT_SECRET`: Secret key for JWT token signing
- Database connection variables (as configured in your database setup) 