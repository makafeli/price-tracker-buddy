import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PriceCard } from '../PriceCard';

const mockData = {
  id: "test-1",
  tld: '.COM',
  date: '2024-03-20',
  oldPrice: 10,
  newPrice: 12,
  priceChange: 2,
  percentageChange: 20,
  domainCount: 1000,
  history: [],
  lastChecked: new Date().toISOString(),
  nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  sources: ["registry"]
};

describe('PriceCard', () => {
  const renderPriceCard = (data = mockData) => {
    return render(
      <BrowserRouter>
        <PriceCard data={data} />
      </BrowserRouter>
    );
  };

  it('renders price card with correct data', () => {
    renderPriceCard();
    expect(screen.getByText('.COM')).toBeInTheDocument();
    expect(screen.getByText('20.00%')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$12.00')).toBeInTheDocument();
  });

  it('displays correct price change indicators for price increase', () => {
    renderPriceCard();
    expect(screen.getByText('$2.00')).toBeInTheDocument();
    expect(screen.getByText('20.00%')).toHaveClass('text-danger');
  });

  it('displays correct domain count and additional revenue', () => {
    renderPriceCard();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
  });

  it('handles price decrease correctly', () => {
    const decreaseData = {
      ...mockData,
      newPrice: 8,
      priceChange: -2,
      percentageChange: -20
    };
    renderPriceCard(decreaseData);
    expect(screen.getByText('$2.00')).toBeInTheDocument();
    expect(screen.getByText('-20.00%')).toHaveClass('text-success');
  });
});