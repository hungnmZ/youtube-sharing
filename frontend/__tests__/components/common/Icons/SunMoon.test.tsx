import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';

import SunMoon from '@/components/common/Icons/SunMoon/SunMoon';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    svg: 'svg',
    circle: 'circle',
    g: 'g',
  },
}));

describe('SunMoon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'light' });
    render(<SunMoon />);
    expect(screen.getByTestId('sun-moon-icon')).toBeInTheDocument();
  });

  it('renders in light mode', () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'light' });
    render(<SunMoon />);
    const svg = screen.getByTestId('sun-moon-icon');
    expect(svg).toHaveAttribute('animate', 'light');
  });

  it('renders in dark mode', () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'dark' });
    render(<SunMoon />);
    const svg = screen.getByTestId('sun-moon-icon');
    expect(svg).toHaveAttribute('animate', 'dark');
  });

  it('renders placeholder when not mounted', () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'light' });
    const { container } = render(<SunMoon />);
    // Simulate unmounted state
    (container.firstChild as HTMLElement).setAttribute('data-mounted', 'false');
    expect(container.firstChild).toHaveClass('h-5 w-5');
  });

  it('applies correct styles when mounted', () => {
    (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'light' });
    const { container } = render(<SunMoon />);
    expect(container.firstChild).toHaveClass('h-5 w-5');
    expect(container.firstChild).not.toHaveClass('text-foreground');
  });
});
