// app/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };





// import NextAuth, { Session } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import EmailProvider from "next-auth/providers/email"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import prisma from "@/lib/prisma"
// import { PrismaClient } from "@prisma/client/extension"

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//   }
// }

// export const authOptions = NextAuth({
//   adapter: PrismaAdapter(prisma as PrismaClient),
//   secret : process.env.NEXTAUTH_SECRET,
//   // Configure one or more authentication providers
//   providers: [
//     GoogleProvider({
//         clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
//         clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
//       }),
//     EmailProvider({
//       server: {
//         host: process.env.NEXT_PUBLIC_EMAIL_SERVER_HOST,
//         port: parseInt(process.env.NEXT_PUBLIC_EMAIL_SERVER_PORT || "587"),
//         auth: {
//           user: process.env.NEXT_PUBLIC_EMAIL_SERVER_USER,
//           pass: process.env.NEXT_PUBLIC_EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: process.env.NEXT_PUBLIC_EMAIL_FROM,
//       // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
//     }),
//     // ...add more providers here
//   ],
//   callbacks: {
//     async session({ session, token, user }) {
//       // Send properties to the client, like an access_token and user id from a provider.
//       session.accessToken = token.accessToken as string
//       session.user.id = token.id as string
//       console.log("Session in callback:", session) // Debugging line
//       return session
//     }
//   }
// })

// export { authOptions as GET, authOptions as POST }