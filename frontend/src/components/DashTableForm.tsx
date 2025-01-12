import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DashTableFormProps {
  dashboardContent: React.ReactNode;
  tableContent: React.ReactNode;
  formContent: React.ReactNode;
}


export function DashTableForm({ dashboardContent, tableContent, formContent }: DashTableFormProps) {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  return (
    <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="table">Tabla</TabsTrigger>
        <TabsTrigger value="form">Formulario</TabsTrigger>
      </TabsList>
      <Card className="mt-4">
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              variants={tabVariants}
            >
              {activeTab === 'dashboard' && dashboardContent}
              {activeTab === 'table' && tableContent}
              {activeTab === 'form' && formContent}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </Tabs>
  )
}