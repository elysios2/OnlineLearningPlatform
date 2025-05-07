import { useState } from 'react';
import { useAuth } from './useAuth';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export type TestStep = 'instructions' | 'reading' | 'questions' | 'results';

interface ReadingProgress {
  wordCount: number;
  timeElapsed: number;
  wordsPerMinute: number;
}

interface Answer {
  questionId: number;
  answerId: number;
}

interface ReadingTestHook {
  currentStep: TestStep;
  setCurrentStep: (step: TestStep) => void;
  readingContent: string;
  questions: any[];
  startReading: () => void;
  finishReading: () => void;
  submitAnswers: (answers: Answer[]) => Promise<void>;
  readingProgress: ReadingProgress | null;
  testResults: any;
  isLoadingContent: boolean;
  isLoadingQuestions: boolean;
  isSubmitting: boolean;
  userTestHistory: any[];
  isLoadingHistory: boolean;
}

export function useReadingTest(): ReadingTestHook {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<TestStep>('instructions');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(null);
  const [currentTestId, setCurrentTestId] = useState<number | null>(null);

  // Fetch reading content
  const { data: readingData = { content: '', wordCount: 0 }, isLoading: isLoadingContent } = useQuery({
    queryKey: ['/api/reading-test/content'],
    enabled: currentStep === 'instructions' || currentStep === 'reading',
  });

  // Fetch questions for current reading
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['/api/reading-test/questions'],
    enabled: currentStep === 'questions',
  });

  // Fetch user's test history
  const { data: userTestHistory = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['/api/user/reading-tests'],
    enabled: !!user,
  });

  // Start the test and track start time
  const startReading = () => {
    setStartTime(Date.now());
    setCurrentStep('reading');
  };

  // Finish reading and calculate reading speed
  const finishReading = () => {
    if (!startTime) return;
    
    const end = Date.now();
    setEndTime(end);
    
    const timeElapsed = (end - startTime) / 1000; // in seconds
    const wordsPerMinute = Math.round((readingData.wordCount / timeElapsed) * 60);
    
    setReadingProgress({
      wordCount: readingData.wordCount,
      timeElapsed,
      wordsPerMinute,
    });
    
    // Initialize test in the backend
    initTestMutation.mutate(wordsPerMinute);
    setCurrentStep('questions');
  };

  // Initialize test mutation
  const initTestMutation = useMutation({
    mutationFn: async (wordsPerMinute: number) => {
      const res = await apiRequest('POST', '/api/reading-test/init', { wordsPerMinute });
      return res.json();
    },
    onSuccess: (data) => {
      setCurrentTestId(data.testId);
    },
  });

  // Submit answers mutation
  const submitMutation = useMutation({
    mutationFn: async (answers: Answer[]) => {
      if (!currentTestId) throw new Error('No test initialized');
      const res = await apiRequest('POST', `/api/reading-test/${currentTestId}/submit`, { answers });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/reading-tests'] });
      setCurrentStep('results');
    },
  });

  // Submit answers and get results
  const submitAnswers = async (answers: Answer[]) => {
    await submitMutation.mutateAsync(answers);
  };

  // Get most recent test results
  const { data: testResults = null } = useQuery({
    queryKey: ['/api/reading-test/result', currentTestId],
    enabled: currentStep === 'results' && !!currentTestId,
  });

  return {
    currentStep,
    setCurrentStep,
    readingContent: readingData.content || '',
    questions,
    startReading,
    finishReading,
    submitAnswers,
    readingProgress,
    testResults,
    isLoadingContent,
    isLoadingQuestions,
    isSubmitting: submitMutation.isPending,
    userTestHistory,
    isLoadingHistory,
  };
}
