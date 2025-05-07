import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-white font-heading font-bold text-2xl">
                  TK<span className="text-[#F59E0B]">&</span>TE
                </span>
              </a>
            </Link>
            <p className="text-gray-400 text-base">
              Transformando la manera en que las personas leen, aprenden y retienen información.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook h-6 w-6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram h-6 w-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter h-6 w-6"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">YouTube</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube h-6 w-6"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Plataforma
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/courses">
                      <a className="text-base text-gray-400 hover:text-gray-300">
                        Cursos
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/reading-test">
                      <a className="text-base text-gray-400 hover:text-gray-300">
                        Prueba de lectura
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a href="#testimonials" className="text-base text-gray-400 hover:text-gray-300">
                      Testimonios
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Soporte
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Preguntas frecuentes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Contacto
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Ayuda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Comunidad
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Empresa
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Sobre nosotros
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Equipo
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Trabaja con nosotros
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Prensa
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Términos de servicio
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Política de privacidad
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                      Política de cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center relative">
            &copy; {new Date().getFullYear()} TK&TE. Todos los derechos reservados.
            <Link href="/admin">
              <a className="opacity-20 hover:opacity-100 transition-opacity absolute right-0 bottom-0 text-[10px] text-gray-600 hover:text-gray-400">
                Admin
              </a>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
