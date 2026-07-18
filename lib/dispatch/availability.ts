import { Transfer } from "@/types/transfer";

function minutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function isDriverAvailable(
  transfers: Transfer[],
  transfer: Transfer,
  driverId: string
) {
  return !transfers.some((t) => {
    if (t.id === transfer.id) return false;
    if (t.driverId !== driverId) return false;
    if (t.date !== transfer.date) return false;
    if (t.status === "Cancelled") return false;

    const diff = Math.abs(
      minutes(t.time) - minutes(transfer.time)
    );

    return diff < 90;
  });
}

export function isVehicleAvailable(
  transfers: Transfer[],
  transfer: Transfer,
  vehicleId: string
) {
  return !transfers.some((t) => {
    if (t.id === transfer.id) return false;
    if (t.vehicleId !== vehicleId) return false;
    if (t.date !== transfer.date) return false;
    if (t.status === "Cancelled") return false;

    const diff = Math.abs(
      minutes(t.time) - minutes(transfer.time)
    );

    return diff < 90;
  });
}