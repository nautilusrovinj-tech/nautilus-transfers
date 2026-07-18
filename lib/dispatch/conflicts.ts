import { Transfer } from "@/types/transfer";

const MIN_GAP_MINUTES = 60;

function toDateTime(transfer: Transfer) {
  return new Date(`${transfer.date}T${transfer.time}`);
}

export function checkDriverConflict(
  transfers: Transfer[],
  transferId: string,
  driverId: string,
  date: string,
  time: string
): Transfer | null {
  const newTransferTime = new Date(`${date}T${time}`);

  for (const transfer of transfers) {
    if (transfer.id === transferId) continue;

    if (transfer.status === "Cancelled") continue;
    if (transfer.status === "Completed") continue;

    if (transfer.driverId !== driverId) continue;

    const existingTime = toDateTime(transfer);

    const diffMinutes =
      Math.abs(
        existingTime.getTime() -
          newTransferTime.getTime()
      ) /
      1000 /
      60;

    if (diffMinutes < MIN_GAP_MINUTES) {
      return transfer;
    }
  }

  return null;
}

export function checkVehicleConflict(
  transfers: Transfer[],
  transferId: string,
  vehicleId: string,
  date: string,
  time: string
): Transfer | null {
  const newTransferTime = new Date(`${date}T${time}`);

  for (const transfer of transfers) {
    if (transfer.id === transferId) continue;

    if (transfer.status === "Cancelled") continue;
    if (transfer.status === "Completed") continue;

    if (transfer.vehicleId !== vehicleId) continue;

    const existingTime = toDateTime(transfer);

    const diffMinutes =
      Math.abs(
        existingTime.getTime() -
          newTransferTime.getTime()
      ) /
      1000 /
      60;

    if (diffMinutes < MIN_GAP_MINUTES) {
      return transfer;
    }
  }

  return null;
}

export function getDriverSchedule(
  transfers: Transfer[],
  driverId: string,
  date: string
) {
  return transfers
    .filter(
      (t) =>
        t.driverId === driverId &&
        t.date === date &&
        t.status !== "Cancelled"
    )
    .sort(
      (a, b) =>
        toDateTime(a).getTime() -
        toDateTime(b).getTime()
    );
}

export function getVehicleSchedule(
  transfers: Transfer[],
  vehicleId: string,
  date: string
) {
  return transfers
    .filter(
      (t) =>
        t.vehicleId === vehicleId &&
        t.date === date &&
        t.status !== "Cancelled"
    )
    .sort(
      (a, b) =>
        toDateTime(a).getTime() -
        toDateTime(b).getTime()
    );
}