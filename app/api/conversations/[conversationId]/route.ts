import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { Session } from "next-auth";

export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
  const session = await getServerSession(authOptions) as Session & { user: { id: string } };
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      owner: { select: { id: true, name: true, image: true } },
      offerer: { select: { id: true, name: true, image: true } },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const userId = session.user?.id;
  if (conversation.ownerId !== userId && conversation.offererId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const otherUser = conversation.ownerId === userId ? conversation.offerer : conversation.owner;

  return NextResponse.json({
    messages: conversation.messages,
    otherUser,
  });
}
