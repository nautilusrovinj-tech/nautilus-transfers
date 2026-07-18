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
    getPartnerName,
  } = useLookups();

  if (!transfer) {
    return (
      <PageCard className="p-6">
        <h2 className="text-xl font-semibold">
          Next Pickup
        </h2>

        <p className="mt-4 text-slate-500">
          No upcoming transfers.
        </p>
      </PageCard>
    );
  }

  return (
    <PageCard className="border-blue-200 bg-blue-50 p-6">
      <h2 className="mb-5 text-xl font-semibold">
        Next Pickup
      </h2>

      <div className="space-y-3">
        <div className="text-4xl font-bold text-blue-700">
          {transfer.time}
        </div>

        <div className="text-2xl font-semibold">
          {transfer.clientName}
        </div>

        <div>
          <span className="font-medium">
            Flight:
          </span>{" "}
          {transfer.flight || "-"}
        </div>

        <div>
          <span className="font-medium">
            From:
          </span>{" "}
          {transfer.pickup}
        </div>

        <div className="text-center text-slate-400">
          ↓
        </div>

        <div>
          <span className="font-medium">
            To:
          </span>{" "}
          {transfer.destination}
        </div>

        <hr className="my-4" />

        <div>
          <span className="font-medium">
            Passengers:
          </span>{" "}
          {transfer.adults} Adult
          {transfer.adults !== 1 ? "s" : ""}
          {transfer.children > 0 &&
            ` • ${transfer.children} Child${
              transfer.children !== 1
                ? "ren"
                : ""
            }`}
        </div>

        <div>
          <span className="font-medium">
            Driver:
          </span>{" "}
          {getDriverName(
            transfer.driverId
          ) || "-"}
        </div>

        <div>
          <span className="font-medium">
            Vehicle:
          </span>{" "}
          {getVehicleName(
            transfer.vehicleId
          ) || "-"}
        </div>

        <div>
          <span className="font-medium">
            Partner:
          </span>{" "}
          {getPartnerName(
            transfer.partnerId
          ) || "Direct"}
        </div>

        <div>
          <span className="font-medium">
            Price:
          </span>{" "}
          €{transfer.price.toFixed(2)}
        </div>

        <div>
          <span className="font-medium">
            Phone:
          </span>{" "}
          {transfer.phone || "-"}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => onEdit?.(transfer)}
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
        >
          Edit
        </button>

        <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          Complete
        </button>
      </div>
    </PageCard>
  );
}