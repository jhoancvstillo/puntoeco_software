import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Cliente } from "@/types/client";

interface ClientDropdownProps {
    clients: Cliente[]
    selectedClientName: string;
    onSelectClient: (client: Cliente) => void;
}



export default function ClientDropdown({ clients, selectedClientName, onSelectClient }: ClientDropdownProps) {
  return (
    <ScrollArea className="h-[200px]">
    {clients.map((client) => (
      <Button
        key={client.id}
        variant="ghost"
        className={cn(
          "w-full justify-start",
          client.name === selectedClientName && "bg-accent"
        )}
        onClick={() => onSelectClient(client)}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            client.name === selectedClientName ? "opacity-100" : "opacity-0"
          )}
        />
        {client.name}
      </Button>
    ))}
    {clients.length === 0 && (
      <div className="p-2 text-sm text-muted-foreground">
        No se encontraron resultados
      </div>
    )}
  </ScrollArea>
  )
}
