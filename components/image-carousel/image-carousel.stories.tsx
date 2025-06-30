import type { Meta, StoryObj } from '@storybook/nextjs';
import { ImageCarousel } from './image-carousel';

const meta: Meta<typeof ImageCarousel> = {
  title: 'Components/ImageCarousel',
  component: ImageCarousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A component for displaying an image carousel with navigation dots.',
      },
    },
  },
  argTypes: {
    imageBlocks: {
      control: { type: 'object' },
      description: 'Array of ImageBlock data to display in the carousel',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageBlocks: [
      {
        type: 'image',
        media: [
          {
            url: 'https://picsum.photos/800/600?random=1',
            width: 800,
            height: 600,
            media_key: 'img1',
          },
        ],
        alt_text: 'First carousel image - beautiful landscape',
      },
      {
        type: 'image',
        media: [
          {
            url: 'https://picsum.photos/800/600?random=2',
            width: 800,
            height: 600,
            media_key: 'img2',
          },
        ],
        alt_text: 'Second carousel image - city skyline',
      },
      {
        type: 'image',
        media: [
          {
            url: 'https://picsum.photos/800/600?random=3',
            width: 800,
            height: 600,
            media_key: 'img3',
          },
        ],
        alt_text: 'Third carousel image - nature scene',
      },
    ],
  },
};
