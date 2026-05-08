import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';

describe('HomePage Component', () => {
  it('should render main heading', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Cesta na závod?/)).toBeInTheDocument();
  });

  it('should render three value propositions', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Ekologie/)).toBeInTheDocument();
    expect(screen.getByText(/Komunita/)).toBeInTheDocument();
    expect(screen.getByText(/Úspora/)).toBeInTheDocument();
  });

  it('should render how it works section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getAllByText(/Jak to funguje?/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Najdi závod/)).toBeInTheDocument();
    expect(screen.getByText(/Domluv spolujízdu/)).toBeInTheDocument();
    expect(screen.getByText(/Běž a užij si to/)).toBeInTheDocument();
  });
});
