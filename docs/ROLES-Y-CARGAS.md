# Roles, reparto y responsabilidades de RutaU

La cantidad de estudiantes no está fijada. Asignar nombres reales cuando se conforme el equipo.

| Rol | Dueño por definir | Entrega de la fase 1 | Después |
|---|---|---|---|
| Revisor 1 (arquitectura) | ____ | Reglas Git, CI y contratos | Revisión técnica de todos los PR |
| Revisor 2 (datos académicos) | ____ | JSON Schema, fuentes y consistencia | Revisión académica de todos los PR |
| Móvil/UI | ____ | Expo, pantalla inicial, estilo | Malla gráfica, navegación, UX |
| Motor académico | ____ | Estados y cierre de período, pruebas | Requisitos especiales, proyección |
| Integración/API | ____ | Registro de módulos y esquema de importación | API externa, caché, persistencia |
| Módulos de carreras | ____ | Plan demo y checklist | Conversión de PDFs oficiales a JSON |

## Reparto equilibrado
- Los revisores también pueden programar, pero se debe resolver cómo revisar sus PR sin autoaprobación.
- Los encargados de carreras se asignan **después** de cerrar el contrato, con una carga proporcional a la complejidad del plan, no solo a la cantidad de carreras.
- Un PDF de 80 materias con reglas especiales pesa más que dos planes pequeños.
- Nadie cambia `packages/contracts` o `packages/academic-core` sin avisar al resto y abrir un PR documentado.

## Propuesta de primeras 6 tareas (Issues)
| Número | Responsable | Tarea | Criterio de terminado |
|---|---|---|---|
| #1 | Revisores | Crear organización, equipo y protección main | 2 revisiones y check validar requeridos |
| #2 | Arquitectura | Congelar `CurriculumSchema v2.0` del MVP | Ejemplo válido y reglas documentadas |
| #3 | Motor | Mejorar cierre de período e historial de intentos | Pruebas de aprobación/reprobación |
| #4 | Móvil | Configurar Expo en 1 Android físico | App inicia y muestra pantalla inicial |
| #5 | Integración | Identificar contrato real de API externa | Adaptador y fuente documentados |
| #6 | Carrera piloto | Levantar plan oficial correcto de Sistemas | JSON con fuente, versión y PR |
