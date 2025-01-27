import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mggcufjzqpevkkihidmb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZ2N1Zmp6cXBldmtraWhpZG1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTU0MTQsImV4cCI6MjA1MjI3MTQxNH0.nQ-hf6OUEEp_lzQ_8um5lg3ojqSHVkvPU5wa5BixLZY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 