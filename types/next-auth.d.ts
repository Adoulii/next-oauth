import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      address?: string | null; 
      phoneNumber?: string | null; 
      dateOfBirth?: Date | null; 
    } & DefaultSession["user"];
  }
}