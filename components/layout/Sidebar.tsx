import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="px-8 py-8 border-b border-slate-800">
        <h1 className="text-2xl font-semibold tracking-wide text-white">
          Nautilus
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Operations
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">

        <Link
          href="/"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          Dashboard
        </Link>

        <Link
          href="/transfers"
          className="block rounded-lg bg-blue-600 px-4 py-3 text-white font-medium"
        >
          Transfers
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          Drivers
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          Vehicles
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          Partners
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          Reports
        </Link>

        <Link
          href="#"
          className="block rounded-lg px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          Settings
        </Link>

      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-6">
        <div className="text-sm text-slate-500">
          Nautilus Operations
        </div>

        <div className="text-xs text-slate-600 mt-1">
          Version 1.0
        </div>
      </div>
    </aside>
  );
}