import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const CallToAction = () => {
  const { user, openRegisterModal } = useAuth();
  
  const handleCreateAccount = () => {
    if (!user) {
      openRegisterModal();
    }
  };

  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:py-20 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-heading max-w-3xl mx-auto">
          <span className="block mb-2">¿Listo para transformar</span>
          <span className="block">tu manera de aprender?</span>
        </h2>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="rounded-md shadow w-full sm:w-auto">
            <Link href="/courses">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px]">
                Ver todos los cursos
              </Button>
            </Link>
          </div>
          
          <div className="rounded-md shadow w-full sm:w-auto">
            {user ? (
              <Link href="/reading-test">
                <Button
                  className="bg-[#F59E0B] hover:bg-[#D97706] text-white w-full sm:w-auto min-w-[200px]"
                  size="lg"
                >
                  Evaluar mi lectura
                </Button>
              </Link>
            ) : (
              <Button 
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white w-full sm:w-auto min-w-[200px]"
                size="lg"
                onClick={handleCreateAccount}
              >
                Crear cuenta gratuita
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
