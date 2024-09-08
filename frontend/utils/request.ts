import { cookies } from 'next/headers';

export const postRequest = async (url: string, body: any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies().toString(),
    },
    body: new URLSearchParams(body).toString(),
  });
  return response.json();
};
