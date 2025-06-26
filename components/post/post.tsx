'use client';
import { AudioBlockComponent } from '@/components/audio-block';
import { BlogInfo } from '@/components/blog-info';
import { ImageBlockComponent } from '@/components/image-block';
import { ImageCarousel } from '@/components/image-carousel';
import { LinkBlockComponent } from '@/components/link-block';
import { PostToolbar } from '@/components/post-toolbar';
import { ScrollShadowBox } from '@/components/scroll-shadow-box';
import { TextBlockComponent } from '@/components/text-block';
import { VideoBlockComponent } from '@/components/video-block';
import type {
  AudioBlock,
  ContentBlock,
  ImageBlock,
  LinkBlock,
  TextBlock,
  TumblrPost,
  VideoBlock,
} from '@/types/tumblr';

const isImageBlock = (block: ContentBlock): block is ImageBlock => {
  return block.type === 'image';
};

const isVideoBlock = (block: ContentBlock): block is VideoBlock => {
  return block.type === 'video';
};

const isTextBlock = (block: ContentBlock): block is TextBlock => {
  return block.type === 'text';
};

const isAudioBlock = (block: ContentBlock): block is AudioBlock => {
  return block.type === 'audio';
};

const isLinkBlock = (block: ContentBlock): block is LinkBlock => {
  return block.type === 'link';
};

const getImageBlocks = (blocks: ContentBlock[]): ImageBlock[] => {
  return blocks.filter(isImageBlock);
};

const getVideoBlocks = (blocks: ContentBlock[]): VideoBlock[] => {
  return blocks.filter(isVideoBlock);
};

const getAudioBlocks = (blocks: ContentBlock[]): AudioBlock[] => {
  return blocks.filter(isAudioBlock);
};

const getTextBlocks = (blocks: ContentBlock[]): TextBlock[] => {
  return blocks.filter(isTextBlock);
};

const getLinkBlocks = (blocks: ContentBlock[]): LinkBlock[] => {
  return blocks.filter(isLinkBlock);
};

interface PostProps {
  post: TumblrPost;
}

export function Post({ post }: PostProps) {
  const mainImageBlocks = getImageBlocks(post.content);
  const mainVideoBlocks = getVideoBlocks(post.content);
  const mainAudioBlocks = getAudioBlocks(post.content);
  const mainTextBlocks = getTextBlocks(post.content);
  const mainLinkBlocks = getLinkBlocks(post.content);
  const trailImageBlocks =
    post.trail?.flatMap((trailItem) =>
      getImageBlocks(trailItem.content || [])
    ) || [];
  const trailVideoBlocks =
    post.trail?.flatMap((trailItem) =>
      getVideoBlocks(trailItem.content || [])
    ) || [];
  const trailAudioBlocks =
    post.trail?.flatMap((trailItem) =>
      getAudioBlocks(trailItem.content || [])
    ) || [];
  const trailTextBlocks =
    post.trail?.flatMap((trailItem) =>
      getTextBlocks(trailItem.content || [])
    ) || [];
  const trailLinkBlocks =
    post.trail?.flatMap((trailItem) =>
      getLinkBlocks(trailItem.content || [])
    ) || [];

  const hasTextOrLinkContent =
    mainTextBlocks.length > 0 ||
    trailTextBlocks.length > 0 ||
    mainLinkBlocks.length > 0 ||
    trailLinkBlocks.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Display main content images */}
      {mainImageBlocks.length > 1 ? (
        <ImageCarousel imageBlocks={mainImageBlocks} />
      ) : mainImageBlocks.length === 1 ? (
        <ImageBlockComponent block={mainImageBlocks[0]} />
      ) : null}

      {/* Display main content videos */}
      {mainVideoBlocks.map((block) => {
        const key = block.media?.url || block.url || block.embed_url;
        return <VideoBlockComponent key={key} block={block} />;
      })}

      {/* Display main content audio */}
      {mainAudioBlocks.map((block) => {
        const key =
          block.media?.url || block.url || block.embed_url || block.title;
        return <AudioBlockComponent key={key} block={block} />;
      })}

      {/* Display trail content images */}
      {trailImageBlocks.length > 1 ? (
        <ImageCarousel imageBlocks={trailImageBlocks} />
      ) : trailImageBlocks.length === 1 ? (
        <ImageBlockComponent block={trailImageBlocks[0]} />
      ) : null}

      {/* Display trail content videos */}
      {trailVideoBlocks.map((block) => {
        const key = block.media?.url || block.url || block.embed_url;
        return <VideoBlockComponent key={key} block={block} />;
      })}

      {/* Display trail content audio */}
      {trailAudioBlocks.map((block) => {
        const key =
          block.media?.url || block.url || block.embed_url || block.title;
        return <AudioBlockComponent key={key} block={block} />;
      })}

      {/* Display blog info */}
      <BlogInfo post={post} />

      {/* Display text and link content */}
      {hasTextOrLinkContent && (
        <ScrollShadowBox maxHeight="10lh">
          {/* Display main content text */}
          {mainTextBlocks.map((block) => (
            <TextBlockComponent key={block.text} block={block} />
          ))}
          {/* Display trail content text */}
          {trailTextBlocks.map((block) => (
            <TextBlockComponent key={block.text} block={block} />
          ))}
          {/* Display main content links */}
          {mainLinkBlocks.map((block) => (
            <LinkBlockComponent key={block.url} block={block} />
          ))}
          {/* Display trail content links */}
          {trailLinkBlocks.map((block) => (
            <LinkBlockComponent key={block.url} block={block} />
          ))}
        </ScrollShadowBox>
      )}
      <PostToolbar
        blogUuid={post.blog.uuid}
        postId={post.id_string}
        reblogKey={post.reblog_key}
        noteCount={post.note_count}
        postUrl={post.post_url}
        liked={post.liked}
      />
    </div>
  );
}
