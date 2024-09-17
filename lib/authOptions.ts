import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "../utils/database";
import User from "../models/user";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();

        try {
          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password!,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          } else {
            return user;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ profile, user, account }) {
      try {
        await connectToDB();

        if (profile) {
          const userExists = await User.findOne({ email: profile.email });
          if (!userExists) {
            await User.create({
              email: profile.email,
              password: await bcrypt.hash("dummy", 10),
              username: profile.name?.replace(" ", "").toLowerCase(),
              image: (profile as any)?.picture,
            });
          } else {
            await User.updateOne(
              { email: profile?.email },
              { image: (profile as any)?.picture }
            );
          }
        } else if (user && account?.provider === "credentials") {
          const userExists = await User.findOne({ email: user.email });
          if (!userExists) {
            throw new Error("User not found");
          }
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token || "";
        token.expires_at = account.expires_at || 0;
        //token.expires_at = Math.floor(Date.now() / 1000) - 10;
        token.refresh_token = account.refresh_token + "D" || "";
        token.provider = account.provider || "";
      } else if (Date.now() < token.expires_at * 1000 - 3590000) {
        return token;
      } else {
        if (!token.refresh_token) {
          if (token.provider === "credentials") {
            return token;
          }
          throw new TypeError("Missing refresh_token");
        }
        console.log("PREVIOUS ACCESS TOKEN:", token.access_token);
        console.log("\nTOKEN EXPIRED, attempting to refresh...\n");
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token!,
            }),
          });

          const newTokens = await response.json();

          if (!response.ok) throw newTokens;

          token.access_token = newTokens.access_token;
          console.log("NEW ACCESS TOKEN:", token.access_token);
          token.expires_at = Math.floor(
            Date.now() / 1000 + newTokens.expires_in
          );

          if (newTokens.refresh_token) {
            token.refresh_token = newTokens.refresh_token;
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
          token.error = "RefreshTokenError";
        }
      }

      console.log("Token:", token);
      return token;
    },

    async session({ session, token }) {
      session.access_token = token.access_token || "";
      session.refresh_token = token.refresh_token || "";
      session.error = token.error;

      console.log(session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}
