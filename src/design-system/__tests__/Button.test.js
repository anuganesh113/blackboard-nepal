/**
 * Button Component Unit Tests
 * 
 * Example test suite demonstrating how to test design system components.
 * In a real project, you would use Jest and React Testing Library.
 */

// Example test structure (commented out as this is a reference)

/*
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';
import { Plus } from 'lucide-react';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('renders button with variant', () => {
    const { container } = render(<Button variant="success">Add</Button>);
    expect(container.firstChild).toHaveClass('bg-gradient-to-r');
    expect(container.firstChild).toHaveClass('from-green-500');
  });

  test('renders button with icon', () => {
    render(<Button icon={<Plus />}>Add</Button>);
    const icon = screen.getByRole('button').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  test('applies size classes correctly', () => {
    const { container: sm } = render(<Button size="sm">Small</Button>);
    const { container: md } = render(<Button size="md">Medium</Button>);
    const { container: lg } = render(<Button size="lg">Large</Button>);

    expect(sm.firstChild).toHaveClass('px-4', 'py-2', 'text-sm');
    expect(md.firstChild).toHaveClass('px-6', 'py-3', 'text-base');
    expect(lg.firstChild).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  test('applies fullWidth class when fullWidth is true', () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    expect(container.firstChild).toHaveClass('w-full');
  });

  test('maintains backward compatibility with withSparkles prop', () => {
    // Should not throw error even though prop is deprecated
    const { container } = render(<Button withSparkles>Test</Button>);
    expect(container.firstChild).toBeInTheDocument();
    // Should not have sparkles icon
    expect(container.firstChild.querySelectorAll('.sparkles')).toHaveLength(0);
  });
});
*/

// Export test utilities
export const testUtils = {
  // Helper function to render button with all props
  renderButton: (props = {}) => {
    // Implementation would use React Testing Library
    return null;
  },
  
  // Helper to check variant classes
  hasVariantClasses: (element, variant) => {
    // Implementation would check for variant-specific classes
    return false;
  },
};

