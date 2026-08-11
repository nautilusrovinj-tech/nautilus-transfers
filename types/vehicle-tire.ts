export interface VehicleTire {
    id: string;
  
    vehicleId: string;
  
    date: string;
  
    kilometers: number | null;
  
    tireType: string;
  
    brand: string;
  
    size: string;
  
    cost: number;
  
    note: string;
  
    createdAt?: string;
  }