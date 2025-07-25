import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required" },
                { status: 400 }
            );
        }

        const foundUser = await db.query.user.findFirst({
            where : eq(user.username, username)
        })

        if(!foundUser){
            return NextResponse.json({message : "No such user exists. Please signup"},{status:401});
        }

        const passwordcheck = await bcrypt.compare(password , foundUser.password);

        if(!passwordcheck){
            return NextResponse.json({message : "Incorrect password"},{status: 401 })
        }
        const token = jwt.sign(
            { username,userID:foundUser.userID, iat: Math.floor(Date.now() / 1000) },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
          );
          
        return NextResponse.json({message:"User successfully signed in",token : token},{status:201});

    }catch(error){
        return NextResponse.json({message : "Error logging in "},{status :501})
    }

}
