#!/bin/bash

echo "🗂️  EPIFY DATABASE VIEWER"
echo "========================="

echo ""
echo "📊 Database Tables:"
docker exec epify-db-1 psql -U epify_user -d epify_db -c "\dt"

echo ""
echo "👥 Users ($(docker exec epify-db-1 psql -U epify_user -d epify_db -t -c "SELECT COUNT(*) FROM users;")):"
docker exec epify-db-1 psql -U epify_user -d epify_db -c "SELECT \"userID\", username, email FROM users;"

echo ""
echo "📦 Products ($(docker exec epify-db-1 psql -U epify_user -d epify_db -t -c "SELECT COUNT(*) FROM products;")):"
docker exec epify-db-1 psql -U epify_user -d epify_db -c "SELECT id, \"productName\", type, sku, price, quantity, \"userID\" FROM products ORDER BY id LIMIT 10;"

echo ""
echo "💡 To view more products: docker exec epify-db-1 psql -U epify_user -d epify_db -c \"SELECT * FROM products;\""
echo "💡 To access interactive shell: docker exec -it epify-db-1 psql -U epify_user -d epify_db" 