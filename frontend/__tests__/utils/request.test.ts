import { getRequest, postRequest } from '@/utils/request';

// Mock the next/headers module
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    toString: () => 'mocked_cookie=123',
  })),
}));

global.fetch = jest.fn();

describe('request utils', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('postRequest', () => {
    it('sends a POST request with correct headers and body', async () => {
      const mockResponse = { json: jest.fn().mockResolvedValue({ data: 'test' }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const url = 'https://api.example.com/test';
      const body = { key: 'value' };
      const result = await postRequest(url, body);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: 'mocked_cookie=123',
        },
        body: JSON.stringify(body),
      });
      expect(result).toEqual({ data: 'test' });
    });

    it('handles fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const url = 'https://api.example.com/test';
      const body = { key: 'value' };
      const result = await postRequest(url, body);

      expect(result).toEqual({ status: 500, message: 'Internal Server Error' });
    });
  });

  describe('getRequest', () => {
    it('sends a GET request with correct headers', async () => {
      const mockResponse = { json: jest.fn().mockResolvedValue({ data: 'test' }) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const url = 'https://api.example.com/test';
      const result = await getRequest(url);

      expect(global.fetch).toHaveBeenCalledWith(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: 'mocked_cookie=123',
        },
      });
      expect(result).toEqual({ data: 'test' });
    });

    it('handles fetch errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const url = 'https://api.example.com/test';
      const result = await getRequest(url);

      expect(result).toEqual({ status: 500, message: 'Internal Server Error' });
    });
  });
});
