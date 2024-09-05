import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useTheme } from 'next-themes';

import DarkModeToggle from './DarkModeToggle';

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('DarkModeToggle', () => {
  it('toggles theme when clicked', () => {
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      resolvedTheme: 'light',
      setTheme: setThemeMock,
    });

    const { getByRole } = render(<DarkModeToggle />);
    const button = getByRole('button');

    fireEvent.click(button);

    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
