import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { verifyToken, createAuthResponse } from "@/lib/auth";
import { count, eq, desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const user = await verifyToken(req);
        if (!user) {
            return createAuthResponse("Authentication required to add products");
        }

        const body = await req.json();
        const { name, type, sku, image_url, description, quantity, price } = body;

        if (!name) {
            return NextResponse.json(
                { message: "Product name is required" },
                { status: 400 }
            );
        }
        if (!sku) {
            return NextResponse.json(
                { message: "SKU is required" },
                { status: 400 }
            );
        }
        if (!type) {
            return NextResponse.json(
                { message: "Product type is required" },
                { status: 400 }
            );
        }
        if (!description) {
            return NextResponse.json(
                { message: "Product description is required" },
                { status: 400 }
            );
        }
        if (quantity === undefined || quantity === null) {
            return NextResponse.json(
                { message: "Product quantity is required" },
                { status: 400 }
            );
        }
        if (price === undefined || price === null) {
            return NextResponse.json(
                { message: "Product price is required" },
                { status: 400 }
            );
        }

        if (!Number.isInteger(quantity) || quantity < 0) {
            return NextResponse.json(
                { message: "Quantity must be a non-negative integer" },
                { status: 400 }
            );
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            return NextResponse.json(
                { message: "Price must be a non-negative number" },
                { status: 400 }
            );
        }
        
        const existingProduct = await db.query.products.findFirst({
            where: eq(products.sku, sku)
        });

        if (existingProduct) {
            if (existingProduct.productName !== name) {
                return NextResponse.json(
                    { message: `Product with SKU ${sku} already exists with different name: ${existingProduct.productName}` },
                    { status: 409 }
                );
            }

            const newQuantity = existingProduct.quantity + quantity;
            
            await db.update(products)
                .set({ quantity: newQuantity })
                .where(eq(products.id, existingProduct.id));

            return NextResponse.json({
                message: "Product quantity updated successfully",
                product: {
                    id: existingProduct.id,
                }
            }, { status: 201 });
        } else {
            const addproduct = await db.insert(products).values({
                productName: name,
                type,
                sku,
                image_url,
                description,
                quantity,
                price: price.toString(),
                userID: user.userID
            }).returning({
                id: products.id,
            });
    
            return NextResponse.json({
                message: "Product added successfully",
                product: addproduct[0]
            }, { status: 201 });
        }


    } catch (error) {
        console.error("Add product error:", error);
        return NextResponse.json(
            { message: "Failed to add product" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const user = await verifyToken(req);
        if (!user) {
            return createAuthResponse("Authentication required to view products");
        }

        const { searchParams } = new URL(req.url);
        const pageParam = searchParams.get('page');
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        
        const currentPage = Math.max(1, page);
        const itemsPerPage = 10;
        
        const totalCountResult = await db.select({ count: count() }).from(products);
        const totalProducts = totalCountResult[0].count;
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        
        const allproducts = await db.select({
            id: products.id,
            productName: products.productName,
            type: products.type,
            sku: products.sku,
            quantity: products.quantity,
            price: products.price,
            userID: products.userID,
        }).from(products).orderBy(desc(products.id)).limit(itemsPerPage).offset(itemsPerPage * (currentPage - 1));

        return NextResponse.json({
            message: "Products retrieved successfully",
            products: allproducts,
            pagination: {
                currentPage,
                totalPages,
                totalProducts,
                itemsPerPage,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1
            }
        });

    } catch (error) {
        console.error("Get products error:", error);
        return NextResponse.json(
            { message: "Failed to retrieve products" },
            { status: 500 }
        );
    }
}