export interface VehicleExpense {
    id: string;
  
    vehicleId: string;
  
    date: string;
  
    kilometers: number | null;
  
    category: string;
  
    description: string;
  
    amount: number;
  
    liters: number | null;
  
    pricePerLiter: number | null;
  
    provider: string;
  
    note: string;
  
    createdAt?: string;
  }