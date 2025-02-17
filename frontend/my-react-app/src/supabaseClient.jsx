import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mjfgmaklpikieoeqrjkp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZmdtYWtscGlraWVvZXFyamtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NTM5OTAsImV4cCI6MjA1NTIyOTk5MH0.Pf11lGTmNZW6n6KD15yke26hC1WBsMb0WT6YLITpi_I'

export const supabase = createClient(supabaseUrl, supabaseKey)