import { postRequest } from '@/utils/request';

// Mock the next/headers module
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    toString: () => 'mocked_cookie=123',
  })),
}));

global.fetch = jest.fn();

describe('postRequest', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('sends a POST request with correct headers and body', async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue({ data: 'test' }) };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = 'https://api.example.com/test';
    const body = { key: 'value' };
    const result = await postRequest(url, body);

    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'mocked_cookie=123',
      },
      body: 'key=value',
    });
    expect(result).toEqual({ data: 'test' });
  });

  it('throws an error when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const url = 'https://api.example.com/test';
    const body = { key: 'value' };

    await expect(postRequest(url, body)).rejects.toThrow('Network error');
  });

  it('returns error response when response is not ok', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({ error: 'Invalid data' }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const url = 'https://api.example.com/test';
    const body = { key: 'value' };

    const result = await postRequest(url, body);
    expect(result).toEqual({ error: 'Invalid data' });
  });
});
