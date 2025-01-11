import  { useEffect, useState } from 'react';
import { WorkerDetailSection } from './WorkerDetailSection';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Download } from 'lucide-react';
import { getDocuments, deleteDocument } from "@/api/trabajadores";
import { DocumentDialog } from './DocumentDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Document {
  id: number;
  name: string;
  upload_date: string;
  file_url: string;
}

interface WorkerDocumentsProps {
  workerId: number;
}

export function WorkerDocuments({ workerId }: WorkerDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [workerId]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDocuments(workerId);
      setDocuments(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching documents.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleOpenDialog = (document?: Document) => {
    setEditingDocument(document || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingDocument(null);
    setIsDialogOpen(false);
  };

  const handleSaveDocument = () => {
    fetchDocuments();
    handleCloseDialog();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <WorkerDetailSection title="Documentos">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Agregar Documento
        </Button>
      </div>

      {documents.length === 0 ? (
        <p className="text-muted-foreground">No hay documentos disponibles para este trabajador.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha de subida</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{format(new Date(doc.upload_date), 'dd MMM yyyy', { locale: es })}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(doc)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
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

      <DocumentDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveDocument}
        document={editingDocument}
        workerId={workerId}
      />
    </WorkerDetailSection>
  );
}

