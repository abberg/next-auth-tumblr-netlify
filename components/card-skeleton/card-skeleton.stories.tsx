import type { Meta, StoryObj } from '@storybook/nextjs';
import { CardSkeleton } from './card-skeleton';

const meta: Meta<typeof CardSkeleton> = {
  title: 'Components/CardSkeleton',
  component: CardSkeleton,
  decorators: [
    (Story: React.FC) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CardSkeleton>;

export const Default: Story = {};
