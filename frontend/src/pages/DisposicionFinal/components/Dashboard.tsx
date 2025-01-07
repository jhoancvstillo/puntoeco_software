import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExportarDocumentosForm } from "./ExportarDocumentosForm"

export default function Dashboard() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Exportar Documentos</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Exportar Documentos</DialogTitle>
            <DialogDescription>
              Ingrese los detalles para exportar los documentos.
            </DialogDescription>
          </DialogHeader>
          <ExportarDocumentosForm />
        </DialogContent>
      </Dialog>
    </div>
  )
}

