import * as React from 'react';
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon, XCircleIcon } from 'lucide-react';

type NotificationProps = {
  toast: {
    visible: boolean;
  };
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description: string;
};

const Notification: React.FC<NotificationProps> = (props) => {
  const { toast, type, title, description } = props;
  return (
    <div
      className={`${
        toast.visible ? 'animate-enter' : 'animate-leave'
      } pointer-events-auto flex w-full max-w-sm rounded-lg bg-background/95 p-3 shadow-lg ring-1 ring-black ring-opacity-5 dark:border`}
    >
      <div className='flex items-center justify-center'>
        {type === 'success' && (
          <CheckCircleIcon
            className='h-10 w-10 text-green-500'
            data-testid='success-icon'
          />
        )}
        {type === 'error' && (
          <XCircleIcon className='h-10 w-10 text-red-500' data-testid='error-icon' />
        )}
        {type === 'info' && (
          <InfoIcon className='h-10 w-10 text-blue-500' data-testid='info-icon' />
        )}
        {type === 'warning' && (
          <AlertTriangleIcon
            className='h-10 w-10 text-yellow-500'
            data-testid='warning-icon'
          />
        )}
        <div className='ml-3 flex-1'>
          <p className='text-sm font-medium text-foreground/90'>{title}</p>
          <p className='mt-1 text-sm text-foreground/75'>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
