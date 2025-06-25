# Storybook Setup

This project includes Storybook for component development and testing in a standalone environment.

## Getting Started

### Running Storybook

```bash
pnpm storybook
```

This will start Storybook on `http://localhost:6006`

### Building Storybook

```bash
pnpm build-storybook
```

This creates a static build of Storybook for deployment.

## Available Stories

### Components

- **PostToolbar** - The toolbar component for posts with like, unlike, and reblog functionality
  - Default state
  - Liked state
  - High note count
  - Zero notes

- **BlogInfo** - Component displaying blog information
  - Default state
  - Long blog name
  - Short blog name

- **ScrollShadowBox** - Scrollable container with shadow indicators
  - Default with long content
  - Custom shadow height
  - Short content (no scroll)
  - With custom styling

## Creating New Stories

To create a story for a new component:

1. Create a file named `[component-name].stories.tsx` in the `components/` directory
2. Import the component and Storybook types:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs';
import { YourComponent } from './your-component';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Define controls for your props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Your component props
  },
};
```

## Features

- **Component Isolation**: Test components in isolation without the full app context
- **Interactive Controls**: Adjust component props in real-time
- **Multiple States**: Show different component states and variations
- **Responsive Testing**: Test components at different viewport sizes
- **Accessibility Testing**: Built-in accessibility checks (when addons are configured)

## Configuration

Storybook is configured in `.storybook/main.ts` and `.storybook/preview.ts`:

- **main.ts**: Defines which stories to include and which addons to use
- **preview.ts**: Sets up global parameters and imports global styles

## Tips

- Use the `layout: 'centered'` parameter to center components in the preview
- Add `argTypes` to create interactive controls for your component props
- Use the `parameters` object to configure story-specific settings
- Import global styles in `preview.ts` to ensure components render correctly 