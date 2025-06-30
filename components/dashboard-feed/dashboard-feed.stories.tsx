import type { TumblrPost } from '@/types/tumblr';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { DashboardFeed } from './dashboard-feed';

const meta: Meta<typeof DashboardFeed> = {
  title: 'Components/DashboardFeed',
  component: DashboardFeed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A component for displaying the dashboard feed.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost: TumblrPost = {
  id: 1,
  id_string: '1',
  blog: {
    uuid: 'blog-uuid',
    name: 'staff',
    url: 'https://staff.tumblr.com',
  },
  content: [
    {
      type: 'text',
      text: 'Hello from Storybook!',
    },
  ],
  liked: false,
  note_count: 0,
  post_url: 'https://demo.tumblr.com/post/1',
  reblog_key: 'reblog-key',
};

export const Default: Story = {
  args: {
    initialPosts: [mockPost],
  },
};
