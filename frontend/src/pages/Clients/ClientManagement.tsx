import { useState, useEffect } from 'react';
import { ClientFormDialog } from './components/ClientFormDialog';
import { ClienteTable } from './components/ClientTable';
import { ClienteDetailsDialog } from './components/ClienteDetailsDialog';
import { Cliente } from '@/types/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient, deleteClient, getClients, updateClient } from '@/api/clients';

export default function ClientManagement() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchClientes();
  }, [currentPage, filter]);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const data = await getClients(currentPage, itemsPerPage, filter);
      setClientes(data.results);
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
    setIsLoading(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setIsFormDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClient(id);
      fetchClientes(); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleViewDetails = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmit = async (data: Cliente) => {
    try {
      if (clienteSeleccionado) {
        // Update cliente
        await updateClient(clienteSeleccionado.id, data);
      } else {
        await createClient(data);
      }
      fetchClientes();
      setIsFormDialogOpen(false);
      setClienteSeleccionado(null);
    } catch (error) {
      console.error('Error submitting client:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };
 
  return (
    <div className="container mx-auto pl-4 pb-4 pr-4">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Filtrar por nombre o RUT..."
          value={filter}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        <Button onClick={() => setIsFormDialogOpen(true)}>Agregar Cliente</Button>
      </div>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <ClienteTable
            clientes={clientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
          {clientes && clientes.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
      <ClientFormDialog
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleSubmit}
        initialData={clienteSeleccionado}
      />
      <ClienteDetailsDialog
        cliente={clienteSeleccionado}
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
}
