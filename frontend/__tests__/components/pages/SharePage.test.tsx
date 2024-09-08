import React from 'react';
import { render } from '@testing-library/react';

import SharePage from '@/app/(main)/share/page';

jest.mock('@/components/common/Icons/HelloAnimation', () => ({
  __esModule: true,
  default: () => <div data-testid='hello-animation'>Hello Animation</div>,
}));

jest.mock('@/components/common/ShareGroup', () => ({
  __esModule: true,
  default: () => <div data-testid='share-group'>Share Group</div>,
}));

describe('SharePage', () => {
  it('renders HelloAnimation and ShareGroup components', async () => {
    const { getByTestId } = render(await SharePage());

    expect(getByTestId('hello-animation')).toBeInTheDocument();
    expect(getByTestId('share-group')).toBeInTheDocument();
  });

  it('applies correct classes to main container', async () => {
    const { container } = render(await SharePage());

    const mainElement = container.querySelector('main > div');
    expect(mainElement).toHaveClass(
      '-mt-14 flex h-dvh flex-col items-center justify-center pt-14',
    );
  });
});
