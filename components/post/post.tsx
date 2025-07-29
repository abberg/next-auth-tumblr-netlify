'use client';

import { AudioBlockComponent } from '@/components/audio-block';
import { BlogInfo } from '@/components/blog-info';
import { ImageBlockComponent } from '@/components/image-block';
import { ImageCarousel } from '@/components/image-carousel';
import { LinkBlockComponent } from '@/components/link-block';
import { ListRenderer } from '@/components/list-renderer';
import { PostToolbar } from '@/components/post-toolbar';
import { ScrollShadowBox } from '@/components/scroll-shadow-box';
import { TextBlockComponent } from '@/components/text-block';
import { VideoBlockComponent } from '@/components/video-block';
import type {
  AudioBlock,
  ImageBlock,
  TextBlock,
  TumblrPost,
  VideoBlock,
} from '@/types/tumblr';
import { categorizePostContent } from './categorizePostContent';

const hasListItems = (blocks: TextBlock[]): boolean => {
  return blocks.some(
    (block) =>
      block.subtype === 'ordered-list-item' ||
      block.subtype === 'unordered-list-item'
  );
};

const TextContent = ({
  blocks,
  keyPrefix,
}: {
  blocks: TextBlock[];
  keyPrefix: string;
}) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return hasListItems(blocks) ? (
    <ListRenderer blocks={blocks} keyPrefix={keyPrefix} />
  ) : (
    blocks.map((block, index) => (
      <TextBlockComponent
        key={`${keyPrefix}_${
          // biome-ignore lint/suspicious/noArrayIndexKey: index is acceptable here
          index
        }`}
        block={block}
      />
    ))
  );
};

const MediaContent = ({
  imageBlocks,
  videoBlocks,
  audioBlocks,
  postId,
  keyPrefix,
}: {
  imageBlocks: ImageBlock[];
  videoBlocks: VideoBlock[];
  audioBlocks: AudioBlock[];
  postId: string;
  keyPrefix: string;
}) => (
  <>
    {imageBlocks.length > 1 ? (
      <ImageCarousel imageBlocks={imageBlocks} />
    ) : imageBlocks.length === 1 ? (
      <ImageBlockComponent block={imageBlocks[0]} />
    ) : null}

    {videoBlocks.map((block, index) => {
      const key =
        block.media?.url ||
        block.url ||
        block.embed_url ||
        `${postId}_${keyPrefix}_vid_${index}`;
      return <VideoBlockComponent key={key} block={block} />;
    })}

    {audioBlocks.map((block, index) => {
      const key =
        block.media?.url ||
        block.url ||
        block.embed_url ||
        block.title ||
        `${postId}_${keyPrefix}_aud_${index}`;
      return <AudioBlockComponent key={key} block={block} />;
    })}
  </>
);

interface PostProps {
  post: TumblrPost;
}

export function Post({ post }: PostProps) {
  const {
    mainImageBlocks,
    mainVideoBlocks,
    mainAudioBlocks,
    mainAskBlocks,
    mainAnswerBlocks,
    mainTextBlocks,
    mainLinkBlocks,
    askAttribution,
    trailImageBlocks,
    trailVideoBlocks,
    trailAudioBlocks,
    trailTextBlocks,
    trailLinkBlocks,
  } = categorizePostContent(post);

  const hasTextOrLinkContent =
    mainTextBlocks.length > 0 ||
    mainAnswerBlocks.length > 0 ||
    trailTextBlocks.length > 0 ||
    mainLinkBlocks.length > 0 ||
    trailLinkBlocks.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Display main content media */}
      <MediaContent
        imageBlocks={mainImageBlocks}
        videoBlocks={mainVideoBlocks}
        audioBlocks={mainAudioBlocks}
        postId={post.id_string}
        keyPrefix="main"
      />

      {/* Display trail content media */}
      <MediaContent
        imageBlocks={trailImageBlocks}
        videoBlocks={trailVideoBlocks}
        audioBlocks={trailAudioBlocks}
        postId={post.id_string}
        keyPrefix="trail"
      />

      {/* Ask */}
      {mainAskBlocks && mainAskBlocks.length > 0 && (
        <div className="flex gap-2">
          <div className="relative flex-1 rounded-md bg-gray-500 px-3 py-2 text-white after:absolute after:top-4 after:right-[-14px] after:border-7 after:border-transparent after:border-l-gray-500 after:content-['']">
            <p className="mb-4">
              {askAttribution?.blog ? (
                <a
                  href={askAttribution.blog.url}
                  className="font-bold hover:underline"
                >
                  {askAttribution.blog.name}
                </a>
              ) : (
                'Anonymous'
              )}{' '}
              asked:
            </p>

            <TextContent
              blocks={mainAskBlocks}
              keyPrefix={`${post.id_string}_ask`}
            />
          </div>

          <img
            src={
              askAttribution?.blog
                ? askAttribution?.blog?.avatar?.[3]?.url
                : 'https://assets.tumblr.com/pop/src/assets/images/avatar/anonymous_avatar_96-223fabe0.png'
            }
            alt={
              askAttribution?.blog ? askAttribution?.blog?.name : 'Anonymous'
            }
            className="h-10 w-10"
          />
        </div>
      )}

      {/* Display blog info */}
      <BlogInfo post={post} />

      {/* Display text and link content */}
      {hasTextOrLinkContent && (
        <ScrollShadowBox maxHeight="10lh">
          <TextContent
            blocks={mainTextBlocks}
            keyPrefix={`${post.id_string}_mtxt`}
          />
          <TextContent
            blocks={trailTextBlocks}
            keyPrefix={`${post.id_string}_ttxt`}
          />
          <TextContent
            blocks={mainAnswerBlocks}
            keyPrefix={`${post.id_string}_ans`}
          />
          {/* Display main content links */}
          {mainLinkBlocks.map((block, index) => (
            <LinkBlockComponent
              key={block.url || `${post.id_string}_main_link_${index}`}
              block={block}
            />
          ))}
          {/* Display trail content links */}
          {trailLinkBlocks.map((block, index) => (
            <LinkBlockComponent
              key={block.url || `${post.id_string}_trail_link_${index}`}
              block={block}
            />
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
