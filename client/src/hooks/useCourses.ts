import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Course } from '@shared/schema';
import { useAuth } from './useAuth';
import { decryptFileUrl } from '@/lib/crypto';

export function useCourses() {
  const queryClient = useQueryClient();
  const { user, isPremiumUser } = useAuth();
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    enrolling: false,
    purchasing: false,
  });

  // Fetch all courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: true,
  });

  // Fetch user enrolled courses
  const { data: userCourses = [], isLoading: isLoadingUserCourses } = useQuery({
    queryKey: ['/api/user/courses'],
    enabled: !!user,
  });

  // Get a specific course
  const getCourse = (id: number): Course | undefined => {
    return courses.find((course: Course) => course.id === id);
  };

  // Check if user is enrolled in a course
  const isEnrolled = (courseId: number): boolean => {
    if (!userCourses || !userCourses.length) return false;
    return userCourses.some((uc: any) => uc.courseId === courseId);
  };

  // Enroll in a free course
  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      setEnrollmentStatus(prev => ({ ...prev, enrolling: true }));
      const res = await apiRequest('POST', `/api/courses/${courseId}/enroll`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/courses'] });
      setEnrollmentStatus(prev => ({ ...prev, enrolling: false }));
    },
    onError: () => {
      setEnrollmentStatus(prev => ({ ...prev, enrolling: false }));
    },
  });

  // Purchase a premium course
  const purchaseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      setEnrollmentStatus(prev => ({ ...prev, purchasing: true }));
      const res = await apiRequest('POST', `/api/courses/${courseId}/purchase`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/courses'] });
      setEnrollmentStatus(prev => ({ ...prev, purchasing: false }));
    },
    onError: () => {
      setEnrollmentStatus(prev => ({ ...prev, purchasing: false }));
    },
  });

  // Get course content (decrypting if necessary)
  const getCourseContent = async (courseId: number): Promise<string> => {
    try {
      const res = await apiRequest('GET', `/api/courses/${courseId}/content`, undefined);
      const data = await res.json();
      
      if (data.encrypted && data.encryptionKey) {
        return decryptFileUrl(data.content, data.encryptionKey);
      }
      
      return data.content;
    } catch (error) {
      console.error('Error fetching course content:', error);
      throw error;
    }
  };

  // Update user progress in a course
  const updateProgressMutation = useMutation({
    mutationFn: async ({ courseId, progress }: { courseId: number; progress: number }) => {
      const res = await apiRequest('PUT', `/api/user/courses/${courseId}/progress`, { progress });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/courses'] });
    },
  });

  return {
    courses,
    userCourses,
    isLoading,
    isLoadingUserCourses,
    getCourse,
    isEnrolled,
    isEnrolling: enrollmentStatus.enrolling,
    isPurchasing: enrollmentStatus.purchasing,
    enrollInCourse: enrollMutation.mutateAsync,
    purchaseCourse: purchaseMutation.mutateAsync,
    getCourseContent,
    updateProgress: updateProgressMutation.mutateAsync,
  };
}
