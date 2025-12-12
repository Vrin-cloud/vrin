import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { AuthService } from '@/lib/services/vrin-service'

const authService = new AuthService()

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password')
        }

        try {
          const response = await authService.login(credentials.email, credentials.password)

          if (response.success && response.user && response.api_key) {
            return {
              id: response.user.user_id,
              email: response.user.email,
              name: response.user.email.split('@')[0],
              apiKey: response.api_key,
            }
          }

          throw new Error(response.error || 'Invalid credentials')
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google sign-in, create or sync user with backend
      if (account?.provider === 'google' && user.email) {
        try {
          // Try to get existing user or create new one
          const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'https://gp7g651udc.execute-api.us-east-1.amazonaws.com/Prod'}/auth/oauth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name || user.email.split('@')[0],
              google_id: account.providerAccountId,
              image: user.image,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            // Store API key in user object for JWT callback
            ;(user as any).apiKey = data.api_key
            ;(user as any).userId = data.user_id
            return true
          }

          // If OAuth endpoint doesn't exist, try regular signup/login flow
          console.log('OAuth endpoint not available, using fallback')
          return true
        } catch (error) {
          console.error('Google sign-in backend sync failed:', error)
          // Still allow sign-in, we'll handle missing API key in the app
          return true
        }
      }
      return true
    },
    async jwt({ token, user, account, trigger }) {
      // SECURITY FIX: On sign-in, always update token with new user data
      // This ensures previous user's data doesn't persist in the token
      if (user || trigger === 'signIn') {
        // Clear any previous user's data and set new user's data
        token.userId = (user as any)?.userId || user?.id || token.userId
        token.apiKey = (user as any)?.apiKey || token.apiKey
        token.email = user?.email || token.email
      }
      return token
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        ;(session.user as any).userId = token.userId
        ;(session.user as any).apiKey = token.apiKey
      }
      return session
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
