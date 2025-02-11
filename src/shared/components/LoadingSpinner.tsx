import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
  </div>
);