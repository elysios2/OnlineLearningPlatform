import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: {
    id: number;
    text: string;
  }[];
}

interface ReadingQuestionsProps {
  questions: Question[];
  onSubmit: (answers: { questionId: number; answerId: number; }[]) => Promise<void>;
  isLoading: boolean;
  isSubmitting: boolean;
  checkBeforeSubmit: () => boolean;
}

const ReadingQuestions = ({ 
  questions, 
  onSubmit, 
  isLoading,
  isSubmitting,
  checkBeforeSubmit
}: ReadingQuestionsProps) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const handleAnswerChange = (questionId: number, answerId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions have been answered
    if (Object.keys(answers).length !== questions.length) {
      toast({
        variant: "destructive",
        title: "Respuestas incompletas",
        description: "Por favor, responde todas las preguntas antes de continuar.",
      });
      return;
    }

    // Check if user needs to login
    if (!checkBeforeSubmit()) {
      toast({
        variant: "destructive",
        title: "Inicio de sesión requerido",
        description: "Necesitas iniciar sesión para guardar tus resultados.",
      });
      return;
    }

    // Format answers for submission
    const formattedAnswers = Object.entries(answers).map(([questionId, answerId]) => ({
      questionId: parseInt(questionId),
      answerId,
    }));

    try {
      await onSubmit(formattedAnswers);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al enviar respuestas",
        description: "Ocurrió un error al procesar tus respuestas. Inténtalo de nuevo.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Preguntas de comprensión</h3>
        <p className="text-gray-500">Responde a las siguientes preguntas basadas en el texto que acabas de leer:</p>
        
        {[1, 2, 3, 4, 5].map((num) => (
          <Card key={num} className="overflow-hidden">
            <CardContent className="p-4">
              <Skeleton className="h-5 w-11/12 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Preguntas de comprensión</h3>
      <p className="text-gray-500">Responde a las siguientes preguntas basadas en el texto que acabas de leer:</p>
      
      {questions.map((question, index) => (
        <Card key={question.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="font-medium mb-3">
              {index + 1}. {question.text}
            </div>
            <RadioGroup
              value={answers[question.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
            >
              {question.options.map((option) => (
                <div className="flex items-center space-x-2 py-1" key={option.id}>
                  <RadioGroupItem value={option.id.toString()} id={`q${question.id}-o${option.id}`} />
                  <Label htmlFor={`q${question.id}-o${option.id}`} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-6 flex justify-center">
        <Button onClick={handleSubmit} size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            "Enviar respuestas"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReadingQuestions;
