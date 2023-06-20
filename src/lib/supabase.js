import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// const options = {
//   autoRefreshToken: true,
//   persistSession: true,
//   detectSessionInUrl: false,
// };

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
