import type { Meta, StoryObj } from '@storybook/nextjs';
import { ImageBlockComponent } from './image-block';

const meta: Meta<typeof ImageBlockComponent> = {
  title: 'Components/ImageBlock',
  component: ImageBlockComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A component for displaying an image block with optimal size selection and alt text support.',
      },
    },
  },
  argTypes: {
    block: {
      control: { type: 'object' },
      description:
        'The ImageBlock data containing media, alt text, and other properties',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Individual stories
export const SingleImage: Story = {
  args: {
    block: {
      type: 'image',
      media: [
        {
          url: 'https://picsum.photos/800/600',
          width: 800,
          height: 600,
        },
      ],
      alt_text: 'A beautiful landscape image',
    },
  },
};

export const MultipleSizes: Story = {
  args: {
    block: {
      type: 'image',
      media: [
        {
          url: 'https://picsum.photos/400/300',
          width: 400,
          height: 300,
        },
        {
          url: 'https://picsum.photos/640/480',
          width: 640,
          height: 480,
        },
        {
          url: 'https://picsum.photos/800/600',
          width: 800,
          height: 600,
        },
      ],
      alt_text:
        'Image with multiple size options - should select 640px version',
    },
  },
};

export const LargeImage: Story = {
  args: {
    block: {
      type: 'image',
      media: [
        {
          url: 'https://picsum.photos/1200/800',
          width: 1200,
          height: 800,
        },
      ],
      alt_text: 'Large image that will be scaled down',
    },
  },
};

export const SmallImage: Story = {
  args: {
    block: {
      type: 'image',
      media: [
        {
          url: 'https://picsum.photos/300/200',
          width: 300,
          height: 200,
        },
      ],
      alt_text: 'Small image that will be scaled up',
    },
  },
};

export const PortraitImage: Story = {
  args: {
    block: {
      type: 'image',
      media: [
        {
          url: 'https://picsum.photos/400/600',
          width: 400,
          height: 600,
        },
      ],
      alt_text: 'Portrait orientation image',
    },
  },
};

export const LandscapeImage: Story = {
  args: {
    block: {
      type: 'image',
      media: [
        {
          url: 'https://picsum.photos/800/400',
          width: 800,
          height: 400,
        },
      ],
      alt_text: 'Landscape orientation image',
    },
  },
};

export const SquareImage: Story = {
  args: {
    block: {
      type: 'image',
      media: [
        {
          url: 'https://picsum.photos/500/500',
          width: 500,
          height: 500,
        },
      ],
      alt_text: 'Square image',
    },
  },
};
