import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardInventario from './components/Dashboard'
import { InventoryManager } from './components/InventoryManager'

export default function Inventory() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="table">Gestión de Inventario</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <DashboardInventario/>
        </TabsContent>
        <TabsContent value="table">
          <InventoryManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
