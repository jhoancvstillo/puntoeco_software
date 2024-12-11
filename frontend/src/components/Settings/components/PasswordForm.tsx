

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"



export default function PasswordForm() {
  return (
    <>
    {['Contraseña Actual', 'Nueva Contraseña', 'Confirmar Nueva Contraseña'].map((label, index) => (
      <div className="space-y-1" key={index}>
        <Label htmlFor={label}>{label}</Label>
        <Input id={label.toLowerCase().replace(/ /g, '-')} type="password" />
      </div>
    ))}
                <CardFooter className={cn("p-0 pt-3 ")}>
                <Button>Guardar Cambios</Button>
    </CardFooter>
  </>
  )
}
