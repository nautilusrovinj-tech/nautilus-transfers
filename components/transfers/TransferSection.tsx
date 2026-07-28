import Card from "@/components/ui/Card";

interface Props {
  title: string;
  children: React.ReactNode;
  columns?: 1 | 2;
}

export default function TransferSection({
  title,
  children,
  columns = 2,
}: Props) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">

      <div className="mb-6 border-b border-slate-200 pb-4">

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

      </div>

      <div
        className={
          columns === 2
            ? "grid gap-6 md:grid-cols-2"
            : "space-y-6"
        }
      >
        {children}
      </div>

    </Card>
  );
}