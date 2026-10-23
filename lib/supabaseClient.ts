import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * Boolean flag indicating whether valid Supabase credentials were provided in the environment.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 5
);

/**
 * Fallback query builder returning chainable mocks to allow static SSR and prerendering
 * to compile with zero errors even when Supabase keys are not set.
 */
function createMockQueryBuilder(): any {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: (val: any) => void) => {
          resolve({ data: [], error: null, count: 0 });
        };
      }
      if (prop === 'single') {
        return () => Promise.resolve({ data: null, error: null });
      }
      return (..._args: any[]) => new Proxy(() => {}, handler);
    },
    apply(_target, _thisArg, _argArray) {
      return new Proxy(() => {}, handler);
    }
  };
  return new Proxy(() => {}, handler);
}

/**
 * Robust mock Supabase client fallback.
 */
function createMockSupabaseClient(): any {
  return {
    isMock: true,
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async ({ email }: { email?: string }) => {
        return {
          data: {
            user: { id: "mock-user-id", email: email || "demo@example.com", role: "authenticated" },
            session: { access_token: "mock-token", expires_in: 3600 }
          },
          error: null
        };
      },
      signUp: async ({ email }: { email?: string }) => {
        return {
          data: {
            user: { id: "mock-user-id", email: email || "demo@example.com", role: "authenticated" },
            session: { access_token: "mock-token", expires_in: 3600 }
          },
          error: null
        };
      },
      signOut: async () => {
        return { error: null };
      },
      onAuthStateChange: (_callback: (event: string, session: any) => void) => {
        return {
          data: {
            subscription: {
              id: "mock-sub",
              callback: () => {},
              unsubscribe: () => {}
            }
          }
        };
      },
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
    },
    from: (_table: string) => createMockQueryBuilder(),
    channel: (_name: string) => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {}
    }),
    storage: {
      from: (_bucket: string) => ({
        upload: async () => ({ data: { path: "mock-path" }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://placehold.co/600x400" } }),
        list: async () => ({ data: [], error: null })
      })
    }
  };
}

export const supabase: SupabaseClient = (
  isSupabaseConfigured
    ? createClient(supabaseUrl!, supabaseAnonKey!)
    : createMockSupabaseClient()
) as SupabaseClient;

export default supabase;
