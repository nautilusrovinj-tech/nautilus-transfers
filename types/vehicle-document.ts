export interface VehicleDocument {
    id: string;
  
    vehicleId: string;
  
    documentType: string;
  
    name: string;
  
    expiryDate: string | null;
  
    filePath: string;
  
    note: string;
  
    createdAt: string;
  
    /**
     * Temporary signed URL generated
     * from Supabase Storage.
     */
    signedUrl?: string;
  }