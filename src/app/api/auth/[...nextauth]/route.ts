import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("[NextAuth] SignIn callback triggered", {
          provider: account?.provider,
          email: profile?.email,
        });

        if (account?.provider === "google" && profile?.email) {
          console.log("[NextAuth] Attempting to upsert user:", profile.email);

          const upsertedUser = await prisma.user.upsert({
            where: { email: profile.email },
            update: {
              name: profile.name || null,
              image: (profile as any).picture || null,
              emailVerified: new Date(),
            },
            create: {
              email: profile.email,
              name: profile.name || null,
              image: (profile as any).picture || null,
              emailVerified: new Date(),
            },
          });

          console.log("[NextAuth] User upserted successfully:", upsertedUser.id);
        }
        return true;
      } catch (error) {
        console.error("[NextAuth] Error in signIn callback:", error);
        console.error("[NextAuth] Error details:", {
          name: (error as any)?.name,
          message: (error as any)?.message,
          code: (error as any)?.code,
          stack: (error as any)?.stack,
        });
        // Retornar true de todas formas para permitir el login
        // El error se loguea pero no bloquea la autenticación
        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
});

export const { GET, POST } = handlers;
