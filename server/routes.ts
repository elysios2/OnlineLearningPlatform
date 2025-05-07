import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authController from "./controllers/auth";
import coursesController from "./controllers/courses";
import readingTestController from "./controllers/readingTest";
import adminController from "./controllers/admin";

// Controlador para webhooks de Supabase
interface SupabaseRecord {
  id: number;
  user_id?: number;
  course_id?: number;
  [key: string]: any;
}

interface WebhookPayload {
  type: string;
  table: string;
  record: SupabaseRecord;
  old_record?: SupabaseRecord;
  schema: string;
}

// Función para manejar los webhooks de Supabase
const handleSupabaseWebhooks = (req: Request, res: Response): void => {
  try {
    const payload = req.body as WebhookPayload;
    
    if (!payload || !payload.type || !payload.table) {
      res.status(400).json({ error: 'Payload inválido' });
      return;
    }
    
    console.log(`Webhook recibido - Tipo: ${payload.type}, Tabla: ${payload.table}`);
    
    // Determinar qué hacer según la tabla y el tipo de evento
    switch (payload.table) {
      case 'user_courses':
        // Manejar eventos de progreso de cursos
        if (payload.type === 'UPDATE' && payload.record && payload.record.user_id) {
          const userId = payload.record.user_id;
          const courseId = payload.record.course_id;
          console.log(`Webhook: Actualización de progreso para usuario ${userId}, curso ${courseId}`);
          
          // Aquí puedes ejecutar cualquier lógica adicional necesaria
          // Por ejemplo, notificar a otros servicios, actualizar estadísticas, etc.
        }
        break;
        
      case 'reading_tests':
        // Manejar eventos de pruebas de lectura
        if (payload.record && payload.record.user_id) {
          const userId = payload.record.user_id;
          console.log(`Webhook: Actualización de prueba de lectura para usuario ${userId}`);
          
          // Aquí puedes ejecutar cualquier lógica adicional necesaria
        }
        break;
      
      default:
        console.log(`Webhook: Tabla no manejada específicamente: ${payload.table}`);
    }
    
    // Responder con éxito
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook route
  app.post("/api/webhooks/supabase", handleSupabaseWebhooks);
  
  // Auth routes
  app.get("/api/auth/user", authController.getCurrentUser);
  app.post("/api/auth/upgrade", authController.upgradeToPremiun);

  // Courses routes
  app.get("/api/courses", coursesController.getAllCourses);
  app.get("/api/courses/:id", coursesController.getCourseById);
  app.get("/api/courses/:id/content", coursesController.getCourseContent);
  app.post("/api/courses/:id/enroll", coursesController.enrollInCourse);
  app.post("/api/courses/:id/purchase", coursesController.purchaseCourse);
  
  // User courses routes
  app.get("/api/user/courses", coursesController.getUserCourses);
  app.put("/api/user/courses/:id/progress", coursesController.updateCourseProgress);
  
  // Reading test routes
  app.get("/api/reading-test/content", readingTestController.getReadingContent);
  app.get("/api/reading-test/questions", readingTestController.getQuestions);
  app.post("/api/reading-test/init", readingTestController.initTest);
  app.post("/api/reading-test/:id/submit", readingTestController.submitAnswers);
  app.get("/api/reading-test/result/:id", readingTestController.getTestResult);
  app.get("/api/user/reading-tests", readingTestController.getUserTests);
  
  // Admin routes - protegidas por middleware de autenticación
  app.get("/api/admin/courses", adminController.verifyAdminAuth, adminController.getAllCoursesAdmin);
  app.post("/api/admin/courses", adminController.verifyAdminAuth, adminController.createCourse);
  app.put("/api/admin/courses/:id", adminController.verifyAdminAuth, adminController.updateCourse);
  app.delete("/api/admin/courses/:id", adminController.verifyAdminAuth, adminController.deleteCourse);

  const httpServer = createServer(app);
  return httpServer;
}
