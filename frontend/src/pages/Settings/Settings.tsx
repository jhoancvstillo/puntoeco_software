import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Users from "./components/Users";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export default function Settings({ open, onOpenChange }: SettingsProps) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Configuración</DialogTitle>
            <DialogDescription>
              Ajusta tus preferencias aquí. Haz clic en guardar cuando hayas terminado.
            </DialogDescription>
          </DialogHeader>
          <Users />
   
        </DialogContent>
      </Dialog>
    );
  }
  