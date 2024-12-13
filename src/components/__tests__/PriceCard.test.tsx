import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PriceCard } from '../PriceCard';

const mockData = {
  tld: '.COM',
  date: '2024-03-20',
  oldPrice: 10,
  newPrice: 12,
  priceChange: 2,
  percentageChange: 20,
  domainCount: 1000
};

describe('PriceCard', () => {
  it('renders price card with correct data', () => {
    render(
      <BrowserRouter>
        <PriceCard data={mockData} />
      </BrowserRouter>
    );

    expect(screen.getByText('.COM')).toBeInTheDocument();
    expect(screen.getByText('20.00%')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('$12.00')).toBeInTheDocument();
  });
});