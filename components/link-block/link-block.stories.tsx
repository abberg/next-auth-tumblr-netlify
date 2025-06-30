import type { Meta, StoryObj } from '@storybook/nextjs';
import { LinkBlockComponent } from './link-block';

const meta: Meta<typeof LinkBlockComponent> = {
  title: 'Components/LinkBlock',
  component: LinkBlockComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A component for displaying a link block.',
      },
    },
  },
  argTypes: {
    block: {
      control: { type: 'object' },
      description:
        'The LinkBlock data containing link information and metadata',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockLinkBlock = {
  type: 'link' as const,
  url: 'https://en.wikipedia.org/wiki/Tumblr',
  title: 'Tumblr - Wikipedia',
  description: 'All about tumblr',
  author: 'oldmansounds',
  site_name: 'wikipedia.org',
  display_url: 'en.wikipedia.org',
  poster: [
    {
      url: 'https://64.media.tumblr.com/3610e523fd361e60057a694489bbf4ce/df430ecfe82f84d3-77/s540x810/07d3ad39077b47ac3d4d005a2b0ff0817abe5c9b.jpg',
      type: 'image/jpg',
      width: 413,
      height: 232,
    },
  ],
};

export const Default: Story = {
  args: {
    block: mockLinkBlock,
  },
};
