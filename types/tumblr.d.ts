// Common object types
export interface MediaObject {
  media_key?: string;
  url: string;
  type?: string;
  width?: number;
  height?: number;
  original_dimensions_missing?: boolean;
  cropped?: boolean;
  has_original_dimensions?: boolean;
}

export interface AttributionObject {
  type: 'post' | 'link' | 'blog' | 'app';
  url: string;
  post?: {
    id: string;
  };
  blog?: {
    uuid: string;
    name: string;
    url: string;
  };
  app_name?: string;
  display_text?: string;
  logo?: MediaObject;
}

// Content block types
export interface BaseBlock {
  type: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  text: string;
  subtype?:
    | 'heading1'
    | 'heading2'
    | 'quirky'
    | 'quote'
    | 'indented'
    | 'chat'
    | 'ordered-list-item'
    | 'unordered-list-item';
  indent_level?: number;
  formatting?: Array<{
    start: number;
    end: number;
    type:
      | 'bold'
      | 'italic'
      | 'strikethrough'
      | 'small'
      | 'link'
      | 'mention'
      | 'color';
    url?: string;
    hex?: string;
    blog?: {
      uuid: string;
      name: string;
      url: string;
    };
  }>;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  media: MediaObject[];
  colors?: { [key: string]: string };
  feedback_token?: string;
  poster?: MediaObject;
  attribution?: AttributionObject;
  alt_text?: string;
  caption?: string;
}

export interface LinkBlock extends BaseBlock {
  type: 'link';
  url: string;
  title?: string;
  description?: string;
  author?: string;
  site_name?: string;
  display_url?: string;
  poster?: MediaObject[];
}

export interface AudioBlock extends BaseBlock {
  type: 'audio';
  provider: string;
  url?: string;
  media?: MediaObject;
  title?: string;
  artist?: string;
  album?: string;
  poster?: MediaObject[];
  embed_html?: string;
  embed_url?: string;
  metadata?: Record<string, unknown>;
  attribution?: AttributionObject;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  provider: string;
  url?: string;
  media?: MediaObject;
  embed_html?: string;
  embed_iframe?: {
    url: string;
    width: number;
    height: number;
  };
  embed_url?: string;
  poster?: MediaObject;
  metadata?: Record<string, unknown>;
  attribution?: AttributionObject;
  can_autoplay_on_cellular?: boolean;
  duration?: number;
}

export type ContentBlock =
  | TextBlock
  | ImageBlock
  | LinkBlock
  | AudioBlock
  | VideoBlock;

// Layout types
export interface RowsLayout {
  type: 'rows';
  display: Array<{
    blocks: number[];
    mode?: {
      type: 'carousel';
    };
  }>;
  truncate_after?: number;
}

export interface AskLayout {
  type: 'ask';
  blocks: number[];
  attribution?: AttributionObject;
}

export type Layout = RowsLayout | AskLayout;

// Trail item types
export interface TrailItem {
  post?: {
    id: string;
    timestamp: number;
    is_commercial: boolean;
  };
  blog?: {
    uuid: string;
    name: string;
    url: string;
  };
  content: ContentBlock[];
  layout: Layout[];
  broken_blog_name?: string;
}

// Post response types
export interface TumblrPost {
  id: number;
  id_string: string;
  blog: {
    uuid: string;
    name: string;
    url: string;
  };
  content: ContentBlock[];
  layout?: Layout[];
  liked: boolean;
  note_count: number;
  post_url: string;
  reblog_key: string;
  trail?: TrailItem[];
  is_paywalled?: boolean;
  paywall_access?: 'creator' | 'member' | 'non-member' | 'disabled';
}

export interface TumblrResponse {
  response: {
    posts: TumblrPost[];
  };
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}
