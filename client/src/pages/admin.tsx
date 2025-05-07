import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Edit, Trash2, Plus, Save, X, Lock } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AdminCredentials {
  username: string;
  password: string;
}

interface AdminSettings {
  adminCredentials: AdminCredentials;
}

interface CourseAdmin {
  id: number;
  title: string;
  description: string;
  price: number;
  isPremium: boolean;
  imageUrl: string;
  fileUrl: string;
  encryptionKey?: string;
  duration: number;
  createdAt: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: '',
    password: ''
  });
  const [, setLocation] = useLocation();
  const [isRouteMatch] = useRoute('/admin');
  
  // Si no estamos en la ruta correcta, redirigir a 404
  useEffect(() => {
    if (!isRouteMatch) {
      setLocation('/not-found');
    }
  }, [isRouteMatch, setLocation]);
  
  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Lock className="mr-2 h-6 w-6" />
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-center">
              Gestión de cursos y configuración de la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isAuthenticated ? (
              <AdminLogin 
                credentials={credentials} 
                setCredentials={setCredentials} 
                onLogin={() => setIsAuthenticated(true)} 
              />
            ) : (
              <Tabs defaultValue="courses">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="courses">Cursos</TabsTrigger>
                  <TabsTrigger value="settings">Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="courses">
                  <CoursesAdmin />
                </TabsContent>
                <TabsContent value="settings">
                  <AdminSettings 
                    settings={{ adminCredentials: credentials }} 
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminLogin({ 
  credentials, 
  setCredentials, 
  onLogin 
}: { 
  credentials: AdminCredentials, 
  setCredentials: React.Dispatch<React.SetStateAction<AdminCredentials>>,
  onLogin: () => void
}) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // Crear las credenciales en formato base64 para Basic Auth
      const base64Credentials = btoa(`${credentials.username}:${credentials.password}`);
      
      // Hacer una solicitud a un endpoint protegido para verificar las credenciales
      const response = await fetch('/api/admin/courses', {
        headers: {
          'Authorization': `Basic ${base64Credentials}`
        }
      });
      
      if (response.ok) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración",
          variant: "default",
        });
        onLogin();
      } else {
        setError('Credenciales incorrectas');
        toast({
          title: "Error de autenticación",
          description: "Las credenciales proporcionadas son incorrectas",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError('Error al iniciar sesión');
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}

function CoursesAdmin() {
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<CourseAdmin | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<CourseAdmin, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    price: 0,
    isPremium: false,
    imageUrl: '',
    fileUrl: '',
    duration: 60,
    encryptionKey: '',
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Base64 credentials para autenticación
  const getAuthHeaders = () => {
    // En un escenario real, estas credenciales deberían guardarse de forma segura
    // o pedirse al usuario en cada operación sensible
    const credentials = `stencabredo:tkyte#lohacereal2025`;
    return {
      'Authorization': `Basic ${btoa(credentials)}`
    };
  };
  
  // Función para cargar los cursos con optimización de rendimiento
  const { data: courses = [], isLoading, isError, error } = useQuery({
    queryKey: ['/api/admin/courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Error al cargar los cursos');
      }
      return response.json();
    },
    staleTime: 60000, // 1 minuto - optimizado
    gcTime: 3600000, // 1 hora - optimizado (reemplaza cacheTime que está obsoleto en v5)
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Evita refrescar datos al volver a la ventana
    retry: 3, // Intentar hasta 3 veces en caso de fallo
  });
  
  // Mutación para crear un nuevo curso
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: Omit<CourseAdmin, 'id' | 'createdAt'>) => {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(courseData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el curso');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setIsAddCourseOpen(false);
      setNewCourse({
        title: '',
        description: '',
        price: 0,
        isPremium: false,
        imageUrl: '',
        fileUrl: '',
        duration: 60,
        encryptionKey: '',
      });
      toast({
        title: "Curso creado",
        description: "El curso ha sido creado correctamente",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al crear el curso",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutación para actualizar un curso - optimizado para mejor fluidez
  const updateCourseMutation = useMutation({
    mutationFn: async (courseData: CourseAdmin) => {
      // Optimistic update - actualiza el cliente antes de que termine la petición
      const previousData = queryClient.getQueryData<CourseAdmin[]>(['/api/admin/courses']);
      
      if (previousData) {
        queryClient.setQueryData(['/api/admin/courses'], 
          previousData.map(course => 
            course.id === courseData.id ? {...courseData} : course
          )
        );
      }
      
      // Añadir timeout y reintentos para mayor robustez
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      try {
        const response = await fetch(`/api/admin/courses/${courseData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(courseData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar el curso');
        }
        
        return response.json();
      } catch (error) {
        // Si falla, restaurar datos anteriores
        if (previousData) {
          queryClient.setQueryData(['/api/admin/courses'], previousData);
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Refrescamos con menor prioridad para mantener la interfaz fluida
      queryClient.invalidateQueries({ 
        queryKey: ['/api/admin/courses'],
        refetchType: 'active'
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/courses'],
        refetchType: 'active'
      });
      setIsEditCourseOpen(false);
      setCurrentCourse(null);
      toast({
        title: "Curso actualizado",
        description: "El curso ha sido actualizado correctamente",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al actualizar el curso",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive",
      });
    }
  });
  
  // Mutación para eliminar un curso
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el curso');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setIsDeleteCourseOpen(false);
      setCurrentCourse(null);
      toast({
        title: "Curso eliminado",
        description: "El curso ha sido eliminado correctamente",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al eliminar el curso",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Función para manejar la selección de un archivo de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (currentCourse) {
          setCurrentCourse({
            ...currentCourse,
            imageUrl: base64
          });
        } else {
          setNewCourse({
            ...newCourse,
            imageUrl: base64
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Funciones para abrir modales
  const openEditModal = (course: CourseAdmin) => {
    setCurrentCourse(course);
    setIsEditCourseOpen(true);
  };
  
  const openDeleteModal = (course: CourseAdmin) => {
    setCurrentCourse(course);
    setIsDeleteCourseOpen(true);
  };
  
  // Función para cambiar el estado premium de un curso
  const togglePremium = (course: CourseAdmin) => {
    updateCourseMutation.mutate({
      ...course,
      isPremium: !course.isPremium
    });
  };
  
  // Si está cargando, mostrar mensaje de carga
  if (isLoading) {
    return <div className="py-8 text-center">Cargando cursos...</div>;
  }
  
  // Si hay un error, mostrar mensaje de error
  if (isError && error) {
    // Mostrar toast de error
    toast({
      title: "Error al cargar cursos",
      description: error.message || 'Ocurrió un error al cargar los cursos',
      variant: "destructive",
    });
    
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Ocurrió un error al cargar los cursos'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Cursos</h2>
        <Button onClick={() => setIsAddCourseOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir Curso
        </Button>
      </div>
      
      <Table>
        <TableCaption>Listado de cursos disponibles en la plataforma</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course: CourseAdmin) => (
            <TableRow key={course.id}>
              <TableCell>{course.id}</TableCell>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>Bs. {(course.price / 100).toFixed(2)}</TableCell>
              <TableCell>
                <Switch 
                  checked={course.isPremium} 
                  onCheckedChange={() => togglePremium(course)}
                />
              </TableCell>
              <TableCell>{course.duration} minutos</TableCell>
              <TableCell className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => openEditModal(course)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => openDeleteModal(course)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Modal para añadir curso */}
      <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Curso</DialogTitle>
            <DialogDescription>
              Completa el formulario para añadir un nuevo curso a la plataforma.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-title">Título</Label>
                <Input
                  id="new-title"
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-price">Precio (Bs. en centavos)</Label>
                <Input
                  id="new-price"
                  type="number"
                  min="0"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({...newCourse, price: parseInt(e.target.value) || 0})}
                  required
                />
                <p className="text-xs text-gray-500">Bs. {(newCourse.price / 100).toFixed(2)} - Moneda: Bolivianos</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-description">Descripción</Label>
              <Textarea
                id="new-description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-image">Imagen</Label>
                <Input
                  id="new-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-gray-500">O proporciona una URL:</p>
                <Input
                  type="text"
                  value={newCourse.imageUrl}
                  onChange={(e) => setNewCourse({...newCourse, imageUrl: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-file-url">URL de Contenido</Label>
                <Input
                  id="new-file-url"
                  type="text"
                  value={newCourse.fileUrl}
                  onChange={(e) => setNewCourse({...newCourse, fileUrl: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-duration">Duración (minutos)</Label>
                <Input
                  id="new-duration"
                  type="number"
                  min="1"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value) || 60})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-encryption-key">Clave de Encriptación (para cursos premium)</Label>
                <Input
                  id="new-encryption-key"
                  type="text"
                  value={newCourse.encryptionKey || ''}
                  onChange={(e) => setNewCourse({...newCourse, encryptionKey: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="new-premium"
                checked={newCourse.isPremium}
                onCheckedChange={(checked) => setNewCourse({...newCourse, isPremium: checked})}
              />
              <Label htmlFor="new-premium">Es contenido premium</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCourseOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => createCourseMutation.mutate(newCourse)}
              disabled={createCourseMutation.isPending}
            >
              {createCourseMutation.isPending ? 'Guardando...' : 'Guardar Curso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para editar curso */}
      <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>
              Modifica la información del curso.
            </DialogDescription>
          </DialogHeader>
          
          {currentCourse && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    type="text"
                    value={currentCourse.title}
                    onChange={(e) => setCurrentCourse({...currentCourse, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Precio (Bs. en centavos)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    value={currentCourse.price}
                    onChange={(e) => setCurrentCourse({...currentCourse, price: parseInt(e.target.value) || 0})}
                    required
                  />
                  <p className="text-xs text-gray-500">Bs. {(currentCourse.price / 100).toFixed(2)} - Moneda: Bolivianos</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={currentCourse.description}
                  onChange={(e) => setCurrentCourse({...currentCourse, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Imagen</Label>
                  {currentCourse.imageUrl && (
                    <div className="mb-2">
                      <img 
                        src={currentCourse.imageUrl} 
                        alt={currentCourse.title} 
                        className="h-32 w-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-gray-500">O proporciona una URL:</p>
                  <Input
                    type="text"
                    value={currentCourse.imageUrl}
                    onChange={(e) => setCurrentCourse({...currentCourse, imageUrl: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-file-url">URL de Contenido</Label>
                  <Input
                    id="edit-file-url"
                    type="text"
                    value={currentCourse.fileUrl}
                    onChange={(e) => setCurrentCourse({...currentCourse, fileUrl: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duración (minutos)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    value={currentCourse.duration}
                    onChange={(e) => setCurrentCourse({...currentCourse, duration: parseInt(e.target.value) || 60})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-encryption-key">Clave de Encriptación (para cursos premium)</Label>
                  <Input
                    id="edit-encryption-key"
                    type="text"
                    value={currentCourse.encryptionKey || ''}
                    onChange={(e) => setCurrentCourse({...currentCourse, encryptionKey: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-premium"
                  checked={currentCourse.isPremium}
                  onCheckedChange={(checked) => setCurrentCourse({...currentCourse, isPremium: checked})}
                />
                <Label htmlFor="edit-premium">Es contenido premium</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCourseOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => currentCourse && updateCourseMutation.mutate(currentCourse)}
              disabled={updateCourseMutation.isPending}
            >
              {updateCourseMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para eliminar curso */}
      <Dialog open={isDeleteCourseOpen} onOpenChange={setIsDeleteCourseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Curso</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el curso "{currentCourse?.title}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCourseOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => currentCourse && deleteCourseMutation.mutate(currentCourse.id)}
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? 'Eliminando...' : 'Eliminar Curso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminSettings({ 
  settings 
}: { 
  settings: AdminSettings 
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Credenciales de Administrador</h3>
        <p className="text-sm text-gray-500 mb-4">
          Estas son las credenciales que se utilizan para acceder al panel de administración.
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Nombre de usuario</p>
              <p className="text-sm">{settings.adminCredentials.username}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Contraseña</p>
              <p className="text-sm">••••••••</p>
            </div>
          </div>
        </div>
      </div>
      
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Información Importante</AlertTitle>
        <AlertDescription>
          Por razones de seguridad, las credenciales de administrador están codificadas en el servidor y no pueden ser modificadas desde esta interfaz.
        </AlertDescription>
      </Alert>
    </div>
  );
}