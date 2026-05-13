import * as React from 'react';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

import DarkModeToggle from '@/components/common/DarkModeToggle';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className='sticky top-0 z-10 w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-5 md:px-10'>
      <div className='flex min-h-14 items-center gap-3 py-2'>
        <div className='flex min-w-0 flex-1 items-center'>
          <Link href='/home' className='shrink-0'>
            <Image
              className='mr-1 h-8 w-auto cursor-pointer'
              src='/images/logo-full.png'
              width={500}
              height={394}
              alt='logo'
            />
          </Link>
          <Link
            className='min-w-0 truncate text-lg font-extrabold text-foreground/80 transition-colors hover:text-foreground sm:text-2xl'
            href='/home'
          >
            YouTube Sharing
          </Link>
        </div>
        <div className='flex shrink-0 items-center justify-end gap-2 sm:gap-5'>
          <Link href='/share'>
            <Button variant='outline' size='sm' className='h-9 gap-1 px-2 sm:px-3'>
              <span className='sm:hidden'>Share</span>
              <span className='hidden sm:inline'>Share a video</span>
            </Button>
          </Link>
          <DarkModeToggle />
          <div className='h-7 w-7'>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
