'use client'


// datetime se muestra así: 11/9/2024, 4:30:00 PM, eliminar los ultimos 00
// eliminar el boton de delete y poner una settings, si se presoina entonces se pueden seleccionar elementos y un boton de eliminar general
// hay que agregar cliente ya que esto se va a enlazar con el historial de clientes
// clasifacicion y subcatogeria debe desplegarse un menu de opciones, como tambien el de agregar una nueva cateogira o eliminar una


import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  date_time: string
  transaction_type: string
  classification: string
  subcategory: string
  frequency: string
  comment: string
  price: string
}

export default function FinanceManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/finance/list/?page=${page}&limit=10`)
      if (!response.ok) throw new Error('Failed to fetch transactions')
      const data = await response.json()
      setTransactions(prev => [...prev, ...data])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast({
        title: "Error",
        description: "Failed to load transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleAddTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newTransaction = Object.fromEntries(formData)

    try {
      const response = await fetch('http://127.0.0.1:8000/finance/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      })

      if (!response.ok) throw new Error('Failed to add transaction')

      const addedTransaction = await response.json()
      setTransactions(prev => [addedTransaction, ...prev])
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Transaction added successfully.",
      })
    } catch (error) {
      console.error('Error adding transaction:', error)
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/finance/delete/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete transaction')

      setTransactions(prev => prev.filter(transaction => transaction.id !== id))
      toast({
        title: "Success",
        description: "Transaction deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting transaction:', error)
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Finance Manager</h1>
      
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <Input name="date_time" type="datetime-local" placeholder="Date and Time" required />
              <Select name="transaction_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                </SelectContent>
              </Select>
              <Input name="classification" placeholder="Classification" required />
              <Input name="subcategory" placeholder="Subcategory" required />
              <Select name="frequency" required>
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="One-time">One-time</SelectItem>
                </SelectContent>
              </Select>
              <Input name="comment" placeholder="Comment" />
              <Input name="price" type="number" step="0.01" placeholder="Price" required />
              <Button type="submit">Submit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Classification</TableHead>
            <TableHead>Subcategory</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date_time).toLocaleString()}</TableCell>
              <TableCell>{transaction.transaction_type}</TableCell>
              <TableCell>{transaction.classification}</TableCell>
              <TableCell>{transaction.subcategory}</TableCell>
              <TableCell>{transaction.frequency}</TableCell>
              <TableCell>{transaction.comment}</TableCell>
              <TableCell>${parseFloat(transaction.price).toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteTransaction(transaction.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {transactions.length % 20 === 0 && (
        <div className="mt-6 flex justify-center">
          <Button onClick={fetchTransactions} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}