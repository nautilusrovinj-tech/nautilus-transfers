import AppLayout from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="text-slate-500 mt-2">
        Welcome to Nautilus Transfers.
      </p>
    </AppLayout>
  );
}