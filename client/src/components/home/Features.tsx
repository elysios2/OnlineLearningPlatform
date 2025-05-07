const Features = () => {
  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
            ¿Por qué elegir nuestra plataforma?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Desarrollamos técnicas probadas científicamente para mejorar tu capacidad de aprendizaje.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#4338CA] rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white text-xl">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-medium text-gray-900">Lectura veloz</h3>
              </div>
              <p className="mt-4 text-base text-gray-500">
                Aprende técnicas para incrementar tu velocidad de lectura de 250 a más de 800 palabras por minuto.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-[#F59E0B] rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white text-xl">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-medium text-gray-900">Comprensión mejorada</h3>
              </div>
              <p className="mt-4 text-base text-gray-500">
                No solo leerás más rápido - entenderás y retendrás mejor la información con nuestras técnicas de comprensión.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-600 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white text-xl">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-medium text-gray-900">Seguimiento personalizado</h3>
              </div>
              <p className="mt-4 text-base text-gray-500">
                Evaluaciones detalladas y recomendaciones personalizadas para mejorar tus habilidades de lectura y aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
