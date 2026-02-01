import { compileMDX } from 'next-mdx-remote/rsc';
import type { ReactElement } from 'react';

const components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-serif text-xl font-semibold text-[var(--ink)] mt-8 mb-4 pb-2 border-b border-[var(--tape-border)]" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-none pl-0 my-3 space-y-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[var(--stamp)] before:font-bold" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 leading-relaxed" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-[var(--stamp)] underline underline-offset-2 hover:text-[var(--stamp-light)]" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-[var(--stamp)] pl-4 my-4 italic text-[var(--ink-light)]" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-[var(--tape)] px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-[var(--tape)] p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />
  ),
};

export async function renderMDX(content: string): Promise<ReactElement> {
  const { content: renderedContent } = await compileMDX({
    source: content,
    components,
  });
  return renderedContent;
}
