export interface VehicleFuel {
    id: string;
  
    vehicleId: string;
  
    date: string;
  
    liters: number;
  
    pricePerLiter: number;
  
    totalCost: number;
  
    kilometers: number | null;
  
    fuelStation: string;
  
    note: string;
  
    createdAt: string;
  }