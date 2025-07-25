import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function verifyToken(request: NextRequest): Promise<any | null> {
    try {
        const authHeader = request.headers.get("authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        return decoded;
        
    } catch (error) {
        return null;
    }
}

export function createAuthResponse(message: string = "Authentication required") {
    return Response.json(
        { message },
        { status: 401 }
    );
} 