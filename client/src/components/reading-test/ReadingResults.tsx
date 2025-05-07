import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ReadingProgressType {
  wordCount: number;
  timeElapsed: number;
  wordsPerMinute: number;
}

interface Results {
  id: number;
  userId: number;
  wordsPerMinute: number;
  comprehensionScore: number;
  dateCompleted: string;
  recommendations: string;
  questionResults: {
    question: string;
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

interface ReadingResultsProps {
  results: Results | null;
  readingProgress: ReadingProgressType | null;
  onRetry: () => void;
}

const ReadingResults = ({ results, readingProgress, onRetry }: ReadingResultsProps) => {
  const [activeTab, setActiveTab] = useState<string>("score");

  if (!results || !readingProgress) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resultados no disponibles</h3>
        <p className="text-gray-500 text-center mb-6">
          No se pudo obtener los resultados de la prueba. Puedes intentar realizarla nuevamente.
        </p>
        <Button onClick={onRetry}>
          Realizar nueva prueba
        </Button>
      </div>
    );
  }

  const { wordsPerMinute, comprehensionScore, recommendations, questionResults } = results;

  // Get reading speed rating
  const getSpeedRating = (wpm: number): string => {
    if (wpm < 150) return "Lenta";
    if (wpm < 250) return "Por debajo del promedio";
    if (wpm < 350) return "Promedio";
    if (wpm < 450) return "Buena";
    if (wpm < 600) return "Muy buena";
    return "Excelente";
  };

  // Get comprehension rating
  const getComprehensionRating = (score: number): string => {
    if (score < 20) return "Deficiente";
    if (score < 40) return "Baja";
    if (score < 60) return "Media";
    if (score < 80) return "Buena";
    return "Excelente";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Resultados de la prueba</h3>
      
      <Tabs defaultValue="score" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="score">Puntuación</TabsTrigger>
          <TabsTrigger value="answers">Respuestas</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="score" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Velocidad de lectura</h4>
                <div className="text-3xl font-bold text-primary">{wordsPerMinute} <span className="text-base font-normal text-gray-500">PPM</span></div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">Calificación:</span>
                    <span className="text-sm font-medium text-primary">{getSpeedRating(wordsPerMinute)}</span>
                  </div>
                  <Progress value={Math.min((wordsPerMinute / 700) * 100, 100)} className="h-2" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Palabras totales:</span>
                    <span className="font-medium">{readingProgress.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tiempo de lectura:</span>
                    <span className="font-medium">{Math.round(readingProgress.timeElapsed)} segundos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Comprensión de lectura</h4>
                <div className="text-3xl font-bold text-[#F59E0B]">{comprehensionScore}%</div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">Calificación:</span>
                    <span className="text-sm font-medium text-[#F59E0B]">{getComprehensionRating(comprehensionScore)}</span>
                  </div>
                  <Progress value={comprehensionScore} className="h-2 bg-gray-200 [&>*]:bg-[#F59E0B]" />
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Preguntas correctas:</span>
                    <span className="font-medium">
                      {questionResults.filter(q => q.correct).length} de {questionResults.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button onClick={onRetry}>
              Realizar nueva prueba
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="answers" className="pt-4">
          <div className="space-y-4 mb-6">
            {questionResults.map((result, index) => (
              <Card key={index} className={result.correct ? "border-green-200" : "border-red-200"}>
                <CardContent className="p-4">
                  <div className="font-medium mb-2">{index + 1}. {result.question}</div>
                  <div className="text-sm mb-1">
                    <span className="font-medium">Tu respuesta: </span>
                    <span className={result.correct ? "text-green-600" : "text-red-600"}>
                      {result.userAnswer}
                    </span>
                  </div>
                  {!result.correct && (
                    <div className="text-sm text-green-600">
                      <span className="font-medium">Respuesta correcta: </span>
                      {result.correctAnswer}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button onClick={() => setActiveTab("recommendations")}>
              Ver recomendaciones
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="pt-4">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones personalizadas</h4>
              <div className="text-gray-700 space-y-4">
                {recommendations.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-3">Cursos recomendados</h5>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Lectura Veloz - Nivel Básico</div>
                      <div className="text-sm text-gray-500">Curso perfecto para principiantes</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Comprensión y Retención Avanzada</div>
                      <div className="text-sm text-gray-500">Mejora tu capacidad de entender y memorizar</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-6">
            <Button onClick={onRetry}>
              Realizar nueva prueba
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadingResults;
