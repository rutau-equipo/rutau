# Arquitectura inicial

- `apps/mobile`: interfaz React Native / Expo.
- `packages/contracts`: tipos TypeScript y el esquema JSON **2.0**.
- `packages/academic-core`: funciones puras; ningún módulo de plan reimplementa requisitos o cierres.
- `packages/plans/*`: un paquete por plan / versión, fuente y JSON separado.
- `scripts/validate-plans.mjs`: validación automática de esquema, referencias y ciclos de prerrequisitos obligatorios.
- `tests`: pruebas de motor con Node 22.

## Límites importantes del prototipo
- La app de ejemplo no tiene todavía base de datos local ni consulta API. Al reiniciar se restauran datos ficticios.
- Los planes reales requieren verificar flechas, equivalencias, créditos, optativas y normas especiales.
- La validación de ciclos alternativos `anyOf` es futura: la v2.0 valida ciclos obligatorios `allOf`.
- Una asignatura cursándose jamás se cuenta como aprobada; `possibleUnlocks` es una simulación condicionada a que **todas** las cursadas resulten aprobadas.
- La disponibilidad real para matrícula depende de ofertas, cupos, horarios y reglamento universitario, aún fuera de alcance.
- El historial de intentos se conserva por períodos; el cierre no sobrescribe intentos anteriores.
