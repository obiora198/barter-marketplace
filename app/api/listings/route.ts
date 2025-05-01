import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { listingSchema } from "@/lib/validation/validatorSchema";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = listingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      category,
      condition,
      tradePreference,
      location,
      images,
    } = result.data;

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        category,
        condition,
        tradePreference,
        location,
        images,
        ownerId: session.user.id,
        offers: [],
      },
    });

    return NextResponse.json(listing, { status: 201 });

  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json({ message: "Error creating listing" }, { status: 500 });
  }
}
