
/**
 * Tests for the timeout utilities module
 * 
 * These tests verify that promise timeouts work correctly,
 * including both explicit and default timeout durations.
 */
import { createTimeoutPromise } from '../timeout-utils';

describe('Timeout Utils', () => {
  beforeEach(() => {
    // Use fake timers to control time in tests
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers after each test
    jest.useRealTimers();
  });

  it('should resolve after specified duration', async () => {
    const timeoutPromise = createTimeoutPromise(1000);
    const timeoutCallback = jest.fn();
    
    // Setup a promise that will catch the rejection
    const promiseResult = timeoutPromise.catch(timeoutCallback);
    
    // Fast-forward time - simulates waiting 1000ms
    jest.advanceTimersByTime(1000);
    
    // Wait for promises to resolve in the test environment
    await Promise.resolve();
    
    // Verify the timeout callback was called with the expected error
    expect(timeoutCallback).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Recipe generation timed out')
    }));
  });

  it('should use default duration if not specified', async () => {
    const timeoutPromise = createTimeoutPromise();
    const timeoutCallback = jest.fn();
    
    const promiseResult = timeoutPromise.catch(timeoutCallback);
    
    // Should use default of 90000ms (90 seconds)
    jest.advanceTimersByTime(89999);
    await Promise.resolve();
    // Verify callback hasn't been called yet (not timed out)
    expect(timeoutCallback).not.toHaveBeenCalled();
    
    // Advance one more millisecond to trigger timeout
    jest.advanceTimersByTime(1);
    await Promise.resolve();
    // Verify callback has been called now (timed out)
    expect(timeoutCallback).toHaveBeenCalled();
  });
});
