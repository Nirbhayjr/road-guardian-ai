export type Severity = 'minor' | 'moderate' | 'dangerous';
export type ReportStatus = 'reported' | 'under_review' | 'in_progress' | 'completed';
export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AIDetectionResult {
  confidence: number;
  severity: Severity;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  verified: boolean;
}

export interface PotholeReport {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  aiResult: AIDetectionResult;
  status: ReportStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalReports: number;
  highPriority: number;
  resolved: number;
  pending: number;
  aiAccuracy: number;
}
