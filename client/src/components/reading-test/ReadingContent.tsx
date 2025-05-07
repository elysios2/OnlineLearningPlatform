import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ReadingContentProps {
  content: string;
  onFinish: () => void;
  isLoading: boolean;
}

const ReadingContent = ({ content, onFinish, isLoading }: ReadingContentProps) => {
  const [timer, setTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  // Start timer when component loads
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  // Format timer as mm:ss
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFinishReading = () => {
    setIsTimerActive(false);
    onFinish();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Lee el siguiente texto</h3>
          <div className="text-gray-500 text-sm px-3 py-1 bg-gray-100 rounded-full">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4 text-gray-700">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
            </div>
            
            <div className="space-y-3 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-9/12" />
            </div>
            
            <div className="space-y-3 mt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Lee el siguiente texto</h3>
        <div className="text-gray-500 text-sm px-3 py-1 bg-gray-100 rounded-full">
          Tiempo: {formatTime(timer)}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4 text-gray-700 leading-relaxed max-h-[400px] overflow-y-auto">
          {content.split("\n").map((paragraph, idx) => (
            <p key={idx} className={idx > 0 ? "mt-4" : ""}>
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-center">
        <Button onClick={handleFinishReading} size="lg">
          Terminé de leer
        </Button>
      </div>
    </div>
  );
};

export default ReadingContent;
