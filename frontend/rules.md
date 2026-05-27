El proyecto está construido utilizando _Next.js 14 (App Router)_ y _React 18_ con _Tailwind CSS_ y _DaisyUI_ para los estilos.

---

## 📂 Estructura General del Proyecto

La estructura de carpetas principal sigue las convenciones del App Router de Next.js, apoyándose en carpetas privadas y agrupaciones lógicas:

•⁠ ⁠⁠ app/ ⁠: Contiene todo el enrutamiento de la aplicación (App Router).
•⁠ ⁠⁠ actions/ ⁠: Contiene las "Server Actions" para mutaciones de datos y manejo de formularios.
•⁠ ⁠⁠ helpers/ ⁠: Funciones utilitarias y compartidas (ej. manejo de headers de autenticación).
•⁠ ⁠⁠ entities.ts ⁠: Archivo en la raíz que define las interfaces/tipos (modelos de datos).
•⁠ ⁠⁠ constants.ts ⁠: Constantes globales (ej. ⁠ API_URL ⁠, nombres de cookies).
•⁠ ⁠⁠ proxy.ts ⁠: Middleware/Proxy para la redirección de rutas basadas en autenticación.

---

## 🧭 Enrutamiento y ⁠ app/ ⁠ (App Router)

El enrutamiento se define enteramente dentro de la carpeta ⁠ app/ ⁠.

### 1. Páginas y Layouts (⁠ page.tsx ⁠, ⁠ layout.tsx ⁠)

•⁠ ⁠*⁠ page.tsx ⁠: Representa la UI única de una ruta. Por defecto, son \*\*Server Components*.
•⁠ ⁠*⁠ layout.tsx ⁠*: Envuelve a las páginas u otros layouts hijos. Mantiene el estado en navegaciones.

- Nota: En ⁠ app/dashboard/layout.tsx ⁠, se usa ⁠ "use client" ⁠ para poder usar hooks como ⁠ usePathname() ⁠ y renderizar condicionalmente rutas paralelas.

### 2. Rutas Dinámicas y Query Params (⁠ [id] ⁠)

Las rutas dinámicas se crean usando corchetes, por ejemplo: `app/dashboard/employees/[id]/page.tsx`.
En Next.js 14, los `params` (y `searchParams`) son _objetos síncronos_ y pueden ser desestructurados directamente:

```tsx
// app/dashboard/employees/[id]/page.tsx
export default async function EmployeePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  // ... data fetching con el ID
}
```

### 3. Rutas Paralelas (⁠ @folder ⁠)

El proyecto utiliza _Parallel Routes_ para renderizar componentes complejos o modales en la misma vista.
•⁠ ⁠Se definen con un arroba, ej: ⁠ app/dashboard/@locations ⁠.
•⁠ ⁠Se inyectan como ⁠ props ⁠ en el ⁠ layout.tsx ⁠ del mismo nivel:
⁠ tsx
export default function DashboardLayout({ children, locations }: { children: React.ReactNode, locations: React.ReactNode }) {
// children es la ruta principal, locations es el contenido de @locations
}
 ⁠

### 4. Componentes Aislados (⁠ _components ⁠)

Para evitar que Next.js convierta ciertas carpetas en rutas públicas, se usa el prefijo ⁠ _ ⁠.
•⁠ ⁠Toda la UI específica de una sección o ruta (formularios, botones, modales) se guarda en carpetas llamadas ⁠ _components ⁠ dentro del segmento de ruta correspondiente (ej. ⁠ app/dashboard/employees/\_components ⁠).
•⁠ ⁠Esto mantiene la co-locación de archivos, agrupando las páginas con sus componentes dependientes.

### 5. Páginas de Carga y Error (⁠ loading.tsx ⁠, ⁠ error.tsx ⁠)

Aunque en algunas partes se maneja el error internamente en el componente (ej. ⁠ if (!employee) return <div>Error...</div> ⁠), la estructura oficial y _regla para futuros flujos_ es utilizar los archivos especiales de Next.js:
•⁠ ⁠*⁠ loading.tsx ⁠*: Se muestra un esqueleto o spinner mientras el contenido de ⁠ page.tsx ⁠ se resuelve en el servidor.
•⁠ ⁠*⁠ error.tsx ⁠*: Atrapa errores durante la renderización o data fetching. Debe tener la directiva ⁠ "use client" ⁠.

---

## 🛠️ Helpers

Los helpers contienen lógica reutilizable, típicamente para el entorno del servidor.
Un patrón clave en este proyecto es el manejo de Headers de autenticación utilizando la función ⁠ cache ⁠ de React para deduplicar la lectura de cookies durante el ciclo de vida de un request.

_Ejemplo (⁠ helpers/authHeaders.ts ⁠):_
⁠ typescript
import { cookies } from "next/headers";
import { cache } from "react";

export const AuthHeaders = cache(async () => {
const token = (await cookies()).get(TOKEN_NAME)?.value;
return { Authorization: `Bearer ${token}` };
});
 ⁠
Regla: Siempre usar ⁠ await AuthHeaders() ⁠ al hacer peticiones ⁠ fetch ⁠ en Server Components o Server Actions.

---

## ⚡ Acciones (Server Actions)

Las mutaciones de estado (POST, PATCH, DELETE) no se hacen desde el cliente. Se utilizan _Server Actions_ agrupadas en la carpeta ⁠ /actions/[entidad]/ ⁠.

_Reglas para Actions:_
1.⁠ ⁠Deben iniciar con la directiva ⁠ "use server"; ⁠.
2.⁠ ⁠Extraen los datos normalmente desde un ⁠ FormData ⁠ (si vienen de un formulario) o reciben parámetros directos.
3.⁠ ⁠Hacen la petición al API backend (usando ⁠ API_URL ⁠ y ⁠ AuthHeaders() ⁠).
4.⁠ ⁠Suelen terminar con un ⁠ redirect('/ruta') ⁠ de ⁠ next/navigation ⁠ o usar ⁠ revalidateTag() ⁠ / ⁠ revalidatePath() ⁠ para limpiar la caché y mostrar los nuevos datos.

_Ejemplo de flujo (⁠ actions/users/update.ts ⁠):_
⁠ typescript
"use server";
import { redirect } from "next/navigation";

export async function updateEmployee(employee: Employee, formData: FormData) {
// 1. Extraer datos del FormData
let data = { userEmail: formData.get("userEmail") };

// 2. Fetch al backend con AuthHeaders
const response = await fetch(`${API_URL}/auth/...`, {
method: "PATCH",
headers: { "Content-Type": "application/json", ...(await AuthHeaders()) },
body: JSON.stringify(data),
});

// 3. Redirección
redirect(`/dashboard/employees/${employee.employeeId}`);
}
 ⁠

---

## 📡 Fetching de Datos (Peticiones GET)

El fetching de datos se realiza directamente dentro de los _Server Components_ (⁠ page.tsx ⁠), aprovechando ⁠ async/await ⁠. No se usan hooks como ⁠ useEffect ⁠ para cargas de datos primarios.

_Reglas de Fetching:_
1.⁠ ⁠Usar la API nativa ⁠ fetch ⁠.
2.⁠ ⁠Concatenar la URL base desde ⁠ constants.ts ⁠ (⁠ API*URL ⁠).
3.⁠ ⁠Adjuntar las credenciales con ⁠ await AuthHeaders() ⁠.
4.⁠ ⁠Utilizar ⁠ next: { tags: [...] } ⁠ para implementar \_Cache Invalidation* on-demand. Esto permite que, después de una mutación, se pueda purgar esa caché específica usando ⁠ revalidateTag() ⁠.

_Ejemplo (⁠ page.tsx ⁠):_
⁠ typescript
const employee = await fetch(`${API_URL}/employees/${id}`, {
headers: await AuthHeaders(),
next: {
tags: ["dashboard:employees", `dashboard:employees:${id}`] // Etiquetas para revalidación
}
}).then(res => res.json());
 ⁠

---

## 🔒 Middlewares y Autenticación

La seguridad y redirecciones a nivel de aplicación se manejan con un sistema de proxy/middleware (⁠ proxy.ts ⁠), que evalúa la presencia del token en las cookies:
•⁠ ⁠Protege rutas como ⁠ /dashboard/\* ⁠ redirigiendo al ⁠ /login ⁠ si no hay sesión.
•⁠ ⁠Evita que usuarios autenticados vean la pantalla de login, redirigiéndolos al ⁠ /dashboard ⁠.

---

## 📝 Resumen de Reglas para Nuevos Desarrollos

1.⁠ ⁠*App Router Primero:* Toda la lógica de enrutamiento va en ⁠ app/ ⁠.
2.⁠ ⁠*Server-First:* Prefiere Server Components para fetching. Usa ⁠ "use client" ⁠ estrictamente solo cuando necesites interactividad (⁠ onClick ⁠, ⁠ useState ⁠, ⁠ hooks ⁠ de React/Next de cliente).
3.⁠ ⁠*Co-locación de Componentes:* Guarda los componentes específicos de una página dentro de una subcarpeta ⁠ _components ⁠ junto a ella.
4.⁠ ⁠*Server Actions para Mutaciones:* Todo POST/PUT/PATCH debe ir dentro de la carpeta ⁠ actions/ ⁠ y ser invocado desde un formulario de cliente o servidor.
5.⁠ ⁠*Autenticación Centralizada:* Utiliza ⁠ AuthHeaders() ⁠ para cualquier petición hacia la API. 6. _Resolución de Params:_ Recuerda que en Next 14 `params` y `searchParams` en `page.tsx` son objetos síncronos y se acceden directamente (sin `await`).
