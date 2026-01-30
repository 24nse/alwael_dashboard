// Type definitions for Deno runtime in Supabase Edge Functions
declare namespace Deno {
    export const env: {
        get(key: string): string | undefined;
    };
}
