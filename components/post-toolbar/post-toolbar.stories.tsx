import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostToolbar } from './post-toolbar';

const meta: Meta<typeof PostToolbar> = {
  title: 'Components/PostToolbar',
  component: PostToolbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toolbar component that displays post actions including like, reblog, and note count. Provides interactive controls for post engagement.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '350px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    noteCount: {
      control: { type: 'number' },
      description: 'The number of notes (likes + reblogs) on the post',
    },
    liked: {
      control: { type: 'boolean' },
      description: 'Whether the current user has liked this post',
    },
    blogUuid: {
      control: { type: 'text' },
      description: 'The UUID of the blog that owns the post',
    },
    postId: {
      control: { type: 'text' },
      description: 'The ID of the post',
    },
    reblogKey: {
      control: { type: 'text' },
      description: 'The reblog key for the post',
    },
    postUrl: {
      control: { type: 'text' },
      description: 'The URL of the post',
    },
  },
  args: {
    blogUuid: 'test-blog-uuid',
    postId: '123456789',
    reblogKey: 'test-reblog-key',
    noteCount: 42,
    postUrl: 'https://example.tumblr.com/post/123456789',
    liked: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Liked: Story = {
  args: {
    liked: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'PostToolbar showing a post that has been liked by the current user.',
      },
    },
  },
};

export const HighNoteCount: Story = {
  args: {
    noteCount: 1234,
  },
  parameters: {
    docs: {
      description: {
        story: 'PostToolbar with a high note count to test number formatting.',
      },
    },
  },
};

export const ZeroNotes: Story = {
  args: {
    noteCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'PostToolbar with zero notes to test empty state display.',
      },
    },
  },
};
