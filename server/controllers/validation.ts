import { z } from 'zod';
import { insertCourseSchema as baseInsertCourseSchema } from '@shared/schema';

// Esquema para validar la creación de cursos
export const insertCourseSchema = baseInsertCourseSchema.extend({
  // Validaciones adicionales para el campo de imagen
  imageUrl: z.string().url('La URL de imagen debe ser válida').or(
    z.string().startsWith('data:image/', 'Formato de imagen base64 inválido')
  ),
  
  // Validaciones para el precio
  price: z.number().int('El precio debe ser un número entero').min(0, 'El precio no puede ser negativo'),
  
  // Validaciones para la duración
  duration: z.number().int('La duración debe ser un número entero').min(1, 'La duración debe ser mayor a cero'),
  
  // La clave de encriptación es opcional
  encryptionKey: z.string().optional(),
});

// Esquema para validar la actualización de cursos
export const updateCourseSchema = insertCourseSchema.partial().extend({
  id: z.number().int('El ID debe ser un número entero').positive('El ID debe ser positivo'),
});

// Esquema para validar las credenciales de administrador
export const adminCredentialsSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// Exportar todos los esquemas
export default {
  insertCourseSchema,
  updateCourseSchema,
  adminCredentialsSchema,
};