import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';
import { downloadFile } from '@/components/downloadFile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { parse, isValid, compareAsc, compareDesc } from 'date-fns';

interface Column<T extends Record<string, any>> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

interface GenericTableProps<T extends Record<string, any>> {
  initialRecords: T[];
  columns: Column<T>[];
  title: string;
  description: string;
  onDelete: (record: T) => void;
}

function formatNumber(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function GenericTable<T extends Record<string, any>>({
  initialRecords,
  columns,
  title,
  description,
  onDelete,
}: GenericTableProps<T>) {
  const [records, setRecords] = useState<T[]>(initialRecords);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<keyof T>('fecha' as keyof T);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<T | null>(null);

  const itemsPerPage = 10;

  const parseDate = (date: string | undefined | null): Date => {
    if (!date || typeof date !== 'string') {
      return new Date(0);
    }

    const formats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'];
    for (const format of formats) {
      const parsedDate = parse(date, format, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }

    return new Date(0);
  };

  const filteredAndSortedRecords = useMemo(() => {
    return records
      .filter((record) =>
        Object.values(record).some((value) =>
          String(value).toLowerCase().includes(filter.toLowerCase())
        )
      )
      .sort((a, b) => {
        if (sortBy === 'fecha') {
          const dateA = parseDate(a.fecha as unknown as string);
          const dateB = parseDate(b.fecha as unknown as string);
          return sortOrder === 'asc' ? compareAsc(dateA, dateB) : compareDesc(dateA, dateB);
        } else {
          if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
          if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        }
      });
  }, [records, filter, sortBy, sortOrder]);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedRecords.slice(start, end);
  }, [filteredAndSortedRecords, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredAndSortedRecords.length / itemsPerPage));
  }, [filteredAndSortedRecords]);

  useEffect(() => {
    setSortBy('fecha' as keyof T);
    setSortOrder('desc');
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredAndSortedRecords.length / itemsPerPage));
  }, [filteredAndSortedRecords]);

  useEffect(() => {
    const hasIDColumn = initialRecords.length > 0 && 'ID' in initialRecords[0];
    const sortedRecords = [...initialRecords];
    if (hasIDColumn) {
      setSortBy('ID' as keyof T);
      setSortOrder('desc');
      sortedRecords.sort((a, b) => (b['ID'] as number) - (a['ID'] as number));
    } else {
      setSortBy('fecha' as keyof T);
      setSortOrder('desc');
      sortedRecords.sort((a, b) => {
        const dateA = parseDate(a.fecha as unknown as string);
        const dateB = parseDate(b.fecha as unknown as string);
        return compareDesc(dateA, dateB);
      });
    }
    setRecords(sortedRecords);
  }, [initialRecords]);

  const handleSort = (column: keyof T) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (record: T) => {
    setRecordToDelete(record);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      onDelete(recordToDelete);
      setRecords(records.filter((r) => r !== recordToDelete));
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Filtrar registros"
            value={filter}
            onChange={handleFilterChange}
            className="flex-grow"
          />
          <Select value={sortBy as string} onValueChange={(value) => setSortBy(value as keyof T)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((column) => (
                <SelectItem key={String(column.key)} value={String(column.key)}>
                  {column.header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className="cursor-pointer"
                    onClick={() => handleSort(column.key)}
                  >
                    {column.header}
                    {sortBy === column.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                  </TableHead>
                ))}
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((record, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {['Total', 'Valor/L', 'Precio por Unidad', 'Precio', 'Peso', 'Valor'].includes(column.header)
                        ? formatNumber(Number(record[column.key]))
                        : column.header === 'Descargar' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const url = record[column.key] as string;
                              const filename = url.split('/').pop() || 'download';
                              downloadFile(url, filename);
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                          </Button>
                        ) : column.render
                          ? column.render(record[column.key], record)
                          : String(record[column.key])}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(record)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredAndSortedRecords.length > 0 && (
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
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que quieres eliminar este registro?
            </DialogDescription>
          </DialogHeader>
          {recordToDelete && (
            <div className="grid grid-cols-2 gap-4">
              {columns.map((column) => (
                <div key={String(column.key)}>
                  <strong>{column.header}:</strong> {String(recordToDelete[column.key])}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
