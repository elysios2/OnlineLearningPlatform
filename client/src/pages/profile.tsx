import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { useQuery } from "@tanstack/react-query";
import { UserAvatar } from "@/components/ui/avatars";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";
import { ReadingProgressChart } from "@/components/reading-test/ReadingProgressChart";
import { CourseProgressChart } from "@/components/courses/CourseProgressChart";
import { AnimatedProgress } from "@/components/ui/animated-progress";

const ProfilePage = () => {
  const [, setLocation] = useLocation();
  const { user, isPremiumUser, upgradeToPremiun, logout } = useAuth();
  const { userCourses, isLoadingUserCourses } = useCourses() as { userCourses: UserCourse[], isLoadingUserCourses: boolean };
  
  useEffect(() => {
    if (!user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  interface ReadingTest {
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

  interface UserCourse {
    courseId: number;
    title: string;
    description: string;
    imageUrl: string;
    isPremium: boolean;
    progress: number;
    purchased: boolean;
    lastAccessed: string;
  }

  const { data: readingTests = [], isLoading: isLoadingTests } = useQuery<ReadingTest[]>({
    queryKey: ['/api/user/reading-tests'],
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  // Get last reading test
  const lastReadingTest = readingTests.length > 0 ? readingTests[0] : null;

  return (
    <>
      <Helmet>
        <title>Mi perfil | TK&TE</title>
        <meta name="description" content="Gestiona tu perfil, consulta tus cursos y resultados de pruebas de lectura." />
      </Helmet>
      
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <UserAvatar user={user} size="lg" />
                    <h2 className="mt-4 text-xl font-bold">{user.email}</h2>
                    <p className="text-sm text-gray-500">Miembro desde {new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
                    
                    <div className="mt-4">
                      {isPremiumUser ? (
                        <Badge className="bg-[#F59E0B]">Usuario Premium</Badge>
                      ) : (
                        <Badge>Usuario Gratuito</Badge>
                      )}
                    </div>
                    
                    {!isPremiumUser && (
                      <div className="mt-4 w-full">
                        <Button 
                          onClick={upgradeToPremiun}
                          className="w-full bg-[#F59E0B] hover:bg-[#D97706]"
                        >
                          Actualizar a Premium
                        </Button>
                      </div>
                    )}
                    
                    <div className="mt-6 w-full">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={logout}
                      >
                        Cerrar sesión
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Reading Stats Summary */}
              <div className="mt-6">
                {isLoadingTests ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas de lectura</CardTitle>
                      <CardDescription>Tu rendimiento en pruebas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ) : readingTests.length > 0 ? (
                  <>
                    <ReadingProgressChart 
                      wordsPerMinute={lastReadingTest?.wordsPerMinute || 0}
                      comprehensionScore={lastReadingTest?.comprehensionScore || 0}
                      testHistory={readingTests.map((test: ReadingTest) => ({
                        date: test.dateCompleted,
                        wordsPerMinute: test.wordsPerMinute,
                        comprehensionScore: test.comprehensionScore
                      }))}
                      showHistory={false}
                    />
                    <div className="mt-4">
                      <Button className="w-full" variant="outline" onClick={() => setLocation("/reading-test")}>
                        Realizar nueva prueba
                      </Button>
                    </div>
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas de lectura</CardTitle>
                      <CardDescription>Tu rendimiento en pruebas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-4">Aún no has realizado pruebas de lectura</p>
                        <Button onClick={() => setLocation("/reading-test")}>
                          Realizar prueba
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Main Content */}
            <div className="col-span-1 lg:col-span-2">
              <Tabs defaultValue="courses">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="courses">Mis cursos</TabsTrigger>
                  <TabsTrigger value="reading-history">Historial de pruebas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="courses" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Mis cursos</CardTitle>
                      <CardDescription>Cursos en los que estás inscrito</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingUserCourses ? (
                        <div className="space-y-6">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-4">
                              <Skeleton className="h-24 w-full sm:w-40 rounded-md" />
                              <div className="flex-grow space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <div className="pt-2">
                                  <Skeleton className="h-2 w-full" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : userCourses.length > 0 ? (
                        <div className="space-y-8">
                          {userCourses.length > 0 && userCourses[0] && (
                            <CourseProgressChart 
                              progress={userCourses[0].progress || 0}
                              courseTitle={userCourses[0].title}
                              completedModules={Math.ceil(((userCourses[0].progress || 0) / 100) * 4)}
                              remainingModules={4 - Math.ceil(((userCourses[0].progress || 0) / 100) * 4)}
                              lastActivity={userCourses[0].lastAccessed ? new Date(userCourses[0].lastAccessed) : undefined}
                            />
                          )}
                          
                          <div className="space-y-6 mt-6">
                            {userCourses.map((course: UserCourse) => (
                              <div key={course.courseId} className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-b-0 last:pb-0">
                                <div className="relative h-24 w-full sm:w-40 rounded-md overflow-hidden">
                                  <img 
                                    src={course.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                                    alt={course.title} 
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h3 className="text-lg font-medium">{course.title}</h3>
                                  <p className="text-sm text-gray-500 mb-2">
                                    Última actividad: {new Date(course.lastAccessed || Date.now()).toLocaleDateString()}
                                  </p>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-orange-dark">Progreso: {course.progress || 0}%</span>
                                  </div>
                                  <AnimatedProgress 
                                    value={course.progress || 0} 
                                    className="h-2" 
                                    size="sm"
                                    color="#FF8000"
                                  />
                                  <div className="mt-4">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setLocation(`/courses/${course.courseId}`)}
                                    >
                                      Continuar curso
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                          </svg>
                          <h3 className="text-lg font-medium mb-1">No tienes cursos inscritos</h3>
                          <p className="text-gray-500 mb-4">Explora nuestro catálogo y encuentra cursos que te interesen</p>
                          <Button onClick={() => setLocation("/courses")}>
                            Explorar cursos
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reading-history" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de pruebas</CardTitle>
                      <CardDescription>Resultados de tus pruebas de lectura</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingTests ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Card key={i}>
                              <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between">
                                  <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                  </div>
                                  <div className="space-y-2 mt-2 sm:mt-0 text-right">
                                    <Skeleton className="h-5 w-20 ml-auto" />
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : readingTests.length > 0 ? (
                        <div className="space-y-8">
                          <ReadingProgressChart 
                            wordsPerMinute={lastReadingTest?.wordsPerMinute || 0}
                            comprehensionScore={lastReadingTest?.comprehensionScore || 0}
                            testHistory={readingTests.map((test: ReadingTest) => ({
                              date: test.dateCompleted,
                              wordsPerMinute: test.wordsPerMinute,
                              comprehensionScore: test.comprehensionScore
                            }))}
                            showHistory={true}
                          />
                          
                          <div className="space-y-4 mt-6">
                            {readingTests.map((test: any) => (
                              <Card key={test.id}>
                                <CardContent className="p-4">
                                  <div className="flex flex-col sm:flex-row justify-between">
                                    <div>
                                      <h4 className="font-medium">Prueba de lectura</h4>
                                      <p className="text-sm text-gray-500">
                                        {new Date(test.dateCompleted).toLocaleDateString()} - {new Date(test.dateCompleted).toLocaleTimeString()}
                                      </p>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-right">
                                      <div className="font-medium text-orange-main">{test.wordsPerMinute} PPM</div>
                                      <div className="text-sm text-orange-secondary">Comprensión: {test.comprehensionScore}%</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            
                            <div className="text-center pt-4">
                              <Button variant="outline" onClick={() => setLocation("/reading-test")}>
                                Realizar nueva prueba
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <path d="M14 2v6h6"/>
                          </svg>
                          <h3 className="text-lg font-medium mb-1">No hay historial de pruebas</h3>
                          <p className="text-gray-500 mb-4">Realiza una prueba de lectura para evaluar tu velocidad y comprensión</p>
                          <Button onClick={() => setLocation("/reading-test")}>
                            Realizar prueba
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
