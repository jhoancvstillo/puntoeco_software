import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkerDetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function WorkerDetailSection({ title, children }: WorkerDetailSectionProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

