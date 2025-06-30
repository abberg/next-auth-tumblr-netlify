import type { Meta, StoryObj } from '@storybook/nextjs';
import { BlogInfo } from './blog-info';

const meta: Meta<typeof BlogInfo> = {
  title: 'Components/BlogInfo',
  component: BlogInfo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component that displays blog information including the blog name and URL. Used to show attribution for posts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    post: {
      control: { type: 'object' },
      description: 'The post object containing blog information',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost = {
  id: 123456789,
  id_string: '123456789',
  blog: {
    uuid: 'test-blog-uuid',
    name: 'staff',
    url: 'https://staff.tumblr.com',
  },
  content: [],
  note_count: 42,
  liked: false,
  reblog_key: 'test-reblog-key',
  post_url:
    'https://staff.tumblr.com/post/769680688183164928/tumblr-theyre-here-communities-are-finally',
};

export const Default: Story = {
  args: {
    post: mockPost,
  },
};

export const LongBlogName: Story = {
  args: {
    post: {
      ...mockPost,
      blog: {
        ...mockPost.blog,
        name: 'yodawgiheardyoulikemecha',
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'BlogInfo with a long blog name to test text truncation behavior.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-60">
        <Story />
      </div>
    ),
  ],
};

export const RebloggedPost: Story = {
  args: {
    post: {
      ...mockPost,
      blog: {
        uuid: 'reblogger-uuid',
        name: 'rebloggiest-reblogger',
        url: 'https://rebloggiest-reblogger.tumblr.com',
      },
      trail: [
        {
          blog: {
            uuid: 'original-blog-uuid',
            name: 'originalblog',
            url: 'https://originalblog.tumblr.com',
          },
          content: [
            {
              type: 'text',
              text: 'This is the original content that was reblogged.',
            },
          ],
          layout: [],
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'BlogInfo showing a reblogged post with the original blog attribution and reblog icon.',
      },
    },
  },
};
