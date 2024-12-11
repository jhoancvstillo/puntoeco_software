import { CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf } from 'lucide-react';

interface IconHeaderProps {
  darkMode: boolean;
}

export default function IconHeader({ darkMode }: IconHeaderProps) {
  return (
    <>
      <div className="flex justify-center mb-4">
        <Leaf className={`h-12 w-12 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
      </div>
      <CardTitle className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Punto Eco</CardTitle>
      <CardDescription className={darkMode ? 'text-gray-300' : 'text-green-600'}>
        Ingresa a tu cuenta para gestionar tu reciclaje
      </CardDescription>
    </>
  );
}