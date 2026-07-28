import PageCard from "@/components/ui/PageCard";
import { useLookups } from "@/hooks/useLookups";
import { Transfer } from "@/types/transfer";

interface Props {
  transfer?: Transfer;
  onEdit?: (transfer: Transfer) => void;
}

export default function NextPickupCard({
  transfer,
  onEdit,
}: Props) {
  const {
    getDriverName,
    getVehicleName,
  } = useLookups();

  if (!transfer) {
    return (
      <PageCard className="p-6">
        <h2 className="text-xl font-semibold">
          Next Pickup
        </h2>

        <p className="mt-6 text-slate-500">
          No upcoming transfers.
        </p>
      </PageCard>
    );
  }

  return (
    <PageCard className="border-blue-200 bg-blue-50 p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            Next Pickup
          </p>

          <h2 className="mt-2 text-5xl font-bold text-blue-700">
            {transfer.time}
          </h2>

        </div>

        <button
          onClick={() => onEdit?.(transfer)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Edit
        </button>

      </div>

      <div className="mt-6 space-y-5">

        <div>
          <p className="text-sm text-slate-500">
            Client
          </p>

          <p className="text-2xl font-semibold">
            {transfer.clientName}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">
              Transfer Type
            </p>

            <p className="font-semibold">
              {transfer.transferType}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Flight
            </p>

            <p className="font-semibold">
              {transfer.flight || "-"}
            </p>
          </div>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Pickup
          </p>

          <p className="font-semibold">
            {transfer.pickup}
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Destination
          </p>

          <p className="font-semibold">
            {transfer.destination}
          </p>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">
              Driver
            </p>

            <p className="font-semibold">
              {getDriverName(transfer.driverId) || "Unassigned"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Vehicle
            </p>

            <p className="font-semibold">
              {getVehicleName(transfer.vehicleId) || "Unassigned"}
            </p>
          </div>

        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">
              Passengers
            </p>

            <p className="font-semibold">
              {transfer.adults} Adult{transfer.adults !== 1 ? "s" : ""}
              {transfer.children > 0 &&
                ` • ${transfer.children} Child${transfer.children !== 1 ? "ren" : ""}`}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Price
            </p>

            <p className="font-semibold">
              €{transfer.price.toFixed(2)}
            </p>
          </div>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            Guest Phone
          </p>

          <p className="font-semibold">
            {transfer.phone || "-"}
          </p>

        </div>

      </div>

    </PageCard>
  );
}