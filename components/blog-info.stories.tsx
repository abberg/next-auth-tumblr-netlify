import type { Meta, StoryObj } from '@storybook/nextjs';
import { BlogInfo } from './blog-info';

const meta: Meta<typeof BlogInfo> = {
  title: 'Components/BlogInfo',
  component: BlogInfo,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    post: {
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost = {
  id: 123456789,
  id_string: '123456789',
  blog: {
    uuid: 'test-blog-uuid',
    name: 'Test Blog',
    url: 'https://testblog.tumblr.com',
  },
  content: [],
  note_count: 42,
  liked: false,
  reblog_key: 'test-reblog-key',
  post_url: 'https://testblog.tumblr.com/post/123456789',
};

export const Default: Story = {
  args: {
    post: mockPost,
  },
};

export const LongBlogName: Story = {
  args: {
    post: {
      ...mockPost,
      blog: {
        ...mockPost.blog,
        name: 'This is a very long blog name that might wrap to multiple lines',
      },
    },
  },
};

export const ShortBlogName: Story = {
  args: {
    post: {
      ...mockPost,
      blog: {
        ...mockPost.blog,
        name: 'Short',
      },
    },
  },
};
