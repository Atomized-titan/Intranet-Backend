interface Organization {
  id: number;
  name: string;
  description: string;
  profilePicture: string;
  coverImage: string;
  website: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  industry: string;
  foundingDate: Date;
  socialMediaLinks: { platform: string; url: string }[];
  teamSize: number;
  mission: string;
  vision: string;
  membershipType: MembershipType;
  status: OrganizationStatus;
  partnerOrganizations: number[]; // Array of organization IDs (references)
  financialInformation: FinancialInformation;
  awardsAndRecognition: string[];
  logo: string;
  languagePreference: string;
  // Other custom organization properties
}

interface FinancialInformation {
  revenue: number;
  fundingStatus: FundingStatus;
  financialReports: string[];
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId: number;
  profilePicture: string;
  coverImage: string;
  designation: string;
  birthday: Date;
  hobbies: string[];
  socialMedia: { platform: string; url: string }[];
  // Other user properties
  experiencePoints: number;
  level: number;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean; // soft delete
}

interface EngagementAction {
  id: number;
  actionName: string;
  pointValue: number;
}

const engagementActions: EngagementAction[] = [
  { id: 1, actionName: "Comment", pointValue: 5 },
  { id: 2, actionName: "Like", pointValue: 2 },
  // Add more engagement actions with their respective point values
];

enum UserRole {
  Owner = "Owner",
  Admin = "Admin",
  User = "User",
}

interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  // Other post properties
}

interface Like {
  id: number;
  userId: number;
  postId: number;
  createdAt: Date;
  isDeleted: boolean;
}

interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

interface Notification {
  id: number;
  userId: number; // the recipient
  type: NotificationType; // the type of notification - like, comment.
  content: string;
  relatedId: number; // the id of the related action (likeId, postId, or commentId)
  createdAt: Date;
  // Other notification properties
}

interface Email {
  id: number;
  email: string;
  organizationId: number; // reference to the organization the user belongs to
}

interface Badge {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  // Other badge properties
}

enum NotificationType {
  Like = "like",
  Comment = "comment",
  // Add more notification types as needed
}

enum MembershipType {
  Free = "Free",
  Premium = "Premium",
  // Add more membership types as needed
}

enum OrganizationStatus {
  Active = "Active",
  Inactive = "Inactive",
  PendingApproval = "PendingApproval",
  // Add more organization statuses as needed
}

enum FundingStatus {
  Funded = "Funded",
  Bootstrapped = "Bootstrapped",
  // Add more funding statuses as needed
}
