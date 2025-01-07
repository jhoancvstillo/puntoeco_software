import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { getAttendance } from "@/api/trabajadores"; // Importa desde tu API

interface Attendance {
  id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: any;
}

interface WorkerAttendanceProps {
  workerId: number;
}

export function WorkerAttendance({ workerId }: WorkerAttendanceProps) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<{
    totalDaysWorked: number;
    attendancePercentage: number;
    absencePercentage: number;
  } | null>(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttendance(workerId);
        console.log('Datos de asistencia:', data); // Depuración para verificar estructura
  
        // Manejo de un único objeto o un array
        const attendanceArray = Array.isArray(data) ? data : [data];
  
        const transformedData = attendanceArray.map((attendance: any) => ({
          id: attendance.id,
          date: attendance.date,
          check_in: attendance.check_in || null,
          check_out: attendance.check_out || null,
          status: attendance.status === 'present' ? 'Presente'
                 : attendance.status === 'absent' ? 'Ausente'
                 : attendance.status === 'permission' ? 'Permiso'
                 : 'Tarde',
        }));
  
        setAttendances(transformedData);
      } catch (err) {
        setError((err as Error).message || 'Error al obtener los registros de asistencia.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAttendances();
  }, [workerId]);
  
  useEffect(() => {
    if (attendances.length > 0) {
      const totalDays = attendances.length;
      const daysWorked = attendances.filter(a => a.status === 'Presente').length;
      const daysAbsent = attendances.filter(a => a.status === 'Ausente').length;

      setMonthlyReport({
        totalDaysWorked: daysWorked,
        attendancePercentage: (daysWorked / totalDays) * 100,
        absencePercentage: (daysAbsent / totalDays) * 100,
      });
    } else {
      setMonthlyReport(null);
    }
  }, [attendances]);

  const filteredAttendances = attendances.filter(attendance =>
    (!date || attendance.date === format(date, 'yyyy-MM-dd')) &&
    (!status || attendance.status === status)
  );

  if (loading) {
    return <p>Cargando registros de asistencia...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Presente">Presente</SelectItem>
            <SelectItem value="Ausente">Ausente</SelectItem>
            <SelectItem value="Permiso">Permiso</SelectItem>
            <SelectItem value="Tarde">Tarde</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Hora de entrada</TableHead>
            <TableHead>Hora de salida</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAttendances.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell>{attendance.date}</TableCell>
              <TableCell>{attendance.check_in || 'N/A'}</TableCell>
              <TableCell>{attendance.check_out || 'N/A'}</TableCell>
              <TableCell>{attendance.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {monthlyReport && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Reporte mensual</h3>
          <p>Días trabajados: {monthlyReport.totalDaysWorked}</p>
          <p>Porcentaje de asistencia: {monthlyReport.attendancePercentage.toFixed(2)}%</p>
          <p>Porcentaje de ausencia: {monthlyReport.absencePercentage.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
