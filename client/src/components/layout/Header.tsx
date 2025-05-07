import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [location] = useLocation();
  const { user, openLoginModal, openRegisterModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between" style={{ height: "4.5rem" }}>
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/logotkyte-trim.png" 
                  alt="TK & TE Online - Plataforma de Cursos de Lectura en Bolivia" 
                  className="h-12 w-auto" 
                  title="TK & TE - Fundada por Sten Cabredo Vilchez en Cochabamba, Bolivia"
                />
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative group">
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                  <span>Navegar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 invisible group-hover:visible">
                  <Link href="/">
                    <a className={`block px-4 py-2 text-sm ${
                      location === '/' 
                        ? 'text-primary bg-gray-50 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      Inicio
                    </a>
                  </Link>
                  <Link href="/courses">
                    <a className={`block px-4 py-2 text-sm ${
                      location === '/courses' 
                        ? 'text-primary bg-gray-50 font-medium'  
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      Cursos
                    </a>
                  </Link>
                  <Link href="/reading-test-categories">
                    <a className={`block px-4 py-2 text-sm ${
                      location === '/reading-test-categories' || location === '/reading-test'
                        ? 'text-primary bg-gray-50 font-medium'  
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      Prueba de Lectura
                    </a>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex space-x-4 items-center">
                <Link href="/profile">
                  <a className="text-sm text-gray-700 hover:text-gray-900">
                    Mi Perfil
                  </a>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={openLoginModal}

                >
                  Iniciar sesión
                </Button>
                <Button 
                  onClick={openRegisterModal}
                >
                  Registrarse
                </Button>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
