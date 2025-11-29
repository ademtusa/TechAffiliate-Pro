import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyUser, getUserById } from '@/lib/auth'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Login attempt:', credentials?.email)
          const user = await verifyUser(credentials.email, credentials.password)
          
          console.log('👤 User found:', user ? 'Yes' : 'No')
          
          if (!user) {
            throw new Error('Invalid credentials')
          }
          
          // Admin always allowed, regular users need approval
          if (user.role !== 'admin' && user.status !== 'approved') {
            throw new Error('Your account is pending approval')
          }
          
          console.log('✅ Auth successful:', user.email, user.role)
          return user
        } catch (error) {
          console.error('❌ Auth error:', error.message)
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.status = user.status
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.role = token.role
        session.user.status = token.status
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }