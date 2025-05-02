// app/api/conversations/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { offererId: userId },
      ],
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      owner: {
        select: { id: true, name: true, email: true, image: true },
      },
      offerer: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatted = conversations.map((conv) => {
    const otherUser = conv.ownerId === userId ? conv.offerer : conv.owner;
    return {
      id: conv.id,
      otherUser,
      lastMessage: conv.messages[0] || null,
    };
  });

  return NextResponse.json(formatted);
}
