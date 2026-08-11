export interface DriverDocument {
    id: string;
  
    driverId: string;
  
    documentType: string;
  
    name: string;
  
    expiryDate: string | null;
  
    filePath: string;
  
    note: string;
  
    createdAt: string;
  
    signedUrl?: string;
  }