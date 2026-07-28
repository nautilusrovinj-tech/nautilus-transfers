import { Driver } from "@/types/driver";
import { Transfer } from "@/types/transfer";

function passengerCount(transfer: Transfer) {
  return (
    transfer.adults +
    transfer.children
  );
}

export function chooseBestDriver(
  transfer: Transfer,
  drivers: Driver[],
  todayTransfers: Transfer[]
): Driver | null {
  const candidates = drivers
    .filter((d) => d.active)
    .filter(
      (d) =>
        d.maxPassengers >=
        passengerCount(transfer)
    )
    .filter((driver) => {
      return !todayTransfers.some(
        (t) =>
          t.driverId === driver.id &&
          t.time === transfer.time &&
          t.date === transfer.date
      );
    });

  if (candidates.length === 0) {
    return null;
  }

  const scored = candidates.map((driver) => {
    const jobs = todayTransfers.filter(
      (t) => t.driverId === driver.id
    ).length;

    let score = 0;

    // Fewer jobs is better
    score += jobs * 10;

    // Lower priority number is better
    score += driver.priority;

    // Base location bonus
    const route = (
      transfer.pickup +
      " " +
      transfer.destination
    ).toLowerCase();

    if (
      driver.baseLocation &&
      route.includes(
        driver.baseLocation.toLowerCase()
      )
    ) {
      score -= 20;
    }

    return {
      driver,
      score,
    };
  });

  scored.sort(
    (a, b) => a.score - b.score
  );

  return scored[0].driver;
}