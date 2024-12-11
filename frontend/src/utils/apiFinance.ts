
interface Transaction {
    date_time: string; // ISO 8601 format, example: "2024-11-09T15:30:00Z"
    transaction_type: "Expense" | "Income"; // Limits the type to "Expense" or "Income"
    classification: string; // Example: "Operacional"
    subcategory: string; // Example: "Mantenimiento de Maquinarias"
    frequency: "Regular" | "Irregular"; // Limits to specific values
    comment?: string; // Optional field
    price: number; // Numeric value representing the price
  }


export async function getTransactions(): Promise<Transaction[]> {
    const response = await fetch('http://localhost:8000/finance/list/');
    if (!response.ok) throw new Error('Error al obtener las transacciones');
  
    const data = await response.json();
    return data;
  }
  
  // Función para obtener y organizar las transacciones
export async function fetchAndOrganizeTransactions()  {
  const response = await fetch('http://localhost:8000/finance/list/');
  if (!response.ok) throw new Error('Error al obtener las transacciones');

  const listTransactions = await response.json();

    // Estructura para almacenar los datos organizados
  const organizedTransactions: {
      Expense: { [classification: string]: { [subcategory: string]: any[] } };
      Income: { [classification: string]: { [subcategory: string]: any[] } };
    } = { Expense: {}, Income: {} };
  
    // Recorrer cada transacción y organizarlas en el diccionario
    listTransactions.forEach((transaction:Transaction) => {
      const type = transaction.transaction_type as "Expense" | "Income";
      const classification = transaction.classification;
      const subcategory = transaction.subcategory;
  
      // Asegurarse de que la estructura existe
      if (!organizedTransactions[type][classification]) {
        organizedTransactions[type][classification] = {};
      }
      if (!organizedTransactions[type][classification][subcategory]) {
        organizedTransactions[type][classification][subcategory] = [];
      }
  
      // Añadir la transacción al lugar correspondiente
      organizedTransactions[type][classification][subcategory].push(transaction);
    });
    return organizedTransactions;
  }
  


export async function createTransaction(transaction: Transaction): Promise<Transaction> {
    const response = await fetch('http://localhost:8000/finance/create/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });
    if (!response.ok) throw new Error('Error al crear la transacción');
    return response.json();
}