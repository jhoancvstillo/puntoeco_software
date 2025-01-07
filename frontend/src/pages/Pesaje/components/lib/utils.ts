export function formatNumber(num: number): string {
    return new Intl.NumberFormat('es-CL').format(num);
  }
  
  export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  