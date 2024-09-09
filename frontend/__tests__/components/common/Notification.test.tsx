import React from 'react';
import { render, screen } from '@testing-library/react';

import Notification from '@/components/common/Notification/Notification';

describe('Notification', () => {
  const mockProps = {
    toast: { visible: true },
    type: 'success' as const,
    title: 'Test Title',
    description: 'Test Description',
  };

  it('renders correctly with given props', () => {
    render(<Notification {...mockProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies correct animation class when visible', () => {
    const { container } = render(<Notification {...mockProps} />);
    expect(container.firstChild).toHaveClass('animate-in');
  });

  it('applies correct animation class when not visible', () => {
    const { container } = render(
      <Notification {...mockProps} toast={{ visible: false }} />,
    );
    expect(container.firstChild).toHaveClass('animate-out');
  });

  it('renders success icon for success type', () => {
    render(<Notification {...mockProps} />);
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
  });

  it('renders error icon for error type', () => {
    render(<Notification {...mockProps} type='error' />);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('renders info icon for info type', () => {
    render(<Notification {...mockProps} type='info' />);
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('renders warning icon for warning type', () => {
    render(<Notification {...mockProps} type='warning' />);
    expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
  });

  it('applies correct color to icon based on type', () => {
    const { rerender } = render(<Notification {...mockProps} />);
    expect(screen.getByTestId('success-icon')).toHaveClass('text-green-500');

    rerender(<Notification {...mockProps} type='error' />);
    expect(screen.getByTestId('error-icon')).toHaveClass('text-red-500');

    rerender(<Notification {...mockProps} type='info' />);
    expect(screen.getByTestId('info-icon')).toHaveClass('text-blue-500');

    rerender(<Notification {...mockProps} type='warning' />);
    expect(screen.getByTestId('warning-icon')).toHaveClass('text-yellow-500');
  });
});
