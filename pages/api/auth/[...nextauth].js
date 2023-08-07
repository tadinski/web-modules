import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const res = await fetch(
            process.env.NEXT_PUBLIC_REST +
              `/passwordless/login?loginToken=${credentials.token}`,
            {
              method: "GET",
            }
          );
          const user = await res.json();

          // If no error and we have user data, return it
          if (res.ok && user) {
            return user;
          }
          if (!res.ok || !user) {
            throw new Error(user.error.message);
          }
          // Return null if user data could not be retrieved
          return null;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    // Getting the JWT token from API response
    jwt: async ({ token, user }) => {
      if (user) {
        token.jwt = user.jwt;
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      session.jwt = token.jwt;
      return Promise.resolve(session);
    },
  },
});
