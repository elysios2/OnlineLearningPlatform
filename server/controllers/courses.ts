import { Request, Response } from "express";
import { storage } from "../storage";
import { encryptFileUrl, decryptFileUrl } from "@/lib/crypto";

// Get all courses
const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await storage.getAllCourses();
    return res.json(courses);
  } catch (error: any) {
    console.error("Error getting courses:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a specific course by ID
const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await storage.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json(course);
  } catch (error: any) {
    console.error("Error getting course:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get course content
const getCourseContent = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the course
    const course = await storage.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is enrolled in this course
    const userCourse = await storage.getUserCourse(user.id, courseId);
    if (!userCourse) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // If it's a premium course, make sure the user has purchased it
    if (course.isPremium && !userCourse.purchased && !user.isPremium) {
      return res.status(403).json({ message: "Course not purchased" });
    }

    // If premium content, return encrypted content and encryption key
    if (course.isPremium) {
      return res.json({
        content: course.fileUrl,
        encrypted: true,
        encryptionKey: course.encryptionKey
      });
    }

    // For free content, just return the content URL
    return res.json({
      content: course.fileUrl,
      encrypted: false
    });
  } catch (error: any) {
    console.error("Error getting course content:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Enroll in a course (free courses)
const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the course
    const course = await storage.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the course is free or if the user is premium
    if (course.isPremium && !user.isPremium) {
      return res.status(403).json({ message: "This is a premium course" });
    }

    // Check if the user is already enrolled in this course
    const existingEnrollment = await storage.getUserCourse(user.id, courseId);
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Enroll the user in the course
    const enrollment = await storage.enrollUserInCourse({
      userId: user.id,
      courseId,
      progress: 0,
      purchased: false
    });

    return res.status(201).json(enrollment);
  } catch (error: any) {
    console.error("Error enrolling in course:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Purchase a premium course
const purchaseCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the course
    const course = await storage.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the course is premium
    if (!course.isPremium) {
      return res.status(400).json({ message: "This is a free course. Use /enroll endpoint" });
    }

    // Check if the user is already enrolled in this course
    const existingEnrollment = await storage.getUserCourse(user.id, courseId);
    if (existingEnrollment && existingEnrollment.purchased) {
      return res.status(400).json({ message: "Already purchased this course" });
    }

    // If user is already enrolled but hasn't purchased, update the enrollment
    if (existingEnrollment) {
      const updatedEnrollment = await storage.updateUserCourseProgress(user.id, courseId, existingEnrollment.progress);
      if (!updatedEnrollment) {
        return res.status(500).json({ message: "Failed to update enrollment" });
      }
      
      return res.json(updatedEnrollment);
    }

    // Enroll the user in the course as a purchaser
    const enrollment = await storage.enrollUserInCourse({
      userId: user.id,
      courseId,
      progress: 0,
      purchased: true,
      purchaseDate: new Date()
    });

    return res.status(201).json(enrollment);
  } catch (error: any) {
    console.error("Error purchasing course:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's enrolled courses
const getUserCourses = async (req: Request, res: Response) => {
  try {
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the user's courses
    const userCourses = await storage.getUserCourses(user.id);
    
    // Format the response
    const formattedCourses = userCourses.map(uc => ({
      courseId: uc.courseId,
      title: uc.courseDetails.title,
      description: uc.courseDetails.description,
      imageUrl: uc.courseDetails.imageUrl,
      isPremium: uc.courseDetails.isPremium,
      progress: uc.progress,
      purchased: uc.purchased,
      lastAccessed: uc.lastAccessed
    }));

    return res.json(formattedCourses);
  } catch (error: any) {
    console.error("Error getting user courses:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update course progress
const updateCourseProgress = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const { progress } = req.body;
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Invalid progress value" });
    }

    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is enrolled in the course
    const userCourse = await storage.getUserCourse(user.id, courseId);
    if (!userCourse) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Update the progress
    const updatedUserCourse = await storage.updateUserCourseProgress(user.id, courseId, progress);
    if (!updatedUserCourse) {
      return res.status(500).json({ message: "Failed to update progress" });
    }

    return res.json(updatedUserCourse);
  } catch (error: any) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  getAllCourses,
  getCourseById,
  getCourseContent,
  enrollInCourse,
  purchaseCourse,
  getUserCourses,
  updateCourseProgress
};
