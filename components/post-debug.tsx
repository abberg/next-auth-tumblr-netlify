'use client';

import { JSONTree } from 'react-json-tree';

const theme = {
  scheme: 'Tokyonight',
  author: 'Folke Lemaitre (https://github.com/folke)',
  base00: '#24283b',
  base01: '#1f2335',
  base02: '#292e42',
  base03: '#565f89',
  base04: '#a9b1d6',
  base05: '#c0caf5',
  base06: '#c0caf5',
  base07: '#c0caf5',
  base08: '#f7768e',
  base09: '#ff9e64',
  base0A: '#e0af68',
  base0B: '#9ece6a',
  base0C: '#1abc9c',
  base0D: '#41a6b5',
  base0E: '#bb9af7',
  base0F: '#ff007c',
};

interface PostDebugProps {
  data: any;
}

export function PostDebug({ data }: PostDebugProps) {
  return (
    <div className="rounded bg-[rgba(36,40,59,0.95)] *:bg-transparent! px-3 pt-0.5 pb-2 font-mono font-normal text-sm fixed top-4 left-4 w-sm max-h-[550px] overflow-y-auto">
      <JSONTree data={data} theme={theme} />
    </div>
  );
} 