import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userCreateInput = Prisma.validator<Prisma.UserCreateInput>()({
        email: email.toLowerCase(),
        name,
      //  password: hashedPassword,
      }) as Prisma.UserCreateInput;

    // Create user with explicit type
    const newUser = await prisma.user.create({
      data: userCreateInput,
      select: {
        id: true,
        email: true,
        name: true,
        // Don't return password
      }
    });

    return NextResponse.json({
      success: true,
      user: newUser,
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}