import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createAuthResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const user = await verifyToken(request);
        if (!user) {
            return createAuthResponse("Authentication required to access analytics");
        }

        const mostStockedProduct = await db.query.products.findFirst({
            orderBy: [desc(products.quantity)],
        });

        const mostExpensiveProduct = await db.query.products.findFirst({
            orderBy: [desc(products.price)],
        });

        return NextResponse.json({ 
            mostStockedProduct, 
            mostExpensiveProduct 
        }, { status: 200 });

    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ 
            message: "Failed to fetch analytics" 
        }, { status: 500 });
    }
}