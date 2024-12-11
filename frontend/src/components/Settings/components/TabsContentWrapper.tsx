// components/TabsContentWrapper.tsx
import React, { ReactNode } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabsContentWrapperProps {
  children: ReactNode
}


const tabs = [
  { id: "general", label: "General" },
  { id: "users", label: "Usuarios" },
  { id: "security", label: "Seguridad" },
]

export const TabsContentWrapper: React.FC<TabsContentWrapperProps> = ({ children }) => {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
