// app/api/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  console.log('fetching listing with id:', id);

  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing, { status: 200 });

  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json({ message: "Error fetching listing" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, condition, tradePreference, location, images } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { message: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    if (listing.ownerId !== session.user.id) {
      return NextResponse.json({ message: "You are not authorized to edit this listing" }, { status: 403 });
    }

    const validImages = images?.filter((img: string) => img.trim() !== "") ?? [];

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description,
        category,
        condition: condition || "good",
        tradePreference,
        location,
        images: validImages.length > 0 ? validImages : listing.images,
      },
    });

    return NextResponse.json(updatedListing, { status: 200 });

  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json({ message: "Error updating listing" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    if (listing.ownerId !== session.user.id) {
      return NextResponse.json({ message: "You are not authorized to delete this listing" }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id } });

    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ message: "Error deleting listing" }, { status: 500 });
  }
}
