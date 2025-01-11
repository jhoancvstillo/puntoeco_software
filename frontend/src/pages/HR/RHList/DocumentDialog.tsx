import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDocument, editDocument } from "@/api/trabajadores";

interface Document {
  id?: number;
  name: string;
  upload_date: string;
  file_url?: string;
}

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  document: Document | null;
  workerId: number;
}

export function DocumentDialog({ isOpen, onClose, onSave, document, workerId }: DocumentDialogProps) {
  const [formData, setFormData] = useState<Document>({
    name: '',
    upload_date: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (document) {
      setFormData(document);
    } else {
      setFormData({
        name: '',
        upload_date: '',
      });
      setFile(null);
    }
  }, [document]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('upload_date', formData.upload_date);

      if (file) {
        formDataToSend.append('file_url', file);
      }

      if (document) {

        await editDocument(formDataToSend);
      } else {
        formDataToSend.append('worker', workerId.toString());
        await createDocument(formDataToSend);
      }
      onSave();
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{document ? 'Editar' : 'Agregar'} Documento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del documento</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre del documento"
            />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="upload_date">Fecha de subida</Label>
            <Input
              type="date"
              id="upload_date"
              name="upload_date"
              value={formData.upload_date}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Archivo</Label>
            <Input
              type="file"
              id="file"
              onChange={handleFileChange}
            />
          </div>
          <DialogFooter>
            <Button type="submit">{document ? 'Guardar cambios' : 'Crear'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

