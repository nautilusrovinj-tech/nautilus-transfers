import { Transfer } from "@/types/transfer";

export function hasDriverConflict(
  transfers: Transfer[],
  current: Transfer,
  driver: string
) {
  const currentTime = new Date(
    `${current.date}T${current.time}`
  ).getTime();

  return transfers.find((transfer) => {
    if (transfer.id === current.id) return false;

    if (transfer.driver !== driver) return false;

    if (transfer.date !== current.date) return false;

    const transferTime = new Date(
      `${transfer.date}T${transfer.time}`
    ).getTime();

    const minutes =
      Math.abs(currentTime - transferTime) / 60000;

    return minutes < 90;
  });
}