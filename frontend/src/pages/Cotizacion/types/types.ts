export interface QuotationItem {
  description: string
  price: number
  quantity: number
  total: number
}

export interface ClientInfo {
  name: string
  rut: string
  address: string
  city: string
  email: string
  phone: string
}

export interface QuotationData {
  number: string
  date: string
  validUntil: string
  client: ClientInfo
  requestedBy: string
  processedBy: string
  items: QuotationItem[]
  subtotal: number
  tax: number
  total: number
  terms: string[]
}

export interface EditableQuotationItem extends QuotationItem {
  id: string
}

export interface Worker {
  name: string
}

export interface Client extends ClientInfo {
  id: string
}
