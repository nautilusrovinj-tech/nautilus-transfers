import AppLayout from "@/components/layout/AppLayout";

export default function DriversPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          Drivers
        </h1>

        <p className="text-slate-500">
          Manage your drivers.
        </p>
      </div>
    </AppLayout>
  );
}