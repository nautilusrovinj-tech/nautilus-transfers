export default function Sidebar() {
    return (
      <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">
          ⚓ Nautilus
        </h2>
  
        <nav className="space-y-3">
          <a href="#" className="block hover:text-blue-300">🏠 Dashboard</a>
          <a href="#" className="block hover:text-blue-300">🚐 Transfers</a>
          <a href="#" className="block hover:text-blue-300">👨 Drivers</a>
          <a href="#" className="block hover:text-blue-300">🚗 Vehicles</a>
          <a href="#" className="block hover:text-blue-300">🤝 Partners</a>
          <a href="#" className="block hover:text-blue-300">📊 Reports</a>
          <a href="#" className="block hover:text-blue-300">⚙️ Settings</a>
        </nav>
      </aside>
    );
  }