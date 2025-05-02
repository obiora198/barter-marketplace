import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { Session } from "next-auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const { listingId, initialMessage } = await req.json();
  
    if (!listingId || !initialMessage) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
  
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { owner: true },
    });
  
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    if (listing.ownerId === session.user.id) {
      return NextResponse.json({ error: "Cannot offer on your own listing" }, { status: 403 });
    }
  
    // Check if conversation already exists
    const existingConv = await prisma.conversation.findUnique({
      where: { listingId_offererId: { listingId, offererId: session.user.id } },
    });
  
    if (existingConv) {
      return NextResponse.json({ conversationId: existingConv.id });
    }
  
    // Transaction: create Offer, Conversation, Message
    const result = await prisma.$transaction(async tx => {
      const offer = await tx.offer.create({
        data: {
          listingId,
          senderId: session.user.id,
          initialMessage,
          status: "UNDER_NEGOTIATION",
        },
      });
  
      const conversation = await tx.conversation.create({
        data: {
            offerId: offer.id,
            listingId,
            offererId: session.user.id,
            ownerId: listing.ownerId,
        },
      });
  
      await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.user.id,
          text: initialMessage,
        },
      });
  
      await tx.offer.update({
        where: { id: offer.id },
        data: { conversation: { connect: { id: conversation.id } } },
      });
  
      return { conversationId: conversation.id };
    });
  
    return NextResponse.json(result);
  }
  