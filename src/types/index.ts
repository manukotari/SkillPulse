export type TaskCategory = 
  | 'Frontend' 
  | 'Backend' 
  | 'System Design' 
  | 'DevOps' 
  | 'Algorithms' 
  | 'Soft Skills' 
  | 'Architecture';

export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: Priority;
  status: TaskStatus;
  date: string; // YYYY-MM-DD
  estimatedMinutes: number;
  actualMinutes: number;
  evidenceIds: string[];
  createdAt: string;
}

export interface LearningEntry {
  id: string;
  date: string; // YYYY-MM-DD
  topic: string;
  category: TaskCategory;
  summary: string;
  ahaMoment: string;
  challengeFaced: string;
  howSolved: string;
  masteryScore: number; // 1 to 10
  hoursSpent: number;
  tags: string[];
  evidenceIds: string[];
}

export interface UpskillActionItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface UpskillGap {
  id: string;
  skillName: string;
  category: TaskCategory;
  currentProficiency: number; // 1 - 10
  targetProficiency: number;  // 1 - 10
  reasonForGap: string;
  changesRequired: string[];  // concrete changes needed to upskill
  actionItems: UpskillActionItem[];
  priority: Priority;
  status: 'identified' | 'in-progress' | 'mastered';
  targetDate: string;
}

export interface ScreenEvidence {
  id: string;
  timestamp: string;
  title: string;
  notes: string;
  imageData: string; // Data URL or indexed blob reference
  taskId?: string;
  category?: TaskCategory;
}

export interface DashboardMetrics {
  completionRate: number;
  tasksCompletedToday: number;
  totalTasksToday: number;
  avgMasteryScore: number;
  weeklyHours: number;
  activeStreak: number;
  upskillProgress: number;
}
