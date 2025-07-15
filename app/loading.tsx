import { CardSkeleton } from '@/components/card-skeleton';

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <ul className="my-6 ms-0 grid list-none grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {Array(6)
        .fill('')
        .map((_, index) => (
          <li
            key={`sketeton-${
              // biome-ignore lint/suspicious/noArrayIndexKey: index is consistent
              index
            }`}
          >
            <CardSkeleton />
          </li>
        ))}
    </ul>
  );
}
