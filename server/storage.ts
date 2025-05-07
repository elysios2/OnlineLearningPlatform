import { 
  users, type User, type InsertUser, 
  courses, type Course, type InsertCourse,
  userCourses, type UserCourse, type InsertUserCourse,
  readingTests, type ReadingTest, type InsertReadingTest
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  
  // User courses methods
  getUserCourses(userId: number): Promise<(UserCourse & { courseDetails: Course })[]>;
  getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined>;
  enrollUserInCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  updateUserCourseProgress(userId: number, courseId: number, progress: number): Promise<UserCourse | undefined>;
  
  // Reading test methods
  createReadingTest(test: InsertReadingTest): Promise<ReadingTest>;
  getReadingTest(id: number): Promise<ReadingTest | undefined>;
  getUserReadingTests(userId: number): Promise<ReadingTest[]>;
  updateReadingTest(id: number, testData: Partial<ReadingTest>): Promise<ReadingTest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private userCourses: Map<string, UserCourse>;
  private readingTests: Map<number, ReadingTest>;
  
  currentUserId: number;
  currentCourseId: number;
  currentUserCourseId: number;
  currentReadingTestId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.userCourses = new Map();
    this.readingTests = new Map();
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentUserCourseId = 1;
    this.currentReadingTestId = 1;
    
    // Initialize with some sample courses
    this.initializeSampleCourses();
  }

  // Initialize sample courses
  private initializeSampleCourses() {
    const sampleCourses: InsertCourse[] = [
      {
        title: "Lectura Veloz - Nivel Básico",
        description: "Aprende los fundamentos de la lectura rápida y técnicas básicas para aumentar tu velocidad de lectura.",
        price: 0, // Free course
        isPremium: false,
        imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        fileUrl: "https://example.com/courses/free-course-content",
        duration: 240, // 4 hours
      },
      {
        title: "Lectura Veloz - Nivel Avanzado",
        description: "Domina técnicas avanzadas para alcanzar velocidades de lectura superiores a 1000 palabras por minuto con total comprensión.",
        price: 4999, // $49.99
        isPremium: true,
        imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        fileUrl: "https://example.com/courses/premium-course-content",
        encryptionKey: "sample-encryption-key-123",
        duration: 720, // 12 hours
      },
      {
        title: "Comprensión y Retención Avanzada",
        description: "Técnicas avanzadas para mejorar la comprensión de textos complejos y retener información a largo plazo.",
        price: 3999, // $39.99
        isPremium: true,
        imageUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        fileUrl: "https://example.com/courses/retention-course-content",
        encryptionKey: "sample-encryption-key-456",
        duration: 480, // 8 hours
      }
    ];
    
    sampleCourses.forEach(course => {
      this.createCourse(course);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id, createdAt: new Date() };
    this.courses.set(id, course);
    return course;
  }
  
  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course | undefined> {
    const existingCourse = await this.getCourseById(id);
    if (!existingCourse) return undefined;
    
    const updatedCourse = { ...existingCourse, ...courseData };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }
  
  async deleteCourse(id: number): Promise<boolean> {
    const existingCourse = await this.getCourseById(id);
    if (!existingCourse) return false;
    
    // Eliminar el curso
    const deleted = this.courses.delete(id);
    
    // Opcional: También podríamos eliminar todas las inscripciones relacionadas a este curso
    // Esto depende de los requisitos específicos de la aplicación
    
    return deleted;
  }
  
  // User courses methods
  async getUserCourses(userId: number): Promise<(UserCourse & { courseDetails: Course })[]> {
    const userCoursesArray = Array.from(this.userCourses.values())
      .filter(uc => uc.userId === userId);
    
    // Join with course details
    return userCoursesArray.map(uc => {
      const courseDetails = this.courses.get(uc.courseId);
      return {
        ...uc,
        courseDetails: courseDetails!
      };
    });
  }
  
  async getUserCourse(userId: number, courseId: number): Promise<UserCourse | undefined> {
    const key = `${userId}-${courseId}`;
    return this.userCourses.get(key);
  }
  
  async enrollUserInCourse(insertUserCourse: InsertUserCourse): Promise<UserCourse> {
    const id = this.currentUserCourseId++;
    const key = `${insertUserCourse.userId}-${insertUserCourse.courseId}`;
    
    const userCourse: UserCourse = { 
      ...insertUserCourse, 
      id,
      progress: insertUserCourse.progress || 0,
      purchased: insertUserCourse.purchased || false,
      lastAccessed: new Date()
    };
    
    this.userCourses.set(key, userCourse);
    return userCourse;
  }
  
  async updateUserCourseProgress(userId: number, courseId: number, progress: number): Promise<UserCourse | undefined> {
    const key = `${userId}-${courseId}`;
    const userCourse = this.userCourses.get(key);
    
    if (!userCourse) return undefined;
    
    const updatedUserCourse: UserCourse = {
      ...userCourse,
      progress,
      lastAccessed: new Date()
    };
    
    this.userCourses.set(key, updatedUserCourse);
    return updatedUserCourse;
  }
  
  // Reading test methods
  async createReadingTest(insertTest: InsertReadingTest): Promise<ReadingTest> {
    const id = this.currentReadingTestId++;
    const readingTest: ReadingTest = { 
      ...insertTest, 
      id,
      dateCompleted: new Date()
    };
    
    this.readingTests.set(id, readingTest);
    return readingTest;
  }
  
  async getReadingTest(id: number): Promise<ReadingTest | undefined> {
    return this.readingTests.get(id);
  }
  
  async getUserReadingTests(userId: number): Promise<ReadingTest[]> {
    return Array.from(this.readingTests.values())
      .filter(test => test.userId === userId)
      .sort((a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime());
  }
  
  async updateReadingTest(id: number, testData: Partial<ReadingTest>): Promise<ReadingTest | undefined> {
    const existingTest = await this.getReadingTest(id);
    if (!existingTest) return undefined;
    
    const updatedTest = { ...existingTest, ...testData };
    this.readingTests.set(id, updatedTest);
    return updatedTest;
  }
}

export const storage = new MemStorage();
