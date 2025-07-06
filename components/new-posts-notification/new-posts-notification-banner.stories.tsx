import type { Meta, StoryObj } from '@storybook/nextjs';
import { NewPostsNotificationBanner } from './new-posts-notification-banner';

const meta: Meta<typeof NewPostsNotificationBanner> = {
  title: 'Components/NewPostsNotificationBanner',
  component: NewPostsNotificationBanner,
  tags: ['autodocs'],
  argTypes: {
    newPostCount: {
      control: { type: 'number' },
      description: 'Number of new posts available',
    },
    isVisible: {
      control: { type: 'boolean' },
      description: 'Whether the notification is visible',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Whether the refresh button is loading',
    },
    onRefresh: { action: 'refresh clicked' },
  },
  args: {
    newPostCount: 2,
    isVisible: true,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A pure notification banner for new posts. Use this to preview all UI states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NewPostsNotificationBanner>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Hidden: Story = {
  args: {
    isVisible: false,
  },
};

export const SinglePost: Story = {
  args: {
    newPostCount: 1,
  },
};
