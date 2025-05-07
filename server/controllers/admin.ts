import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertCourseSchema, updateCourseSchema } from './validation';
import { supabase } from '../supabase';

// Autenticación simple para admin
const ADMIN_USERNAME = 'stencabredo';
const ADMIN_PASSWORD = 'tkyte#lohacereal2025';

// Middleware para verificar autenticación de admin
export const verifyAdminAuth = (req: Request, res: Response, next: Function) => {
  // Comprobar si hay credenciales en el header de autorización
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Autenticación requerida' });
  }
  
  // Decodificar credenciales (formato Basic Auth)
  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      next();
    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al verificar credenciales de admin:', error);
    return res.status(401).json({ error: 'Error de autenticación' });
  }
};

// Obtener todos los cursos (solo admin)
export const getAllCoursesAdmin = async (req: Request, res: Response) => {
  try {
    const courses = await storage.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Error al obtener cursos para admin:', error);
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
};

// Crear un nuevo curso
export const createCourse = async (req: Request, res: Response) => {
  try {
    // Validar datos del curso
    const validatedData = insertCourseSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        error: 'Datos de curso inválidos', 
        details: validatedData.error.errors 
      });
    }
    
    // Intentar subir imagen a Supabase Storage si es una URL base64
    let imageUrl = validatedData.data.imageUrl;
    if (imageUrl.startsWith('data:image')) {
      try {
        const imageUpload = await uploadBase64Image(imageUrl, 'course-images');
        if (imageUpload.publicUrl) {
          imageUrl = imageUpload.publicUrl;
        }
      } catch (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        // Continuar con la URL original si falla la subida
      }
    }
    
    // Crear el curso con la URL de imagen actualizada
    const course = await storage.createCourse({
      ...validatedData.data,
      imageUrl
    });
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ error: 'Error al crear curso' });
  }
};

// Actualizar un curso existente
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'ID de curso inválido' });
    }
    
    // Verificar que el curso existe
    const existingCourse = await storage.getCourseById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    
    // Validar datos de actualización
    const validatedData = updateCourseSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ 
        error: 'Datos de curso inválidos', 
        details: validatedData.error.errors 
      });
    }
    
    // Intentar subir imagen a Supabase Storage si es una URL base64 y es diferente a la actual
    let imageUrl = validatedData.data.imageUrl;
    if (imageUrl && imageUrl.startsWith('data:image') && imageUrl !== existingCourse.imageUrl) {
      try {
        const imageUpload = await uploadBase64Image(imageUrl, 'course-images');
        if (imageUpload.publicUrl) {
          imageUrl = imageUpload.publicUrl;
        }
      } catch (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        // Continuar con la URL original si falla la subida
      }
    }
    
    // Actualizar el curso con la posible nueva URL de imagen
    const updatedCourse = await storage.updateCourse(courseId, {
      ...validatedData.data,
      imageUrl
    });
    
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    
    res.json(updatedCourse);
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
};

// Eliminar un curso
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'ID de curso inválido' });
    }
    
    // Verificar que el curso existe
    const existingCourse = await storage.getCourseById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    
    // Eliminar el curso
    const deleted = await storage.deleteCourse(courseId);
    
    if (!deleted) {
      return res.status(500).json({ error: 'No se pudo eliminar el curso' });
    }
    
    // Intentar eliminar la imagen de Storage si es una URL de Supabase
    if (existingCourse.imageUrl && existingCourse.imageUrl.includes('supabase')) {
      try {
        // Extraer el path de la URL
        const url = new URL(existingCourse.imageUrl);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/(.+)/);
        if (pathMatch && pathMatch[1]) {
          const path = pathMatch[1];
          await supabase.storage.from('course-images').remove([path]);
        }
      } catch (deleteError) {
        console.error('Error al eliminar imagen:', deleteError);
        // Continuar aunque falle la eliminación de la imagen
      }
    }
    
    res.json({ success: true, message: 'Curso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
};

// Función auxiliar para subir imágenes base64 a Supabase Storage
async function uploadBase64Image(base64String: string, bucket: string) {
  try {
    // Extraer datos y tipo de mime del string base64
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error('Formato base64 inválido');
    }
    
    const mime = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generar nombre de archivo único basado en timestamp
    const fileName = `${Date.now()}.${mime.split('/')[1] || 'png'}`;
    
    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`public/${fileName}`, buffer, {
        contentType: mime,
        upsert: false
      });
      
    if (error) {
      throw error;
    }
    
    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`public/${fileName}`);
      
    return {
      filePath: data?.path,
      publicUrl: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error al subir imagen base64:', error);
    throw error;
  }
}

// Exportar controladores
export default {
  verifyAdminAuth,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse
};