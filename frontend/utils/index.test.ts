import { debounce, range } from './index';

describe('range function', () => {
  it('should generate a range of numbers', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(0, 3)).toEqual([0, 1, 2]);
    expect(range(1, 5, 2)).toEqual([1, 3]);
    expect(range(1, 2, 2)).toEqual([1]);
  });
});

describe('debounce function', () => {
  jest.useFakeTimers();

  it('should debounce a function call', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(func).toHaveBeenCalledTimes(1);
  });
});
