import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TemplateTabs() {


  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="form">Formulario</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          {/* <FuelDashboard records={fuelRecords} /> */}
        </TabsContent>
        <TabsContent value="table">
          {/* <FuelTable initialRecords={fuelRecords} /> */}
        </TabsContent>
        <TabsContent value="form">
          {/* <FuelForm onSubmit={addFuelRecord} /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

