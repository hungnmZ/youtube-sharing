import * as React from 'react';

import styles from './HelloAnimation.module.css';

const HelloAnimation: React.FC = () => {
  return (
    <div className={styles.stage} aria-hidden='true'>
      <svg
        className={styles.scene}
        width='420'
        height='300'
        viewBox='0 0 420 300'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g className={styles.shareLines}>
          <path d='M210 154 C153 116 105 101 66 89' />
          <path d='M210 154 C279 103 333 77 377 62' />
          <path d='M210 154 C275 190 325 213 366 244' />
        </g>

        <g className={`${styles.node} ${styles.nodeLeft}`}>
          <circle cx='63' cy='88' r='18' />
          <path d='M55 88 L69 80 L69 96 Z' />
        </g>
        <g className={`${styles.node} ${styles.nodeTop}`}>
          <circle cx='376' cy='62' r='18' />
          <path d='M368 62 L382 54 L382 70 Z' />
        </g>
        <g className={`${styles.node} ${styles.nodeBottom}`}>
          <circle cx='366' cy='244' r='18' />
          <path d='M358 244 L372 236 L372 252 Z' />
        </g>

        <g className={styles.videoCard}>
          <rect x='126' y='82' width='168' height='116' rx='18' />
          <rect
            className={styles.thumbnail}
            x='140'
            y='96'
            width='140'
            height='74'
            rx='12'
          />
          <path className={styles.play} d='M196 116 L196 150 L228 133 Z' />
          <rect className={styles.metaOne} x='146' y='180' width='74' height='8' rx='4' />
          <rect className={styles.metaTwo} x='229' y='180' width='42' height='8' rx='4' />
        </g>

        <g className={`${styles.clip} ${styles.clipOne}`}>
          <rect x='0' y='0' width='54' height='36' rx='8' />
          <path d='M22 11 L22 25 L35 18 Z' />
        </g>
        <g className={`${styles.clip} ${styles.clipTwo}`}>
          <rect x='0' y='0' width='50' height='34' rx='8' />
          <path d='M20 10 L20 24 L33 17 Z' />
        </g>
        <g className={`${styles.clip} ${styles.clipThree}`}>
          <rect x='0' y='0' width='48' height='32' rx='8' />
          <path d='M19 10 L19 22 L31 16 Z' />
        </g>

        <g className={styles.sparkles}>
          <circle cx='112' cy='49' r='4' />
          <circle cx='318' cy='134' r='3.5' />
          <circle cx='88' cy='213' r='3' />
          <circle cx='334' cy='34' r='3' />
          <path d='M108 147 L116 147 M112 143 L112 151' />
          <path d='M316 220 L324 220 M320 216 L320 224' />
        </g>
      </svg>
    </div>
  );
};

export default HelloAnimation;
