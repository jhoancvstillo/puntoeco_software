
export type EntradaFinanciera = {
    id: number
    descripcion: string
    monto: number[]
  }
  
export type EstadoFinanciero = {
    ingresos: EntradaFinanciera[]
    egresos: EntradaFinanciera[]
  }
  
  // export interface Transaction {
  //   id: number;
  //   date_time: string;
  //   transaction_type: 'Expense' | 'Income';
  //   classification: {
  //     id: number;
  //     name: string;
  //     description: string | null;
  //   };
  //   subcategory: {
  //     id: number;
  //     classification: number;
  //     name: string;
  //     description: string | null;
  //   };
  //   comment: string;
  //   price: string;
  // }

  export interface Transaction {

    id: number;
  
    date_time: string;
  
    date: string; // Add this line
  
    transaction_type: string;
  
    classification: Classification;
  
    subcategory: Subcategory;
  
    comment: string;
  
    price: string;

    amount: number;

    description: string;
    
  
  }
  
  
  export interface Classification {
    id: number;
    name: string;
    description?: string;
  }
  
  export interface Subcategory {
    id: number;
    name: string;
    description?: string;
    classification: number;
  }
  


export interface TransactionTableProps {
  id: number;
  description: string;
  amount: number;
  classification: string;
  subcategory: string;
  date: string;
}

