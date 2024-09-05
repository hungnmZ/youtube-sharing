import { displayTitleTime, secondsToTime } from './time';

describe('secondsToTime', () => {
  it('converts seconds to hours and minutes', () => {
    expect(secondsToTime(3600)).toEqual({ hours: 1, minutes: 0 });
    expect(secondsToTime(3661)).toEqual({ hours: 1, minutes: 1 });
    expect(secondsToTime(7200)).toEqual({ hours: 2, minutes: 0 });
  });
});

describe('displayTitleTime', () => {
  it('formats time for display', () => {
    expect(displayTitleTime(3600)).toBe('1h');
    expect(displayTitleTime(3660)).toBe('1h 1m');
    expect(displayTitleTime(7200)).toBe('2h');
    expect(displayTitleTime(1800)).toBe('30m');
  });
});
