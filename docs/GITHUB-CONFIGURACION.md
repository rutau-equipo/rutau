# Configuración del repositorio y las dos revisiones

## 1. Crear organización y repositorio
1. Crear organización en https://github.com/organizations/new (ejemplo: `rutau-equipo`).
2. En la organización, crear un repositorio **vacío** `rutau` (sin README ni .gitignore porque están en este proyecto).
3. Invitar miembros y otorgar acceso de escritura a quienes contribuyen.
4. Crear un equipo `revisores` con los **dos revisores designados**, con permisos Write.
5. Reemplazar `@TU-ORGANIZACION/revisores` en `.github/CODEOWNERS`.

## 2. Publicar el proyecto inicial
Desde PowerShell en la carpeta descomprimida:
```powershell
npm install
npm run check
git init -b main
git add .
git commit -m "chore: iniciar monorepo RutaU"
git remote add origin https://github.com/TU-ORGANIZACION/rutau.git
git push -u origin main
```
**Importante:** el primer push es la inicialización controlada. Proteger `main` inmediatamente después. `npm install` genera `package-lock.json`, que debe subirse.

## 3. Proteger main
En GitHub: repositorio > Settings > Rules > Rulesets > New branch ruleset.
- Nombre: `proteccion-main`.
- Estado: Active.
- Rama objetivo: `main`.
- Require a pull request before merging.
- Required approvals: **2**.
- Dismiss stale pull request approvals.
- Require status checks to pass: seleccionar el check **validar** (una vez que el workflow haya corrido).
- Require conversation resolution before merging.
- Block force pushes y restringir eliminaciones.
- No bypass para quienes trabajan diariamente.
- Required reviewers: equipo `revisores`, número de aprobaciones **2**, patrón `**/*` si la función aparece disponible. Esta regla es la que exige específicamente a las dos personas, no únicamente dos aprobaciones cualesquiera.
- Si esa opción no está disponible en tu plan/interfaz, **no afirmar que los dos designados son obligatorios técnicamente**: usar una verificación adicional en CI o cambiar a una configuración compatible.

## 4. Ciclo de trabajo de cada integrante
```powershell
git checkout main
git pull origin main
git checkout -b feature/plan-derecho
# realizar cambios
git add .
git commit -m "feat: agregar borrador de plan de derecho"
git push -u origin feature/plan-derecho
```
Ir a GitHub > Pull requests > New pull request, describir el trabajo, solicitar a los dos revisores, atender comentarios y fusionar solo con validación correcta.

## 5. Conflictos de revisión
- El autor no aprueba su propio PR.
- Si alguno de los revisores modifica código, se requiere un suplente autorizado o un procedimiento aprobado por el equipo que mantenga dos revisiones independientes.
- La aprobación de `CODEOWNERS` por sí sola **no** garantiza dos aprobaciones de dos personas concretas; el ruleset es adicional.
- Privacidad de repositorios y reglas depende del plan de GitHub. En GitHub Free, proteger ramas funciona en repositorios públicos; comprobar el plan si se requiere privado.
