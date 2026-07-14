interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  export default function SearchBar({
    value,
    onChange,
  }: SearchBarProps) {
    return (
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by transfer number, client, phone, flight..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }