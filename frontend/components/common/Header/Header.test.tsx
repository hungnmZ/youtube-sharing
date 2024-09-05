import React from 'react';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import Header from './Header';

jest.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid='user-button'>User Button</div>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />);

    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('YouTube Sharing')).toBeInTheDocument();
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });
});
