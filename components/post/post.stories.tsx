import type { Meta, StoryObj } from '@storybook/nextjs';
import { Post } from './post';

const meta: Meta<typeof Post> = {
  title: 'Components/Post',
  component: Post,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A component for displaying Tumblr posts with various content types including text, images, videos, audio, and links.',
      },
    },
  },
  argTypes: {
    post: {
      control: { type: 'object' },
      description:
        'The TumblrPost data containing content, blog info, and metadata',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TextPost: Story = {
  args: {
    post: {
      id: 123456789,
      id_string: '123456789',
      blog: {
        uuid: 'blog-uuid-1',
        name: 'exampleblog',
        url: 'https://exampleblog.tumblr.com',
      },
      content: [
        {
          type: 'text',
          text: 'This is a simple text post with some basic content.',
        },
        {
          type: 'text',
          text: 'Here is a second paragraph with more text content.',
          subtype: 'heading2',
        },
      ],
      layout: [],
      liked: false,
      note_count: 42,
      post_url: 'https://exampleblog.tumblr.com/post/123456789',
      reblog_key: 'reblog-key-1',
    },
  },
};

export const ImagePost: Story = {
  args: {
    post: {
      id: 123456790,
      id_string: '123456790',
      blog: {
        uuid: 'blog-uuid-2',
        name: 'photoblogger',
        url: 'https://photoblogger.tumblr.com',
      },
      content: [
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
          alt_text: 'A beautiful landscape photograph',
        },
      ],
      layout: [],
      liked: true,
      note_count: 128,
      post_url: 'https://photoblog.tumblr.com/post/123456790',
      reblog_key: 'reblog-key-2',
    },
  },
};

export const ImageCarouselPost: Story = {
  args: {
    post: {
      id: 123456791,
      id_string: '123456791',
      blog: {
        uuid: 'blog-uuid-3',
        name: 'galleryblog',
        url: 'https://galleryblog.tumblr.com',
      },
      content: [
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
          alt_text: 'First image in carousel',
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
          alt_text: 'Second image in carousel',
        },
        {
          type: 'image',
          media: [
            {
              url: 'https://picsum.photos/800/600?random=4',
              width: 800,
              height: 600,
              media_key: 'img4',
            },
          ],
          alt_text: 'Third image in carousel',
        },
      ],
      layout: [],
      liked: false,
      note_count: 256,
      post_url: 'https://galleryblog.tumblr.com/post/123456791',
      reblog_key: 'reblog-key-3',
    },
  },
};

export const MixedContentPost: Story = {
  args: {
    post: {
      id: 123456792,
      id_string: '123456792',
      blog: {
        uuid: 'blog-uuid-4',
        name: 'mixedblog',
        url: 'https://mixedblog.tumblr.com',
      },
      content: [
        {
          type: 'text',
          text: 'This is a mixed content post with multiple types of content.',
          subtype: 'heading1',
        },
        {
          type: 'image',
          media: [
            {
              url: 'https://picsum.photos/800/600?random=5',
              width: 800,
              height: 600,
              media_key: 'img5',
            },
          ],
          alt_text: 'An image in a mixed content post',
        },
        {
          type: 'text',
          text: 'Here is some text after the image with **bold formatting** and *italic text*.',
          formatting: [
            {
              start: 35,
              end: 50,
              type: 'bold',
            },
            {
              start: 55,
              end: 67,
              type: 'italic',
            },
          ],
        },
        {
          type: 'link',
          url: 'https://example.com',
          title: 'Example Website',
          description: 'This is an example website link',
          site_name: 'Example.com',
        },
      ],
      layout: [],
      liked: true,
      note_count: 89,
      post_url: 'https://mixedblog.tumblr.com/post/123456792',
      reblog_key: 'reblog-key-4',
    },
  },
};

export const RebloggedPost: Story = {
  args: {
    post: {
      id: 123456793,
      id_string: '123456793',
      blog: {
        uuid: 'blog-uuid-5',
        name: 'rebloggiest-reblogger',
        url: 'https://rebloggiest-reblogger.tumblr.com',
      },
      content: [
        {
          type: 'text',
          text: 'This is a reblogged post with trail content.',
        },
      ],
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
              subtype: 'quote',
            },
            {
              type: 'image',
              media: [
                {
                  url: 'https://picsum.photos/800/600?random=6',
                  width: 800,
                  height: 600,
                  media_key: 'img6',
                },
              ],
              alt_text: 'Original image from the reblogged post',
            },
          ],
          layout: [],
        },
      ],
      layout: [],
      liked: false,
      note_count: 156,
      post_url: 'https://reblogger.tumblr.com/post/123456793',
      reblog_key: 'reblog-key-5',
    },
  },
};

export const VideoPost: Story = {
  args: {
    post: {
      id: 123456794,
      id_string: '123456794',
      blog: {
        uuid: 'blog-uuid-6',
        name: 'my-video-link-blog',
        url: 'https://my-video-link-blog.tumblr.com',
      },
      content: [
        {
          type: 'video',
          provider: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          embed_html:
            '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315"></iframe>',
        },
        {
          type: 'text',
          text: 'Check out this amazing video!',
        },
      ],
      layout: [],
      liked: true,
      note_count: 73,
      post_url: 'https://videoblog.tumblr.com/post/123456794',
      reblog_key: 'reblog-key-6',
    },
  },
};

export const AudioPost: Story = {
  args: {
    post: {
      id: 123456795,
      id_string: '123456795',
      blog: {
        uuid: 'blog-uuid-7',
        name: 'audioblog',
        url: 'https://audioblog.tumblr.com',
      },
      content: [
        {
          type: 'audio',
          provider: 'spotify',
          url: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh',
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          album: 'A Night at the Opera',
        },
        {
          type: 'text',
          text: 'One of my favorite songs ever! 🎵',
        },
      ],
      layout: [],
      liked: false,
      note_count: 234,
      post_url: 'https://audioblog.tumblr.com/post/123456795',
      reblog_key: 'reblog-key-7',
    },
  },
};

export const LongTextPost: Story = {
  args: {
    post: {
      id: 123456796,
      id_string: '123456796',
      blog: {
        uuid: 'blog-uuid-8',
        name: 'writerblog',
        url: 'https://writerblog.tumblr.com',
      },
      content: [
        {
          type: 'text',
          text: 'This is a very long text post that demonstrates the scroll shadow box functionality.',
          subtype: 'heading1',
        },
        {
          type: 'text',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
          type: 'text',
          text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
          type: 'text',
          text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        },
        {
          type: 'text',
          text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
        },
        {
          type: 'text',
          text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
        },
      ],
      layout: [],
      liked: true,
      note_count: 45,
      post_url: 'https://writerblog.tumblr.com/post/123456796',
      reblog_key: 'reblog-key-8',
    },
  },
};
