import { displayTitleTime, secondsToTime } from '@/utils/time';

describe('secondsToTime', () => {
  it('converts seconds to hours and minutes', () => {
    expect(secondsToTime(3600)).toEqual({ hours: 1, minutes: 0 });
    expect(secondsToTime(3661)).toEqual({ hours: 1, minutes: 1 });
    expect(secondsToTime(7200)).toEqual({ hours: 2, minutes: 0 });
  });

  it('handles zero seconds', () => {
    expect(secondsToTime(0)).toEqual({ hours: 0, minutes: 0 });
  });

  it('handles large number of seconds', () => {
    expect(secondsToTime(86400)).toEqual({ hours: 24, minutes: 0 });
    expect(secondsToTime(86460)).toEqual({ hours: 24, minutes: 1 });
  });
});

describe('displayTitleTime', () => {
  it('formats time for display', () => {
    expect(displayTitleTime(3600)).toBe('1h');
    expect(displayTitleTime(3660)).toBe('1h 1m');
    expect(displayTitleTime(7200)).toBe('2h');
    expect(displayTitleTime(1800)).toBe('30m');
  });

  it('handles zero seconds', () => {
    expect(displayTitleTime(0)).toBe('0m');
  });

  it('handles only minutes', () => {
    expect(displayTitleTime(120)).toBe('2m');
  });

  it('handles large number of seconds', () => {
    expect(displayTitleTime(86400)).toBe('24h');
    expect(displayTitleTime(86460)).toBe('24h 1m');
  });
});
