import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'next-themes';

import DarkModeToggle from '@/components/common/DarkModeToggle/DarkModeToggle';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('DarkModeToggle', () => {
  it('toggles theme from light to dark when clicked', async () => {
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: setThemeMock,
    });

    render(<DarkModeToggle />);
    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('toggles theme from dark to light when clicked', async () => {
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: setThemeMock,
    });

    render(<DarkModeToggle />);
    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('renders the SunMoon icon', () => {
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: jest.fn(),
    });

    render(<DarkModeToggle />);
    expect(screen.getByTestId('sun-moon-icon')).toBeInTheDocument();
  });

  it('applies correct styles to the button', () => {
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: jest.fn(),
    });

    render(<DarkModeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex h-8 w-8 items-center justify-center opacity-80 hover:opacity-100',
    );
  });
});
