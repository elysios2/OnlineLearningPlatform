import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const ReadingTestCategoriesPage = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [ageGroup, setAgeGroup] = useState("");
  const [countdownTime, setCountdownTime] = useState("180"); // 3 minutos en segundos
  const [isReading, setIsReading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(parseInt(countdownTime));
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("niños");
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [testInProgress, setTestInProgress] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  
  // Los textos para cada categoría
  const texts = {
    niños: `EL CONEJO Y LA ZANAHORIA: Había una vez un pequeño conejo llamado Tito. A Tito le encantaban las zanahorias, pero un día encontró una muy grande en el jardín. Tiró de ella con todas sus fuerzas, pero no podía sacarla. Llamó a su amigo el ratón y juntos intentaron sacarla, pero tampoco pudieron. Luego vino la ardilla, pero la zanahoria seguía en su lugar. Finalmente, llegó la tortuga y, con su ayuda, todos lograron sacarla. ¡Era la zanahoria más grande que habían visto! Todos compartieron la zanahoria y aprendieron que trabajar en equipo es mejor.`,
    jóvenes: `Los avances tecnológicos han transformado nuestra manera de comunicarnos y aprender. El acceso instantáneo a la información a través de internet ha revolucionado la educación, permitiendo que personas de todas las edades adquieran conocimientos desde cualquier lugar. Sin embargo, esta sobreabundancia de información también presenta desafíos, como la capacidad para distinguir entre fuentes confiables y no confiables, y la tentación constante de distracciones digitales que pueden afectar nuestra concentración y productividad.`,
    adultos: `La evolución del pensamiento crítico es fundamental para el desarrollo de sociedades democráticas. La capacidad de analizar la información de manera objetiva, evaluar argumentos desde múltiples perspectivas y formular conclusiones basadas en evidencia, constituye una habilidad esencial en la era de la información. Este proceso cognitivo complejo requiere no solo conocimientos específicos, sino también metacognición, es decir, la conciencia y regulación de nuestros propios procesos mentales. Las instituciones educativas deben fomentar estas habilidades mediante metodologías que promuevan el cuestionamiento, la investigación y la resolución de problemas complejos en contextos interdisciplinarios.`
  };

  // Verificar la conexión con Supabase al cargar la página
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.warn("Supabase connection warning:", error.message);
          setConnectionStatus("retry");
        } else {
          setConnectionStatus("connected");
        }
      } catch (err) {
        console.error("Supabase connection error:", err);
        setConnectionStatus("offline");
      }
    };
    
    checkConnection();
    
    // Verificar periódicamente la conexión
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Temporizador para la prueba de lectura
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    
    if (isReading && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsReading(false);
            setTestStarted(false);
            setShowResults(true);
            clearInterval(timer!);
            calculateResults();
            return 0;
          }
          
          // Actualizar el progreso
          const progress = 100 - (prev / parseInt(countdownTime)) * 100;
          setReadingProgress(progress);
          
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isReading, timeRemaining, countdownTime]);

  // Calcular palabras por minuto
  const calculateResults = () => {
    const text = texts[activeTab as keyof typeof texts];
    const wordCount = text.split(/\s+/).length;
    const minutesSpent = (parseInt(countdownTime) - timeRemaining) / 60;
    const wpm = Math.round(wordCount / minutesSpent);
    setWordsPerMinute(wpm);
  };

  // Manejar comienzo de la prueba
  const handleStartTest = () => {
    if (!ageGroup) {
      toast({
        title: "Selecciona un grupo de edad",
        description: "Por favor, selecciona un grupo de edad antes de comenzar la prueba",
        variant: "destructive",
      });
      return;
    }
    
    // Si hay problemas de conexión, mostrar advertencia
    if (connectionStatus === "offline") {
      toast({
        title: "Conexión no disponible",
        description: "No se podrán guardar tus resultados. ¿Deseas continuar de todos modos?",
        variant: "destructive",
      });
    }
    
    setTimeRemaining(parseInt(countdownTime));
    setIsReading(true);
    setTestStarted(true);
    setShowResults(false);
    setTestInProgress(true);
    setReadingProgress(0);
  };
  
  // Finalizar la prueba
  const handleFinishReading = () => {
    setIsReading(false);
    setShowResults(true);
    calculateResults();
    
    // Guardar los resultados en el backend (simulado por ahora)
    toast({
      title: "Prueba completada",
      description: `Has leído a una velocidad de ${wordsPerMinute} palabras por minuto.`,
      variant: "default",
    });
    
    setTestInProgress(false);
  };
  
  // Reiniciar la prueba
  const handleReset = () => {
    setTimeRemaining(parseInt(countdownTime));
    setIsReading(false);
    setTestStarted(false);
    setShowResults(false);
    setReadingProgress(0);
    setWordsPerMinute(0);
    setTestInProgress(false);
  };
  
  // Manejar cambio de categoría
  useEffect(() => {
    if (testInProgress) {
      handleReset();
    }
  }, [activeTab]);

  return (
    <>
      <Helmet>
        <title>Medidor de Capacidad de Lectura | TK&TE</title>
        <meta name="description" content="Evalúa y mejora tu velocidad y comprensión lectora con nuestras pruebas personalizadas por categorías de edad." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
              Medidor de Capacidad de Lectura
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Evalúa y mejora tu velocidad y comprensión lectora.
            </p>
            
            {connectionStatus === "retry" && (
              <div className="mt-2 inline-flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" y2="13" x2="12"></line><line x1="12" y1="17" y2="17.01" x2="12"></line></svg>
                Conexión limitada - Intentando reconectar
              </div>
            )}
            
            {connectionStatus === "offline" && (
              <div className="mt-2 inline-flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Sin conexión - Algunos datos no se guardarán
              </div>
            )}
          </motion.div>
          
          {/* Pestañas de categorías */}
          <Tabs defaultValue="niños" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="niños">Niños (6-12 años)</TabsTrigger>
              <TabsTrigger value="jóvenes">Jóvenes (13-17 años)</TabsTrigger>
              <TabsTrigger value="adultos">Adultos (18+ años)</TabsTrigger>
            </TabsList>
            
            {/* Contenido para cada pestaña */}
            {["niños", "jóvenes", "adultos"].map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`overflow-hidden shadow-lg border-t-4 ${
                    category === "niños" 
                      ? "border-t-blue-400" 
                      : category === "jóvenes" 
                        ? "border-t-green-400" 
                        : "border-t-purple-400"
                  }`}>
                    <CardHeader className="bg-gradient-to-r from-white to-gray-50">
                      <CardTitle className={`text-2xl ${
                        category === "niños" 
                          ? "text-blue-700" 
                          : category === "jóvenes" 
                            ? "text-green-700" 
                            : "text-purple-700"
                      }`}>
                        {category === "niños" 
                          ? "Prueba para Niños" 
                          : category === "jóvenes" 
                            ? "Prueba para Jóvenes" 
                            : "Prueba para Adultos"}
                      </CardTitle>
                      <CardDescription>
                        {category === "niños" 
                          ? "Lectura adaptada para niños de 6 a 12 años" 
                          : category === "jóvenes" 
                            ? "Lectura adaptada para jóvenes de 13 a 17 años" 
                            : "Lectura adaptada para adultos mayores de 18 años"}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Selector de edad */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selecciona tu grupo de edad:
                          </label>
                          <Select value={ageGroup} onValueChange={setAgeGroup}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona un rango de edad" />
                            </SelectTrigger>
                            <SelectContent>
                              {category === "niños" ? (
                                <>
                                  <SelectItem value="6-8">6-8 años</SelectItem>
                                  <SelectItem value="9-10">9-10 años</SelectItem>
                                  <SelectItem value="11-12">11-12 años</SelectItem>
                                </>
                              ) : category === "jóvenes" ? (
                                <>
                                  <SelectItem value="13-14">13-14 años</SelectItem>
                                  <SelectItem value="15-17">15-17 años</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="18-30">18-30 años</SelectItem>
                                  <SelectItem value="31-50">31-50 años</SelectItem>
                                  <SelectItem value="51+">51+ años</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Tiempo de prueba */}
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-gray-700">Tiempo para la prueba:</span>
                            <div className="text-3xl font-bold mt-1">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${isReading ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></div>
                            <span className="text-sm text-gray-600">{isReading ? "En progreso" : "Esperando"}</span>
                          </div>
                        </div>
                        
                        {/* Progreso */}
                        {testStarted && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Progreso</span>
                              <span>{Math.round(readingProgress)}%</span>
                            </div>
                            <Progress value={readingProgress} className="h-2" />
                          </div>
                        )}
                        
                        {/* Mensaje cuando no se ha iniciado la prueba */}
                        {!testStarted && !showResults && (
                          <div className="bg-blue-50 p-6 rounded-lg text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                            <h3 className="text-lg font-medium text-blue-800 mb-2">¡Prepárate para leer!</h3>
                            <p className="text-blue-600">
                              Selecciona tu edad y presiona "Comenzar a Leer" cuando estés listo.
                              El texto aparecerá y tendrás 3 minutos para leerlo.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                      <div>
                        {showResults && (
                          <div className="text-lg font-semibold text-green-700">
                            {wordsPerMinute} palabras por minuto
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        {testStarted && (
                          <Button 
                            variant="outline" 
                            onClick={handleReset}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Reiniciar
                          </Button>
                        )}
                        
                        {!testStarted && showResults && (
                          <Button 
                            variant="outline" 
                            onClick={handleReset}
                          >
                            Nueva prueba
                          </Button>
                        )}
                        
                        {isReading ? (
                          <Button 
                            onClick={handleFinishReading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Terminé de leer
                          </Button>
                        ) : (
                          !showResults && (
                            <Button 
                              onClick={handleStartTest}
                              className={`${
                                category === "niños" 
                                  ? "bg-blue-600 hover:bg-blue-700" 
                                  : category === "jóvenes" 
                                    ? "bg-green-600 hover:bg-green-700" 
                                    : "bg-purple-600 hover:bg-purple-700"
                              }`}
                            >
                              Comenzar a Leer
                            </Button>
                          )
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
          
          {/* Pie de página */}
          <div className="bg-white p-6 rounded-lg shadow-sm text-center mt-8">
            <div className="flex justify-center mb-6">
              <img src="/logotkyte-trim.png" alt="TK & TE" className="h-12" />
            </div>
            <Link href="/courses">
              <Button variant="outline" className="bg-orange-50 hover:bg-orange-100 text-primary border-primary/30">
                Ver Cursos
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              © {new Date().getFullYear()} Medidor de Capacidad de Lectura
            </p>
          </div>
        </div>
      </div>
      
      {/* Ventana emergente con el texto de lectura */}
      <Sheet open={isReading} onOpenChange={(open) => !open && handleFinishReading()}>
        <SheetContent side="bottom" className="h-[90vh] sm:max-w-3xl mx-auto rounded-t-xl">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle className="flex items-center justify-between">
              <span>Lectura en curso</span>
              <div className="flex items-center">
                <div className="text-2xl font-mono mr-3">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleFinishReading}
                >
                  Terminar
                </Button>
              </div>
            </SheetTitle>
            <SheetDescription>
              Lee el siguiente texto lo más rápido que puedas y con atención.
            </SheetDescription>
          </SheetHeader>
          
          <div className="relative overflow-y-auto max-h-[calc(90vh-180px)] pb-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="bg-white shadow-sm rounded-lg p-8 max-w-3xl mx-auto"
              style={{
                backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                backgroundSize: "20px 30px"
              }}
            >
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {texts[activeTab as keyof typeof texts]}
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-10 pointer-events-none" />
          
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleFinishReading}
              className="bg-green-600 hover:bg-green-700"
            >
              He terminado de leer
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Resultados */}
      <Sheet open={showResults && !isReading} onOpenChange={(open) => !open && handleReset()}>
        <SheetContent className="sm:max-w-2xl mx-auto">
          <SheetHeader>
            <SheetTitle>Resultados de la prueba</SheetTitle>
            <SheetDescription>
              Aquí están los resultados de tu prueba de lectura.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium text-blue-800 mb-2">Tu velocidad de lectura</h3>
              <div className="text-5xl font-bold text-blue-700 mb-2">
                {wordsPerMinute} <span className="text-2xl font-normal">PPM</span>
              </div>
              <p className="text-blue-600 text-sm">
                Palabras por minuto
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Análisis de tu resultado</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">Nivel de velocidad</span>
                    <span className="text-sm font-medium text-blue-600">
                      {wordsPerMinute < 150 ? 'Principiante' : wordsPerMinute < 250 ? 'Intermedio' : 'Avanzado'}
                    </span>
                  </div>
                  <Progress value={wordsPerMinute < 150 ? 33 : wordsPerMinute < 250 ? 66 : 100} className="h-2" />
                </div>
                
                <p className="text-gray-600 mt-4">
                  {wordsPerMinute < 150 
                    ? 'Tu velocidad de lectura está en desarrollo. Con práctica constante, podrás mejorar significativamente.' 
                    : wordsPerMinute < 250 
                      ? 'Tienes una buena velocidad de lectura. Sigue practicando para alcanzar un nivel avanzado.' 
                      : 'Excelente velocidad de lectura. Estás por encima del promedio de los lectores.'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Nueva prueba
              </Button>
              <Link href="/courses">
                <Button>Ver cursos recomendados</Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ReadingTestCategoriesPage;