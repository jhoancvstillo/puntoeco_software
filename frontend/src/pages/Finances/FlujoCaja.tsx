"use client"

import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  date_time: string
  transaction_type: 'Expense' | 'Income'
  classification: string
  subcategory: string
  frequency: string
  comment: string
  price: string
}

interface OrganizedTransactions {
  Expense: { [classification: string]: { [subcategory: string]: Transaction[] } }
  Income: { [classification: string]: { [subcategory: string]: Transaction[] } }
}

export default function FlujoCaja() {
  const [organizedTransactions, setOrganizedTransactions] = useState<OrganizedTransactions | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set())
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/finance/list/`)
      if (!response.ok) throw new Error('Failed to fetch transactions')
      const data = (await response.json()) as Transaction[]

      const organized: OrganizedTransactions = { Expense: {}, Income: {} }
      let expenses = 0
      let income = 0

      data.forEach((transaction) => {
        const { transaction_type: type, classification, subcategory, price } = transaction
        if (!organized[type][classification]) {
          organized[type][classification] = {}
        }
        if (!organized[type][classification][subcategory]) {
          organized[type][classification][subcategory] = []
        }
        organized[type][classification][subcategory].push(transaction)

        const amount = parseFloat(price)
        if (type === 'Expense') {
          expenses += amount
        } else {
          income += amount
        }
      })

      setOrganizedTransactions(organized)
      setTotalExpenses(expenses)
      setTotalIncome(income)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(subcategory)) {
        newSet.delete(subcategory)
      } else {
        newSet.add(subcategory)
      }
      return newSet
    })
  }

  if (!organizedTransactions) {
    return <div className="text-center p-4">Cargando...</div>
  }

  const columnWidths = {
    category: '350px',
    date: '120px',
    comment: '350px',
    price: '100px'
  }

  const netFlow = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  return (
    <div className='p-2 space-y-4'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Flujo de Caja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{width: columnWidths.category}}>Categoría</TableHead>
                    <TableHead style={{width: columnWidths.date}}>Fecha</TableHead>
                    <TableHead style={{width: columnWidths.comment}}>Comentario</TableHead>
                    <TableHead style={{width: columnWidths.price}} className="text-right">Precio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(['Income', 'Expense'] as const).map((type) => (
                    <React.Fragment key={type}>
                      <TableRow>
                        <TableCell colSpan={4} className={`font-bold text-lg ${type === 'Income' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                          {type === 'Income' ? 'Ingresos' : 'Gastos'}
                        </TableCell>
                      </TableRow>
                      {Object.entries(organizedTransactions[type]).map(([classification, subcategories]) => (
                        <React.Fragment key={`${type}-${classification}`}>
                          <TableRow className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleCategory(`${type}-${classification}`)}>
                            <TableCell colSpan={4}>
                              <div className="flex items-center">
                                {expandedCategories.has(`${type}-${classification}`) ? (
                                  <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                                )}
                                <span className="font-semibold truncate">{classification}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedCategories.has(`${type}-${classification}`) && (
                            <>
                              {Object.entries(subcategories).map(([subcategory, transactions]) => (
                                <React.Fragment key={`${type}-${classification}-${subcategory}`}>
                                  <TableRow className="hover:bg-gray-100 cursor-pointer" onClick={() => toggleSubcategory(`${type}-${classification}-${subcategory}`)}>
                                    <TableCell colSpan={4}>
                                      <div className="flex items-center pl-8">
                                        {expandedSubcategories.has(`${type}-${classification}-${subcategory}`) ? (
                                          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                                        )}
                                        <span className="truncate">{subcategory}</span>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                  {expandedSubcategories.has(`${type}-${classification}-${subcategory}`) && (
                                    <>
                                      {transactions.map((transaction) => (
                                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                                          <TableCell style={{width: columnWidths.category}} className="pl-16 truncate">{transaction.subcategory}</TableCell>
                                          <TableCell style={{width: columnWidths.date}}>{new Date(transaction.date_time).toLocaleDateString()}</TableCell>
                                          <TableCell style={{width: columnWidths.comment}} className="truncate">{transaction.comment}</TableCell>
                                          <TableCell style={{width: columnWidths.price}} className="text-right">
                                            <span className={`font-semibold ${type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                              {parseFloat(transaction.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                            </span>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </>
                                  )}
                                </React.Fragment>
                              ))}
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Total Ingresos</p>
                <p className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Gastos</p>
                <p className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Flujo Neto</p>
                <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netFlow.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Ahorro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{savingsRate.toFixed(2)}%</p>
            <p className="text-sm text-gray-500">Porcentaje de ingresos ahorrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gasto Promedio Diario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(totalExpenses / 30).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
            <p className="text-sm text-gray-500">Basado en los últimos 30 días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categoría de Mayor Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">Pendiente</p>
            <p className="text-sm text-gray-500">Implementar lógica para calcular</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}