'use client';
import type { TextBlock } from '@/types/tumblr';
import type React from 'react';

interface TextBlockProps {
  block: TextBlock;
}

// Font for quirky
const quirkyFont = 'cursive';

function renderFormattedText(
  text: string,
  formatting?: TextBlock['formatting']
): React.ReactNode[] {
  if (!formatting || formatting.length === 0) return [text];
  // Sort by start, then by -end (so innermost first)
  const sorted = [...formatting].sort((a, b) =>
    a.start !== b.start ? a.start - b.start : b.end - a.end
  );
  // Recursively apply formatting
  function apply(
    start: number,
    end: number,
    formats: typeof sorted
  ): React.ReactNode[] {
    if (!formats.length) return [text.slice(start, end)];
    const [f, ...rest] = formats;
    if (f.start >= end || f.end <= start) {
      // No overlap
      return apply(start, end, rest);
    }
    const before = f.start > start ? apply(start, f.start, rest) : [];
    const inside = apply(Math.max(start, f.start), Math.min(end, f.end), rest);
    const after = f.end < end ? apply(f.end, end, rest) : [];
    let el: React.ReactNode = inside;
    switch (f.type) {
      case 'bold':
        el = <strong key={`b-${f.start}`}>{inside}</strong>;
        break;
      case 'italic':
        el = <em key={`i-${f.start}`}>{inside}</em>;
        break;
      case 'strikethrough':
        el = <s key={`s-${f.start}`}>{inside}</s>;
        break;
      case 'small':
        el = <small key={`sm-${f.start}`}>{inside}</small>;
        break;
      case 'link':
        el = (
          <a
            key={`l-${f.start}`}
            href={f.url}
            className="text-sky-800 underline hover:text-sky-950"
          >
            {inside}
          </a>
        );
        break;
      case 'mention':
        el = f.blog?.url ? (
          <a
            key={`m-${f.start}`}
            href={f.blog.url}
            className="text-sky-800 underline hover:text-sky-950"
          >
            {inside}
          </a>
        ) : (
          inside
        );
        break;
      case 'color':
        el = (
          <span key={`c-${f.start}`} style={{ color: f.hex }}>
            {inside}
          </span>
        );
        break;
      default:
        break;
    }
    return [...before, el, ...after];
  }
  return apply(0, text.length, sorted);
}

export function TextBlockComponent({ block }: TextBlockProps) {
  // Handle empty text blocks (skip rendering)
  if (!block.text) return null;

  // Handle subtypes
  switch (block.subtype) {
    case 'heading1':
      return (
        <h1 className="font-bold text-gray-800 text-xl tracking-tight">
          {renderFormattedText(block.text, block.formatting)}
        </h1>
      );
    case 'heading2':
      return (
        <h2 className="font-semibold text-gray-800 text-lg tracking-tight">
          {renderFormattedText(block.text, block.formatting)}
        </h2>
      );
    case 'quirky':
      return (
        <p className="text-2xl" style={{ fontFamily: quirkyFont }}>
          {renderFormattedText(block.text, block.formatting)}
        </p>
      );
    case 'quote':
      return (
        <blockquote className="border-gray-300 border-l-4 pl-4 font-serif text-lg italic">
          {renderFormattedText(block.text, block.formatting)}
        </blockquote>
      );
    case 'indented':
      return (
        <blockquote
          className={`pl-${(block.indent_level ?? 1) * 4} border-gray-200 border-l-2`}
        >
          {renderFormattedText(block.text, block.formatting)}
        </blockquote>
      );
    case 'chat':
      return (
        <p className="rounded-xl bg-sky-500 px-3 py-2 text-gray-50">
          {renderFormattedText(block.text, block.formatting)}
        </p>
      );
    case 'ordered-list-item':
    case 'unordered-list-item':
      // List items are handled in the parent component for proper nesting
      return (
        <li className={`ml-${(block.indent_level ?? 0) * 4}`}>
          {renderFormattedText(block.text, block.formatting)}
        </li>
      );
    default:
      return (
        <p className="text-pretty">
          {renderFormattedText(block.text, block.formatting)}
        </p>
      );
  }
}
