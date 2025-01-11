import React, { useEffect, useState } from "react";
import { WorkerDetailSection } from "./WorkerDetailSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getNotes, editNote, deleteNote, createNote } from "@/api/trabajadores";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Note {
  id: number;
  date: string;
  rating: number;
  observations: string;
}

interface WorkerNotesProps {
  workerId: number;
}

export function WorkerNotes({ workerId }: WorkerNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [workerId]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getNotes(workerId);
      const formattedNotes = data.map((note: any) => ({
        id: note.id,
        date: note.date,
        rating: note.rating,
        observations: note.observation,
      }));
      setNotes(formattedNotes);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al obtener las notas.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    setCurrentNote(null);
    setIsDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsDialogOpen(true);
  };

  const handleDeleteNote = (noteId: number) => {
    setNoteToDelete(noteId);
    setIsAlertDialogOpen(true);
  };

  const handleSaveNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const noteData = {
      date: formData.get("date") as string,
      rating: Number(formData.get("rating")),
      observation: formData.get("observations") as string,
      workerId,
    };

    try {
      if (currentNote) {
        await editNote({ ...noteData, id: currentNote.id });
      } else {
        await createNote(noteData);
      }
      fetchNotes();
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar la nota.");
    }
  };

  const confirmDeleteNote = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete);
        fetchNotes();
      } catch (err: any) {
        setError(err.message || "Ocurrió un error al eliminar la nota.");
      }
    }
    setIsAlertDialogOpen(false);
  };

  if (loading) {
    return <p>Cargando notas...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <WorkerDetailSection title="Notas y Evaluaciones">
      <div className="mb-4">
        <Button onClick={handleAddNote} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Agregar Nota
        </Button>
      </div>
      {notes.length === 0 ? (
        <p className="text-muted-foreground">
          No hay notas disponibles para este trabajador.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Observaciones</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>{note.date}</TableCell>
                <TableCell>{note.rating}</TableCell>
                <TableCell>{note.observations}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditNote(note)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentNote ? "Editar Nota" : "Agregar Nota"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveNote}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Fecha
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={
                    currentNote?.date || new Date().toISOString().split("T")[0]
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Calificación
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={currentNote?.rating || 3}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="observations" className="text-right">
                  Observaciones
                </Label>
                <Textarea
                  id="observations"
                  name="observations"
                  defaultValue={currentNote?.observations || ""}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la nota.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteNote}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </WorkerDetailSection>
  );
}
