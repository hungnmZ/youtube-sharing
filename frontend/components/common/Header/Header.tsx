import * as React from 'react';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import DarkModeToggle from '@/components/common/DarkModeToggle';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className='sticky top-0 z-10 w-full border-b bg-background/95 px-5 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-10'>
      <div className='flex h-14 items-center'>
        <div className='mr-4 flex'>
          <Link href='/home'>
            <Image
              className='mr-1 h-8 w-auto cursor-pointer'
              src='/images/logo-full.png'
              width={500}
              height={394}
              alt='logo'
            />
          </Link>
          <Link
            className='flex items-center justify-center text-2xl font-extrabold tracking-tighter text-foreground/80 transition-colors hover:text-foreground'
            href='/home'
          >
            YouTube Sharing
          </Link>
        </div>
        <div className='flex flex-1 justify-end gap-5'>
          <Link href='/share'>
            <Button variant='outline' size='sm' className='gap-1'>
              Share a video
            </Button>
          </Link>
          <DarkModeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
