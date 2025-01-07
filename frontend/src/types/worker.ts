export interface Trabajador {
    id: number;
    photo?: string; // URL de la foto, opcional
    name: string;
    position: string;
    joinDate: string; // Fecha en formato ISO
    status: 'active' | 'inactive';
    rut: string;
    phone?: string; // Opcional
    isDriver: boolean;
  }
  export interface TrabajadorForm{
    photo?: string; // URL de la foto, opcional
    name: string;
    position: string;
    joinDate: string;
    status: 'active' | 'inactive';
    rut: string;
    phone: string;
    isDriver: boolean;
  }
  
  export interface Asistencia {
    id: number;
    worker: Trabajador; // Relación con el trabajador
    date: string; // Fecha en formato ISO
    checkIn: string; // Hora en formato ISO
    checkOut: string; // Hora en formato ISO
    status: 'present' | 'late' | 'absent';
  }
  
  export interface PagoBeneficio {
    id: number;
    worker: Trabajador;
    date: string; // Fecha en formato ISO
    baseSalary: number; // Decimal
    bonuses: number; // Decimal
    deductions: number; // Decimal
    totalPaid: number; // Decimal
  }
  
  export interface Nota {
    id: number;
    worker: Trabajador;
    date: string; // Fecha en formato ISO
    rating: number; // Calificación
    observation: string;
  }
  
  export interface Documento {
    id: number;
    worker: Trabajador;
    name: string; // Nombre del documento
    type: string; // Tipo de documento (DNI, Pasaporte, etc.)
    uploadDate: string; // Fecha en formato ISO
    fileUrl: string; // URL del archivo
  }
  
  export interface VacacionPermiso {
    id: number;
    worker: Trabajador;
    startDate: string; // Fecha en formato ISO
    endDate: string; // Fecha en formato ISO
    reason: string; // Razón de la vacación o permiso
    type: 'vacation' | 'permission';
    status: 'approved' | 'rejected' | 'pending';
  }
  
  export interface Capacitacion {
    id: number;
    worker: Trabajador;
    courseName: string;
    date: string; // Fecha en formato ISO
    status: 'Completed' | 'In Progress';
  }
  
  export interface Incidente {
    id: number;
    worker: Trabajador;
    date: string; // Fecha en formato ISO
    description: string; // Descripción del incidente
    severity: 'Low' | 'Medium' | 'High';
    correctiveAction: string; // Acción correctiva
  }
  

 