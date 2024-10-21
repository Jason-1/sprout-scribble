import { AlertCircle } from "lucide-react";

export const FormError = ({ message }: { message?: string }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-destructive/25 flex text-xs items-center my-2 gap-2 font-medium text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
