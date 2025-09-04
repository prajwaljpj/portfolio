import { unified } from 'unified';
import parse from 'uniorg-parse';
import { visit } from 'unist-util-visit';
import uniorg2rehype from 'uniorg-rehype';
import rehypeReact from 'rehype-react';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import React, { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Node } from 'unist';
import RoamLink from '../components/RoamLink';

interface RoamDB {
  nodes: any[];
  links: any[];
  tags: any[];
  refs: any[];
}

export const processOrgFile = (content: string, db: RoamDB) => {
  const processor = unified()
    .use(parse)
    // --- Primary Tree Transformation Step ---
    .use(() => (tree: Node) => {
      visit(tree, (node: any) => {
        // Handle Roam/ID links
        if (node.type === 'link' && (node.linkType === 'roam' || node.linkType === 'id')) {
          node.type = 'element';
          node.tagName = 'a';
          node.properties = { 'data-roam-id': node.path };
          node.children = [{ type: 'text', value: node.children[0]?.value || node.path }];
        }
        // Handle File/Attachment links (Images and PDFs)
        else if (node.type === 'link' && (node.linkType === 'file' || node.linkType === 'attachment')) {
          const fileName = node.path.split(/[\\/]/).pop();
          const isPdf = fileName?.toLowerCase().endsWith('.pdf');
          node.type = 'element';
          if (isPdf) {
            node.tagName = 'a';
            node.properties = {
              href: `/assets/roam_images/${fileName}`,
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'text-blue-500 hover:underline',
            };
            node.children = [{ type: 'text', value: node.children[0]?.value || fileName }];
          } else {
            node.tagName = 'img';
            node.properties = {
              src: `/assets/roam_images/${fileName}`,
              alt: node.children[0]?.value || fileName,
            };
            node.children = [];
          }
        }
        // Handle Code Blocks
        else if (node.type === 'org-block' && node.name === 'SRC') {
            const lang = node.params?.[0] || 'text';
            // This structure will be converted to <pre><code class="language-">
            // rehype-highlight will then add the data-lang attribute.
        }
      });
    })
    .use(uniorg2rehype)
    // Add a new step to visit the HTML tree (hast) for code blocks
    .use(() => (tree: Node) => {
        visit(tree, 'element', (node: any) => {
          if (node.tagName === 'pre' && node.children && node.children.length > 0) {
            const codeNode = node.children[0];
            if (codeNode.tagName === 'code' && codeNode.properties.className) {
              const langClass = codeNode.properties.className.find((c: string) => c.startsWith('language-'));
              if (langClass) {
                const lang = langClass.replace('language-', '');
                node.properties['data-lang'] = lang;
              }
            }
          }
        });
      })
    .use(remarkMath)
    .use(rehypeKatex)
    .use(rehypeHighlight)
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      createElement: React.createElement,
      components: {
        a: (props: any) => {
          if (props['data-roam-id']) {
            return <RoamLink {...props} id={props['data-roam-id']} db={db} />;
          }
          return <a {...props} />;
        },
      },
    });

  return processor.processSync(content).result;
};
