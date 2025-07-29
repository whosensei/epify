-- Create the database schema for Epify
-- This file will be executed when the PostgreSQL container starts

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    "userID" SERIAL PRIMARY KEY,
    "username" VARCHAR UNIQUE NOT NULL,
    "email" VARCHAR UNIQUE NOT NULL,
    "password" VARCHAR NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    "id" SERIAL PRIMARY KEY,
    "productName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sku" TEXT UNIQUE NOT NULL,
    "img_url" VARCHAR,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "userID" INTEGER NOT NULL REFERENCES users("userID")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_userid ON products("userID");
CREATE INDEX IF NOT EXISTS idx_products_sku ON products("sku");
CREATE INDEX IF NOT EXISTS idx_users_email ON users("email");
CREATE INDEX IF NOT EXISTS idx_users_username ON users("username");

-- Insert sample users
INSERT INTO users ("username", "email", "password") VALUES 
('user1', 'user1in@epify.com', '$2b$10$rOjLrS1Ii1jZmqLK5z5s7eKY8YJ7J7J7J7J7J7J7J7J7J7J7J7J7J7'),
('user2', 'user2@epify.com', '$2b$10$rOjLrS1Ii1jZmqLK5z5s7eKY8YJ7J7J7J7J7J7J7J7J7J7J7J7J7J7'),
('user3', 'user3@epify.com', '$2b$10$rOjLrS1Ii1jZmqLK5z5s7eKY8YJ7J7J7J7J7J7J7J7J7J7J7J7J7J7')
ON CONFLICT DO NOTHING;

-- Insert 25 sample products
INSERT INTO products ("productName", "type", "sku", "img_url", "description", "quantity", "price", "userID") VALUES 
('MacBook Pro 16"', 'Electronics', 'MBP-16-001', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'High-performance laptop for professionals with M3 Pro chip', 15, 2499.00, 1),
('iPhone 15 Pro', 'Electronics', 'IPH-15P-002', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 'Latest iPhone with titanium design and A17 Pro chip', 32, 999.00, 1),
('Sony WH-1000XM5', 'Electronics', 'SNY-WH5-003', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', 'Premium noise-canceling wireless headphones', 25, 349.99, 1),
('Dell XPS 13', 'Electronics', 'DEL-XPS-004', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 'Ultra-portable laptop with InfinityEdge display', 18, 1299.00, 1),
('Samsung Galaxy S24', 'Electronics', 'SAM-S24-005', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 'Flagship Android smartphone with AI features', 28, 799.99, 1),
('iPad Pro 12.9"', 'Electronics', 'IPD-PRO-006', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'Professional tablet with M2 chip and Liquid Retina display', 20, 1099.00, 2),
('Nintendo Switch OLED', 'Electronics', 'NIN-SWI-007', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400', 'Handheld gaming console with vibrant OLED screen', 35, 349.99, 2),
('Canon EOS R6 Mark II', 'Electronics', 'CAN-R6M-008', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400', 'Professional mirrorless camera with 24MP sensor', 8, 2499.00, 2),
('Bose QuietComfort Earbuds', 'Electronics', 'BOS-QCE-009', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 'True wireless earbuds with world-class noise cancellation', 45, 279.00, 2),
('LG OLED55C3PUA', 'Electronics', 'LG-OLD-010', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', '55-inch 4K OLED smart TV with webOS', 12, 1499.99, 2),
('Apple Watch Series 9', 'Electronics', 'APW-S9-011', 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400', 'Advanced smartwatch with health monitoring features', 40, 399.00, 1),
('Microsoft Surface Laptop 5', 'Electronics', 'MSF-SL5-012', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', 'Premium laptop with sleek design and all-day battery', 22, 1299.99, 1),
('AirPods Pro (2nd Gen)', 'Electronics', 'APP-2G-013', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', 'Wireless earbuds with active noise cancellation', 60, 249.00, 1),
('Samsung 32" Odyssey G7', 'Electronics', 'SAM-ODY-014', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', 'Curved gaming monitor with 240Hz refresh rate', 15, 699.99, 3),
('Google Pixel 8 Pro', 'Electronics', 'GOO-P8P-015', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 'AI-powered smartphone with exceptional camera', 25, 899.00, 3),
('Sony PlayStation 5', 'Electronics', 'SNY-PS5-016', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', 'Next-gen gaming console with ultra-high speed SSD', 18, 499.99, 3),
('DJI Air 3', 'Electronics', 'DJI-AIR-017', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400', 'Dual-camera drone with 4K HDR video capability', 10, 1049.00, 3),
('Tesla Model Y Floor Mats', 'Automotive', 'TES-FLM-018', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', 'All-weather floor mats designed for Tesla Model Y', 75, 179.99, 1),
('Vitamix A3500', 'Appliances', 'VIT-A35-019', 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400', 'High-performance blender with smart technology', 8, 549.95, 2),
('Dyson V15 Detect', 'Appliances', 'DYS-V15-020', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'Cordless vacuum with laser dust detection', 30, 749.99, 2),
('Instant Pot Duo 7-in-1', 'Appliances', 'INS-DUO-021', 'https://images.unsplash.com/photo-1574781330855-d0c7a52d2eba?w=400', 'Multi-use pressure cooker with 7 functions', 50, 89.95, 2),
('KitchenAid Stand Mixer', 'Appliances', 'KIT-STM-022', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'Professional 5-quart stand mixer for baking', 16, 429.99, 3),
('Herman Miller Aeron Chair', 'Furniture', 'HMI-AER-023', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'Ergonomic office chair with advanced PostureFit SL', 5, 1395.00, 3),
('IKEA MALM Dresser', 'Furniture', 'IKE-MAL-024', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', '6-drawer dresser with white stain finish', 20, 179.00, 3),
('Patagonia Better Sweater', 'Clothing', 'PAT-BSW-025', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', 'Fleece jacket made from recycled polyester', 40, 139.00, 1)
ON CONFLICT DO NOTHING; 