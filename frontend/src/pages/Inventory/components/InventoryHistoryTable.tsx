import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Define the structure of a stock change event
interface StockChangeEvent {
  id: number;
  productId: number;
  productName: string;
  changeType: 'add' | 'remove' | 'modify';
  quantity: number;
  timestamp: Date;
  location: string;
}

// Mock function to fetch stock change events (replace with actual API call)
const fetchStockChangeEvents = async (): Promise<StockChangeEvent[]> => {
  // Simulated API call
  return [
    { id: 1, productId: 1, productName: "Product A", changeType: 'add', quantity: 10, timestamp: new Date(), location: "Warehouse 1" },
    { id: 2, productId: 2, productName: "Product B", changeType: 'remove', quantity: 5, timestamp: new Date(), location: "Store 1" },
    { id: 3, productId: 1, productName: "Product A", changeType: 'modify', quantity: -2, timestamp: new Date(), location: "Warehouse 1" },
  ];
};

export function InventoryHistoryTable() {
  const [events, setEvents] = useState<StockChangeEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<StockChangeEvent>>({});

  useEffect(() => {
    const loadEvents = async () => {
      const fetchedEvents = await fetchStockChangeEvents();
      setEvents(fetchedEvents);
    };
    loadEvents();
  }, []);



  const handleAddEvent = () => {
    if (newEvent.productName && newEvent.changeType && newEvent.quantity && newEvent.location) {
      const event: StockChangeEvent = {
        id: events.length + 1,
        productId: events.length + 1, // This should be replaced with actual product ID
        productName: newEvent.productName,
        changeType: newEvent.changeType as 'add' | 'remove' | 'modify',
        quantity: Number(newEvent.quantity),
        timestamp: new Date(),
        location: newEvent.location,
      };
      setEvents([...events, event]);
      setNewEvent({});
    }
  };

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Agregar Cambio de Stock</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Cambio de Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productName" className="text-right">
                Producto
              </Label>
              <Input
                id="productName"
                value={newEvent.productName || ''}
                onChange={(e) => setNewEvent({ ...newEvent, productName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="changeType" className="text-right">
                Tipo de Cambio
              </Label>
              <Select 
                onValueChange={(value) => setNewEvent({ ...newEvent, changeType: value as 'add' | 'remove' | 'modify' })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar tipo de cambio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Agregar</SelectItem>
                  <SelectItem value="remove">Quitar</SelectItem>
                  <SelectItem value="modify">Modificar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newEvent.quantity || ''}
                onChange={(e) => setNewEvent({ ...newEvent, quantity: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Ubicación
              </Label>
              <Input
                id="location"
                value={newEvent.location || ''}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddEvent}>Guardar Cambio</Button>
        </DialogContent>
      </Dialog>

    </div>
  );
}

