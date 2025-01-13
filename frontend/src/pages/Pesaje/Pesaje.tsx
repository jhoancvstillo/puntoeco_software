import { PesajeForm } from './components/form/PesajeForm'
import { DashTableForm } from '@/components/DashTableForm';
import GenericTable from '@/components/GenericTable';
import { certificadosAPI } from '@/api/pesaje';
import { useEffect, useState } from 'react';
import { CertificadoPesaje, CertificadoPesajeNombres, TicketPesaje } from '@/types/pesaje';
import { Dashboard } from './components/Dashboard';

interface Column<T extends Record<string, any>> {
  key: keyof T; // La clave debe ser una propiedad válida de T
  header: string;
  render?: (value: T[keyof T], record: T) => React.ReactNode; // Render personalizado (opcional)
  }


const COLUMNS_TABLE_CERTIFICATES: Column<CertificadoPesajeNombres>[] = [
  { key: 'id', header: 'ID' },
  { key: 'fecha', header: 'Fecha' },
  { key: 'cliente', header: 'Cliente' },
  { key: 'conductor', header: 'Conductor' },
  { key: 'patente', header: 'Patente' },
  { key: 'hora_salida', header: 'Hora de Salida' },
  { key: 'peso_1', header: 'Peso' },
  { key: 'pdf_ticket', header: 'Descargar' },
];



export default function Pesaje() {
  const handleFormSubmit = (data: any) => {
    certificadosAPI.create(data).then(() => {
      certificadosAPI.getAll().then((data) => {
        const transformedData: CertificadoPesajeNombres[] = data.map((certificado: CertificadoPesaje) => ({
          id: certificado.id,
          codigo_producto: certificado.codigo_producto,
          dispatch_guide: certificado.dispatch_guide,
          tipo_camion: certificado.tipo_camion,
          cliente: certificado.cliente?.name || "N/A",
          conductor: certificado.conductor?.nombre || "N/A",
          patente: certificado.patente,
          fecha: certificado.fecha,
          hora_ingreso: certificado.hora_ingreso,
          hora_salida: certificado.hora_salida,
          peso_1: certificado.peso_1,
          peso_2: certificado.peso_2,
          pdf_ticket: certificado.pdf_ticket,
        }));
  
        setCertificadosWithNames(transformedData);
        
      });
    });
  };
     const [certificadosWithNames, setCertificadosWithNames] = useState<CertificadoPesajeNombres[]>([]);
   const [certificados, setCertificados] = useState<TicketPesaje[]>([]);

   
 
   useEffect(() => {
    const fetchData = async () => {
      try {
        const [certificatesData] = await Promise.all([
          certificadosAPI.getAll(),

        ]);
  
        // Convertir los datos de CertificadoPesaje a CertificadoPesajeNombres
        const certificatesWithNames: CertificadoPesajeNombres[] = certificatesData.map(
          (certificado: CertificadoPesaje) => ({
            id: certificado.id,
            codigo_producto: certificado.codigo_producto,
            dispatch_guide: certificado.dispatch_guide,
            tipo_camion: certificado.tipo_camion,
            cliente: certificado.cliente?.name || "N/A", // Asegurarse de manejar valores nulos o undefined
            conductor: certificado.conductor?.nombre || "N/A", // Igual que para cliente
            patente: certificado.patente,
            fecha: certificado.fecha,
            hora_ingreso: certificado.hora_ingreso,
            hora_salida: certificado.hora_salida,
            peso_1: certificado.peso_1,
            peso_2: certificado.peso_2,
            pdf_ticket: certificado.pdf_ticket,
          })
        );

        setCertificados(certificatesData)
        setCertificadosWithNames(certificatesWithNames); // Guardar los datos transformados
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOnDelete = async (data: CertificadoPesajeNombres) => {
    try {
      await certificadosAPI.delete(data.id);
      const newCertificados = certificadosWithNames.filter((certificado) => certificado.id !== data.id);
      setCertificadosWithNames(newCertificados);
    } catch (error) {
      console.error("Error deleting data:", error
      );
    }
  }

  console.log(certificadosWithNames)
  return (
    <div>
      <DashTableForm
        dashboardContent={<Dashboard data={certificados} />}
        tableContent={<GenericTable columns={COLUMNS_TABLE_CERTIFICATES}
        initialRecords={certificadosWithNames} 
        title='Historial' 
        description='Histotrial de todos los certificados de pesaje'
        onDelete={handleOnDelete}
        />
      }
        formContent={<PesajeForm onSubmit={handleFormSubmit} />}
      />

    </div>
  );
};
