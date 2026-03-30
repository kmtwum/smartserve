import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Match all routes except static files and API routes that shouldn't go through middleware
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
