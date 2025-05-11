import { createClient } from '@supabase/supabase-js';

// Используем твои ключи и URL
const supabaseUrl = 'https://vsskfzjuwdfwvrforkfc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzc2tmemp1d2Rmd3ZyZm9ya2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NjY2MDQsImV4cCI6MjA2MjU0MjYwNH0.gySIo9Ape8VmcCG3wFcIVM5Q2tBuoGCc-ygrb8LQw10';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;