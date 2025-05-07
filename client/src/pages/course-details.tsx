import { useParams } from "wouter";
import CourseDetails from "@/components/courses/CourseDetails";
import { useCourses } from "@/hooks/useCourses";
import { Helmet } from "react-helmet";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const { getCourse } = useCourses();
  
  const courseId = parseInt(id);
  const course = getCourse(courseId);

  return (
    <>
      <Helmet>
        <title>{course ? `${course.title} | TK&TE` : "Detalles del curso | TK&TE"}</title>
        <meta 
          name="description" 
          content={course ? course.description : "Detalles de nuestro curso especializado en técnicas de lectura y aprendizaje."} 
        />
      </Helmet>
      
      <CourseDetails />
    </>
  );
};

export default CourseDetailsPage;
