export const calculateTotalInvoice = (liters: number, pricePerLiter: number): number => {
    return Math.round(liters * pricePerLiter);
  };
  
  