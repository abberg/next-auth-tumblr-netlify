import type { AudioBlock } from '@/types/tumblr';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { AudioBlockComponent } from './audio-block';

const meta: Meta<typeof AudioBlockComponent> = {
  title: 'Components/AudioBlock',
  component: AudioBlockComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A component for displaying audio content with poster image, controls, and metadata.',
      },
    },
  },
  argTypes: {
    block: {
      control: { type: 'object' },
      description:
        'The AudioBlock data containing audio information, poster, and metadata',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const tumblrAudioBlock: AudioBlock = {
  type: 'audio',
  provider: 'tumblr',
  url: 'https://64.media.tumblr.com/f6dde419c8e200fd547df90373baa197/e7de94fa818529f9-2f/5f5b251d036ae43d8e23784f56e065d3a37a4ac7.mp3',
  title: 'My test track',
  artist: 'Test Artist',
  album: 'Test Album',
  media: {
    media_key: 'f6dde419c8e200fd547df90373baa197:36053d71bb351c04-4e',
    type: 'audio/mpeg',
    url: 'https://64.media.tumblr.com/f6dde419c8e200fd547df90373baa197/36053d71bb351c04-4e/7f6b0e3f9463a16294df22373bb2120cb21548bc.mp3',
  },
  poster: [
    {
      media_key: '1f8c15d6217822770af6e2252aca0394:36053d71bb351c04-bf',
      type: 'image/jpeg',
      width: 259,
      height: 194,
      url: 'https://64.media.tumblr.com/1f8c15d6217822770af6e2252aca0394/36053d71bb351c04-bf/s400x600/e6025277779d1fc3f8b0ea6a18763350b745c698.jpg',
    },
  ],
};

export const Default: Story = {
  args: {
    block: tumblrAudioBlock,
  },
};

const spotifyAudioBlock: AudioBlock = {
  type: 'audio',
  provider: 'spotify',
  url: 'https://open.spotify.com/track/37nNeCuAmklq4CrZBn6z0q',
  title: 'WHERE WERE YOU',
  artist: 'VIER',
  album: 'WHERE WERE YOU',
  embed_url:
    'https://open.spotify.com/embed?uri=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F37nNeCuAmklq4CrZBn6z0q&amp;view=coverart',
  embed_html:
    '<iframe class="spotify_audio_player" src="https://open.spotify.com/embed?uri=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F37nNeCuAmklq4CrZBn6z0q&amp;view=coverart" frameborder="0" allowtransparency="true" width="500" height="580"></iframe>',
  poster: [
    {
      media_key: '93a74a44dcd8c92a3a8ad117950d794e:9e3e827f63803c2a-2d',
      type: 'image/jpeg',
      width: 640,
      height: 640,
      url: 'https://64.media.tumblr.com/93a74a44dcd8c92a3a8ad117950d794e/9e3e827f63803c2a-2d/s640x960/db49c02245b805dcb73a68a5a598cb8f4fb50c8c.jpg',
    },
  ],
  metadata: {
    id: 'spotify:track:37nNeCuAmklq4CrZBn6z0q',
  },
  attribution: {
    type: 'app',
    app_name: 'Spotify',
    url: 'https://open.spotify.com/track/37nNeCuAmklq4CrZBn6z0q',
    logo: {
      url: 'https://static.tumblr.com/620021e3d68993e56aadd0b7719f987d/k3htaqs/irQnz1ujc/tumblr_static_spotify-logo_64.png',
      type: 'image/png',
      width: 64,
      height: 64,
    },
    display_text: 'Listen on Spotify',
  },
};

export const Spotify: Story = {
  args: {
    block: spotifyAudioBlock,
  },
};

const soundcloudAudioBlock: AudioBlock = {
  type: 'audio',
  provider: 'soundcloud',
  url: 'https://soundcloud.com/szababy2/kill-bill',
  title: 'Kill Bill',
  embed_url:
    'https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fszababy2%2Fkill-bill&amp;visual=true&amp;liking=false&amp;sharing=false&amp;auto_play=false&amp;show_comments=false&amp;continuous_play=false&amp;origin=tumblr',
  embed_html:
    '<iframe src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1396880485&amp;visual=true&amp;liking=false&amp;sharing=false&amp;auto_play=false&amp;show_comments=false&amp;continuous_play=false&amp;origin=tumblr" frameborder="0" allowtransparency="true" class="soundcloud_audio_player" width="540" height="540"></iframe>',
  media: {
    url: 'https://api.soundcloud.com/tracks/1396880485/stream?client_id=N2eHz8D7GtXSl6fTtcGHdSJiS74xqOUI',
  },
  poster: [
    {
      url: 'https://64.media.tumblr.com/tumblr_rnva88hR6N1zj7mqn_1672677514_cover.jpg',
      type: 'image/jpeg',
      width: 500,
      height: 500,
    },
  ],
  attribution: {
    type: 'app',
    app_name: 'SoundCloud',
    url: 'https://soundcloud.com/szababy2/kill-bill',
    logo: {
      url: 'https://static.tumblr.com/f92f127280909cfd34d802e241dfef3f/iebsmgz/lIVnsx8an/tumblr_static_soundcloud_logo.png',
      type: 'image/png',
      width: 128,
      height: 128,
    },
    display_text: 'Listen on',
  },
};

export const SoundCloud: Story = {
  args: {
    block: soundcloudAudioBlock,
  },
};

const bandcampAudioBlock: AudioBlock = {
  type: 'audio',
  provider: 'bandcamp',
  url: 'https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=1665553001&ts=1672677204&t=ba3b769818b5faab7c5c25b59b612e5c0032d4dc',
  title: 'Dance Forever',
  artist: 'Hudson Mohawke',
  album: 'Cry Sugar',
  embed_url:
    'https://bandcamp.com/EmbeddedPlayer/size=medium/bgcol=ffffff/linkcol=0687f5/notracklist=true/transparent=true/album=2136517966/',
  embed_html:
    '<iframe class="bandcamp_audio_player" width="100%" height="120" src="https://bandcamp.com/EmbeddedPlayer/size=medium/bgcol=ffffff/linkcol=0687f5/notracklist=true/transparent=true/album=2136517966/" allowtransparency="true" frameborder="0"></iframe>',
  media: {
    url: 'https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=1665553001&ts=1750860068&t=3f20fe1336b12d7f482f71b0eaf4e14a9d3dc054',
  },
  poster: [
    {
      url: 'https://64.media.tumblr.com/tumblr_rnv9zo5Fo01zj7mqn_1672677204_cover.jpg',
      type: 'image/jpeg',
      width: 500,
      height: 500,
    },
  ],
  attribution: {
    type: 'app',
    app_name: 'Bandcamp',
    url: 'https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=1665553001&ts=1672677204&t=ba3b769818b5faab7c5c25b59b612e5c0032d4dc',
    display_text: 'Listen on Bandcamp',
  },
};

export const Bandcamp: Story = {
  args: {
    block: bandcampAudioBlock,
  },
};
