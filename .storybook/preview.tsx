import { TumblrActionsProvider } from '@/components/tumblr-actions';
import type { Preview } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import '../app/globals.css';

// Stories never talk to Tumblr: components get fakes that resolve immediately
// and show up in the Actions panel.
const tumblrActions = {
  fetchDashboard: fn(async () => []).mockName('fetchDashboard'),
  likePost: fn(async () => ({})).mockName('likePost'),
  unlikePost: fn(async () => ({})).mockName('unlikePost'),
  reblogPost: fn(async () => ({})).mockName('reblogPost'),
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <TumblrActionsProvider actions={tumblrActions}>
        <Story />
      </TumblrActionsProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },

    layout: 'centered',

    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
      },
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
      ],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
