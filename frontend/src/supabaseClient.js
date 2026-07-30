import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://svphqlpumstcpwecenoz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cGhxbHB1bXN0Y3B3ZWNlbm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0Mzc4OTYsImV4cCI6MjEwMTAxMzg5Nn0.g1yJBu51Tzpaz4eORSVTHxtLD4FOlSTjqOTrE21O4fc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
