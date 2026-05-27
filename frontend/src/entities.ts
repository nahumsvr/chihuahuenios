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
  asientos_disponibles: number;
  total_asientos: number;
}
