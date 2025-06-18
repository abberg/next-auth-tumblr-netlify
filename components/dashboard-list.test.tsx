import { describe, expect, it } from 'vitest';
import { render } from '../test/test-utils';
import { DashboardList } from './dashboard-list';

describe('DashboardList', () => {
  it('shows "No posts to display" when posts array is empty', () => {
    const { getByText } = render(<DashboardList posts={[]} />);
    expect(getByText('No posts to display')).toBeInTheDocument();
  });

  it('shows "No posts to display" when posts is undefined', () => {
    const { getByText } = render(<DashboardList />);
    expect(getByText('No posts to display')).toBeInTheDocument();
  });

  it('renders JSON tree when posts are provided', () => {
    const mockPosts = [
      {
        id: '12345',
        blog: { uuid: '', name: '', url: '' },
        content: [],
      },
    ];

    const { getByText } = render(<DashboardList posts={mockPosts} />);
    expect(getByText('root', { exact: false })).toBeInTheDocument();
  });
});
