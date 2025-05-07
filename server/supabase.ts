import { createClient } from '@supabase/supabase-js';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

// Configuración para Neon Database
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in environment variables');
}

// Cliente de Supabase para uso en el servidor
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// Pool de conexión para consultas SQL directas si es necesario
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Validar que podamos conectar con Supabase
async function validateSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('courses').select('count');
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (error) {
    console.error('Exception when connecting to Supabase:', error);
  }
}

// Intentar validar la conexión al iniciar el servidor
validateSupabaseConnection().catch(console.error);