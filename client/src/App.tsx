import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import ReadingTest from "@/pages/reading-test";
import ReadingTestCategories from "@/pages/reading-test-categories";
import Profile from "@/pages/profile";
import AdminPage from "@/pages/admin";
import { AuthModals } from "@/components/auth/AuthModals";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/reading-test" component={ReadingTest} />
      <Route path="/reading-test-categories" component={ReadingTestCategories} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isLoading } = useAuth();
  const [loadingTime, setLoadingTime] = useState<number>(0);
  const [forceRender, setForceRender] = useState<boolean>(false);
  
  // Temporizador para mostrar mensaje adicional si la carga tarda demasiado
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTime((prev: number) => {
          // Si ha pasado mucho tiempo (10 segundos), forzar renderizado sin autenticación
          if (prev === 10) {
            console.log("Carga demasiado lenta - forzando renderizado de app");
            setForceRender(true);
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setLoadingTime(0);
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  if (isLoading && !forceRender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
        
        <h2 className="text-xl font-semibold text-center">Cargando tu experiencia de aprendizaje...</h2>
        
        {loadingTime > 3 && (
          <p className="text-center mt-2 text-gray-600 max-w-md">
            Estamos conectando con nuestros servidores. Esto podría tomar unos momentos...
          </p>
        )}
        
        {loadingTime > 7 && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md max-w-md">
            <p className="text-center text-amber-700">
              La conexión está tardando más de lo esperado. Verificando conexión con servicios externos...
            </p>
          </div>
        )}
        
        {loadingTime > 9 && (
          <button 
            onClick={() => setForceRender(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Continuar sin autenticación
          </button>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <AuthModals />
      </div>
    </TooltipProvider>
  );
}

export default App;
