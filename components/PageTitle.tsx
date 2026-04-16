import { HowItWorksTooltip } from './HowItWorksTooltip';

export function PageTitle() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="text-2xl font-bold text-text tracking-tight">
        Tax Harvesting
      </h1>
      <HowItWorksTooltip />
    </div>
  );
}
