interface Props {
    show: boolean;
    message: string;
  }
  
  export default function ConflictAlert({
    show,
    message,
  }: Props) {
    if (!show) return null;
  
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3">
  
        <div className="font-semibold text-red-700">
          Scheduling Conflict
        </div>
  
        <div className="mt-1 text-sm text-red-600">
          {message}
        </div>
  
      </div>
    );
  }