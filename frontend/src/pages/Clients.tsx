'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Edit, Trash2, Search, UserCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Definir el esquema del cliente
const clienteSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  mail: z.string().email({ message: 'Email inválido' }),
  phoneNumber: z.string().min(6, { message: 'Teléfono inválido' }),
  address: z.string().optional(),
})

type Cliente = z.infer<typeof clienteSchema>

export default function ClientesManagement() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm<Cliente>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      name: '',
      mail: '',
      phoneNumber: '',
      address: '',
    },
  })

  useEffect(() => {
    // Cargar clientes desde la API
    fetch('http://localhost:8000/clients/getClients/')
      .then(response => response.json())
      .then(data => {
        setClientes(data)
      })
      .catch(error => {
        console.error('Error al cargar clientes:', error)
      })
  }, [])

  const onSubmit = async (data: Cliente) => {
    if (clienteSeleccionado) {
      // Actualizar cliente existente
      fetch(`http://localhost:8000/clients/update/profile_${clienteSeleccionado.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(updatedClient => {
          setClientes(clientes.map(c => c.id === updatedClient.id ? updatedClient : c))
          setIsEditModalOpen(false)
          form.reset()
        })
        .catch(error => {
          console.error('Error al actualizar cliente:', error)
        })
    } else {
      // Crear nuevo cliente
      fetch('http://localhost:8000/clients/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(newClient => {
          setClientes([...clientes, newClient])
          setIsEditModalOpen(false)
          form.reset()
        })
        .catch(error => {
          console.error('Error al crear cliente:', error)
        })
    }
  }

  const handleDelete = async (id: number) => {
    fetch(`http://localhost:8000/clients/delete/profile_${id}/`, {
      method: 'DELETE',
    })
      .then(() => {
        setClientes(clientes.filter(c => c.id !== id))
      })
      .catch(error => {
        console.error('Error al eliminar cliente:', error)
      })
  }

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.mail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-64"
          />
        </div>
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setClienteSeleccionado(null)
              form.reset()
            }}>
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{clienteSeleccionado ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>
              <DialogDescription>
                Complete los detalles del cliente aquí. Haga clic en guardar cuando termine.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Campos del formulario ajustados */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Teléfono del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Guardar</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>{cliente.name}</TableCell>
              <TableCell>{cliente.mail}</TableCell>
              <TableCell>{cliente.phoneNumber}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setClienteSeleccionado(cliente)
                    setIsViewModalOpen(true)
                  }}
                >
                  <UserCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setClienteSeleccionado(cliente)
                    form.reset(cliente)
                    setIsEditModalOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el cliente
                        y eliminará sus datos de nuestros servidores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => cliente.id && handleDelete(cliente.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles del Cliente</DialogTitle>
          </DialogHeader>
          {clienteSeleccionado && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Nombre</h4>
                <p>{clienteSeleccionado.name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p>{clienteSeleccionado.mail}</p>
              </div>
              <div>
                <h4 className="font-semibold">Teléfono</h4>
                <p>{clienteSeleccionado.phoneNumber}</p>
              </div>
              <div>
                <h4 className="font-semibold">Dirección</h4>
                <p>{clienteSeleccionado.address}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
