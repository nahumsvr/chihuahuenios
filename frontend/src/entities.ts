// Interfaces y tipos globales de la aplicación

export interface Employee {
  employeeId: string;
  name?: string;
  // Añadir más campos según se requiera
}

export interface User {
  id: string;
  email: string;
  // Añadir más campos según se requiera
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
