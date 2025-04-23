import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  const { email, name, image } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        image,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 }
    );
  }
}