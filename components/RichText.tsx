'use client';

import { useMessages } from 'next-intl';

/**
 * Renders a message that contains trusted inline HTML (e.g. <strong>, <em>).
 *
 * next-intl runs every t() string through ICU, which treats <tag> as rich-text
 * markup and throws unless handlers are supplied. Our HTML here is authored,
 * not user input, so we read the RAW message via useMessages() (no ICU parsing)
 * and inject it. Works in both server and client components.
 */
export function RichText({
  path,
  as: Tag = 'span',
  className,
  style,
}: {
  path: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}) {
  const messages = useMessages() as Record<string, unknown>;
  const raw = path
    .split('.')
    .reduce<unknown>((obj, key) => (obj as Record<string, unknown>)?.[key], messages);

  return (
    <Tag
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: typeof raw === 'string' ? raw : '' }}
    />
  );
}
