import { Driver } from "@/types/driver";
import { Vehicle } from "@/types/vehicle";

interface Props {
  drivers: Driver[];
  vehicles: Vehicle[];
}

export default function AssignmentSuggestions({
  drivers,
  vehicles,
}: Props) {
  return (
    <div className="col-span-2 rounded-xl border border-blue-200 bg-blue-50 p-4">

      <h3 className="font-semibold text-blue-700">
        Suggested Resources
      </h3>

      <div className="mt-3 grid gap-2 md:grid-cols-2">

        <div>
          <div className="text-sm font-medium text-slate-600">
            Available Drivers
          </div>

          <ul className="mt-2 space-y-1 text-sm">
            {drivers.length === 0 ? (
              <li className="text-slate-500">
                None available
              </li>
            ) : (
              drivers.map((driver) => (
                <li key={driver.id}>
                  • {driver.name}
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium text-slate-600">
            Available Vehicles
          </div>

          <ul className="mt-2 space-y-1 text-sm">
            {vehicles.length === 0 ? (
              <li className="text-slate-500">
                None available
              </li>
            ) : (
              vehicles.map((vehicle) => (
                <li key={vehicle.id}>
                  • {vehicle.name}
                </li>
              ))
            )}
          </ul>
        </div>

      </div>

    </div>
  );
}