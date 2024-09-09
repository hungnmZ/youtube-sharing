import React from 'react';
import toast from 'react-hot-toast';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ShareGroup from '@/components/common/ShareGroup';
import { shareVideo } from '@/data/video';

jest.mock('react-hot-toast');
jest.mock('@/data/video');

describe('ShareGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input and share button', () => {
    render(<ShareGroup />);
    expect(
      screen.getByPlaceholderText('Enter a YouTube video URL or a short video URL'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('disables the share button when input is empty', () => {
    render(<ShareGroup />);
    expect(screen.getByRole('button', { name: /share/i })).toBeDisabled();
  });

  it('enables the share button when a valid URL is entered', async () => {
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(screen.getByRole('button', { name: /share/i })).toBeEnabled();
  });

  it('shows an error message for invalid YouTube URLs', async () => {
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.invalid-url.com');
    expect(
      screen.getByText('Please enter a valid YouTube video URL'),
    ).toBeInTheDocument();
  });

  it('clears the input and shows success notification on successful share', async () => {
    (shareVideo as jest.Mock).mockResolvedValue({ status: 200 });
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await userEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(input).toHaveValue('');
      expect(toast.custom).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('shows an error message when sharing fails', async () => {
    (shareVideo as jest.Mock).mockRejectedValue(new Error('Sharing failed'));
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await userEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(
        screen.getByText('There was an error sharing the video'),
      ).toBeInTheDocument();
    });
  });

  it('shows a loading indicator while sharing and enables button after completion', async () => {
    (shareVideo as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ status: 200 }), 1000)),
    );
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const shareButton = screen.getByRole('button', { name: /share/i });
    await userEvent.click(shareButton);

    expect(shareButton).toBeDisabled();
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
      },
      { timeout: 1000 },
    );

    await waitFor(
      () => {
        expect(shareButton).toBeDisabled();
      },
      { timeout: 1000 },
    );
  });

  describe('URL Validation', () => {
    const validURLs = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/v/dQw4w9WgXcQ',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'www.youtube.com/watch?v=dQw4w9WgXcQ',
      'youtube.com/watch?v=dQw4w9WgXcQ',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share',
    ];

    const invalidURLs = [
      'not a url',
      'https://www.example.com',
      'https://www.youtube.com',
      'https://www.youtube.com/watch?v=',
      'https://www.youtube.com/playlist?list=WL',
      'https://www.youtube.com/playlist?list=PLHEH4RHwXsbcMkh0hbGdfXOKricGlkTRy&jct=096XU7r9wUAIG19jyVKxeiclIBskOw',
      'https://youtu.be/ARnftey',
      'https://youtu.be/ARnfsdqweqweqwe',
      'https://www.youtube.com/shorts/ARnftey',
      'https://www.youtube.com/shorts/ARnfsdqweqweqwe',
      'https://www.youtube.com/channel/UCq-Fj5jknLsUf-MWSy4_brA',
      'https://www.youtube.com/c/YouTubeCreators',
      'https://www.youtube.com/user/YouTube',
    ];

    validURLs.forEach((url) => {
      it(`should accept valid YouTube URL: ${url}`, async () => {
        render(<ShareGroup />);
        const input = screen.getByPlaceholderText(
          'Enter a YouTube video URL or a short video URL',
        );
        await userEvent.type(input, url);
        expect(
          screen.queryByText('Please enter a valid YouTube video URL'),
        ).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /share/i })).toBeEnabled();
      });
    });

    invalidURLs.forEach((url) => {
      it(`should reject invalid YouTube URL: ${url}`, async () => {
        render(<ShareGroup />);
        const input = screen.getByPlaceholderText(
          'Enter a YouTube video URL or a short video URL',
        );
        await userEvent.type(input, url);
        expect(
          screen.getByText('Please enter a valid YouTube video URL'),
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /share/i })).toBeDisabled();
      });
    });
  });

  it('handles pasting a URL', async () => {
    const user = userEvent.setup();
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );

    await user.click(input);
    await user.paste('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: /share/i })).toBeEnabled();
      },
      { timeout: 1000 },
    ); // Increase timeout if necessary
  });

  it('trims whitespace from input', async () => {
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, '  https://www.youtube.com/watch?v=dQw4w9WgXcQ  ');
    expect(input).toHaveValue('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });

  it('triggers share when Enter key is pressed with valid input', async () => {
    (shareVideo as jest.Mock).mockResolvedValue({ status: 200 });
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(shareVideo).toHaveBeenCalledWith(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      );
      expect(input).toHaveValue('');
      expect(toast.custom).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it('does not trigger share when Enter key is pressed with invalid input', async () => {
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.invalid-url.com');
    await userEvent.keyboard('{Enter}');

    expect(shareVideo).not.toHaveBeenCalled();
    expect(
      screen.getByText('Please enter a valid YouTube video URL'),
    ).toBeInTheDocument();
  });

  it('does not trigger share when Enter key is pressed while loading', async () => {
    (shareVideo as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ status: 200 }), 1000)),
    );
    render(<ShareGroup />);
    const input = screen.getByPlaceholderText(
      'Enter a YouTube video URL or a short video URL',
    );
    await userEvent.type(input, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    await userEvent.click(screen.getByRole('button', { name: /share/i }));

    // Try to trigger share again while loading
    await userEvent.keyboard('{Enter}');

    expect(shareVideo).toHaveBeenCalledTimes(1); // Should only be called once
  });
});
