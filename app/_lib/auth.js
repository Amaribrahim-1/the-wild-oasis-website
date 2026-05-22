import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user; // true or false
    },

    async signIn({ user }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({
            email: user.email,
            fullName: user.name,
          });

        return true;
      } catch {
        return false;
      }
    },

    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
