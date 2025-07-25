import { products } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { verifyToken, createAuthResponse } from "@/lib/auth";

export async function PUT(req: NextRequest, {params}:{params:Promise<{id:string}>}) {
    try {
        const user = await verifyToken(req);
        if (!user) {
            return createAuthResponse("Authentication required to update product quantity");
        }

        const body = await req.json();
        const { quantity } = body;
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id, 10); 

        if (quantity === undefined || quantity === null || typeof quantity !== 'number' || quantity < 0) {
            return NextResponse.json({ message: "Valid quantity is required (must be a non-negative number)" }, { status: 400 });
        }

        const existingProduct = await db.query.products.findFirst({where : eq(products.id, id)});
        if (!existingProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        await db.update(products).set({ quantity: quantity }).where(eq(products.id,id));

        return NextResponse.json({
            message: "Quantity updated successfully",
            productId: id,
            quantity: quantity
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({message:"Failed to update the quantity",error},{status:500})
    }
}