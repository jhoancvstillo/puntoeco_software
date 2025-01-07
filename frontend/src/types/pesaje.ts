import { Cliente } from "./client";
import { Conductor } from "./conductor";

export interface CertificadoPesaje {
  id: number;
  codigo_producto: string;
  dispatch_guide: string | null; // Puede ser null
  tipo_camion: string;
  cliente: Cliente; // Detallado en la interfaz Cliente
  conductor: Conductor; // Detallado en la interfaz Conductor
  patente: string;
  fecha: string; // Formato ISO de fecha (YYYY-MM-DD)
  hora_ingreso: string; // Formato de hora (HH:mm:ss)
  hora_salida: string; // Formato de hora (HH:mm:ss)
  peso_1: string; // Representado como string
  peso_2: string; // Representado como string
  pdf_ticket: string; // URL del PDF
}


export interface CertificadoPesajeNombres {
  id: number;
  codigo_producto: string;
  dispatch_guide: string | null; // Puede ser null
  tipo_camion: string;
  cliente: string; // Detallado en la interfaz Cliente
  conductor: string; // Detallado en la interfaz Conductor
  patente: string;
  fecha: string; // Formato ISO de fecha (YYYY-MM-DD)
  hora_ingreso: string; // Formato de hora (HH:mm:ss)
  hora_salida: string; // Formato de hora (HH:mm:ss)
  peso_1: string; // Representado como string
  peso_2: string; // Representado como string
  pdf_ticket: string; // URL del PDF
}


export interface TicketPesaje {
  id: number;
  codigo_producto: string;
  dispatch_guide: string | null;
  tipo_camion: string;
  cliente: {
    id: number;
    name: string;
    mail: string;
    phoneNumber: string;
    address: string;
    rut: string;
  };
  conductor: {
    id: number;
    nombre: string;
    rut: string;
    cliente: number;
  };
  patente: string;
  fecha: string;
  hora_ingreso: string;
  hora_salida: string;
  peso_1: string; // You might consider changing this to `number` for easier calculations
  peso_2: string; // Same as above
  pdf_ticket: string;
}
