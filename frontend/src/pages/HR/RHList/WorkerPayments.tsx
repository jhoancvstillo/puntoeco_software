import  { useEffect, useState } from 'react';
import { WorkerDetailSection } from './WorkerDetailSection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { getPayments, deletePayment } from "@/api/trabajadores";
import { PaymentDialog } from './PaymentDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Payment {
  id: number;
  worker: number;
  date: string;
  base_salary: string;
  bonuses: string;
  deductions: string;
  total_paid: string;
}

interface WorkerPaymentsProps {
  workerId: number;
}

export function WorkerPayments({ workerId }: WorkerPaymentsProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [workerId]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPayments(workerId);
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching payments.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id: number) => {
    try {
      await deletePayment(id);
      setPayments(payments.filter((payment) => payment.id !== id));
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const handleOpenDialog = (payment?: Payment) => {
    setEditingPayment(payment || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingPayment(null);
    setIsDialogOpen(false);
  };

  const handleSavePayment = () => {
    fetchPayments();
    handleCloseDialog();
  };

  const formatCurrency = (amount: number | string): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <WorkerDetailSection title="Pagos y Beneficios">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Agregar Pago
        </Button>
      </div>

      {payments.length === 0 ? (
        <p className="text-muted-foreground">No hay registros de pagos para este trabajador.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Salario Base</TableHead>
              <TableHead>Bonificaciones</TableHead>
              <TableHead>Deducciones</TableHead>
              <TableHead>Total Pagado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.date), 'dd MMM yyyy', { locale: es })}</TableCell>
                <TableCell>{formatCurrency(payment.base_salary)}</TableCell>
                <TableCell>{formatCurrency(payment.bonuses)}</TableCell>
                <TableCell>{formatCurrency(payment.deductions)}</TableCell>
                <TableCell>{formatCurrency(payment.total_paid)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(payment)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <PaymentDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSavePayment}
        payment={editingPayment}
        workerId={workerId}
      />
    </WorkerDetailSection>
  );
}

