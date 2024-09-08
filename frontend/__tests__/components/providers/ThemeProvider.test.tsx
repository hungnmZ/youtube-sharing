import React from 'react';
import { act, render } from '@testing-library/react';
import { useTheme } from 'next-themes';

import ThemeProvider from '@/components/providers/ThemeProvider/ThemeProvider';

// Mock the next-themes package
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: jest.fn().mockReturnValue({ setTheme: jest.fn() }),
}));

describe('ThemeProvider', () => {
  let matchMediaMock: jest.Mock;
  let addEventListenerMock: jest.Mock;
  let removeEventListenerMock: jest.Mock;

  beforeEach(() => {
    addEventListenerMock = jest.fn();
    removeEventListenerMock = jest.fn();
    matchMediaMock = jest.fn().mockReturnValue({
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });
    window.matchMedia = matchMediaMock;
  });

  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider>
        <div>Test Child</div>
      </ThemeProvider>,
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('sets up theme change detector', () => {
    const setThemeMock = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ setTheme: setThemeMock });

    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>,
    );

    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    // Simulate media query change
    act(() => {
      const changeHandler = addEventListenerMock.mock.calls[0][1];
      changeHandler();
    });

    expect(setThemeMock).toHaveBeenCalledWith('system');
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>,
    );

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
