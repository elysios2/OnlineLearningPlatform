import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ReadingInstructionsProps {
  onStart: () => void;
  isLoading: boolean;
}

const ReadingInstructions = ({ onStart, isLoading }: ReadingInstructionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900">¿Cómo funciona la prueba?</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          
          <div className="mt-6 space-y-6">
            <div className="flex">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            
            <div className="flex">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            
            <div className="flex">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-500">
            Esta evaluación mide tanto tu velocidad como tu nivel de comprensión lectora. El proceso consta de 3 etapas simples:
          </p>
          
          <ol className="mt-4 space-y-4 text-gray-500">
            <li className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                  1
                </div>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Lectura cronometrada</p>
                <p className="mt-1">Se presentará un texto que deberás leer en el menor tiempo posible. Al finalizar, presiona el botón "Terminé de leer".</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                  2
                </div>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Preguntas de comprensión</p>
                <p className="mt-1">Responderás a 5 preguntas de opción múltiple sobre el contenido que acabas de leer.</p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                  3
                </div>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Análisis de resultados</p>
                <p className="mt-1">Obtendrás un informe detallado sobre tu velocidad (palabras por minuto) y nivel de comprensión, con recomendaciones personalizadas.</p>
              </div>
            </li>
          </ol>
          
          <div className="mt-8 flex justify-center">
            <Button onClick={onStart} size="lg">
              Comenzar prueba
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReadingInstructions;
