import type { Meta, StoryObj } from '@storybook/nextjs';
import { BlogInfo } from './blog-info';

const meta: Meta<typeof BlogInfo> = {
  title: 'Components/BlogInfo',
  component: BlogInfo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component that displays blog information including the blog name and URL. Used to show attribution for posts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    post: {
      control: { type: 'object' },
      description: 'The post object containing blog information',
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
  parameters: {
    docs: {
      description: {
        story: 'BlogInfo with a long blog name to test text wrapping behavior.',
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
  parameters: {
    docs: {
      description: {
        story: 'BlogInfo with a short blog name to test minimal text display.',
      },
    },
  },
};
