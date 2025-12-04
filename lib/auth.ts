import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 Tentando login:", credentials?.email);

        // Credenciais fixas para teste - SEM banco de dados
        if (credentials?.email === "admin@easyprospect.com" && credentials?.password === "senha123") {
          console.log("✅ Login autorizado");
          return {
            id: "1",
            email: credentials.email,
            name: "Administrador"
          };
        }

        console.log("❌ Credenciais inválidas");
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};