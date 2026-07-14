import { Driver } from "@/types/driver";

interface Props {
  drivers: Driver[];
}

export default function DriverTable({ drivers }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Languages</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((driver) => (
            <tr
              key={driver.id}
              className="border-b hover:bg-slate-50"
            >
              <td className="p-4 font-medium">
                {driver.name}
              </td>

              <td className="p-4">
                {driver.phone}
              </td>

              <td className="p-4">
                {driver.email}
              </td>

              <td className="p-4">
                {driver.languages}
              </td>

              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    driver.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {driver.active ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}