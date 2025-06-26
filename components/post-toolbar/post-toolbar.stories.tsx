import type { Meta, StoryObj } from '@storybook/nextjs';
import { PostToolbar } from './post-toolbar';

const meta: Meta<typeof PostToolbar> = {
  title: 'Components/PostToolbar',
  component: PostToolbar,
  parameters: {
    layout: 'centered',
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
    },
    liked: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    blogUuid: 'test-blog-uuid',
    postId: '123456789',
    reblogKey: 'test-reblog-key',
    noteCount: 42,
    postUrl: 'https://example.tumblr.com/post/123456789',
    liked: false,
  },
};

export const Liked: Story = {
  args: {
    ...Default.args,
    liked: true,
  },
};

export const HighNoteCount: Story = {
  args: {
    ...Default.args,
    noteCount: 1234,
  },
};

export const ZeroNotes: Story = {
  args: {
    ...Default.args,
    noteCount: 0,
  },
};
