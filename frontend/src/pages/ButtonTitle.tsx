import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
  
export function ButtonTitle({
    open,
    setOpen,
    buttonName,
    title,
    description,
    children }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    buttonName: string;
    title?: string;
    description?: string;
    children?: React.ReactNode;

  }) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{buttonName}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
            {children}
        </DialogContent>
      </Dialog>
    );
  }
  