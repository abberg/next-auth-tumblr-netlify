import type { Meta, StoryObj } from '@storybook/nextjs';

import { LoginBox } from './login-box';

const meta: Meta<typeof LoginBox> = {
  title: 'Components/LoginBox',
  component: LoginBox,
  tags: ['autodocs'],
  argTypes: {
    onAuthorize: {
      action: 'authorize',
      description: 'Callback fired when animation completes.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Animated login component that transitions into a skeleton dashboard preview before starting Tumblr authorization.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const NarrowViewport: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};
