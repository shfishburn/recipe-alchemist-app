
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FullScreenLoading } from '../FullScreenLoading';
import userEvent from '@testing-library/user-event';

describe('FullScreenLoading component', () => {
  it('should render loading animation when no error', () => {
    render(<FullScreenLoading />);
    
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
    expect(screen.queryByText(/Recipe Generation Failed/i)).not.toBeInTheDocument();
  });

  it('should render error state when error is provided', () => {
    render(<FullScreenLoading error="Something went wrong" />);
    
    expect(screen.getByText(/Recipe Generation Failed/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByTestId('loading-animation')).not.toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const mockCancel = jest.fn();
    render(<FullScreenLoading error="Error message" onCancel={mockCancel} />);

    await userEvent.click(screen.getByText(/Start Over/i));
    
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry when retry button is clicked', async () => {
    const mockRetry = jest.fn();
    render(<FullScreenLoading error="Error message" onRetry={mockRetry} />);

    await userEvent.click(screen.getByText(/Try Again/i));
    
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should show retry button as disabled when isRetrying is true', () => {
    render(
      <FullScreenLoading 
        error="Error message" 
        onRetry={() => {}} 
        isRetrying={true} 
      />
    );

    expect(screen.getByText(/Retrying/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retrying/i })).toBeDisabled();
  });

  it('should add overflow-hidden class to body', () => {
    render(<FullScreenLoading />);
    
    expect(document.body.classList.contains('overflow-hidden')).toBe(true);
  });

  it('should remove overflow-hidden class from body on unmount', () => {
    const { unmount } = render(<FullScreenLoading />);
    
    unmount();
    
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('should show timeout-specific tips when error includes timeout', () => {
    render(<FullScreenLoading error="Recipe generation timed out" />);
    
    expect(screen.getByText(/Tip for timeout errors/i)).toBeInTheDocument();
    expect(screen.getByText(/Try a simpler ingredient/i)).toBeInTheDocument();
  });

  it('should not show timeout-specific tips for other errors', () => {
    render(<FullScreenLoading error="Regular error" />);
    
    expect(screen.queryByText(/Tip for timeout errors/i)).not.toBeInTheDocument();
  });
});
