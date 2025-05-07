import ReadingTest from "@/components/reading-test/ReadingTest";
import { Helmet } from "react-helmet";

const ReadingTestPage = () => {
  return (
    <>
      <Helmet>
        <title>Prueba de lectura | TK&TE</title>
        <meta name="description" content="Evalúa tu velocidad y comprensión de lectura con nuestra prueba interactiva y recibe recomendaciones personalizadas." />
      </Helmet>
      
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight font-heading">
              Prueba de lectura
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Evalúa tu velocidad y comprensión de lectura para recibir recomendaciones personalizadas.
            </p>
          </div>
        </div>
      </div>
      
      <ReadingTest />
    </>
  );
};

export default ReadingTestPage;
