'use client';
import { TextBlockComponent } from '@/components/text-block';
import type { TextBlock } from '@/types/tumblr';
import { clsx } from 'clsx';
import type React from 'react';

interface ListRendererProps {
  blocks: TextBlock[];
  keyPrefix?: string;
}

interface ListItem {
  block: TextBlock;
  index: number;
}

interface ProcessedBlock {
  type: 'single' | 'list';
  content: TextBlock | ListItem[];
  listType?: 'ordered' | 'unordered';
  originalIndex: number;
}

function groupConsecutiveListItems(blocks: TextBlock[]): ProcessedBlock[] {
  const result: ProcessedBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    
    if (block.subtype === 'ordered-list-item' || block.subtype === 'unordered-list-item') {
      // Start of a list - collect consecutive list items
      const listType = block.subtype === 'ordered-list-item' ? 'ordered' : 'unordered';
      const listItems: ListItem[] = [];
      
      // Collect consecutive list items of the same base type and level
      while (i < blocks.length) {
        const currentBlock = blocks[i];
        const currentType = currentBlock.subtype === 'ordered-list-item' ? 'ordered' : 'unordered';
        
        if (currentBlock.subtype === 'ordered-list-item' || currentBlock.subtype === 'unordered-list-item') {
          listItems.push({ block: currentBlock, index: i });
          i++;
        } else {
          break;
        }
      }
      
      if (listItems.length > 0) {
        result.push({
          type: 'list',
          content: listItems,
          listType,
          originalIndex: listItems[0].index
        });
      }
    } else {
      // Regular text block
      result.push({
        type: 'single',
        content: block,
        originalIndex: i
      });
      i++;
    }
  }

  return result;
}

function renderNestedListItems(items: ListItem[], keyPrefix: string, currentLevel: number = 0): React.ReactNode {
  if (items.length === 0) return null;

  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < items.length) {
    const item = items[i];
    const itemLevel = item.block.indent_level || 0;
    
    // Skip items that are deeper than our current level (they'll be handled by recursion)
    if (itemLevel < currentLevel) {
      break;
    }
    
    // Skip items that are deeper than our current level (they should have been handled already)
    if (itemLevel > currentLevel) {
      i++;
      continue;
    }

    const isOrdered = item.block.subtype === 'ordered-list-item';
    
    // Collect consecutive items of the same type and level
    const groupItems: { item: ListItem; children: ListItem[] }[] = [];
    
    while (i < items.length) {
      const current = items[i];
      const level = current.block.indent_level || 0;
      const currentIsOrdered = current.block.subtype === 'ordered-list-item';
      
      if (level < currentLevel) {
        break;
      }
      
      if (level === currentLevel && currentIsOrdered === isOrdered) {
        // This item belongs to our current list
        const children: ListItem[] = [];
        i++; // Move past the current item
        
        // Collect any child items (higher indent level)
        while (i < items.length) {
          const childItem = items[i];
          const childLevel = childItem.block.indent_level || 0;
          
          if (childLevel > currentLevel) {
            children.push(childItem);
            i++;
          } else {
            break;
          }
        }
        
        groupItems.push({ item: current, children });
      } else if (level === currentLevel && currentIsOrdered !== isOrdered) {
        // Different list type at same level, stop grouping
        break;
      } else {
        // Different level, this will be handled in recursion
        i++;
      }
    }

    if (groupItems.length > 0) {
      const ListElement = isOrdered ? 'ol' : 'ul';
      
      result.push(
        <ListElement 
          key={`${keyPrefix}-${isOrdered ? 'ol' : 'ul'}-${currentLevel}`}
          className={clsx(
            'pl-4',
            {
              'list-decimal': isOrdered,
              'list-disc': !isOrdered,
            }
          )}
        >
          {groupItems.map(({ item, children }) => (
            <li key={`${keyPrefix}-li-${item.index}`}>
              <TextBlockComponent block={{ ...item.block, subtype: undefined }} />
              {children.length > 0 && renderNestedListItems(children, `${keyPrefix}-nested-${item.index}`, currentLevel + 1)}
            </li>
          ))}
        </ListElement>
      );
    }
  }

  return result.length === 1 ? result[0] : <>{result}</>;
}

export function ListRenderer({ blocks, keyPrefix = 'lr' }: ListRendererProps) {
  const processedBlocks = groupConsecutiveListItems(blocks);

  return (
    <>
      {processedBlocks.map((processedBlock, index) => {
        if (processedBlock.type === 'single') {
          const block = processedBlock.content as TextBlock;
          return (
            <TextBlockComponent
              key={`${keyPrefix}-single-${processedBlock.originalIndex}`}
              block={block}
            />
          );
        } else {
          const items = processedBlock.content as ListItem[];
          return (
            <div key={`${keyPrefix}-list-${processedBlock.originalIndex}`}>
              {renderNestedListItems(items, `${keyPrefix}-${index}`)}
            </div>
          );
        }
      })}
    </>
  );
}