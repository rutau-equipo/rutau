export type Result = 'PENDING' | 'PASSED' | 'FAILED';
export type CourseType = 'COURSE' | 'ELECTIVE' | 'PRACTICE';
export type CourseStatus = 'APPROVED' | 'IN_PROGRESS' | 'BLOCKED' | 'REQUIRES_COREQUISITE' | 'AVAILABLE';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  recommendedPeriod: number;
  type: CourseType;
  hours?: number;
  prerequisites: { allOf: string[]; anyOf: string[] };
  corequisites: string[];
}
export interface CurriculumPlan {
  schemaVersion: '2.0';
  planId: string;
  planVersion: string;
  institution: string;
  careerId: string;
  careerName: string;
  periodSystem: 'SEMESTER' | 'TRIMESTER' | 'QUARTER';
  source: { type: 'DEMO' | 'OFFICIAL_PDF'; url?: string };
  courses: Course[];
}
export interface PeriodEnrollment { courseId: string; result: Result; }
export interface AcademicPeriod {
  id: string;
  status: 'OPEN' | 'CLOSED';
  courses: PeriodEnrollment[];
}
export type PeriodResults = Record<string, 'PASSED' | 'FAILED'>;
