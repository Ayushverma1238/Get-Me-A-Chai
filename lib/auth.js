import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import connectDb from "@/db/connectDb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import FacebookProvider from 'next-auth/providers/facebook'
import LinkedInProvider from 'next-auth/providers/linkedin'
import TwitterProvider from 'next-auth/providers/twitter'

import GoogleProvider from "next-auth/providers/google";
// await connectDb();
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDb();

        const user = await User.findOne({
          $or: [
            { username: credentials.username },
            { email: credentials.username },
          ],
        }).select("+password");

        if (!user) return null;

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isMatch) return null;

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // 👈 VERY IMPORTANT
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      await connectDb();

      if (token?.email) {
        session.user.email = token.email;
        session.user.name = token.name;

        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          session.user.name = dbUser.username;
        }
      }

      return session;
    },

    async signIn({ user, account }) {
      if (account.provider === "google" || account.provider === "github") {
        await connectDb();

        let currUser = await User.findOne({ email: user.email });

        if (!currUser) {
          currUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
          });
        }

        user.name = currUser.username;
      }
      return true;
    },
  },
};
