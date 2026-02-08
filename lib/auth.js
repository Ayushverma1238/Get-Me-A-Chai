import GitHubProvider from "next-auth/providers/github";
import User from "@/models/User";
import connectDb from "@/db/connectDb";
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from "bcryptjs";

import GoogleProvider from "next-auth/providers/google";
await connectDb();
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    async signIn({ user, account }) {
      if (account.provider === "github") {
        await connectDb();

        const currUser = await User.findOne({ email: user.email });

        if (!currUser) {
          const newUser = new User({
            email: user.email,
            username: user.email.split("@")[0],
          });

          await newUser.save();
          user.name = newUser.username;
        }
      }
      return true;
    },

    async session({ session }) {
      const dbUser = await User.findOne({
        email: session.user.email,
      });
      // console.log(dbUser);

      if (dbUser) {
        session.user.name = dbUser.username;
      }

      return session;
    },
  },
};
