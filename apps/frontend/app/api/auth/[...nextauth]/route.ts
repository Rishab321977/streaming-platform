import NextAuth, {NextAuthOptions} from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import GithubProvider from "next-auth/providers/github";
import clientPromise from "@/app/_lib/mongodb";
import { DefaultSession } from "next-auth";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      // Sign an access token the backend can verify
      token.accessToken = jwt.sign(
        { sub: token.sub },
        process.env.NEXTAUTH_SECRET as string,
        { expiresIn: "1h" }
      );
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };