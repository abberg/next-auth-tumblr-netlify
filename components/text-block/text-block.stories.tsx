import type { Meta, StoryObj } from '@storybook/nextjs';
import { TextBlockComponent } from './text-block';

const meta: Meta<typeof TextBlockComponent> = {
  title: 'Components/TextBlock',
  component: TextBlockComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A component for displaying a text block with various subtypes and formatting options.',
      },
    },
  },
  argTypes: {
    block: {
      control: { type: 'object' },
      description: 'The TextBlock data containing text and formatting',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story showing all variations
export const AllVariations: Story = {
  render: () => (
    <div className="max-w-4xl space-y-6 p-6">
      <h1 className="mb-4 font-bold text-2xl">
        TextBlock Component - All Variations
      </h1>

      <section className="space-y-4">
        <h2 className="font-semibold text-xl">Basic Subtypes</h2>
        <div className="space-y-2">
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'Heading 1',
              subtype: 'heading1' as const,
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'Heading 2',
              subtype: 'heading2' as const,
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'Quirky text with cursive font',
              subtype: 'quirky' as const,
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This is a quote block with serif font and italic styling',
              subtype: 'quote' as const,
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This is an indented block with left border',
              subtype: 'indented' as const,
              indent_level: 1,
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This is a chat message with blue background',
              subtype: 'chat' as const,
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This is a default paragraph with text-pretty styling',
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-xl">Formatting Examples</h2>
        <div className="space-y-2">
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text has bold formatting',
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'bold',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text has italic formatting',
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'italic',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text has strikethrough formatting',
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'strikethrough',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text has small formatting',
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'small',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text contains a link',
              formatting: [
                {
                  start: 16,
                  end: 20,
                  type: 'link',
                  url: 'https://example.com',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text mentions @someblog',
              formatting: [
                {
                  start: 16,
                  end: 25,
                  type: 'mention',
                  blog: {
                    uuid: '123',
                    name: 'someblog',
                    url: 'https://someblog.tumblr.com',
                  },
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text has colored formatting',
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'color',
                  hex: '#ff0000',
                },
              ],
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold text-xl">Complex Examples</h2>
        <div className="space-y-2">
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text has bold, italic, and colored formatting',
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'bold',
                },
                {
                  start: 5,
                  end: 11,
                  type: 'italic',
                },
                {
                  start: 16,
                  end: 22,
                  type: 'color',
                  hex: '#00ff00',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This text has nested bold and italic formatting',
              formatting: [
                {
                  start: 0,
                  end: 8,
                  type: 'bold',
                },
                {
                  start: 5,
                  end: 8,
                  type: 'italic',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This is a complex text block with multiple formatting types including bold, italic, links, and colors',
              subtype: 'quote' as const,
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'bold',
                },
                {
                  start: 8,
                  end: 14,
                  type: 'italic',
                },
                {
                  start: 25,
                  end: 29,
                  type: 'link',
                  url: 'https://tumblr.com',
                },
                {
                  start: 35,
                  end: 40,
                  type: 'color',
                  hex: '#ff6b6b',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'This indented block has bold and italic formatting',
              subtype: 'indented' as const,
              indent_level: 2,
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'bold',
                },
                {
                  start: 5,
                  end: 11,
                  type: 'italic',
                },
              ],
            }}
          />
          <TextBlockComponent
            block={{
              type: 'text' as const,
              text: 'Chat message with bold and colored text',
              subtype: 'chat' as const,
              formatting: [
                {
                  start: 0,
                  end: 4,
                  type: 'bold',
                },
                {
                  start: 9,
                  end: 15,
                  type: 'color',
                  hex: '#ffff00',
                },
              ],
            }}
          />
        </div>
      </section>
    </div>
  ),
};

// Basic subtypes
export const Heading1: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'Heading 1',
      subtype: 'heading1' as const,
    },
  },
};

export const Heading2: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'Heading 2',
      subtype: 'heading2' as const,
    },
  },
};

export const Quirky: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'Quirky text with cursive font',
      subtype: 'quirky' as const,
    },
  },
};

export const Quote: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This is a quote block with serif font and italic styling',
      subtype: 'quote' as const,
    },
  },
};

export const Indented: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This is an indented block with left border',
      subtype: 'indented' as const,
      indent_level: 1,
    },
  },
};

export const Chat: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This is a chat message with blue background',
      subtype: 'chat' as const,
    },
  },
};

export const OrderedListItem: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'Ordered list item',
      subtype: 'ordered-list-item' as const,
    },
  },
};

export const UnorderedListItem: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'Unordered list item',
      subtype: 'unordered-list-item' as const,
    },
  },
};

export const DefaultParagraph: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This is a default paragraph with text-pretty styling',
    },
  },
};

// Formatting examples
export const BoldText: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text has bold formatting',
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'bold',
        },
      ],
    },
  },
};

export const ItalicText: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text has italic formatting',
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'italic',
        },
      ],
    },
  },
};

export const StrikethroughText: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text has strikethrough formatting',
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'strikethrough',
        },
      ],
    },
  },
};

export const SmallText: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text has small formatting',
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'small',
        },
      ],
    },
  },
};

export const LinkText: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text contains a link',
      formatting: [
        {
          start: 16,
          end: 20,
          type: 'link',
          url: 'https://example.com',
        },
      ],
    },
  },
};

export const MentionText: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text mentions @someblog',
      formatting: [
        {
          start: 16,
          end: 25,
          type: 'mention',
          blog: {
            uuid: '123',
            name: 'someblog',
            url: 'https://someblog.tumblr.com',
          },
        },
      ],
    },
  },
};

export const ColoredText: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text has colored formatting',
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'color',
          hex: '#ff0000',
        },
      ],
    },
  },
};

// Complex formatting examples
export const MultipleFormatting: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text has bold, italic, and colored formatting',
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'bold',
        },
        {
          start: 5,
          end: 11,
          type: 'italic',
        },
        {
          start: 16,
          end: 22,
          type: 'color',
          hex: '#00ff00',
        },
      ],
    },
  },
};

export const NestedFormatting: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This text has nested bold and italic formatting',
      formatting: [
        {
          start: 0,
          end: 8,
          type: 'bold',
        },
        {
          start: 5,
          end: 8,
          type: 'italic',
        },
      ],
    },
  },
};

export const ComplexTextBlock: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This is a complex text block with multiple formatting types including bold, italic, links, and colors',
      subtype: 'quote' as const,
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'bold',
        },
        {
          start: 8,
          end: 14,
          type: 'italic',
        },
        {
          start: 25,
          end: 29,
          type: 'link',
          url: 'https://tumblr.com',
        },
        {
          start: 35,
          end: 40,
          type: 'color',
          hex: '#ff6b6b',
        },
      ],
    },
  },
};

export const IndentedWithFormatting: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'This indented block has bold and italic formatting',
      subtype: 'indented' as const,
      indent_level: 2,
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'bold',
        },
        {
          start: 5,
          end: 11,
          type: 'italic',
        },
      ],
    },
  },
};

export const ChatWithFormatting: Story = {
  args: {
    block: {
      type: 'text' as const,
      text: 'Chat message with bold and colored text',
      subtype: 'chat' as const,
      formatting: [
        {
          start: 0,
          end: 4,
          type: 'bold',
        },
        {
          start: 9,
          end: 15,
          type: 'color',
          hex: '#ffff00',
        },
      ],
    },
  },
};
