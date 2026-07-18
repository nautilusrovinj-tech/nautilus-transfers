import Card from "@/components/ui/Card";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function TransferSection({
  title,
  children,
}: Props) {
  return (
    <Card title={title}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {children}
      </div>
    </Card>
  );
}