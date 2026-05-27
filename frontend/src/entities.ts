// Interfaces y tipos globales de la aplicación

export type UserRole = 'usuario' | 'admin';

export interface Employee {
  employeeId: string;
  name?: string;
  // Añadir más campos según se requiera
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
  identificacion_url?: string;
}

export interface RutaResumen {
  id: number;
  origen: string;
  destino: string;
}

export interface ViajeConDisponibilidad {
  id: number;
  ruta: RutaResumen;
  fecha_hora_salida: string;
  fecha_hora_llegada?: string;
  duracion?: number;
  precio_boleto?: number;
  asientos_disponibles: number;
  total_asientos: number;
}

export interface Boleto {
  id: number;
  viaje_id: number;
  numero_asiento: number;
  estado: 'disponible' | 'reservado' | 'pagado';
  bloqueado_hasta?: string | null;
}

export interface CompraResumen {
  id: number;
  codigo_boleto: string;
  numero_asiento: number;
  precio: number;
  viaje: {
    id: number;
    fecha_hora_salida: string;
    fecha_hora_llegada: string;
    duracion: number;
    precio_boleto: number;
    ruta: RutaResumen;
  };
}

