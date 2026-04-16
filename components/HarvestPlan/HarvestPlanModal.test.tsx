// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HarvestPlanModal } from './HarvestPlanModal';
import type { Holding, HarvestingResult } from '@/types';

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('@/lib/toastStore', () => ({
  toastStore: { show: vi.fn() },
}));

vi.mock('@/lib/exportHarvestPlan', () => ({
  toJSON: vi.fn(() => '{"mock":"json"}'),
  toCSV: vi.fn(() => 'mock,csv'),
  downloadCSV: vi.fn(),
}));

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: vi.fn().mockResolvedValue(undefined) },
  configurable: true,
  writable: true,
});

// ─── Fixtures ────────────────────────────────────────────────────────────────

const holding: Holding = {
  id: 'eth-0',
  coin: 'ETH',
  coinName: 'Ethereum',
  logo: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
  currentPrice: 216182,
  totalHolding: 0.0004211938732637162,
  averageBuyPrice: 3909.79,
  stcg: { balance: 0.0004211938732637162, gain: 89.41 },
  ltcg: { balance: 0, gain: 0 },
};

const result: HarvestingResult = {
  afterGains: {
    stcg: { profits: 70290.29, losses: 1548.53 },
    ltcg: { profits: 5020, losses: 3050 },
    totalCapitalGains: 70711.76,
  },
  savings: 500,
};

function renderModal(isOpen = true) {
  const onClose = vi.fn();
  render(
    <HarvestPlanModal
      isOpen={isOpen}
      onClose={onClose}
      selectedHoldings={[holding]}
      result={result}
    />
  );
  return { onClose };
}

// ─── Lifecycle ───────────────────────────────────────────────────────────────

beforeEach(() => { vi.clearAllMocks(); });
afterEach(() => { cleanup(); });

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('HarvestPlanModal', () => {
  it('renders the modal title when open', () => {
    renderModal(true);
    expect(screen.getByText('Your Harvest Plan')).toBeTruthy();
  });

  it('backdrop has pointer-events-none when closed', () => {
    renderModal(false);
    const backdrop = document.querySelector('div[aria-hidden="true"]');
    expect(backdrop?.className).toContain('pointer-events-none');
  });

  it('renders holding asset name in the table', () => {
    renderModal(true);
    const nodes = screen.getAllByText((_, el) => el?.textContent?.includes('Ethereum') ?? false);
    expect(nodes.length).toBeGreaterThan(0);
  });

  it('shows correct number of assets in summary card', () => {
    renderModal(true);
    expect(screen.getByText('Assets to Sell')).toBeTruthy();
    const card = screen.getByText('Assets to Sell').closest('div');
    expect(card?.textContent).toContain('1');
  });

  it('calls onClose when the close button is clicked', () => {
    const { onClose } = renderModal(true);
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    const { onClose } = renderModal(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls clipboard.writeText when Copy as JSON is clicked', async () => {
    renderModal(true);
    fireEvent.click(screen.getByText(/Copy as JSON/i));
    await Promise.resolve();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('{"mock":"json"}');
  });

  it('calls downloadCSV when Download CSV is clicked', async () => {
    const { downloadCSV } = await import('@/lib/exportHarvestPlan');
    renderModal(true);
    fireEvent.click(screen.getByText(/Download CSV/i));
    expect(downloadCSV).toHaveBeenCalled();
  });
});
