import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { demoPlan } from '@rutau/plan-demo-sistemas';
import { closePeriod, courseEligibility, possibleUnlocks, summarizeProgress } from '@rutau/academic-core';
import type { AcademicPeriod, PeriodResults } from '@rutau/contracts';

const initialPeriods: AcademicPeriod[] = [
  { id: '2026-P1', status: 'CLOSED', courses: [
    { courseId: 'MAT101', result: 'PASSED' }, { courseId: 'PRO101', result: 'PASSED' }
  ] },
  { id: '2026-P2', status: 'OPEN', courses: [
    { courseId: 'MAT102', result: 'PENDING' }, { courseId: 'PRO102', result: 'PENDING' }
  ] }
];

export default function App() {
  const [periods, setPeriods] = useState<AcademicPeriod[]>(initialPeriods);
  const [results, setResults] = useState<PeriodResults>({});
  const progress = useMemo(() => summarizeProgress(demoPlan, periods), [periods]);
  const unlocked = useMemo(() => possibleUnlocks(demoPlan, periods), [periods]);
  const current = periods.find(p => p.status === 'OPEN');
  const unfinished = current?.courses.some(c => results[c.courseId] !== 'PASSED' && results[c.courseId] !== 'FAILED') ?? false;

  function finishPeriod() {
    if (!current) return;
    try {
      const closed = closePeriod(current, results);
      setPeriods(previous => previous.map(p => p.id === closed.id ? closed : p));
      setResults({});
      Alert.alert('Período cerrado', 'Los resultados se recalcularon en la malla.');
    } catch (error) {
      Alert.alert('Faltan resultados', error instanceof Error ? error.message : 'Revisa las materias');
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>RutaU</Text>
        <Text style={styles.title}>Mi progreso académico</Text>
        <Text style={styles.muted}>{demoPlan.careerName}</Text>
        <Text style={styles.warning}>Plan ficticio para pruebas. No representa una malla oficial.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Progreso confirmado</Text>
          <Text style={styles.percent}>{progress.percentage}%</Text>
          <Text style={styles.muted}>{progress.approvedCourses} de {progress.totalCourses} asignaturas · {progress.creditsApproved} / {progress.totalCredits} créditos</Text>
          <View style={styles.track}><View style={[styles.progress, { width: `${progress.percentage}%` }]} /></View>
        </View>

        <Text style={styles.section}>Malla y estados</Text>
        {demoPlan.courses.map(course => {
          const result = courseEligibility(course, progress.approved, progress.inProgress);
          const status = result.status === 'APPROVED' ? 'Aprobada'
            : result.status === 'IN_PROGRESS' ? 'En curso'
            : result.status === 'BLOCKED' ? 'Bloqueada'
            : result.status === 'REQUIRES_COREQUISITE' ? 'Requiere correquisito' : 'Disponible';
          return (
            <View style={styles.course} key={course.id}>
              <View style={styles.courseTitle}>
                <Text style={styles.courseName}>{course.name}</Text>
                <Text style={styles.courseCode}>{course.code}</Text>
              </View>
              <Text style={styles.muted}>{course.credits} créditos · Período {course.recommendedPeriod}</Text>
              <Text style={[styles.state, result.status === 'APPROVED' ? styles.approved : result.status === 'IN_PROGRESS' ? styles.running : styles.pending]}>{status}</Text>
              {unlocked.includes(course.id) && <Text style={styles.note}>Si apruebas las materias actuales, podría desbloquearse.</Text>}
            </View>
          );
        })}

        <Text style={styles.section}>Cierre de período</Text>
        {current ? (
          <View style={styles.card}>
            <Text style={styles.muted}>{current.id} · Selecciona los resultados</Text>
            {current.courses.map(enrollment => {
              const course = demoPlan.courses.find(c => c.id === enrollment.courseId);
              return (
                <View style={styles.resultRow} key={enrollment.courseId}>
                  <Text style={styles.courseName}>{course?.name ?? enrollment.courseId}</Text>
                  <View style={styles.buttons}>
                    {(['PASSED', 'FAILED'] as const).map(value => (
                      <TouchableOpacity
                        accessibilityRole="button"
                        key={value}
                        style={[styles.choice, results[enrollment.courseId] === value && styles.choiceSelected]}
                        onPress={() => setResults(prev => ({ ...prev, [enrollment.courseId]: value }))}
                      >
                        <Text style={results[enrollment.courseId] === value ? styles.choiceSelectedText : styles.choiceText}>
                          {value === 'PASSED' ? 'Aprobada' : 'Reprobada'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
            <TouchableOpacity accessibilityRole="button" disabled={unfinished} style={[styles.action, unfinished && styles.disabled]} onPress={finishPeriod}>
              <Text style={styles.actionText}>Finalizar período y recalcular</Text>
            </TouchableOpacity>
          </View>
        ) : <Text style={styles.muted}>El período de demostración está cerrado. El nuevo avance se refleja arriba.</Text>}
        <Text style={styles.footer}>Etapa 1: demo local. Persistencia, API oficial y navegación se implementarán en las siguientes tareas.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f8fc' },
  content: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 50 },
  brand: { color: '#2563eb', fontSize: 17, fontWeight: '800', marginBottom: 8 },
  title: { color: '#17223d', fontSize: 27, fontWeight: '800' },
  muted: { color: '#64748b', fontSize: 13, marginTop: 4 },
  warning: { color: '#92400e', backgroundColor: '#fef3c7', borderRadius: 10, padding: 10, marginTop: 14, fontSize: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginTop: 16 },
  label: { fontSize: 13, color: '#475569', fontWeight: '600' },
  percent: { fontSize: 32, fontWeight: '800', color: '#0f766e', marginTop: 5 },
  track: { marginTop: 13, height: 10, borderRadius: 6, backgroundColor: '#e2e8f0', overflow: 'hidden' },
  progress: { height: '100%', backgroundColor: '#10b981', borderRadius: 6 },
  section: { color: '#1e293b', fontSize: 19, fontWeight: '800', marginTop: 27, marginBottom: 5 },
  course: { backgroundColor: 'white', padding: 14, borderRadius: 12, marginTop: 9 },
  courseTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courseName: { color: '#1e293b', fontSize: 15, fontWeight: '700', flexShrink: 1 },
  courseCode: { color: '#64748b', fontSize: 11 },
  state: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  approved: { color: '#047857' },
  running: { color: '#2563eb' },
  pending: { color: '#92400e' },
  note: { color: '#0f766e', marginTop: 5, fontSize: 12 },
  resultRow: { marginVertical: 13, gap: 8 },
  buttons: { flexDirection: 'row', gap: 10 },
  choice: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  choiceSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  choiceText: { color: '#334155', fontWeight: '600' },
  choiceSelectedText: { color: 'white', fontWeight: '700' },
  action: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  disabled: { opacity: 0.45 },
  actionText: { color: 'white', fontSize: 14, fontWeight: '800' },
  footer: { fontSize: 12, color: '#64748b', marginTop: 26, lineHeight: 18 }
});
