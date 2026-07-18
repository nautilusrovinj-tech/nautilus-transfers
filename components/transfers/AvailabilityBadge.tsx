interface Props {
    available: boolean;
    text?: string;
  }
  
  export default function AvailabilityBadge({
    available,
    text,
  }: Props) {
    return (
      <div
        className={`mt-2 flex items-center rounded-lg border px-3 py-2 text-sm font-medium ${
          available
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        <span
          className={`mr-2 h-2.5 w-2.5 rounded-full ${
            available
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />
  
        {available
          ? "Available"
          : text ?? "Unavailable"}
      </div>
    );
  }