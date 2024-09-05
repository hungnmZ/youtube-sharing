import * as React from 'react';

import styles from './HelloAnimation.module.css';

type HelloAnimationProps = {};

const HelloAnimation: React.FC<HelloAnimationProps> = () => {
  return (
    <div className={styles.helloParent}>
      <svg
        className={`${styles.helloWord} text-foreground`}
        width='365'
        height='365'
        viewBox='0 0 365 365'
      >
        <g id='H-letter'>
          <line
            className={styles.hLeftStroke}
            x1='17'
            y1='0'
            x2='17'
            y2='124'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
          <line
            className={styles.hMidStroke}
            x1='33'
            y1='62'
            x2='68'
            y2='62'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
          <line
            className={styles.hRightStroke}
            x1='84'
            y1='0'
            x2='84'
            y2='124'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
        </g>

        <g id='E-letter'>
          <line
            className={styles.eLeftStroke}
            x1='138'
            y1='0'
            x2='138'
            y2='124'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
          <line
            className={styles.eTopStroke}
            x1='154'
            y1='17'
            x2='201'
            y2='17'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
          <line
            className={styles.eMidStroke}
            x1='154'
            y1='62'
            x2='196'
            y2='62'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
          <line
            className={styles.eBottomStroke}
            x1='154'
            y1='107'
            x2='201'
            y2='107'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
        </g>

        <g id='L-one-letter'>
          <line
            className={styles.lOneLongStroke}
            x1='17'
            y1='153'
            x2='17'
            y2='277'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
          <line
            className={styles.lOneShortStroke}
            x1='33'
            y1='260'
            x2='77'
            y2='260'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
        </g>

        <g id='L-two-letter'>
          <line
            className={styles.lTwoLongStroke}
            x1='104'
            y1='153'
            x2='104'
            y2='277'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
          <line
            className={styles.lTwoShortStroke}
            x1='120'
            y1='260'
            x2='164'
            y2='260'
            stroke='currentColor'
            fill='none'
            strokeWidth='34'
          />
        </g>

        <g id='O-letter'>
          <circle
            className={styles.oStroke}
            cx='231'
            cy='215'
            r='48'
            stroke='currentColor'
            fill='none'
            strokeWidth='31'
          />
        </g>

        <g id='red-dot'>
          <line
            x1='325'
            y1='260'
            x2='325'
            y2='260'
            stroke='#FF5851'
            className={styles.redDot}
          />

          <line
            x1='325'
            y1='260'
            x2='325'
            y2='260'
            stroke='#FF5851'
            className={styles.redDot}
          />
        </g>
      </svg>
    </div>
  );
};

export default HelloAnimation;
