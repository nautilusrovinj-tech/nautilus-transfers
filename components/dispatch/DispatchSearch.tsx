"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DispatchSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search by client, flight, driver, partner..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}