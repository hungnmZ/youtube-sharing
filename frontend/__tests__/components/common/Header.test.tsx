import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';

import Header from '@/components/common/Header/Header';

jest.mock('@clerk/nextjs', () => ({
  UserButton: () => <div data-testid='user-button'>User Button</div>,
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme: jest.fn() });
  });

  it('renders the logo and navigation links', () => {
    render(<Header />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByText('YouTube Sharing')).toBeInTheDocument();
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });

  it('renders the "Share a video" button', () => {
    render(<Header />);
    const shareButton = screen.getByRole('link', { name: /share a video/i });
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute('href', '/share');
  });

  it('renders the dark mode toggle', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument();
  });

  it('applies correct styles to header', () => {
    const { container } = render(<Header />);
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass('sticky top-0 z-10 w-full border-b bg-background/95');
  });

  it('renders logo with correct attributes', () => {
    render(<Header />);
    const logo = screen.getByAltText('logo') as HTMLImageElement;
    expect(logo).toHaveAttribute('src', '/images/logo-full.png');
    expect(logo).toHaveAttribute('width', '500');
    expect(logo).toHaveAttribute('height', '394');
  });

  it('has correct link for logo and title', () => {
    render(<Header />);
    const logoLink = screen.getByRole('link', { name: /logo/i });
    const titleLink = screen.getByRole('link', { name: /youtube sharing/i });
    expect(logoLink).toHaveAttribute('href', '/home');
    expect(titleLink).toHaveAttribute('href', '/home');
  });
});
