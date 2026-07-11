export interface Transfer {
    id: string;
  
    clientName: string;
    phone: string;
  
    date: string;
    time: string;
  
    pickup: string;
    dropoff: string;
  
    flightNumber: string;
  
    adults: number;
    children: number;
    babySeats: number;
    boosterSeats: number;
  
    price: number;
  
    driver: string;
    vehicle: string;
    partner: string;
  
    paymentStatus: "Pending" | "Paid";
  
    status: "New" | "Confirmed" | "Completed" | "Cancelled";
  
    notes: string;
  }