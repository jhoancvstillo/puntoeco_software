// "date": "2025-01-01",
// "weight_kg": "150.50",
// "value": "20000.00"

export interface VertederoDataForm{
    date: string;
    weight_kg: number;
    value: number;
}

export interface VertederoData extends VertederoDataForm{
    id: number;
}
