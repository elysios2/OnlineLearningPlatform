import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ user, size = "md", className = "" }: UserAvatarProps) {
  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  // Get user initials for the fallback
  const getUserInitials = (): string => {
    if (!user || !user.email) return "?";
    
    // Try to extract initials from email
    const emailName = user.email.split("@")[0];
    if (emailName) {
      if (emailName.length <= 2) return emailName.toUpperCase();
      
      // Try to extract two letters, assuming potential first.last format
      const parts = emailName.split(/[._-]/);
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      
      return emailName.substring(0, 2).toUpperCase();
    }
    
    return "?";
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={user?.user_metadata?.avatar_url || undefined} 
        alt={user?.email || "User avatar"} 
      />
      <AvatarFallback className="bg-primary text-white">
        {getUserInitials()}
      </AvatarFallback>
    </Avatar>
  );
}

interface TestimonialAvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallback?: string;
}

export function TestimonialAvatar({ 
  src, 
  alt, 
  size = "md", 
  className = "",
  fallback = "TK" 
}: TestimonialAvatarProps) {
  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="bg-primary text-white">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
