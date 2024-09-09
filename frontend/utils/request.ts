import { cookies } from 'next/headers';

export const postRequest = async (url: string, body: Record<string, any>) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString(),
      },
      body: JSON.stringify(body),
    });

    return response.json();
  } catch (error) {
    console.error(error);
    return { status: 500, message: 'Internal Server Error' };
  }
};

export const getRequest = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookies().toString(),
      },
    });

    return response.json();
  } catch (error) {
    console.error(error);
    return { status: 500, message: 'Internal Server Error' };
  }
};
