# MVP - Sistema de Venta de Boletos (Chihuahueños S.A. de C.V.)

## 1. Objetivo del Sistema
Plataforma web para la compra de boletos de autobús entre múltiples estados. El sistema debe prevenir condiciones de carrera (doble reserva del mismo asiento en el mismo instante), soportar la carga de archivos de identificación y permitir la escalabilidad de rutas a futuro sin interfaces administrativas complejas.

## 2. Stack Tecnológico Estricto
- **Backend:** NestJS (con `@nestjs/swagger` para documentación y testeo de administración).
- **Frontend:** Next.js 14 (App Router).
- **Base de Datos:** PostgreSQL.
- **Almacenamiento de Archivos (Bonus):** MinIO (Emulador local de AWS S3).
- **Infraestructura:** TODO el stack (API, Frontend, BD, Almacenamiento) DEBE levantarse obligatoriamente con un único archivo `docker-compose`. Queda prohibido depender de servicios externos o bases de datos locales fuera de Docker.

## 3. Modelo de Datos Mínimo (Entidades Principales)
No crear tablas innecesarias (PROHIBIDO crear tablas de Roles o Permisos). El modelo estricto es:
- **Ruta:** Origen, Destino.
- **Viaje (Corrida):** ID de Ruta, Fecha/Hora de salida.
- **Boleto:** ID de Viaje, Número de Asiento, Estado (`disponible`, `reservado`, `pagado`), `bloqueado_hasta` (Timestamp), ID de Usuario.
- **Usuario:** Nombre, `identificacion_url` (Ruta en MinIO).

## 4. Requerimientos Funcionales (Pantallas/Endpoints)

### A. Flujo de Cliente (Next.js)
- Pantalla para listar viajes disponibles de una ruta.
- Pantalla de selección de asientos.
- Interfaz bloqueada para administración: **El frontend NO debe tener ninguna pantalla de creación, edición o borrado de rutas/viajes.**

### B. Administración y Escalabilidad (Solo NestJS API)
- El requerimiento de "añadir más rutas a futuro" se resolverá exclusivamente a través de la API documentada con Swagger.
- **Endpoints de Admin:** `POST /api/rutas` y `POST /api/viajes`.
- **Seguridad Básica:** Estos endpoints deben estar protegidos por un `Guard` simple que valide un *header* estático (ej. `x-api-key`). No implementar JWT ni login de administrador.
- **Generación de Asientos (Bulk Insert):** Al crear un viaje (`POST /api/viajes`), el backend debe recibir la capacidad del autobús y realizar una inserción masiva automática en la tabla `Boleto` generando "N" asientos en estado `disponible` vinculados a ese viaje.

### C. Flujo de Compra y Concurrencia (CRÍTICO)
- **Regla de Concurrencia:** Cuando un cliente inicie el proceso de compra de un boleto, otro usuario concurrente NO debe poder seleccionarlo.
- **Implementación Técnica Obligatoria:** 1. El endpoint de reserva en NestJS debe usar bloqueo a nivel de fila en PostgreSQL (`SELECT ... FOR UPDATE`).
  2. Al seleccionar, el boleto pasa a estado `reservado` y se actualiza el campo `bloqueado_hasta` a `NOW() + 10 minutos`.
  3. Las consultas de disponibilidad deben ignorar los boletos donde `estado = 'reservado'` y `bloqueado_hasta > NOW()`.

### D. Verificación de Identidad (Bonus)
- Durante el *checkout*, el usuario debe subir un archivo de identificación.
- **Implementación Técnica Obligatoria:** NestJS recibirá el archivo mediante `multipart/form-data`. Se debe implementar un `FileInterceptor` estricto (máximo 5MB, solo tipos seguros como PDF/JPG/PNG).
- NestJS enviará este buffer directamente al contenedor de MinIO y guardará la URL resultante en la base de datos.
- Prohibido guardar archivos en el sistema de archivos local del contenedor de NestJS.

## 5. Stretch Goals (Opcional - SOLO SI SOBRA TIEMPO)
Esta característica es secundaria y está sujeta a la finalización perfecta de los puntos anteriores.
- **Visualización de Trayectos con Mapas:** Agregar un mapa interactivo en la vista de detalles del viaje en Next.js para mostrar el origen y destino de la ruta seleccionada.
- **Restricción Técnica Estricta:** Queda prohibido usar la API de Google Maps o cualquier servicio que requiera credenciales de pago o API Keys externas. Se debe utilizar **Leaflet.js con OpenStreetMap** (componentes de cliente en Next.js). Las coordenadas de origen y destino deben ser estáticas y consumirse desde la entidad `Ruta` en PostgreSQL.

## 6. Instrucciones para la IA (Claude Code / Agentes)
- Lee siempre este archivo antes de proponer cambios arquitectónicos.
- **PROHIBIDO:** Añadir autenticación de usuarios complejos (roles), pasarelas de pago reales, interfaces de administración en el frontend, o alterar el alcance del MVP.
- **PROHIBIDO** iniciar la implementación del mapa (Sección 5) si existen bugs abiertos, fallas de tipado en TypeScript, o si la lógica de concurrencia/MinIO no está completada al 100%.
- Si una implementación requiere modificar el esquema de base de datos o el `docker-compose.yml`, detente y pide confirmación mostrando el `diff`.
