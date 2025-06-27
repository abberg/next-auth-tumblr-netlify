import type { Meta, StoryObj } from '@storybook/nextjs';
import { ToastDemo } from './toast-demo';

const meta: Meta<typeof ToastDemo> = {
  title: 'Components/ToastDemo',
  component: ToastDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A demo component for customizing and testing toast notifications using Sonner. This component allows you to test different toast types and configurations in real-time.',
      },
    },
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'top-center',
        'bottom-center',
      ],
      description: 'Position of the toast notifications on the screen',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description: 'Theme for the toast notifications',
    },
    richColors: {
      control: { type: 'boolean' },
      description:
        'Enable rich colors for better visual distinction between toast types',
    },
    closeButton: {
      control: { type: 'boolean' },
      description: 'Show close button on toast notifications',
    },
    duration: {
      control: { type: 'range', min: 1000, max: 10000, step: 500 },
      description:
        'Duration in milliseconds before toast automatically disappears',
    },
  },
  args: {
    position: 'bottom-right',
    theme: 'light',
    richColors: false,
    closeButton: false,
    duration: 4000,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
