// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://qunkocmokebqrmbuxiba.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bmtvY21va2VicXJtYnV4aWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1ODE0MTksImV4cCI6MjA0NjE1NzQxOX0.OUuQ6ojir9-hiRkO-Fb-PMiszU_8hL6uEHpfl3RsUdQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);