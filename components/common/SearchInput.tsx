interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  
  export default function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
  }: SearchInputProps) {
    return (
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5"
      />
    );
  }