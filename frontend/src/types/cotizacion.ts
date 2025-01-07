import { Cliente } from '@/types/client'; // Asegúrate de ajustar esta ruta según tu estructura de proyecto
import { Trabajador } from '@/types/worker'; // Ajusta la ruta según corresponda

export interface Cotizacion {
  id?: number; // Opcional porque puede no existir al crear una nueva cotización
  client: Cliente; // Referencia al tipo de cliente
  requestedBy: string; // Nombre de quien solicita la cotización
  worker: Trabajador; // Referencia al tipo de trabajador
  dateTime: string; // Fecha y hora en formato ISO
}
