declare module '@auth0/nextjs-auth0/client' {
  export interface UserProfile {
    sub?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: string;
    updated_at?: string;
    [key: string]: any;
  }

  export interface UserContext {
    user?: UserProfile;
    error?: Error;
    isLoading: boolean;
  }

  export function useUser(): UserContext;
  export function UserProvider({ children }: { children: React.ReactNode }): JSX.Element;
} 

declare module '@auth0/nextjs-auth0/edge' {
  import { NextRequest, NextResponse } from 'next/server';

  export interface HandleLoginOptions {
    authorizationParams?: {
      scope?: string;
      audience?: string;
      client_id?: string;
      [key: string]: string | undefined;
    };
    returnTo?: string;
    getLoginState?: (req: NextRequest) => any;
  }

  export function handleLogin(
    req: NextRequest,
    options?: HandleLoginOptions
  ): NextResponse;
} 