export interface VehicleService {
  id: string;
  vehicleId: string;

  serviceDate: string;
  serviceType: string;

  description: string | null;

  kilometers: number | null;
  cost: number;

  serviceProvider: string | null;

  nextServiceDate: string | null;
  nextServiceKilometers: number | null;

  notes: string | null;

  createdAt?: string;
}