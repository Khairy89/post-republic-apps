// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://clchnmmdbedbbbpjzola.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsY2hubW1kYmVkYmJicGp6b2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5ODcyMTYsImV4cCI6MjA2NTU2MzIxNn0.dKMkQrn49l6cDF0_vSJSlT3GoPaHndXaES-_UZ0wnFE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);