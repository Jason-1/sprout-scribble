'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="w-full min-h-full flex items-center justify-center flex-col">
      <h2>Something went wrong {error.message}</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
