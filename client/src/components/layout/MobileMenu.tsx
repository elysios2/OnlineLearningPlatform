import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [location] = useLocation();
  const { user, openLoginModal, openRegisterModal, logout } = useAuth();

  const handleLinkClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sm:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-sm" id="mobile-menu">
      <div className="p-4 max-w-md mx-auto flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <img 
            src="/logotkyte-trim.png" 
            alt="TK & TE Online - Plataforma de Cursos de Lectura en Bolivia" 
            className="h-12 w-auto" 
            title="TK & TE - Fundada por Sten Cabredo Vilchez en Cochabamba, Bolivia"
          />
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            <span className="sr-only">Cerrar menú</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
          <h3 className="font-medium text-gray-800 px-3 py-2 text-sm">Navegación</h3>
          <div className="space-y-1 mt-2">
            <Link href="/">
              <a 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location === '/' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Inicio
              </a>
            </Link>
            <Link href="/courses">
              <a 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location === '/courses' 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                Cursos
              </a>
            </Link>
            <Link href="/reading-test-categories">
              <a 
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  location === '/reading-test-categories' || location === '/reading-test'
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                Prueba de Lectura
              </a>
            </Link>
          </div>
        </div>
        
        <div className="mt-auto bg-white rounded-lg shadow-sm p-2">
          <h3 className="font-medium text-gray-800 px-3 py-2 text-sm">Mi cuenta</h3>
          <div className="space-y-1 mt-2">
            {user ? (
              <>
                <Link href="/profile">
                  <a 
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={handleLinkClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Mi Perfil
                  </a>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    openLoginModal();
                    onClose();
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Iniciar sesión
                </button>
                <button 
                  onClick={() => {
                    openRegisterModal();
                    onClose();
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
