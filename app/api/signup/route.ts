import { user } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, email, password } = body;

        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Username, email, and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        const existingUser = await db.query.user.findFirst({
            where: or(
                eq(user.username, username),
                eq(user.email, email)
            )
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return NextResponse.json(
                    { message: "Username already exists" },
                    { status: 409 }
                );
            }
            if (existingUser.email === email) {
                return NextResponse.json(
                    { message: "Email already exists" },
                    { status: 409 }
                );
            }
        }

        const salt = 10;
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = await db.insert(user).values({
            username,
            email,
            password: hashedpassword,
        }).returning({
            userID: user.userID,
            username: user.username,
            email: user.email
        });

        return NextResponse.json({
            message: "User successfully signed up",
            user: newUser[0]
        }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Internal server error during signup" },
            { status: 500 }
        );
    }
}