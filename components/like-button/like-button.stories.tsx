import type { Meta, StoryObj } from '@storybook/nextjs';
import { LikeButton } from './like-button';

const meta: Meta<typeof LikeButton> = {
  title: 'Components/LikeButton',
  component: LikeButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A heart-shaped button component for liking posts. Supports both liked and unliked states with smooth animations and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isLiked: {
      control: { type: 'boolean' },
      description: 'Whether the post is currently liked by the user',
    },
    onClick: {
      action: 'clicked',
      description:
        'Callback function triggered when the like button is clicked',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for screen readers',
    },
  },
  args: {
    isLiked: false,
    'aria-label': 'Like Post',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
