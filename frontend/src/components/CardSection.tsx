import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface CardSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export const CardSection: React.FC<CardSectionProps> = ({ title, description, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
    
  </Card>
)
