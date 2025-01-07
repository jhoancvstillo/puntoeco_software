import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react'; // Ícono de basurero
import { VertederoData } from '../types/Vertedero';
import { formatNumber } from '@/utils/CurrencyFormatter';

interface DetailsTableProps {
  initialRecords: VertederoData[];
  columns: { key: string; header: string; }[];

}

export default function DetailsTable({ initialRecords = [] }: DetailsTableProps) {
  const [records, setRecords] = useState<VertederoData[]>([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<keyof VertederoData>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    setRecords(initialRecords);
  }, [initialRecords]);

  const handleDelete = (id: number) => {
    setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
  };

  const filteredAndSortedRecords = useMemo(() => {
    return records
      .filter((record) =>
        (record.date?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
        (record.weight_kg?.toString().includes(filter) ?? false) ||
        (record.value?.toString().includes(filter) ?? false)
      )
      .sort((a, b) => {
        if (a[sortBy] == null || b[sortBy] == null) return 0;
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
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

  const handleSort = (column: keyof VertederoData) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historial de Vertedero</CardTitle>
        <CardDescription>Registro detallado de todas las operaciones en el vertedero</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Filtrar por fecha, peso o valor"
            value={filter}
            onChange={handleFilterChange}
            className="flex-grow"
          />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof VertederoData)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha</SelectItem>
              <SelectItem value="weight_kg">Peso (kg)</SelectItem>
              <SelectItem value="value">Valor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('date')}>Fecha</TableHead>
                <TableHead onClick={() => handleSort('weight_kg')}>Peso (kg)</TableHead>
                <TableHead onClick={() => handleSort('value')}>Valor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date ?? 'N/A'}</TableCell>
                  <TableCell>{record.weight_kg != null ? formatNumber(record.weight_kg) : 'N/A'}</TableCell>
                  <TableCell>{record.value != null ? formatNumber(record.value) : 'N/A'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
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
            <span>Página {currentPage} de {totalPages}</span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
