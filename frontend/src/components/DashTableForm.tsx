import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface DashTableFormProps {
  dashboardContent: React.ReactNode;
  tableContent: React.ReactNode;
  formContent: React.ReactNode;
}

export function DashTableForm({ dashboardContent, tableContent, formContent }: DashTableFormProps) {
  return (
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="form">Formulario</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <TabsContent value="dashboard">
              {dashboardContent}
            </TabsContent>
            <TabsContent value="table">
              {tableContent}
            </TabsContent>
            <TabsContent value="form">
              {formContent}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
  )
}

