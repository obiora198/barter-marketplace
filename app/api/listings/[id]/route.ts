// /app/api/listings/[id]/handler.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../..//lib/prisma"; 

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { owner: true }, // Make sure 'owner' is a valid relation
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing, { status: 200 });

  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { message: "Error fetching listing", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, condition, tradePreference, location, images } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { message: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // Find the listing by ID
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Check if the user is the owner of the listing
    if (listing.ownerId !== session.user.id) {
      return NextResponse.json({ message: "You are not authorized to edit this listing" }, { status: 403 });
    }

    // Sanitize images
    const validImages = images.filter((img: string) => img.trim() !== "");

    // Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        condition: condition || "good",
        tradePreference,
        location,
        images: validImages.length > 0 ? validImages : listing.images, // Use existing images if no new ones are provided
      },
    });

    return NextResponse.json(updatedListing, { status: 200 });

  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json({ message: "Error updating listing" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find the listing by ID
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    // Check if the user is the owner of the listing
    if (listing.ownerId !== session.user.id) {
      return NextResponse.json({ message: "You are not authorized to delete this listing" }, { status: 403 });
    }

    // Delete the listing
    await prisma.listing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ message: "Error deleting listing" }, { status: 500 });
  }
}
