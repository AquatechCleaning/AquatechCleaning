import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/db";
import { AdminUser } from "@/lib/models/AdminUser";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!email || !password) return null;

        await dbConnect();

        let user = await AdminUser.findOne({ email });
        const adminCount = await AdminUser.countDocuments();

        if (!user && adminCount === 0 && email === process.env.ADMIN_DEFAULT_EMAIL && password === process.env.ADMIN_DEFAULT_PASSWORD) {
          user = await AdminUser.create({
            email,
            passwordHash: await bcrypt.hash(password, 12),
            role: "admin",
          });
        }

        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
};
