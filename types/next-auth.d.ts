import NextAuth from "next-auth";
import type { LayoutParams } from 'next/dist/types/app/layout';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  declare module 'next' {
    interface PageProps {
      params: Record<string, string>;
      searchParams: Record<string, string | string[] | undefined>;
    }
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}
