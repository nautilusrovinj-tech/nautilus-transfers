export default function Header() {
    return (
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Nautilus Transfers
          </h1>
        </div>
  
        <div className="flex items-center gap-4">
          <span className="text-slate-600">
            Welcome, Admin
          </span>
  
          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
            N
          </div>
        </div>
      </header>
    );
  }