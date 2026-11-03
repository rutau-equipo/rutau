# RutaU

Aplicación móvil universitaria para seguimiento de mallas curriculares y planificación por período. **Repositorio base de la fase 1.**

## Requisitos
- Node.js **22.13+** y npm, Git, VS Code.
- Para probar en Android: Expo Go compatible con SDK 57 o un build de desarrollo; computadora y teléfono en red compatible.

## Arranque (Windows PowerShell)
```powershell
cd rutau
npm install
npm run check
npm run start
```
`npm install` genera el archivo `package-lock.json`; inclúyelo en el primer commit. Si el SDK marca dependencias desalineadas, ejecuta desde `apps/mobile`: `npx expo install --fix` y vuelve a verificar.

## Estructura
```
apps/mobile/                      app Expo (pantalla inicial interactiva)
packages/contracts/              JSON Schema 2.0 y tipos
packages/academic-core/          reglas del período y elegibilidad
packages/plans/demo-sistemas/    plan FICTICIO para pruebas
scripts/validate-plans.mjs       validación automática de planes
tests/                            pruebas unitarias
docs/                             arquitectura, roles, GitHub
.github/                          workflow y política de revisión
```

## Comandos
- `npm run start`: iniciar Expo.
- `npm run validate:plans`: validar esquemas y dependencias.
- `npm test`: probar cálculos, cierre y resultados.
- `npm run typecheck`: comprobar tipos de la app.
- `npm run check`: ejecutar las tres verificaciones.

## Gobernanza GitHub
Lee primero [docs/GITHUB-CONFIGURACION.md](docs/GITHUB-CONFIGURACION.md) y después [docs/ROLES-Y-CARGAS.md](docs/ROLES-Y-CARGAS.md). Cambiar `@TU-ORGANIZACION/revisores` por el equipo verdadero antes de activar reglas de revisión.

## Importante
- Antes del primer push, sustituir el equipo ficticio de CODEOWNERS por el real.
Este repositorio se entrega **sin node_modules y sin package-lock** porque las dependencias deben descargarse al ejecutar `npm install` en un entorno con acceso a npm. Las pruebas unitarias puras sí pueden ejecutarse con Node instalado; no se ha compilado la app móvil ni publicado el repositorio remoto en esta entrega.
