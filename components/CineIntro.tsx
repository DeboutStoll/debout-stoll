// Studio-title cold open — server-rendered so the curtain is present at first
// paint (like the original), then plays out via pure CSS. Reduced-motion and
// data-light suppression are handled in globals.css.
export default function CineIntro({
  presents,
  tagline,
}: {
  presents: string;
  tagline: string;
}) {
  return (
    <div className="cine-intro" aria-hidden="true">
      <div className="cine-bar cine-bar-top" />
      <div className="cine-bar cine-bar-bottom" />
      <div className="cine-center">
        <div className="cine-presents">{presents}</div>
        <div className="cine-title">AKONO</div>
        <div className="cine-rule" />
        <div className="cine-tag">{tagline}</div>
      </div>
    </div>
  );
}
