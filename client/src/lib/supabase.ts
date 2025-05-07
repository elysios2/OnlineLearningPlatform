import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Función para crear el cliente de Supabase con manejo de errores integrado
function createSupabaseClient(): SupabaseClient {
  try {
    // Log the environment variables for debugging
    console.log('Environment variables check:');
    console.log('VITE_SUPABASE_URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
    console.log('VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

    const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase URL or Anon Key not found in environment variables');
      
      // Mostrar un mensaje de error más detallado
      if (!supabaseUrl) {
        console.error('VITE_SUPABASE_URL está vacío o no definido');
      }
      
      if (!supabaseAnonKey) {
        console.error('VITE_SUPABASE_ANON_KEY está vacío o no definido');
      }
      
      // En un entorno de producción, podríamos querer mostrar un error visual al usuario
      if (typeof document !== 'undefined') {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '0';
        errorDiv.style.left = '0';
        errorDiv.style.width = '100%';
        errorDiv.style.padding = '20px';
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.style.color = '#721c24';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = 'Error: No se pudieron cargar las credenciales para la conexión a la base de datos.';
        document.body?.appendChild(errorDiv);
      }
      
      // Crear un cliente vacío para evitar errores críticos
      // Esto permitirá que la aplicación se cargue aunque Supabase no esté disponible
      return createClient('https://example.supabase.co', 'public-anon-key', {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }

    console.log('Creating Supabase client with:');
    console.log('URL:', supabaseUrl ? 'URL exists (not showing for security)' : 'URL is empty');
    console.log('Key:', supabaseAnonKey ? 'Key exists (not showing for security)' : 'Key is empty');

    // Opciones de configuración para el cliente Supabase
    const supabaseOptions = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      // Mejorar los reintentos de conexión
      global: {
        fetch: fetch,
        headers: {},
        customFetch: (url: RequestInfo, init?: RequestInit) => {
          // Configurar un tiempo límite de 5 segundos
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          return fetch(url, {
            ...init,
            signal: controller.signal
          }).finally(() => clearTimeout(timeoutId));
        }
      },
      // Configuración optimizada para tiempo real
      realtime: {
        params: {
          eventsPerSecond: 10,          // Limitar a 10 eventos por segundo
          heartbeatIntervalMs: 30000,   // Intervalo de latido cada 30 segundos
          timeout: 60000,               // Tiempo de espera para conexión: 60 segundos
          reconnectAfterMs: (attempts: number) => 
            Math.min(1000 * (2 ** attempts), 30000) // Estrategia de backoff exponencial
        }
      },
      // Configuración para manejo de errores
      debug: import.meta.env.DEV // Habilitar depuración en desarrollo
    };

    // Create the Supabase client with proper typing
    return createClient(
      supabaseUrl, 
      supabaseAnonKey,
      supabaseOptions
    );
  } catch (error) {
    console.error('Error crítico al crear cliente Supabase:', error);
    // Si hay un error en la creación del cliente, devolver un cliente mínimo
    return createClient('https://example.supabase.co', 'public-anon-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
}

// Crear y exportar el cliente
export const supabase = createSupabaseClient();

// Authentication functions
export async function signInWithGoogle() {
  console.log('Iniciando autenticación con Google...');
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    
    if (error) {
      console.error('Error durante autenticación con Google:', error);
    } else {
      console.log('Autenticación con Google iniciada exitosamente');
    }
    
    return { data, error };
  } catch (err) {
    console.error('Excepción durante autenticación con Google:', err);
    return { data: null, error: err as Error };
  }
}

export async function signInWithEmail(email: string, password: string) {
  console.log('Iniciando sesión con email:', email.substring(0, 3) + '***@***');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Error durante inicio de sesión con email:', error);
    } else {
      console.log('Inicio de sesión con email exitoso');
    }
    
    return { data, error };
  } catch (err) {
    console.error('Excepción durante inicio de sesión con email:', err);
    return { data: null, error: err as Error };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  console.log('Registrando nuevo usuario con email:', email.substring(0, 3) + '***@***');
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    
    if (error) {
      console.error('Error durante registro con email:', error);
    } else {
      console.log('Registro con email exitoso');
    }
    
    return { data, error };
  } catch (err) {
    console.error('Excepción durante registro con email:', err);
    return { data: null, error: err as Error };
  }
}

export async function signOut() {
  console.log('Cerrando sesión de usuario...');
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error durante cierre de sesión:', error);
    } else {
      console.log('Cierre de sesión exitoso');
    }
    
    return { error };
  } catch (err) {
    console.error('Excepción durante cierre de sesión:', err);
    return { error: err as Error };
  }
}

export async function getCurrentUser() {
  console.log('Obteniendo usuario actual...');
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error al obtener usuario actual:', error);
    } else {
      const email = data?.user?.email;
      console.log('Usuario actual obtenido:', email ? `${email.substring(0, 3)}***@***` : 'No hay usuario');
    }
    
    return { user: data?.user, error };
  } catch (err) {
    console.error('Excepción al obtener usuario actual:', err);
    return { user: null, error: err as Error };
  }
}

export async function getSession() {
  console.log('Obteniendo sesión actual...');
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error al obtener sesión actual:', error);
    } else {
      console.log('Estado de sesión:', data?.session ? 'Activa' : 'No hay sesión');
    }
    
    return { session: data?.session, error };
  } catch (err) {
    console.error('Excepción al obtener sesión actual:', err);
    return { session: null, error: err as Error };
  }
}

// Storage functions
export async function uploadCourseFile(file: File, courseId: string) {
  console.log(`Subiendo archivo para el curso ${courseId}...`);
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `courses/${courseId}/${fileName}`;
    
    console.log(`Tipo de archivo: ${file.type}, Tamaño: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`Ruta de destino: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('course-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error al subir archivo:', error);
    } else {
      console.log('Archivo subido exitosamente');
    }
      
    return { data, error, filePath };
  } catch (err) {
    console.error('Excepción al subir archivo:', err);
    return { data: null, error: err as Error, filePath: '' };
  }
}

export async function getCourseFileUrl(filePath: string) {
  console.log(`Obteniendo URL pública para el archivo: ${filePath}`);
  try {
    const { data } = await supabase.storage
      .from('course-files')
      .getPublicUrl(filePath);
      
    console.log(`URL pública generada: ${data.publicUrl.substring(0, 50)}...`);
    return data.publicUrl;
  } catch (err) {
    console.error('Error al obtener URL pública:', err);
    return '';
  }
}

// Funciones para suscripciones en tiempo real

/**
 * Suscribirse a cambios en el progreso de cursos de un usuario
 * @param userId ID del usuario
 * @param callback Función a ejecutar cuando se reciban cambios
 * @returns Función para cancelar la suscripción
 */
export function subscribeToUserCourseProgress(userId: number, callback: (payload: any) => void) {
  console.log(`Suscribiendo a cambios de progreso para usuario ${userId}...`);
  
  try {
    const subscription = supabase
      .channel(`user-course-progress-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar todos los eventos: INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'user_courses',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Cambio detectado en progreso de curso:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Estado de suscripción: ${status}`);
      });
      
    // Devolver función para cancelar la suscripción
    return () => {
      console.log(`Cancelando suscripción de progreso para usuario ${userId}...`);
      supabase.removeChannel(subscription);
    };
  } catch (err) {
    console.error('Error al suscribirse a cambios de progreso:', err);
    // Devolver función vacía en caso de error
    return () => {};
  }
}

/**
 * Suscribirse a cambios en una tabla específica
 * @param table Nombre de la tabla
 * @param column Columna para filtrar (opcional)
 * @param value Valor para filtrar (opcional)
 * @param callback Función a ejecutar cuando se reciban cambios
 * @returns Función para cancelar la suscripción
 */
export function subscribeToTableChanges(
  table: string,
  column?: string,
  value?: string | number,
  callback?: (payload: any) => void
) {
  const channelId = `${table}-${column}-${value}-${Date.now()}`;
  console.log(`Suscribiendo a cambios en tabla ${table}...`);
  
  try {
    // Configurar filtro si se especificaron columna y valor
    let filter = undefined;
    if (column && value !== undefined) {
      filter = `${column}=eq.${value}`;
    }
    
    const subscription = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar todos los eventos
          schema: 'public',
          table: table,
          filter: filter
        },
        (payload) => {
          console.log(`Cambio detectado en tabla ${table}:`, payload);
          if (callback) callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Estado de suscripción a ${table}: ${status}`);
      });
      
    // Devolver función para cancelar la suscripción
    return () => {
      console.log(`Cancelando suscripción a ${table}...`);
      supabase.removeChannel(subscription);
    };
  } catch (err) {
    console.error(`Error al suscribirse a cambios en ${table}:`, err);
    // Devolver función vacía en caso de error
    return () => {};
  }
}

/**
 * Suscribirse a cambios en las pruebas de lectura de un usuario
 * @param userId ID del usuario
 * @param callback Función a ejecutar cuando se reciban cambios
 * @returns Función para cancelar la suscripción
 */
export function subscribeToReadingTests(userId: number, callback: (payload: any) => void) {
  return subscribeToTableChanges('reading_tests', 'user_id', userId, callback);
}
