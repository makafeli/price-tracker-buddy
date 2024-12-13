import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('calls onSearch with input value when form is submitted', () => {
    const mockOnSearch = jest.fn();
    render(<Hero onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for a TLD (e.g., .com, .io)');
    const searchButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: '.com' } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('.com');
  });
});