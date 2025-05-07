import { useState } from 'react';
import { useCourses } from '@/hooks/useCourses';
import CourseCard from './CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Course } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

type CourseFilter = 'all' | 'free' | 'premium';

const CourseList = () => {
  const { courses, isLoading } = useCourses();
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredCourses = courses
    .filter(course => {
      // Apply category filter
      if (filter === 'free' && course.isPremium) return false;
      if (filter === 'premium' && !course.isPremium) return false;
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });

  const visibleCourses = filteredCourses.slice(0, visibleCount);
  const hasMore = visibleCourses.length < filteredCourses.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <section id="courses" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-heading">
            Nuestros cursos
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            De principiante a experto - tenemos cursos para todos los niveles de aprendizaje.
          </p>
        </div>

        <div className="mt-12">
          {/* Course Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 mb-6">
            <div className="flex items-center space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-primary text-white' : ''}
              >
                Todos
              </Button>
              <Button
                variant={filter === 'free' ? 'default' : 'outline'}
                onClick={() => setFilter('free')}
                className={filter === 'free' ? 'bg-primary text-white' : ''}
              >
                Gratuitos
              </Button>
              <Button
                variant={filter === 'premium' ? 'default' : 'outline'}
                onClick={() => setFilter('premium')}
                className={filter === 'premium' ? 'bg-primary text-white' : ''}
              >
                Premium
              </Button>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar cursos..."
                className="pl-10 pr-4 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </span>
            </div>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No se encontraron cursos</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Intenta con otros términos de búsqueda o filtros
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {visibleCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    className="inline-flex items-center px-6 py-3"
                  >
                    Ver más cursos
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseList;
