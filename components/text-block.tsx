'use client';
import type { TextBlock } from '@/types/tumblr';

interface TextBlockProps {
  block: TextBlock;
}

const styles = {
  heading1: 'text-lg font-bold',
  chat: 'my-0.5 rounded-2xl bg-sky-500 px-3 py-1 text-white [&:nth-child(even)]:float-right [&:nth-child(odd)]:float-left',
  quote: `relative text-lg leading-5
  before:absolute before:-left-4 before:-top-8 before:z-[-1] before:text-6xl before:text-gray-200 before:content-['❝']
  after:absolute after:-right-4 after:-bottom-8 after:z-[-1] after:text-6xl after:text-gray-200 after:content-['❞']
  [&+p]:text-sm [&+p]:text-right [&+p]:text-gray-600 [&+p::before]:content['?']`,
};

export const TextBlockComponent = ({ block }: TextBlockProps) => {
  let formatted = block.text;
  if (block.formatting) {
    formatted = applyFormatting(formatted, block.formatting);
  }
  return (
    <p
      className={
        block.subtype ? styles[block.subtype as keyof typeof styles] : ''
      }
      // biome-ignore lint/security/noDangerouslySetInnerHtml: allow for tags in formatted strings
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
};

function applyFormatting(
  str: string,
  formatting: Array<{
    type: string;
    start: number;
    end: number;
    url?: string;
    hex?: string;
  }>
) {
  const arr = str.split('');
  const inserted = new Array(str.length + 1).fill(0);

  for (const f of formatting) {
    let openingTag = '';
    let closingTag = '';
    switch (f.type) {
      case 'bold':
        openingTag = '<strong>';
        closingTag = '</strong>';
        break;
      case 'color':
        openingTag = `<span style='color: ${f.hex}'>`;
        closingTag = '</span>';
        break;
      case 'link':
        openingTag = `<a href="${f.url}" class="text-sky-800 hover:text-sky-950 underline">`;
        closingTag = '</a>';
        break;
      case 'small':
        openingTag = '<small>';
        closingTag = '</small>';
        break;
      case 'strikethrough':
        openingTag = '<s>';
        closingTag = '</s>';
        break;
      case 'italic':
        openingTag = '<em>';
        closingTag = '</em>';
        break;
      default:
        continue;
    }
    let offset = 0;
    for (let i = 0; i <= f.start; i++) {
      offset += inserted[i];
    }
    arr.splice(f.end + offset, 0, closingTag);
    arr.splice(f.start + offset, 0, openingTag);
    inserted[f.start]++;
    inserted[f.end]++;
  }
  return arr.join('');
}
