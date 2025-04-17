import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { PrismaClient } from "@prisma/client/extension"

export const authOptions = NextAuth({
  adapter: PrismaAdapter(prisma as PrismaClient),
  secret : process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      }),
    // ...add more providers here
  ],
})

export { authOptions as GET, authOptions as POST }