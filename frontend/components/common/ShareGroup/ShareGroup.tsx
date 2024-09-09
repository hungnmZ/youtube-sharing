'use client';

import * as React from 'react';
import toast from 'react-hot-toast';
import { Loader2Icon, Share2Icon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { shareVideo } from '@/data/video';

import Notification from '../Notification';

const ShareGroup = () => {
  const [url, setUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const data = await shareVideo(url);
      if (data.status === 200) {
        toast.custom((t) => (
          <Notification
            toast={t}
            type='success'
            title='Video shared'
            description='Your video has been shared'
          />
        ));
        setUrl('');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('There was an error sharing the video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value.trim());
    validateYoutubeUrl(value.trim());
  };

  const validateYoutubeUrl = (url: string) => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setErrorMessage('Please enter a valid YouTube video URL');
    } else {
      setErrorMessage('');
    }
  };

  const extractVideoId = (url: string) => {
    const regExp =
      /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[&?].*)?$/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && url !== '' && errorMessage === '' && !isLoading) {
      handleShare();
    }
  };

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Input
          value={url}
          placeholder='Enter a YouTube video URL or a short video URL'
          className='h-11 w-96'
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
        />
        <Button
          size='lg'
          className='gap-1'
          onClick={handleShare}
          disabled={isLoading || errorMessage !== '' || url === ''}
        >
          {isLoading && (
            <Loader2Icon
              className='mr-2 h-4 w-4 animate-spin'
              data-testid='loader-icon'
            />
          )}
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
