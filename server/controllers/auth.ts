import { Request, Response } from "express";
import { storage } from "../storage";

interface SupabaseUser {
  id: string;
  email: string;
  app_metadata: any;
  user_metadata: any;
}

// Middleware to get the current authenticated user
const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would extract the user ID from the Supabase JWT
    // For this implementation, we'll use a simpler approach with auth headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Extract the user email from the auth header
    // Format: "Bearer user_email"
    const userEmail = authHeader.split(" ")[1];
    if (!userEmail) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    // Find the user in our database
    let user = await storage.getUserByEmail(userEmail);
    
    // If the user doesn't exist yet (first login after Supabase auth), create them
    if (!user) {
      user = await storage.createUser({
        email: userEmail,
        authProvider: "email",
        isPremium: false
      });
    }

    // Return the user data
    return res.json({
      id: user.id,
      email: user.email,
      isPremium: user.isPremium,
      authProvider: user.authProvider
    });
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upgrade a user to premium
const upgradeToPremiun = async (req: Request, res: Response) => {
  try {
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

    // Update the user to premium
    const updatedUser = await storage.updateUser(user.id, { isPremium: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user data
    return res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      isPremium: updatedUser.isPremium,
      authProvider: updatedUser.authProvider
    });
  } catch (error: any) {
    console.error("Error upgrading user to premium:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  getCurrentUser,
  upgradeToPremiun
};
