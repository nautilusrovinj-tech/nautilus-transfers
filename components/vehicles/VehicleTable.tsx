import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicles: Vehicle[];
}

export default function VehicleTable({ vehicles }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">Vehicle</th>
            <th className="p-4 text-left">Registration</th>
            <th className="p-4 text-left">Seats</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-6 text-center text-slate-500"
              >
                No vehicles found.
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-medium">
                  {vehicle.name}
                </td>

                <td className="p-4">
                  {vehicle.registration}
                </td>

                <td className="p-4">
                  {vehicle.seats}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      vehicle.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {vehicle.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}