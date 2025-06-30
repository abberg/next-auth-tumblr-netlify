import type { Meta, StoryObj } from '@storybook/nextjs';
import { VideoBlockComponent } from './video-block';

const meta: Meta<typeof VideoBlockComponent> = {
  title: 'Components/VideoBlock',
  component: VideoBlockComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A component for displaying a video block.',
      },
    },
  },
  argTypes: {
    block: {
      control: { type: 'object' },
      description:
        'The VideoBlock data containing video information, embed HTML, and metadata',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const vimeoBlock = {
  type: 'video' as const,
  provider: 'vimeo',
  video_type: 'vimeo',
  embed_html: `<iframe src="https://player.vimeo.com/video/120454782?title=0&amp;byline=0&amp;portrait=0&amp;app_id=122963" width="500" height="281" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" title="Ryoji Ikeda : test pattern [100m version], 2013"></iframe>`,
  thumbnail_url:
    'https://i.vimeocdn.com/video/508302748-40bf057598937218bd51d61a5283b6f250c19709a93c2678496846728d6f40f5-d_295x166?region=us',
  thumbnail_width: 295,
  thumbnail_height: 166,
  caption: `<p><a href="https://www.tumblr.com/oldmansounds/701406629448564736/test-pattern" class="tumblr_blog">oldmansounds</a>:</p>\n<blockquote><p>Test pattern</p></blockquote>`,
  permalink_url: 'https://vimeo.com/120454782',
  html5_capable: true,
};

const youtubeBlock = {
  type: 'video' as const,
  provider: 'youtube',
  video_type: 'youtube',
  embed_html: `<iframe width="500" height="281"  id="youtube_iframe" src="https://www.youtube.com/embed/S7SLep244ss?feature=oembed&amp;enablejsapi=1&amp;origin=https://safe.txmblr.com&amp;wmode=opaque" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="🔝 4K Test pattern UHD 2160p - 30 min. Test Card Calibration Video. TV test video 4k"></iframe>`,
  thumbnail_url: 'https://i.ytimg.com/vi/S7SLep244ss/hqdefault.jpg',
  thumbnail_width: 480,
  thumbnail_height: 360,
  caption: `<p><a href="https://www.tumblr.com/oldmansounds/705382634017144832/via-4k-test-pattern-uhd-2160p-30-min-test" class="tumblr_blog">oldmansounds</a>:</p>\n<blockquote><p>(via <a href="https://www.youtube.com/watch?v=S7SLep244ss">🔝 4K Test pattern UHD 2160p - 30 min. Test Card Calibration Video. TV test video 4k - YouTube</a>) </p></blockquote>`,
  permalink_url: 'https://www.youtube.com/watch?v=S7SLep244ss',
  html5_capable: true,
};

const tumblrBlock = {
  type: 'video' as const,
  provider: 'tumblr',
  video_type: 'tumblr',
  embed_html: `<video  id='embed-685fff615975d828344018' class='crt-video crt-skin-default' width='500' height='281' poster='https://64.media.tumblr.com/tumblr_rnvwcprrro1zj7mqn_smart1.jpg' preload='none' muted data-crt-video data-crt-options='{"autoheight":null,"duration":16,"hdUrl":false,"filmstrip":{"url":"https://64.media.tumblr.com/previews/tumblr_rnvwcprrro1zj7mqn_filmstrip.jpg","width":"200","height":"112"}}' crossOrigin='anonymous' controls>\n    <source src="https://va.media.tumblr.com/tumblr_rnvwcprrro1zj7mqn.mp4" type="video/mp4">\n</video>`,
  thumbnail_url:
    'https://64.media.tumblr.com/tumblr_rnvwcprrro1zj7mqn_frame1.jpg',
  thumbnail_width: 640,
  thumbnail_height: 360,
  caption: `<p><a href="https://www.tumblr.com/oldmansounds/705383667530383360/test-video" class="tumblr_blog">oldmansounds</a>:</p>\n<blockquote><p>Test video</p></blockquote>`,
  permalink_url:
    'https://deckardisareplicant.tumblr.com/post/787606378128801792/oldmansounds-test-video',
  html5_capable: true,
};

export const Default: Story = {
  args: {
    block: tumblrBlock,
  },
};

export const YouTube: Story = {
  args: {
    block: youtubeBlock,
  },
};

export const Vimeo: Story = {
  args: {
    block: vimeoBlock,
  },
};
