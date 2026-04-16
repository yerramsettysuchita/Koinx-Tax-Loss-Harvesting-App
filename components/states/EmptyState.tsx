import { PackageOpen } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="py-14 flex flex-col items-center gap-3 text-center">
      <PackageOpen className="w-10 h-10 text-text-faint" strokeWidth={1.5} />
      <p className="text-sm font-semibold text-text">No holdings to harvest</p>
      <p className="text-xs text-text-mute max-w-xs">
        Your portfolio doesn&apos;t have any holdings yet. Holdings will appear here once data is
        available.
      </p>
    </div>
  );
}
