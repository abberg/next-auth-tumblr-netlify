import type { Meta, StoryObj } from '@storybook/nextjs';
import { ScrollShadowBox } from './scroll-shadow-box';

const meta: Meta<typeof ScrollShadowBox> = {
  title: 'Components/ScrollShadowBox',
  component: ScrollShadowBox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    maxHeight: {
      control: { type: 'text' },
    },
    shadowHeight: {
      control: { type: 'number' },
    },
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
    maxHeight: '300px',
  },
};

export const CustomShadowHeight: Story = {
  args: {
    children: longContent,
    maxHeight: '300px',
    shadowHeight: 16,
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
    maxHeight: '300px',
  },
};

export const WithCustomStyling: Story = {
  args: {
    children: longContent,
    maxHeight: '400px',
    className: 'border border-gray-300 rounded-lg',
    style: { width: '400px' },
  },
};
