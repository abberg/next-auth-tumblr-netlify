import { render } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
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
        id: 12345,
        id_string: '12345',
        blog: { uuid: '', name: '', url: '' },
        content: [],
        note_count: 0,
        liked: false,
        post_url: '',
        reblog_key: '',
      },
    ];

    const { getByText } = render(<DashboardList posts={mockPosts} />);
    expect(getByText('root', { exact: false })).toBeInTheDocument();
  });
});
