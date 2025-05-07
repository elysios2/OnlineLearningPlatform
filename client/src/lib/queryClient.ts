import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      const text = (await res.text()) || res.statusText;
      console.error(`Error en respuesta HTTP: ${res.status} - ${text}`);
      throw new Error(`${res.status}: ${text}`);
    } catch (error) {
      console.error("Error al procesar respuesta:", error);
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: RequestInit
): Promise<Response> {
  try {
    console.log(`Realizando solicitud ${method} a ${url}`);
    
    // Combinar opciones predeterminadas con opciones personalizadas
    const defaultOptions: RequestInit = {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...(options?.headers || {})
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    };
    
    const requestOptions = {...defaultOptions, ...options, headers: {...defaultOptions.headers, ...options?.headers}};
    
    console.log("Opciones de solicitud:", JSON.stringify({
      method: requestOptions.method,
      headers: Object.keys(requestOptions.headers || {}),
      hasBody: !!requestOptions.body
    }));
    
    const startTime = Date.now();
    const res = await fetch(url, requestOptions);
    const timeTaken = Date.now() - startTime;
    
    console.log(`Respuesta recibida de ${url}, estado: ${res.status}, tiempo: ${timeTaken}ms`);
    
    // No lanzar error aquí, dejar que el llamador decida
    return res;
  } catch (error) {
    console.error(`Error en solicitud ${method} a ${url}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      console.log(`Ejecutando consulta para: ${queryKey[0]}`);
      
      // Verificar si hay una sesión activa de Supabase
      let headers = {};
      try {
        const { supabase } = await import('./supabase');
        const { data } = await supabase.auth.getSession();
        if (data && data.session) {
          console.log("Sesión activa encontrada para la consulta");
          const userEmail = data.session.user?.email;
          if (userEmail) {
            headers = { 
              Authorization: `Bearer ${userEmail}`
            };
          }
        }
      } catch (err) {
        console.warn("No se pudo obtener la sesión para la consulta:", err);
      }
      
      const startTime = Date.now();
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
        headers
      });
      const timeTaken = Date.now() - startTime;
      
      console.log(`Respuesta de consulta ${queryKey[0]}, estado: ${res.status}, tiempo: ${timeTaken}ms`);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log("Respuesta 401 tratada como null según configuración");
        return null;
      }

      if (!res.ok) {
        try {
          const errorText = await res.text();
          console.error(`Error en consulta ${queryKey[0]}: ${res.status} - ${errorText}`);
          throw new Error(`${res.status}: ${errorText}`);
        } catch (parseError) {
          console.error(`Error al procesar respuesta de error para ${queryKey[0]}:`, parseError);
          throw new Error(`${res.status}: ${res.statusText}`);
        }
      }
      
      try {
        const data = await res.json();
        console.log(`Datos recibidos de ${queryKey[0]}:`, data);
        return data;
      } catch (error) {
        console.error(`Error al procesar JSON de ${queryKey[0]}:`, error);
        throw new Error(`Error al procesar respuesta JSON`);
      }
    } catch (error) {
      console.error(`Error en consulta ${queryKey[0]}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }), // Cambiado a returnNull para manejar mejor los estados no autenticados
      refetchInterval: false,
      refetchOnWindowFocus: true, // Cambiado a true para refrescar datos al volver a la ventana
      staleTime: 5 * 60 * 1000, // 5 minutos en lugar de Infinity para mejor balance de cache
      retry: 2, // Intentar 2 veces en caso de fallo de red
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
    },
    mutations: {
      retry: 1, // Un reintento para mutaciones
      retryDelay: 1000,
    },
  }
});
