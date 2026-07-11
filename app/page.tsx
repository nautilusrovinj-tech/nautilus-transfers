import AppLayout from "@/components/layout/AppLayout";
import StatsCard from "@/components/dashboard/StatsCard";

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-slate-500">
            Welcome back.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <StatsCard
            title="Today's Transfers"
            value="0"
          />

          <StatsCard
            title="Revenue Today"
            value="€0"
          />

          <StatsCard
            title="Drivers"
            value="0"
          />

        </div>

      </div>
    </AppLayout>
  );
}