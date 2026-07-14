import { Button } from "@/components/ui/button";
import { Partner } from "@/types/partner";

interface Props {
  partners: Partner[];
  onDelete?: (id: string) => void;
  onEdit?: (partner: Partner) => void;
}

export default function PartnerTable({
  partners,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="p-4 text-left">Partner</th>
            <th className="p-4 text-left">Contact</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Commission</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {partners.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-6 text-center text-slate-500"
              >
                No partners found.
              </td>
            </tr>
          ) : (
            partners.map((partner) => (
              <tr
                key={partner.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-medium">
                  {partner.name}
                </td>

                <td className="p-4">
                  {partner.contactPerson || "-"}
                </td>

                <td className="p-4">
                  {partner.phone || "-"}
                </td>

                <td className="p-4">
                  {partner.commission}%
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      partner.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {partner.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit?.(partner)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete?.(partner.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}