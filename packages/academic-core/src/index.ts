import type {
  AcademicPeriod, Course, CourseStatus, CurriculumPlan, PeriodResults
} from '@rutau/contracts';

export function summarizeProgress(plan: CurriculumPlan, periods: AcademicPeriod[]) {
  const approved = new Set<string>();
  const inProgress = new Set<string>();
  const failed = new Set<string>();
  for (const period of periods) {
    for (const enrollment of period.courses) {
      if (period.status === 'CLOSED' && enrollment.result === 'PASSED') approved.add(enrollment.courseId);
      if (period.status === 'CLOSED' && enrollment.result === 'FAILED') failed.add(enrollment.courseId);
      if (period.status === 'OPEN' && enrollment.result === 'PENDING') inProgress.add(enrollment.courseId);
    }
  }
  const creditsApproved = plan.courses.reduce((sum, c) => sum + (approved.has(c.id) ? c.credits : 0), 0);
  const totalCredits = plan.courses.reduce((sum, c) => sum + c.credits, 0);
  return {
    approved,
    inProgress,
    failed,
    creditsApproved,
    totalCredits,
    approvedCourses: plan.courses.filter(c => approved.has(c.id)).length,
    totalCourses: plan.courses.length,
    percentage: Math.round((plan.courses.filter(c => approved.has(c.id)).length / plan.courses.length) * 100)
  };
}

export function courseEligibility(
  course: Course,
  approved: ReadonlySet<string>,
  inProgress: ReadonlySet<string>,
  planned: ReadonlySet<string> = new Set<string>()
): { status: CourseStatus; missingPrerequisites: string[]; missingCorequisites: string[] } {
  const basic = { missingPrerequisites: [] as string[], missingCorequisites: [] as string[] };
  if (approved.has(course.id)) return { status: 'APPROVED', ...basic };
  if (inProgress.has(course.id)) return { status: 'IN_PROGRESS', ...basic };
  const missingAll = course.prerequisites.allOf.filter(id => !approved.has(id));
  const hasAny = course.prerequisites.anyOf.length === 0 || course.prerequisites.anyOf.some(id => approved.has(id));
  const missingAny = hasAny ? [] : [...course.prerequisites.anyOf];
  const missingPrerequisites = [...missingAll, ...missingAny];
  if (missingPrerequisites.length) return { status: 'BLOCKED', missingPrerequisites, missingCorequisites: [] };
  const missingCorequisites = course.corequisites.filter(id => !approved.has(id) && !inProgress.has(id) && !planned.has(id));
  if (missingCorequisites.length) return { status: 'REQUIRES_COREQUISITE', missingPrerequisites: [], missingCorequisites };
  return { status: 'AVAILABLE', ...basic };
}

export function closePeriod(period: AcademicPeriod, results: PeriodResults): AcademicPeriod {
  if (period.status !== 'OPEN') throw new Error('El período ya está cerrado');
  const registered = new Set(period.courses.map(c => c.courseId));
  for (const key of Object.keys(results)) {
    if (!registered.has(key)) throw new Error(`Materia no matriculada: ${key}`);
  }
  const courses = period.courses.map(c => {
    const result = results[c.courseId];
    if (result !== 'PASSED' && result !== 'FAILED') {
      throw new Error(`Resultado pendiente: ${c.courseId}`);
    }
    return { courseId: c.courseId, result };
  });
  return { ...period, status: 'CLOSED', courses };
}

export function possibleUnlocks(plan: CurriculumPlan, periods: AcademicPeriod[]) {
  const progress = summarizeProgress(plan, periods);
  // Simulación: todas las materias EN CURSO se aprueban; no es una confirmación oficial.
  const projected = new Set([...progress.approved, ...progress.inProgress]);
  return plan.courses.filter(course =>
    courseEligibility(course, progress.approved, progress.inProgress).status === 'BLOCKED' &&
    courseEligibility(course, projected, new Set()).status !== 'BLOCKED'
  ).map(c => c.id);
}
