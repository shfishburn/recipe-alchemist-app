
import { createTimeoutPromise } from '../timeout-utils';

describe('Timeout Utils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should resolve after specified duration', async () => {
    const timeoutPromise = createTimeoutPromise(1000);
    const timeoutCallback = jest.fn();
    
    // Setup a promise that will catch the rejection
    const promiseResult = timeoutPromise.catch(timeoutCallback);
    
    // Fast-forward time
    jest.advanceTimersByTime(1000);
    
    // Wait for promises to resolve
    await Promise.resolve();
    
    expect(timeoutCallback).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Recipe generation timed out')
    }));
  });

  it('should use default duration if not specified', async () => {
    const timeoutPromise = createTimeoutPromise();
    const timeoutCallback = jest.fn();
    
    const promiseResult = timeoutPromise.catch(timeoutCallback);
    
    // Should use default of 90000ms
    jest.advanceTimersByTime(89999);
    await Promise.resolve();
    expect(timeoutCallback).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(1);
    await Promise.resolve();
    expect(timeoutCallback).toHaveBeenCalled();
  });
});
