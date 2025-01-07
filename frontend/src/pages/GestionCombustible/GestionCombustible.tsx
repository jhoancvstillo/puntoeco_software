import { DashTableForm } from '@/components/DashTableForm';
import GenericTable from '@/components/GenericTable';
import { useCallback, useEffect, useState } from 'react';
import { conductoresAPI } from '@/api/pesaje';
import { Combustible } from '@/types/combustible';
import { deleteCombustible, getCombustibles } from '@/api/combustible';
import { FuelForm } from './fuelForm';
import FuelDashboard from './FuelDashboard';
import { Conductor } from '@/types/conductor';


const COLUMNS_TABLE_CERTIFICATES: Array<{key: keyof Combustible; header: string}> = [
  { key: 'fecha', header: 'Fecha' },
  { key: 'hora', header: 'Hora' },
  { key: 'patente', header: 'Patente' },
  { key: 'conductor_nombre', header: 'Conductor' },
  { key: 'valor_litro', header: 'Valor/L' },
  { key: 'total', header: 'Total' },
  { key: 'tarjeta', header: 'Tarjeta' },
  { key: 'guia', header: 'Guía' },
  { key: 'observaciones', header: 'Observaciones' },
]



export default function Pesaje() {
  const [transacciones, setTransacciones] = useState<Combustible[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conductoresData, transaccionesData] = await Promise.all([
          conductoresAPI.getAll(),
          getCombustibles(),
        ]);

        setConductores(conductoresData);
        setTransacciones(transaccionesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const handleFormSubmit = useCallback(async (data: Combustible) => {
    console.log('Submit data:', data);
    // Actualizar la lista de transacciones
    setTransacciones(prevTransacciones => [...prevTransacciones, data]);
  }, []);

  const handleDelete = useCallback(async (record: Combustible) => {

    try {
      if (record.id !== undefined) {
        await deleteCombustible(record.id);
      } else {
        console.error('Error: record.id is undefined');
      }
      setTransacciones(prevTransacciones => prevTransacciones.filter(t => t.id !== record.id));
    } catch (error) {
      console.error('Error deleting combustible:', error);
    }
  }, []);

  return (
    <div>
      <DashTableForm
        dashboardContent={<FuelDashboard records={transacciones} />}
        tableContent={
          <GenericTable<Combustible>
            title='Transacciones de Combustible'
            initialRecords={transacciones}
            columns={COLUMNS_TABLE_CERTIFICATES}
            description="Tabla de transacciones de combustible"
            onDelete={handleDelete}
          />
        }
        formContent={
          <FuelForm 
            conductores={conductores}
            onFormSubmit={handleFormSubmit}
          />
        }
      />
    </div>
  );
}

