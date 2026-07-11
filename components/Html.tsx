// Renders a trusted, author-controlled HTML snippet (from the message
// catalogue / content files). Content is not user-supplied, so this is safe.
export function Html({
  html,
  as: Tag = 'span',
  className,
}: {
  html: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
