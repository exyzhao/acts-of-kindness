import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // get a JWT token
        const tokenResponse = await fetch(`${BACKEND_URL}/auth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: credentials?.username || "",
            password: credentials?.password || "",
          }),
        });

        if (!tokenResponse.ok) {
          return null;
        }

        const tokenData = await tokenResponse.json();
        console.log(tokenData);

        if (!tokenData.access_token) {
          return null;
        }

        // get user info
        const userResponse = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        if (!userResponse.ok) {
          return null;
        }

        const userData = await userResponse.json();
        console.log(userData);

        // return a user object indicating successful login
        return {
          id: userData.username,
          name: userData.username,
          accessToken: tokenData.access_token,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
