import PageCard from "@/components/ui/PageCard";
import { Transfer } from "@/types/transfer";

interface Props {
  transfers: Transfer[];
}

export default function AttentionPanel({
  transfers,
}: Props) {
  const noDriver = transfers.filter(
    (t) => !t.driverId
  );

  const noVehicle = transfers.filter(
    (t) => !t.vehicleId
  );

  const noPhone = transfers.filter(
    (t) => !t.phone
  );

  const upcoming = transfers.filter((t) => {
    if (!t.date || !t.time) return false;

    const transferTime = new Date(
      `${t.date}T${t.time}`
    );

    const now = new Date();

    const diff =
      (transferTime.getTime() -
        now.getTime()) /
      1000 /
      60;

    return diff >= 0 && diff <= 30;
  });

  return (
    <PageCard className="p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Needs Attention
      </h2>

      <div className="space-y-4">

        <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">
          <div>
            <p className="font-semibold text-slate-900">
              Unassigned Drivers
            </p>

            <p className="text-sm text-slate-500">
              Transfers waiting for driver
            </p>
          </div>

          <div className="text-3xl font-bold text-red-600">
            {noDriver.length}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4">
          <div>
            <p className="font-semibold text-slate-900">
              Unassigned Vehicles
            </p>

            <p className="text-sm text-slate-500">
              Transfers waiting for vehicle
            </p>
          </div>

          <div className="text-3xl font-bold text-orange-600">
            {noVehicle.length}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
          <div>
            <p className="font-semibold text-slate-900">
              Starting Soon
            </p>

            <p className="text-sm text-slate-500">
              Within next 30 minutes
            </p>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            {upcoming.length}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-yellow-50 p-4">
          <div>
            <p className="font-semibold text-slate-900">
              Missing Phone
            </p>

            <p className="text-sm text-slate-500">
              Guest phone missing
            </p>
          </div>

          <div className="text-3xl font-bold text-yellow-600">
            {noPhone.length}
          </div>
        </div>

      </div>

    </PageCard>
  );
}