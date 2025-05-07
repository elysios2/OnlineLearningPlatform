import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import CourseList from "@/components/courses/CourseList";
import ReadingTest from "@/components/reading-test/ReadingTest";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>TK&TE - Plataforma de lectura veloz y aprendizaje</title>
        <meta name="description" content="Aprende técnicas de lectura veloz, comprensión y memorización para mejorar tus habilidades de estudio y aprendizaje." />
      </Helmet>
      
      <Hero />
      <Features />
      <CourseList />
      <ReadingTest />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;
