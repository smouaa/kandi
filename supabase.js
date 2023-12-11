import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xlinbzpbkixmjhjlqkjy.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaW5ienBia2l4bWpoamxxa2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyMzU0MDAsImV4cCI6MjAxNjgxMTQwMH0.XqcRCvCu13ZMHxSUBOIUuvlSv_mY6X7wSV5zpPf04iI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
