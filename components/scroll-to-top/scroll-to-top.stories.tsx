import type { Meta, StoryObj } from '@storybook/nextjs';
import { ScrollToTop } from './scroll-to-top';

const meta: Meta<typeof ScrollToTop> = {
  title: 'Components/ScrollToTop',
  component: ScrollToTop,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A scroll to top button that appears in the lower right corner after scrolling down.',
      },
    },
  },
  argTypes: {
    threshold: {
      control: { type: 'number' },
      description: 'Scroll threshold in pixels before button appears',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen">
        <div className="h-[200vh] bg-gradient-to-b from-blue-100 to-purple-100 p-8">
          <h1 className="mb-4 font-bold text-2xl">
            Scroll Down to See the Button
          </h1>
          <p className="mb-4">
            This is a long page to demonstrate the scroll to top functionality.
          </p>
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`section-${i + 1}`}
                className="rounded-lg bg-white p-4 shadow"
              >
                <h2 className="font-semibold text-lg">Section {i + 1}</h2>
                <p>
                  This is content for section {i + 1}. Scroll down to see the
                  scroll to top button appear.
                </p>
              </div>
            ))}
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    threshold: 300,
  },
};

export const LowThreshold: Story = {
  args: {
    threshold: 100,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Scroll to top button with a low threshold (100px) - appears quickly when scrolling.',
      },
    },
  },
};

export const HighThreshold: Story = {
  args: {
    threshold: 800,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Scroll to top button with a high threshold (800px) - appears only after scrolling further.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    threshold: 300,
    className: 'bg-red-600 hover:bg-red-700',
  },
  parameters: {
    docs: {
      description: {
        story: 'Scroll to top button with custom red styling.',
      },
    },
  },
};
