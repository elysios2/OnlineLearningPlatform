import { useState } from "react";
import { useReadingTest, TestStep } from "@/hooks/useReadingTest";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReadingInstructions from "./ReadingInstructions";
import ReadingContent from "./ReadingContent";
import ReadingQuestions from "./ReadingQuestions";
import ReadingResults from "./ReadingResults";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const ReadingTest = () => {
  const { user, openLoginModal } = useAuth();
  const { 
    currentStep, 
    setCurrentStep, 
    readingContent,
    questions,
    startReading,
    finishReading,
    submitAnswers,
    readingProgress,
    testResults,
    isLoadingContent,
    isLoadingQuestions,
    isSubmitting
  } = useReadingTest();

  // Handle when a non-logged in user tries to submit results
  const handleBeforeSubmit = () => {
    if (!user) {
      openLoginModal();
      return false;
    }
    return true;
  };

  return (
    <section id="reading-test" className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
            Prueba de velocidad y comprensión lectora
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Descubre tu nivel actual y recibe recomendaciones personalizadas para mejorar.
          </p>
        </div>

        <div className="mt-12">
          <Card className="overflow-hidden shadow rounded-lg">
            <CardContent className="p-0">
              {/* Test Steps */}
              <div className="border-b border-gray-200">
                <Tabs value={currentStep} className="w-full">
                  <TabsList className="flex w-full justify-start px-4 h-auto">
                    <TabsTrigger 
                      value="instructions"
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        currentStep === "instructions" 
                          ? "border-primary text-primary" 
                          : "border-transparent text-gray-500"
                      }`}
                      disabled
                    >
                      Instrucciones
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reading"
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        currentStep === "reading" 
                          ? "border-primary text-primary" 
                          : "border-transparent text-gray-500"
                      }`}
                      disabled
                    >
                      Lectura
                    </TabsTrigger>
                    <TabsTrigger 
                      value="questions"
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        currentStep === "questions" 
                          ? "border-primary text-primary" 
                          : "border-transparent text-gray-500"
                      }`}
                      disabled
                    >
                      Comprensión
                    </TabsTrigger>
                    <TabsTrigger 
                      value="results"
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        currentStep === "results" 
                          ? "border-primary text-primary" 
                          : "border-transparent text-gray-500"
                      }`}
                      disabled
                    >
                      Resultados
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Test Content */}
              <div className="p-4 sm:p-6">
                {currentStep === "instructions" && (
                  <ReadingInstructions onStart={startReading} isLoading={isLoadingContent} />
                )}
                
                {currentStep === "reading" && (
                  <ReadingContent 
                    content={readingContent} 
                    onFinish={finishReading} 
                    isLoading={isLoadingContent} 
                  />
                )}
                
                {currentStep === "questions" && (
                  <ReadingQuestions 
                    questions={questions} 
                    onSubmit={submitAnswers} 
                    isLoading={isLoadingQuestions}
                    isSubmitting={isSubmitting}
                    checkBeforeSubmit={handleBeforeSubmit}
                  />
                )}
                
                {currentStep === "results" && (
                  <ReadingResults 
                    results={testResults}
                    readingProgress={readingProgress}
                    onRetry={() => setCurrentStep("instructions")}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReadingTest;
