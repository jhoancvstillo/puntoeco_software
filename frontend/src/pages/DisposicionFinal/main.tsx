  import { CertificadoForm } from './components/CertificadoForm';
  import { getClientsNormal } from '@/api/clients';
  import { Cliente } from '@/types/client';
  import { useEffect, useState } from 'react';
  import { DashTableForm } from '@/components/DashTableForm';
  import GenericTable from '@/components/GenericTable';
  import { deleteCertificado, getCertificados } from '@/api/destinoFinal';
  import Dashboard from './components/Dashboard';


  const COLUMNS_TABLE_CERTIFICATES = [
    { key: 'id', header: 'ID' },
    { key: 'fecha', header: 'Fecha' },
    { key: 'client', header: 'Cliente' },
    { key: 'categoria', header: 'Categoría' },
    { key: 'folio', header: 'N° Folio' },
    { key: 'numero_certificado', header: 'N° Certificado' },
    { key: 'numero_guia', header: 'N° Guía' },
    { key: 'file', header: 'Descargar' },
  ]


  export default function CertificadoDisposicionFinal() {
    const [clients, setClients] = useState<Cliente[]>([]);
    const [certificados, setCertificados] = useState<any[]>([]);
    const [certificadosWithClientName, setCertificadosWithClientName] = useState<any[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [clientsData, certificatesData] = await Promise.all([
            getClientsNormal(),
            getCertificados(),
          ]);
          setClients(clientsData); // Asignamos los datos a `clients`
          setCertificados(certificatesData); // Asignamos los datos a `certificados`
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []);

    useEffect(() => {
      // convertir los id de cliente a nombre de cliente solo cuando `clients` o `certificados` cambien
        const updatedCertificados = certificados.map((certificado: any) => {
          return {
            ...certificado,
            client: convertIDToClient(certificado.client),
          };
        });
        setCertificadosWithClientName(updatedCertificados);
    }, [clients, certificados]);

    const convertIDToClient = (id: number) => {
      const client = clients.find((client) => client.id === id);
      return client ? client.name : '';
    };

    const handleOnDelete = async (data: any) => {
      try {
        await deleteCertificado(data.id);
        // const updatedCertificados = certificados.filter((certificado) => certificado.id !== data.id);
        const updatedCertificados = await getCertificados();
        setCertificados(updatedCertificados);
      } catch (error) {
        console.error('Error deleting certificado:', error);
      }
    }

    const onUpdate = async () => {
      try {
        const updatedCertificados = await getCertificados();
        setCertificados(updatedCertificados);
        
        const updatedCertificadosWithClientName = updatedCertificados.map((certificado: any) => ({
          ...certificado,
          client: convertIDToClient(certificado.client),
        }));
        setCertificadosWithClientName(updatedCertificadosWithClientName);
      } catch (error) {
        console.error('Error updating certificados:', error);
      }

    };


    return (
      
      <DashTableForm
      dashboardContent={<Dashboard/>}
        tableContent={
          <GenericTable
            key={certificadosWithClientName.length}
            title="Clientes"
            description="Lista de clientes"
            initialRecords={certificadosWithClientName || []}
            columns={COLUMNS_TABLE_CERTIFICATES}
            onDelete={handleOnDelete}

          />
        }
        formContent={<CertificadoForm clients={clients || []}
        onUpdate={onUpdate} />}
      />
    );
  }
