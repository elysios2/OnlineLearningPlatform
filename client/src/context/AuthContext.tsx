import { createContext, useEffect, useState, ReactNode, useRef } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentUser,
  getSession,
  subscribeToUserCourseProgress,
  subscribeToReadingTests
} from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isPremiumUser: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  loginWithGoogle: () => Promise<{
    data: any;
    error: any;
  }>;
  loginWithEmail: (email: string, password: string) => Promise<{
    data: any;
    error: any;
  }>;
  registerWithEmail: (email: string, password: string) => Promise<{
    data: any;
    error: any;
  }>;
  registerWithGoogle: () => Promise<{
    data: any;
    error: any;
  }>;
  logout: () => Promise<void>;
  upgradeToPremiun: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isPremiumUser: false,
  isLoading: true,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  openRegisterModal: () => {},
  closeRegisterModal: () => {},
  loginWithGoogle: async () => ({ data: null, error: null }),
  loginWithEmail: async () => ({ data: null, error: null }),
  registerWithEmail: async () => ({ data: null, error: null }),
  registerWithGoogle: async () => ({ data: null, error: null }),
  logout: async () => {},
  upgradeToPremiun: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Referencia para almacenar las funciones de limpieza de suscripciones
  const subscriptionCleanups = useRef<(() => void)[]>([]);

  // Función para configurar suscripciones en tiempo real
  const setupRealTimeSubscriptions = (userId: number) => {
    console.log("Configurando suscripciones en tiempo real para el usuario:", userId);
    
    // Limpiar suscripciones anteriores
    if (subscriptionCleanups.current.length > 0) {
      console.log("Limpiando suscripciones anteriores...");
      subscriptionCleanups.current.forEach(cleanup => cleanup());
      subscriptionCleanups.current = [];
    }
    
    try {
      // Suscribirse a cambios en el progreso de cursos
      const unsubscribeCourseProgress = subscribeToUserCourseProgress(userId, (payload) => {
        console.log("Cambio en progreso de curso detectado:", payload);
        
        // Invalidar las consultas relacionadas con cursos del usuario
        queryClient.invalidateQueries({
          queryKey: ['/api/courses/user']
        });
        
        // Obtener el ID del curso desde el payload
        const courseId = payload.new?.course_id || payload.old?.course_id;
        if (courseId) {
          // Invalidar también la consulta específica del curso
          queryClient.invalidateQueries({
            queryKey: [`/api/courses/${courseId}`]
          });
        }
        
        toast({
          title: "Progreso actualizado",
          description: "Tu progreso en el curso ha sido actualizado",
          duration: 3000,
        });
      });
      
      // Suscribirse a cambios en pruebas de lectura
      const unsubscribeReadingTests = subscribeToReadingTests(userId, (payload) => {
        console.log("Cambio en pruebas de lectura detectado:", payload);
        
        // Invalidar las consultas relacionadas con pruebas de lectura
        queryClient.invalidateQueries({
          queryKey: ['/api/reading-test/user']
        });
        
        // Obtener el ID de la prueba desde el payload
        const testId = payload.new?.id || payload.old?.id;
        if (testId) {
          // Invalidar también la consulta específica de la prueba
          queryClient.invalidateQueries({
            queryKey: [`/api/reading-test/${testId}`]
          });
        }
        
        toast({
          title: "Prueba de lectura actualizada",
          description: "Los resultados de tu prueba de lectura han sido actualizados",
          duration: 3000,
        });
      });
      
      // Guardar funciones de limpieza
      subscriptionCleanups.current.push(unsubscribeCourseProgress);
      subscriptionCleanups.current.push(unsubscribeReadingTests);
      
      console.log("Suscripciones en tiempo real configuradas correctamente");
    } catch (error) {
      console.error("Error al configurar suscripciones en tiempo real:", error);
    }
  };

  // Efecto para gestionar suscripciones cuando cambia el usuario
  useEffect(() => {
    // Solo configurar suscripciones si hay un usuario autenticado
    if (user && user.id) {
      // Obtener el ID de usuario numérico desde la API (asumiendo que user.id es un string en Supabase)
      apiRequest("GET", "/api/auth/user", undefined)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("No se pudo obtener el ID numérico del usuario");
        })
        .then(userData => {
          if (userData && userData.id) {
            // Configurar suscripciones con el ID numérico
            setupRealTimeSubscriptions(userData.id);
          }
        })
        .catch(error => {
          console.error("Error al obtener ID de usuario para suscripciones:", error);
        });
    }
    
    // Limpieza al desmontar
    return () => {
      // Limpiar todas las suscripciones
      if (subscriptionCleanups.current.length > 0) {
        console.log("Limpiando suscripciones en tiempo real...");
        subscriptionCleanups.current.forEach(cleanup => cleanup());
        subscriptionCleanups.current = [];
      }
    };
  }, [user]); // Ejecutar cuando cambie el usuario

  // Check if user is authenticated
  useEffect(() => {
    // Establecer un temporizador de seguridad para evitar que la pantalla de carga dure demasiado
    const safetyTimer = setTimeout(() => {
      if (isLoading) {
        console.log("Temporizador de seguridad activado - mostrando la aplicación de todos modos");
        setIsLoading(false);
      }
    }, 3000); // Esperar solo 3 segundos máximo

    async function checkAuthStatus() {
      try {
        console.log("Verificando estado de autenticación...");
        
        // Usar Promise.race para establecer un tiempo límite para la solicitud
        const sessionPromise = getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Tiempo de espera agotado al obtener sesión")), 2000);
        });
        
        let session, error;
        try {
          const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
          session = result.session;
          error = result.error;
        } catch (timeoutError) {
          console.error("Error de tiempo de espera:", timeoutError);
          console.log("Continuando sin sesión debido a tiempo agotado");
          setIsLoading(false);
          setUser(null);
          return;
        }
        
        if (error) {
          console.error("Error detallado al obtener sesión:", JSON.stringify(error));
          setIsLoading(false);
          return;
        }

        console.log("Estado de sesión:", session ? "Activa" : "No hay sesión");
        
        if (session) {
          try {
            const { user: currentUser, error: userError } = await getCurrentUser();
            
            if (userError) {
              console.error("Error al obtener usuario actual:", JSON.stringify(userError));
              setUser(null);
            } else {
              console.log("Usuario autenticado:", currentUser?.email);
              setUser(currentUser || null);

              // Fetch user details from our backend to check premium status
              try {
                const res = await apiRequest("GET", "/api/auth/user", undefined);
                
                if (!res.ok) {
                  console.error("Error en respuesta del servidor:", res.status, res.statusText);
                  const errorText = await res.text();
                  console.error("Detalle del error:", errorText);
                } else {
                  const userData = await res.json();
                  console.log("Datos de usuario del servidor:", userData);
                  setIsPremiumUser(userData.isPremium || false);
                }
              } catch (err) {
                console.error("Error detallado al obtener datos de usuario:", err);
                // Continuar incluso con error
              }
            }
          } catch (err) {
            console.error("Error inesperado al verificar usuario:", err);
            setUser(null);
          }
        } else {
          console.log("Usuario no autenticado");
          setUser(null);
        }
      } catch (error) {
        console.error("Error durante verificación de autenticación:", error);
        setUser(null);
      } finally {
        // Limpiar el temporizador de seguridad si terminamos antes
        clearTimeout(safetyTimer);
        setIsLoading(false);
      }
    }

    checkAuthStatus();

    // Limpieza del efecto
    return () => clearTimeout(safetyTimer);
  }, []);

  // Auth modal functions
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  // Auth functions
  const handleLoginWithGoogle = async () => {
    return await signInWithGoogle();
  };

  const handleLoginWithEmail = async (email: string, password: string) => {
    return await signInWithEmail(email, password);
  };

  const handleRegisterWithEmail = async (email: string, password: string) => {
    return await signUpWithEmail(email, password);
  };

  const handleRegisterWithGoogle = async () => {
    return await signInWithGoogle();
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al cerrar sesión",
          description: error.message,
        });
        return;
      }

      setUser(null);
      setIsPremiumUser(false);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al cerrar sesión",
        description: error.message || "Ocurrió un error inesperado",
      });
    }
  };

  const upgradeToPremiun = async () => {
    try {
      const res = await apiRequest("POST", "/api/auth/upgrade", undefined);
      const userData = await res.json();
      setIsPremiumUser(userData.isPremium || false);
      
      toast({
        title: "¡Felicidades!",
        description: "Ahora eres un usuario premium",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.message || "Ocurrió un error inesperado",
      });
    }
  };

  const value: AuthContextType = {
    user,
    isPremiumUser,
    isLoading,
    isLoginModalOpen,
    isRegisterModalOpen,
    openLoginModal,
    closeLoginModal,
    openRegisterModal,
    closeRegisterModal,
    loginWithGoogle: handleLoginWithGoogle,
    loginWithEmail: handleLoginWithEmail,
    registerWithEmail: handleRegisterWithEmail,
    registerWithGoogle: handleRegisterWithGoogle,
    logout: handleLogout,
    upgradeToPremiun,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
