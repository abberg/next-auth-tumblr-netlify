import type {
  AskLayout,
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

const isAskLayout = (layout: any): layout is AskLayout => {
  return layout.type === 'ask';
};

const _categorizeBlocks = (
  content: ContentBlock[],
  options?: {
    askBlockIndices: Set<number>;
    isAnswerPost: boolean;
  },
) => {
  const categorized = {
    imageBlocks: [] as ImageBlock[],
    videoBlocks: [] as VideoBlock[],
    audioBlocks: [] as AudioBlock[],
    linkBlocks: [] as LinkBlock[],
    askBlocks: [] as TextBlock[],
    answerBlocks: [] as TextBlock[],
    textBlocks: [] as TextBlock[],
  };

  content.forEach((block, index) => {
    switch (block.type) {
      case 'image':
        categorized.imageBlocks.push(block);
        break;
      case 'video':
        categorized.videoBlocks.push(block);
        break;
      case 'audio':
        categorized.audioBlocks.push(block);
        break;
      case 'link':
        categorized.linkBlocks.push(block);
        break;
      case 'text':
        if (options?.askBlockIndices.has(index)) {
          categorized.askBlocks.push(block);
        } else if (options?.isAnswerPost) {
          categorized.answerBlocks.push(block);
        } else {
          categorized.textBlocks.push(block);
        }
        break;
      }
  });

  return categorized;
};

export const categorizePostContent = (post: TumblrPost) => {
  const mainContent = post.content || [];
  const trailContent =
    post.trail?.flatMap(trailItem => trailItem.content || []) || [];

  const askLayout = post.layout?.find(isAskLayout);
  const askBlockIndices = new Set(askLayout?.blocks || []);
  const askAttribution = askLayout?.attribution;

  const mainCategorized = _categorizeBlocks(mainContent, {
    askBlockIndices,
    isAnswerPost: !!askLayout,
  });
  const trailCategorized = _categorizeBlocks(trailContent);

  return {
    mainImageBlocks: mainCategorized.imageBlocks,
    mainVideoBlocks: mainCategorized.videoBlocks,
    mainAudioBlocks: mainCategorized.audioBlocks,
    mainAskBlocks: mainCategorized.askBlocks,
    mainAnswerBlocks: mainCategorized.answerBlocks,
    mainTextBlocks: mainCategorized.textBlocks,
    mainLinkBlocks: mainCategorized.linkBlocks,
    askAttribution,
    trailImageBlocks: trailCategorized.imageBlocks,
    trailVideoBlocks: trailCategorized.videoBlocks,
    trailAudioBlocks: trailCategorized.audioBlocks,
    trailTextBlocks: trailCategorized.textBlocks,
    trailLinkBlocks: trailCategorized.linkBlocks,
  };
};