# Chihuahueños API Specification

This document provides the complete API specification for Chihuahueños backend. It is designed for easy consumption by AI systems and developer tooling.

## Table of Contents
1. [Authentication & Security](#authentication--security)
2. [Endpoints](#endpoints)
   - [App Endpoints](#app-endpoints)
   - [auth Endpoints](#auth-endpoints)
   - [users Endpoints](#users-endpoints)
   - [Rutas Endpoints](#rutas-endpoints)
   - [Viajes Endpoints](#viajes-endpoints)
   - [Boletos Endpoints](#boletos-endpoints)
3. [Schemas (Data Transfer Objects)](#schemas-data-transfer-objects)

## Authentication & Security

The API supports the following security schemes:

### bearer
- **Type**: Bearer Authentication (JWT token in `Authorization` header: `Bearer <token>`)

### x-api-key
- **Type**: API Key
- **Header Name**: `x-api-key`
- **Position**: `header`

## Endpoints

### App Endpoints

#### `GET /`

**Summary**: No summary provided

**Authentication Required**: No

**Responses**:

- **Status `200`**: No description

---

### auth Endpoints

#### `POST /auth/register`

**Summary**: Registrar un nuevo usuario

**Authentication Required**: No

**Request Body**:

- Content-Type: `application/json`
  - Schema: [RegisterDto](#registerdto)

  | Field | Type | Required | Description | Example |
  |---|---|---|---|---|
  | `nombre` | `string` | Yes | Nombre completo del usuario | "Juan Pérez" |
  | `email` | `string` | Yes | Dirección de correo electrónico única | "juan.perez@example.com" |
  | `password` | `string` | Yes | Contraseña del usuario (mínimo 6 caracteres) | "secret123" |


**Responses**:

- **Status `201`**: Usuario registrado exitosamente.

- **Status `400`**: Datos de registro inválidos o correo ya registrado.

---

#### `POST /auth/login`

**Summary**: Iniciar sesión de usuario

**Authentication Required**: No

**Request Body**:

- Content-Type: `application/json`
  - Schema: [LoginDto](#logindto)

  | Field | Type | Required | Description | Example |
  |---|---|---|---|---|
  | `email` | `string` | Yes | Correo electrónico registrado | "juan.perez@example.com" |
  | `password` | `string` | Yes | Contraseña del usuario | "secret123" |


**Responses**:

- **Status `200`**: Autenticación exitosa. Devuelve el access_token.

- **Status `401`**: Credenciales incorrectas.

---

#### `GET /auth/profile`

**Summary**: Obtener perfil del usuario autenticado

**Authentication Required**: Yes (bearer)

**Responses**:

- **Status `200`**: Perfil devuelto exitosamente.

- **Status `401`**: No autorizado / Token inválido.

---

### users Endpoints

#### `POST /users`

**Summary**: Crear un nuevo usuario

**Authentication Required**: No

**Request Body**:

- Content-Type: `application/json`
  - Schema: [CreateUserDto](#createuserdto)

  | Field | Type | Required | Description | Example |
  |---|---|---|---|---|
  | `nombre` | `string` | Yes | Nombre completo del usuario | "Juan Pérez" |
  | `email` | `string` | Yes | Dirección de correo electrónico única | "juan.perez@example.com" |
  | `password` | `string` | Yes | Contraseña del usuario (mínimo 6 caracteres) | "secret123" |
  | `identificacion_url` | `string` | No | URL de la imagen de identificación cargada en checkout | "https://minio/bucket/id.jpg" |


**Responses**:

- **Status `21`**: Usuario creado exitosamente.

- **Status `400`**: Datos inválidos o correo ya registrado.

---

#### `GET /users`

**Summary**: Obtener todos los usuarios

**Authentication Required**: No

**Responses**:

- **Status `200`**: Lista de usuarios devuelta exitosamente.

---

#### `GET /users/{id}`

**Summary**: Obtener un usuario por su ID

**Authentication Required**: No

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `id` | `path` | Yes | `string` | ID único del usuario (UUID) | - |

**Responses**:

- **Status `200`**: Usuario encontrado.

- **Status `404`**: Usuario no encontrado.

---

#### `PATCH /users/{id}`

**Summary**: Actualizar un usuario por su ID

**Authentication Required**: No

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `id` | `path` | Yes | `string` | ID único del usuario (UUID) | - |

**Request Body**:

- Content-Type: `application/json`
  - Schema: [UpdateUserDto](#updateuserdto)

  | Field | Type | Required | Description | Example |
  |---|---|---|---|---|


**Responses**:

- **Status `200`**: Usuario actualizado exitosamente.

- **Status `404`**: Usuario no encontrado.

---

#### `DELETE /users/{id}`

**Summary**: Eliminar un usuario por su ID

**Authentication Required**: No

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `id` | `path` | Yes | `string` | ID único del usuario (UUID) | - |

**Responses**:

- **Status `200`**: Usuario eliminado exitosamente.

- **Status `404`**: Usuario no encontrado.

---

### Rutas Endpoints

#### `GET /api/rutas`

**Summary**: Listar todas las rutas disponibles

**Authentication Required**: No

**Responses**:

- **Status `200`**: Lista de rutas con id, origen y destino.

---

#### `POST /api/rutas`

**Summary**: Crear una nueva ruta de autobús

**Authentication Required**: Yes (x-api-key)

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `x-api-key` | `header` | Yes | `string` | Clave de administración | - |

**Request Body**:

- Content-Type: `application/json`
  - Schema: [CreateRutaDto](#createrutadto)

  | Field | Type | Required | Description | Example |
  |---|---|---|---|---|
  | `origen` | `string` | Yes | Ciudad de origen de la ruta | "Oaxaca" |
  | `destino` | `string` | Yes | Ciudad de destino de la ruta | "Puebla" |


**Responses**:

- **Status `201`**: Ruta creada exitosamente.

- **Status `400`**: Datos de entrada inválidos.

- **Status `401`**: API Key inválida o no proporcionada.

---

### Viajes Endpoints

#### `GET /api/viajes`

**Summary**: Buscar viajes por origen, destino y fecha

**Authentication Required**: No

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `origen` | `query` | Yes | `string` | Ciudad de origen | "Oaxaca" |
| `destino` | `query` | Yes | `string` | Ciudad de destino | "Puebla" |
| `fecha` | `query` | Yes | `string` | Fecha del viaje (YYYY-MM-DD) | "2026-06-01" |

**Responses**:

- **Status `200`**: Lista de viajes con asientos disponibles.
  - Content-Type: `application/json`
  - Schema: Array of [ViajeConDisponibilidadDto](#viajecondisponibilidaddto)

- **Status `400`**: Query params inválidos.

---

#### `GET /api/viajes/disponibles`

**Summary**: Obtener todos los viajes futuros con su disponibilidad (todas las rutas y horarios)

**Authentication Required**: No

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `ruta_id` | `query` | No | `number` | ID de la ruta para filtrar los viajes | 1 |

**Responses**:

- **Status `200`**: Lista de todos los viajes a partir de la fecha y hora actual.
  - Content-Type: `application/json`
  - Schema: Array of [ViajeConDisponibilidadDto](#viajecondisponibilidaddto)

---

#### `POST /api/viajes`

**Summary**: Crear un nuevo viaje con sus boletos

**Authentication Required**: Yes (x-api-key)

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `x-api-key` | `header` | Yes | `string` | Clave de administración | - |

**Request Body**:

- Content-Type: `application/json`
  - Schema: [CreateViajeDto](#createviajedto)

  | Field | Type | Required | Description | Example |
  |---|---|---|---|---|
  | `ruta_id` | `number` | Yes | ID de la ruta asociada | 1 |
  | `fecha_hora_inicio` | `string` | Yes | Fecha y hora de inicio en formato ISO 8601 | "2026-06-01T10:00:00Z" |
  | `duracion` | `number` | Yes | Duración del viaje en minutos | 120 |
  | `precio_boleto` | `number` | No | Precio del boleto (si se omite, se calcula a 120 por hora) | 240.00 |
  | `capacidad` | `number` | Yes | Capacidad total del viaje (número de asientos) | 40 |


**Responses**:

- **Status `201`**: Viaje creado con sus boletos exitosamente.

- **Status `400`**: Datos de entrada inválidos.

- **Status `401`**: API Key inválida o no proporcionada.

- **Status `404`**: Ruta no encontrada.

---

#### `GET /api/viajes/{id}/boletos`

**Summary**: Obtener boletos de un viaje (con Lazy Expiration)

**Authentication Required**: No

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `id` | `path` | Yes | `number` | ID del viaje | - |

**Responses**:

- **Status `200`**: Array de boletos. Las reservas expiradas se marcan como disponibles.

- **Status `404`**: Viaje no encontrado.

---

#### `DELETE /api/viajes/{id}`

**Summary**: Eliminar un viaje y sus boletos (solo si no tiene boletos vendidos)

**Authentication Required**: Yes (x-api-key)

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `x-api-key` | `header` | Yes | `string` | Clave de administración | - |
| `id` | `path` | Yes | `number` | ID del viaje a eliminar | - |

**Responses**:

- **Status `204`**: Viaje eliminado exitosamente.

- **Status `400`**: No se puede eliminar el viaje porque ya se ha vendido al menos un boleto.

- **Status `401`**: API Key inválida o no proporcionada.

- **Status `404`**: Viaje no encontrado.

---

### Boletos Endpoints

#### `POST /api/boletos/{id}/reservar`

**Summary**: Reservar un asiento (bloqueo pesimista de 10 minutos)

**Authentication Required**: Yes (bearer)

**Parameters**:

| Name | In | Required | Type | Description | Example |
|---|---|---|---|---|---|
| `id` | `path` | Yes | `number` | ID del boleto a reservar | - |

**Responses**:

- **Status `200`**: Asiento bloqueado exitosamente.
  - Content-Type: `application/json`
  - Schema: object

- **Status `401`**: Token JWT no proporcionado o inválido.

- **Status `404`**: Boleto no encontrado.

- **Status `409`**: Asiento ya reservado o comprado.

---

#### `POST /api/boletos/confirmar`

**Summary**: Confirmar compra de boleto con identificación

**Authentication Required**: Yes (bearer)

**Request Body**:

- Content-Type: `multipart/form-data`
  - Schema: object

  | Field | Type | Required | Description | Example |
  |---|---|---|---|---|
  | `nombre` | `string` | Yes | Nombre del comprador | "Juan Pérez" |
  | `token` | `string (uuid)` | Yes | Token UUID de la reserva | "550e8400-e29b-41d4-a716-446655440000" |
  | `identificacion` | `string (binary)` | Yes | Archivo de identificación (PDF, PNG, JPG, max 5MB) | - |


**Responses**:

- **Status `200`**: Compra confirmada exitosamente.
  - Content-Type: `application/json`
  - Schema: object

- **Status `400`**: Token inválido, reserva expirada, o archivo no válido.

- **Status `401`**: Token JWT no proporcionado o inválido.

---

## Schemas (Data Transfer Objects)

### RegisterDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `nombre` | `string` | Yes | Nombre completo del usuario | "Juan Pérez" |
| `email` | `string` | Yes | Dirección de correo electrónico única | "juan.perez@example.com" |
| `password` | `string` | Yes | Contraseña del usuario (mínimo 6 caracteres) | "secret123" |

### LoginDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `email` | `string` | Yes | Correo electrónico registrado | "juan.perez@example.com" |
| `password` | `string` | Yes | Contraseña del usuario | "secret123" |

### CreateUserDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `nombre` | `string` | Yes | Nombre completo del usuario | "Juan Pérez" |
| `email` | `string` | Yes | Dirección de correo electrónico única | "juan.perez@example.com" |
| `password` | `string` | Yes | Contraseña del usuario (mínimo 6 caracteres) | "secret123" |
| `identificacion_url` | `string` | No | URL de la imagen de identificación cargada en checkout | "https://minio/bucket/id.jpg" |

### UpdateUserDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|

### CreateRutaDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `origen` | `string` | Yes | Ciudad de origen de la ruta | "Oaxaca" |
| `destino` | `string` | Yes | Ciudad de destino de la ruta | "Puebla" |

### RutaResumenDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `id` | `number` | Yes | - | 1 |
| `origen` | `string` | Yes | - | "Oaxaca" |
| `destino` | `string` | Yes | - | "Puebla" |

### ViajeConDisponibilidadDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `id` | `number` | Yes | - | 1 |
| `ruta` | `undefined` | Yes | - | - |
| `fecha_hora_salida` | `string (date-time)` | Yes | - | "2026-06-01T10:00:00.000Z" |
| `fecha_hora_llegada` | `string (date-time)` | Yes | Fecha y hora de llegada calculada | "2026-06-01T12:00:00.000Z" |
| `duracion` | `number` | Yes | Duración del viaje en minutos | 120 |
| `precio_boleto` | `number` | Yes | Precio del boleto | 240.00 |
| `asientos_disponibles` | `number` | Yes | Asientos no ocupados ni reservados activamente | 35 |
| `total_asientos` | `number` | Yes | Total de asientos del viaje | 40 |

### CreateViajeDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `ruta_id` | `number` | Yes | ID de la ruta asociada | 1 |
| `fecha_hora_inicio` | `string` | Yes | Fecha y hora de inicio en formato ISO 8601 | "2026-06-01T10:00:00Z" |
| `duracion` | `number` | Yes | Duración del viaje en minutos | 120 |
| `precio_boleto` | `number` | No | Precio del boleto (si se omite, se calcula a 120 por hora) | 240.00 |
| `capacidad` | `number` | Yes | Capacidad total del viaje (número de asientos) | 40 |

### ViajesDisponiblesQueryDto

| Field | Type | Required | Description | Example |
|---|---|---|---|---|
| `ruta_id` | `number` | No | ID de la ruta para filtrar los viajes | 1 |
