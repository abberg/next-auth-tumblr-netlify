import type { Meta, StoryObj } from '@storybook/nextjs';
import { ScrollShadowBox } from './scroll-shadow-box';

const meta: Meta<typeof ScrollShadowBox> = {
  title: 'Components/ScrollShadowBox',
  component: ScrollShadowBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A container component that adds scroll shadows to indicate when content is scrollable. Automatically shows/hides shadows based on scroll position.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxHeight: {
      control: { type: 'text' },
      description:
        'Maximum height of the container before scrolling is enabled',
    },
    shadowHeight: {
      control: { type: 'number' },
      description: 'Height of the shadow overlay in pixels',
    },
    children: {
      control: false,
      description:
        'The content to be displayed inside the scrollable container',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply to the container',
    },
    style: {
      control: { type: 'object' },
      description: 'Inline styles to apply to the container',
    },
  },
  args: {
    maxHeight: '300px',
    shadowHeight: 8,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const longContent = Array.from({ length: 20 }, (_, i) => (
  <div key={`content-item-${i + 1}`} className="border-gray-200 border-b p-4">
    Content item {i + 1} - This is some sample content to demonstrate scrolling
  </div>
));

export const Default: Story = {
  args: {
    children: longContent,
  },
};

export const CustomShadowHeight: Story = {
  args: {
    children: longContent,
    shadowHeight: 16,
  },
  parameters: {
    docs: {
      description: {
        story:
          'ScrollShadowBox with a custom shadow height for more prominent scroll indicators.',
      },
    },
  },
};

export const ShortContent: Story = {
  args: {
    children: (
      <div className="p-4">
        <p>This is short content that won't scroll.</p>
        <p>No shadows should appear.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "ScrollShadowBox with short content that doesn't require scrolling. No shadows should be visible.",
      },
    },
  },
};

export const WithCustomStyling: Story = {
  args: {
    children: longContent,
    maxHeight: '400px',
    className: 'border border-gray-300 rounded-lg',
    style: { width: '400px' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'ScrollShadowBox with custom styling including border, rounded corners, and custom width.',
      },
    },
  },
};
