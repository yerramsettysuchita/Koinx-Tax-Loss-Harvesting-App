'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PageTitle } from '@/components/PageTitle';
import { NoticeBanner } from '@/components/NoticeBanner';
import { GainsPanel } from '@/components/GainsPanel/GainsPanel';
import { HoldingsTable } from '@/components/HoldingsTable/HoldingsTable';
import { HarvestPlanButton } from '@/components/HarvestPlan/HarvestPlanButton';
import { HarvestPlanModal } from '@/components/HarvestPlan/HarvestPlanModal';
import { useHoldings } from '@/hooks/useHoldings';
import { useCapitalGains } from '@/hooks/useCapitalGains';
import { useHarvesting } from '@/hooks/useHarvesting';
import { usePersistedState } from '@/hooks/usePersistedState';
import { toastStore } from '@/lib/toastStore';

export default function TaxHarvestingPage() {
  const [selectedIds, setSelectedIds] = usePersistedState<string[]>(
    'koinx-harvesting-selected',
    []
  );
  const [modalOpen, setModalOpen] = useState(false);

  const { data: holdings, isLoading: holdingsLoading, error: holdingsError, refetch: refetchHoldings } = useHoldings();
  const { data: baseGains, isLoading: gainsLoading, error: gainsError, refetch: refetchGains } = useCapitalGains();

  const harvestingResult = useHarvesting(selectedIds, holdings, baseGains);

  const isLoading = holdingsLoading || gainsLoading;
  const error = holdingsError ?? gainsError;

  function handleToggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleToggleAll(ids: string[], allSelected: boolean) {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      toastStore.show('Selections cleared', 'info');
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...ids])]);
    }
  }

  function handleRetry() {
    refetchHoldings();
    refetchGains();
  }

  const selectedHoldings = holdings?.filter((h) => selectedIds.includes(h.id)) ?? [];

  return (
    <>
      <Header />
      <main className="max-w-300 mx-auto w-full px-4 sm:px-8 py-5 sm:py-7 space-y-5">
        <PageTitle />
        <NoticeBanner />
        <GainsPanel
          baseGains={baseGains}
          result={harvestingResult}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
        />
        <HoldingsTable
          holdings={holdings}
          isLoading={holdingsLoading}
          error={holdingsError}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
          onRetry={refetchHoldings}
        />
        <HarvestPlanButton
          disabled={selectedIds.length === 0}
          onClick={() => setModalOpen(true)}
        />
      </main>

      {harvestingResult && (
        <HarvestPlanModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedHoldings={selectedHoldings}
          result={harvestingResult}
        />
      )}
    </>
  );
}
