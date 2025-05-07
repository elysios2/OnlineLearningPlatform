import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const Hero = () => {
  const { user, openRegisterModal } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  // Array de imágenes de fondo
  const backgroundImages = [
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  ];
  
  // Array de palabras que cambian
  const changingWords = ["VELOCIDAD", "COMPRENSIÓN", "FUTURO"];

  // Efecto para cambiar la imagen cada 10 segundos
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    
    return () => clearInterval(imageInterval);
  }, []);
  
  // Efecto para cambiar la palabra cada 10 segundos
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => 
        prevIndex === changingWords.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);
    
    return () => clearInterval(wordInterval);
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Imágenes de fondo con transición */}
      {backgroundImages.map((img, index) => (
        <div 
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${img})`,
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: index === currentImageIndex ? 0 : -10
          }}
        />
      ))}
      
      {/* Overlay de color naranja */}
      <div className="absolute inset-0 bg-primary opacity-80 z-10"></div>
      
      {/* Contenido centrado */}
      <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl tracking-tight font-bold text-white sm:text-5xl md:text-6xl font-heading max-w-3xl">
          <span className="block mb-2">CON TK&TE POTENCIA TU</span>
          <div className="min-h-[1.2em]">
            <span className="block transition-all duration-500">
              {changingWords[currentWordIndex]}
            </span>
          </div>
        </h1>
        <p className="mt-6 text-xl text-white sm:text-2xl max-w-2xl mx-auto">
          Descubre cursos innovadores que te impulsan hacia el éxito profesional
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses">
            <Button size="lg" className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 border border-primary/20">
              Explorar Cursos - Desde Bs. 99
            </Button>
          </Link>
          <Link href="/reading-test-categories">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-primary border-white hover:bg-white/20">
              Evalúa tu velocidad de lectura
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;