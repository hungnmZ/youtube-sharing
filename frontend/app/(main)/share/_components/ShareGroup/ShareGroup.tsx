'use client';

import * as React from 'react';
import { Loader2Icon, Share2Icon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ShareGroup = () => {
  const [url, setUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleShare = async () => {
    setIsLoading(true);
    // await share(url);
    setIsLoading(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    validateYoutubeUrl(value);
  };

  const validateYoutubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      setErrorMessage('Please enter a valid YouTube video URL');
    } else {
      setErrorMessage('');
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input
          value={url}
          placeholder='Enter YouTube video URL'
          className='h-11 w-96'
          onChange={handleOnChange}
        />
        <Button size='lg' className='gap-1' onClick={handleShare} disabled={isLoading}>
          {isLoading && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
          Share <Share2Icon size={16} />
        </Button>
      </div>
      {errorMessage && (
        <Alert variant='destructive'>
          <AlertTitle>Oops!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ShareGroup;
