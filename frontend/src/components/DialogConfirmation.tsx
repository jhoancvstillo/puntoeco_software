import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"



interface DialogConfirmationProps {
  list: any;
  formData: any;
  isDialogOpen: boolean;
  setIsDialogOpen: (value: boolean) => void;
  handleDialogCancel: () => void;
  handleDialogConfirm: () => void;
}

export default function DialogConfirmation({
  list,
  isDialogOpen,
  setIsDialogOpen,
  formData,
  handleDialogCancel,
  handleDialogConfirm,
}: DialogConfirmationProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = () => {
    setIsConfirming(true)
    setTimeout(() => {
      handleDialogConfirm()
      setIsConfirming(false)
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">Confirmación</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground">
                ¿Está seguro de que desea registrar?
              </DialogDescription>
            </DialogHeader>
            {formData && (
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {list.map((item: any) => (
                    <motion.p 
                      key={item.key}
                      className="mb-2 last:mb-0"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <strong className="font-medium text-primary">{item.header}:</strong>{' '}
                      <span className="text-muted-foreground">{formData[item.key]}</span>
                    </motion.p>
                  ))}
                </motion.div>
              </ScrollArea>
            )}
            <DialogFooter className="sm:justify-start">
              <Button variant="outline" onClick={handleDialogCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={isConfirming}
                className="relative"
              >
                {isConfirming ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  </motion.div>
                ) : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}


