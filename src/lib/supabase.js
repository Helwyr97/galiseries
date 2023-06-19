import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
// const options = {
//   autoRefreshToken: true,
//   persistSession: true,
//   detectSessionInUrl: false,
// };

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
