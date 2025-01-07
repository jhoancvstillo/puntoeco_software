export const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', { hour12: true }).replace(/:00\s/, ' ');
  };
  