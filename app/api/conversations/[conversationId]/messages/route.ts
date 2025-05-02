// /app/api/conversations/[conversationId]/messages/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import { Session } from "next-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  const session = await getServerSession(authOptions) as Session & { user: { id: string } };
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { text } = await req.json();
  const { conversationId } = params;

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const userId = session.user?.id;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation || (conversation.ownerId !== userId && conversation.offererId !== userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: userId,
      text,
    },
  });

  return NextResponse.json(message);
}
