import React from 'react';
import { render } from '@testing-library/react';

import AuthProvider from '@/components/providers/AuthProvider';

import '@testing-library/jest-dom';

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='clerk-provider'>{children}</div>
  ),
}));

describe('AuthProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('wraps children with ClerkProvider', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <div>Test Child</div>
      </AuthProvider>,
    );
    expect(getByTestId('clerk-provider')).toBeInTheDocument();
  });
});
