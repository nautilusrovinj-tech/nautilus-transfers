"use client";

interface PriceRow {
  route: string;
  sedan: number;
  minivan: number;
}

interface PriceSectionProps {
  title: string;
  rows: PriceRow[];
}

function PriceSection({
  title,
  rows,
}: PriceSectionProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="grid grid-cols-[1fr_110px_110px] bg-slate-800 text-white">
        <div className="px-4 py-3 text-sm font-semibold uppercase tracking-wide">
          {title}
        </div>

        <div className="border-l border-slate-600 px-4 py-3 text-center text-sm font-semibold">
          Sedan
        </div>

        <div className="border-l border-slate-600 px-4 py-3 text-center text-sm font-semibold">
          Mini van
        </div>
      </div>

      {rows.map((row) => (
        <div
          key={row.route}
          className="grid grid-cols-[1fr_110px_110px] border-t border-slate-200 bg-white"
        >
          <div className="px-4 py-3 text-sm text-slate-700">
            {row.route}
          </div>

          <div className="border-l border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-900">
            {row.sedan} €
          </div>

          <div className="border-l border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-900">
            {row.minivan} €
          </div>
        </div>
      ))}
    </div>
  );
}

const rovinjPrices: PriceRow[] = [
  {
    route: "Rovinj - APT Pula",
    sedan: 70,
    minivan: 80,
  },
  {
    route: "Rovinj - APT Rijeka",
    sedan: 160,
    minivan: 175,
  },
  {
    route: "Rovinj - APT Trst",
    sedan: 160,
    minivan: 175,
  },
  {
    route: "Rovinj - APT Venecija",
    sedan: 330,
    minivan: 350,
  },
  {
    route: "Rovinj - APT Ljubljana",
    sedan: 240,
    minivan: 260,
  },
  {
    route: "Rovinj - APT Zagreb",
    sedan: 330,
    minivan: 350,
  },
];

const porecPrices: PriceRow[] = [
  {
    route: "Poreč - APT Pula",
    sedan: 85,
    minivan: 95,
  },
  {
    route: "Poreč - APT Rijeka",
    sedan: 160,
    minivan: 175,
  },
  {
    route: "Poreč - APT Trst",
    sedan: 160,
    minivan: 175,
  },
  {
    route: "Poreč - APT Venecija",
    sedan: 320,
    minivan: 340,
  },
  {
    route: "Poreč - APT Ljubljana",
    sedan: 230,
    minivan: 250,
  },
  {
    route: "Poreč - APT Zagreb",
    sedan: 320,
    minivan: 340,
  },
];

const pulaPrices: PriceRow[] = [
  {
    route: "APT Pula - Umag",
    sedan: 120,
    minivan: 135,
  },
  {
    route: "APT Pula - Opatija",
    sedan: 125,
    minivan: 145,
  },
  {
    route: "APT Pula - Trieste",
    sedan: 190,
    minivan: 210,
  },
  {
    route: "APT Pula - Ljubljana",
    sedan: 260,
    minivan: 280,
  },
  {
    route: "APT Pula - Zagreb / Venezia",
    sedan: 340,
    minivan: 360,
  },
];

const rabacPrices: PriceRow[] = [
  {
    route: "Rabac - APT Pula",
    sedan: 85,
    minivan: 95,
  },
  {
    route: "Rabac - APT Rijeka",
    sedan: 150,
    minivan: 175,
  },
];

const excursionPrices: PriceRow[] = [
  {
    route: "Up to 4 hours",
    sedan: 160,
    minivan: 180,
  },
  {
    route: "Up to 6 hours",
    sedan: 220,
    minivan: 240,
  },
  {
    route: "Up to 8 hours",
    sedan: 280,
    minivan: 300,
  },
];

export default function PriceList() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Nautilus Price List
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Transfers Pricelist 2026
            </p>
          </div>

          <div className="text-sm font-medium text-slate-500">
            Nautilus
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <PriceSection
          title="From Rovinj"
          rows={rovinjPrices}
        />

        <PriceSection
          title="From Poreč"
          rows={porecPrices}
        />

        <PriceSection
          title="From Pula"
          rows={pulaPrices}
        />

        <PriceSection
          title="From Rabac"
          rows={rabacPrices}
        />

        <PriceSection
          title="Excursion"
          rows={excursionPrices}
        />
      </div>
    </section>
  );
}