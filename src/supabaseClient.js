import { createClient } from "@supabase/supabase-js";

// Ye do values .env.local file se aa rahi hain (README dekho).
// Kabhi bhi in values ko seedha yahan hardcode mat karo agar
// code public GitHub repo mein daal rahe ho.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
