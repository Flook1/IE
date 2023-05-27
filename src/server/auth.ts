import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { prisma } from "(~/)/server/db";
import Credentials from "next-auth/providers/credentials";
// import { env } from "(~/)/env.mjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  // This is the type i think for the session
  interface Session extends DefaultSession {
    user: {
      // id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/* -------------------------------------------------------------------------- */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Sign In With Email & Password",
      // This below is used to create the pre generated login page
      credentials: {
        username: { label: "Username", type: "text", placeholder: "smith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // const password = credentials?.password;
        const username = credentials?.username;

        // return credentials;
        // Add logic here to look up the user from the credentials supplied
        const userDb = await prisma.user_main.findFirst({
          where: {
            email_id: username,
          },
        });

        // If no user
        if (!userDb) {
        return null;
        }

        if (userDb && true) {
        console.log(`User from db: ${JSON.stringify(userDb, null, " ")}`);
        }
        // return user;
        return null;
      },
    }),
  ],

  /* --------------------------- Session strategy --------------------------- */
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/v1/auth/signin",
    
  }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
