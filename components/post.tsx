'use client';
import type {
  ContentBlock,
  ImageBlock,
  TextBlock,
  TumblrPost,
  VideoBlock,
} from '@/types/tumblr';
import { BlogInfo } from './blog-info';
import { ImageBlockComponent } from './image-block';
import { ImageCarousel } from './image-carousel';
import { TextBlockComponent } from './text-block';
import { VideoBlockComponent } from './video-block';

const isImageBlock = (block: ContentBlock): block is ImageBlock => {
  return block.type === 'image';
};

const isVideoBlock = (block: ContentBlock): block is VideoBlock => {
  return block.type === 'video';
};

const isTextBlock = (block: ContentBlock): block is TextBlock => {
  return block.type === 'text';
};

const getImageBlocks = (blocks: ContentBlock[]): ImageBlock[] => {
  return blocks.filter(isImageBlock);
};

const getVideoBlocks = (blocks: ContentBlock[]): VideoBlock[] => {
  return blocks.filter(isVideoBlock);
};

const getTextBlocks = (blocks: ContentBlock[]): TextBlock[] => {
  return blocks.filter(isTextBlock);
};

interface PostProps {
  post: TumblrPost;
}

export function Post({ post }: PostProps) {
  const mainImageBlocks = getImageBlocks(post.content);
  const mainVideoBlocks = getVideoBlocks(post.content);
  const mainTextBlocks = getTextBlocks(post.content);
  const trailImageBlocks =
    post.trail?.flatMap((trailItem) =>
      getImageBlocks(trailItem.content || [])
    ) || [];
  const trailVideoBlocks =
    post.trail?.flatMap((trailItem) =>
      getVideoBlocks(trailItem.content || [])
    ) || [];
  const trailTextBlocks =
    post.trail?.flatMap((trailItem) =>
      getTextBlocks(trailItem.content || [])
    ) || [];

  const allImageBlocks = [...mainImageBlocks, ...trailImageBlocks];

  return (
    <div className="flex flex-col gap-2">
      {/* Display main content images */}
      {mainImageBlocks.length > 1 ? (
        <ImageCarousel imageBlocks={mainImageBlocks} />
      ) : mainImageBlocks.length === 1 ? (
        <ImageBlockComponent block={mainImageBlocks[0]} />
      ) : null}

      {/* Display main content videos */}
      {mainVideoBlocks.map((block) => (
        <VideoBlockComponent key={`video-${block.type}`} block={block} />
      ))}

      {/* Display trail content images */}
      {trailImageBlocks.length > 1 ? (
        <ImageCarousel imageBlocks={trailImageBlocks} />
      ) : trailImageBlocks.length === 1 ? (
        <ImageBlockComponent block={trailImageBlocks[0]} />
      ) : null}

      {/* Display trail content videos */}
      {trailVideoBlocks.map((block) => (
        <VideoBlockComponent key={`trail-video-${block.type}`} block={block} />
      ))}

      {/* Display blog info */}
      <BlogInfo post={post} />

      {/* Display main content text */}
      {mainTextBlocks.map((block) => (
        <TextBlockComponent key={block.text} block={block} />
      ))}

      {/* Display trail content text */}
      {trailTextBlocks.map((block, index) => (
        <TextBlockComponent key={block.text} block={block} />
      ))}
    </div>
  );
}
