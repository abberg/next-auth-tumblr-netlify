import type { Meta, StoryObj } from '@storybook/nextjs';
import { DashboardList } from './dashboard-list';

const meta: Meta<typeof DashboardList> = {
  title: 'Components/DashboardList',
  component: DashboardList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A component for displaying a list in the dashboard.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
