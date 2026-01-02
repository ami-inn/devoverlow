import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { IAccount } from "./database/account.model";

// well check if the signin account type is credentials if yes then we skip weill handle it the other way arond when doing email pasword based auth
// but if the account type is not credentials well call this new signin-with-oauth endpoint to create or update user and account info

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    //  session callback is called whenever a session is checked or created
    // we use it to attach the user id to the session object
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials" // email and password means credentials
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAccount>;

        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },

    //  sign in callback is called whenever a user signs in
    //  we use it to handle oauth sign ins
    //  we extract user profile and account info from the parameters
    //  then we call our api method api.auth.oAuthSignIn to create or update user and account info in our database
    //  based on the response from the api we determine if the sign in should be successful or not
    //  if the api call is successful we return true allowing the sign in to proceed otherwise we return false denying the sign in
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };
      // after getting user info from oauth provider we call our api to create or update user and account info
      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;
      if (!success) return false;

      return true;
    },
  },
});
