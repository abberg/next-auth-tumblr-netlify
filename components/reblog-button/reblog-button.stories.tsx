import type { Meta, StoryObj } from '@storybook/nextjs';
import { ReblogButton } from './reblog-button';

const meta: Meta<typeof ReblogButton> = {
  title: 'Components/ReblogButton',
  component: ReblogButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reblog button component for sharing posts. Features a circular arrow icon and supports custom accessibility labels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description:
        'Callback function triggered when the reblog button is clicked',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessibility label for screen readers',
    },
  },
  args: {
    'aria-label': 'Reblog Post',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
