import CourseList from "@/components/courses/CourseList";
import { Helmet } from "react-helmet";

const Courses = () => {
  return (
    <>
      <Helmet>
        <title>Nuestros cursos | TK&TE</title>
        <meta name="description" content="Explora nuestra selección de cursos de lectura veloz, comprensión y memorización, tanto gratuitos como premium." />
      </Helmet>
      
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight font-heading">
              Todos nuestros cursos
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Mejora tus habilidades de lectura y aprendizaje con nuestros cursos especializados.
            </p>
          </div>
        </div>
      </div>
      
      <CourseList />
    </>
  );
};

export default Courses;
